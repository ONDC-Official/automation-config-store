
export function parseISODurationToMonths(isoDuration: string): number {
    if (!isoDuration) return 12; // default to 12 months if not available

    const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/i;
    const match = isoDuration.match(regex);

    if (!match) {
        console.warn(`[settlement-utils] Could not parse ISO duration: ${isoDuration}, defaulting to 12 months`);
        return 12;
    }

    const years = parseInt(match[1] || "0", 10);
    const months = parseInt(match[2] || "0", 10);
    const weeks = parseInt(match[3] || "0", 10);
    const days = parseInt(match[4] || "0", 10);

    const totalMonths = years * 12 + months + Math.round(weeks * 7 / 30) + Math.round(days / 30);

    console.log(`[settlement-utils] Parsed duration ${isoDuration} → ${totalMonths} months`);
    return totalMonths > 0 ? totalMonths : 12;
}


export function extractTagValue(tags: any[], groupCode: string, itemCode: string): string | undefined {
    if (!Array.isArray(tags)) return undefined;

    for (const tag of tags) {
        if (tag?.descriptor?.code === groupCode && Array.isArray(tag?.list)) {
            const item = tag.list.find((i: any) => i?.descriptor?.code === itemCode);
            if (item?.value !== undefined) return String(item.value);
        }
    }
    return undefined;
}

export function extractBreakupValue(breakup: any[], title: string): number {
    if (!Array.isArray(breakup)) return 0;
    const entry = breakup.find((b: any) => (b?.title || "").toUpperCase() === title.toUpperCase());
    return parseFloat(entry?.price?.value || "0");
}


export function calculateSettlementAmount(sessionData: any): string {
    // --- Read fee parameters saved from search ---
    const feeType = sessionData.buyer_finder_fees_type || "percent-annualized";
    const feePercentage = parseFloat(sessionData.buyer_finder_fees_percentage || "0");
    const feeAmount = parseFloat(sessionData.buyer_finder_fees_amount || "0");

    // --- Read loan parameters saved from on_select ---
    const netDisbursedAmount = parseFloat(sessionData.net_disbursed_amount || "0");
    const totalLoanAmount = parseFloat(sessionData.quote_price || "0");
    const loanTermISO = sessionData.loan_term || "P12M";
    const loanTermMonths = parseISODurationToMonths(loanTermISO);

    console.log("[settlement-utils] Calculating SETTLEMENT_AMOUNT with:", {
        feeType,
        feePercentage,
        feeAmount,
        netDisbursedAmount,
        totalLoanAmount,
        loanTermISO,
        loanTermMonths,
    });

    let settlementAmount = 0;

    switch (feeType) {
        case "amount":
            // Flat INR amount directly
            settlementAmount = feeAmount;
            console.log(`[settlement-utils] amount type → ${settlementAmount}`);
            break;

        case "percent":
            // Absolute percentage of total loan amount
            settlementAmount = (feePercentage / 100) * totalLoanAmount;
            console.log(`[settlement-utils] percent type → ${feePercentage}% × ${totalLoanAmount} = ${settlementAmount}`);
            break;

        case "percent-annualized":
        default:
            // Annualized: scale by actual tenure vs 12 months, applied on net disbursed amount
            settlementAmount = (feePercentage / 100) * (loanTermMonths / 12) * netDisbursedAmount;
            console.log(
                `[settlement-utils] percent-annualized type → ${feePercentage}% × (${loanTermMonths}/12) × ${netDisbursedAmount} = ${settlementAmount}`
            );
            break;
    }

    const result = String(Math.round(settlementAmount));
    console.log(`[settlement-utils] Final SETTLEMENT_AMOUNT = ${result}`);
    return result;
}


export function injectSettlementAmount(existingPayload: any, sessionData: any): string {
    // Use pre-calculated value from session if available, otherwise calculate
    const settlementAmount =
        sessionData.settlement_amount ?? calculateSettlementAmount(sessionData);

    const payments: any[] = existingPayload?.message?.order?.payments || [];

    payments.forEach((payment: any) => {
        if (!Array.isArray(payment?.tags)) return;

        payment.tags.forEach((tag: any) => {
            if (Array.isArray(tag?.list)) {
                const item = tag.list.find(
                    (i: any) => i?.descriptor?.code === "SETTLEMENT_AMOUNT"
                );
                if (item) {
                    item.value = settlementAmount;
                    console.log(`[settlement-utils] Injected SETTLEMENT_AMOUNT = ${settlementAmount} into BAP_TERMS`);
                }
            }
        });
    });

    return settlementAmount;
}

export function extractInfoTagValue(existingPayload: any, code: string): string | undefined {
    const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags || [];
    for (const tag of tags) {
        if (tag?.descriptor?.code === "INFO" && Array.isArray(tag?.list)) {
            const item = tag.list.find((i: any) => i?.descriptor?.code === code);
            if (item?.value !== undefined) return String(item.value);
        }
    }
    return undefined;
}

/** Full loan detail calculation result */
export interface LoanDetails {
    downPayment: number;
    principalAmount: number;
    netDisbursedAmount: number;
    emiAmount: number;
    totalInterest: number;
    loanTermMonths: number;
    interestRateAnnual: number;
    schedule: Array<{ principal: number; interest: number; outstanding: number }>;
}


export function calculateLoanDetails(sessionData: any, existingPayload?: any): LoanDetails {
    console.log("sessionDataform_dataaaa", JSON.stringify(sessionData?.form_data))
    console.log("sessionDataaaa", JSON.stringify(sessionData))
    const downPayment = parseFloat(
        sessionData?.form_data?.down_payment_form?.updateDownpayment
        ?? sessionData?.down_payment
        ?? "0"
    );

    const loanAmount = parseFloat(sessionData?.loan_amount ?? "70000");
    const principalAmount = loanAmount - downPayment;

    let processingFee = 0;
    let insuranceCharges = 0;
    let otherUpfront = 0;

    const breakup: any[] = existingPayload?.message?.order?.quote?.breakup ?? [];

    breakup.forEach((b: any) => {
        const t = (b?.title || "").toUpperCase();
        const v = parseFloat(b?.price?.value || "0");

        if (t === "PROCESSING_FEE") processingFee = v;
        if (t === "INSURANCE_CHARGES") insuranceCharges = v;
        if (t === "OTHER_UPFRONT_CHARGES") otherUpfront = v;
    });

    const netDisbursedAmount =
        principalAmount - processingFee - insuranceCharges - otherUpfront;

    const rawRate = String(sessionData?.interest_rate ?? "12");
    const interestRateAnnual =
        parseFloat(rawRate.replace(/[^0-9.]/g, "")) || 12;

    const monthlyRate = interestRateAnnual / 12 / 100;

    const loanTermMonths =
        parseISODurationToMonths(sessionData?.loan_term ?? "P5M");

    let emiExact: number;

    if (monthlyRate === 0) {
        emiExact = principalAmount / loanTermMonths;
    } else {
        const factor = Math.pow(1 + monthlyRate, loanTermMonths);
        emiExact = (principalAmount * monthlyRate * factor) / (factor - 1);
    }

    const emiAmount = Math.round(emiExact);

    // FIX: interest always derived from EMI
    const totalInterest =
        (emiAmount * loanTermMonths) - principalAmount;

    const schedule: LoanDetails["schedule"] = [];
    let outstanding = principalAmount;

    for (let i = 0; i < loanTermMonths; i++) {

        const interestThisMonth = outstanding * monthlyRate;
        let principalThisMonth = emiAmount - interestThisMonth;

        // FIX: adjust last EMI
        if (i === loanTermMonths - 1) {
            principalThisMonth = outstanding;
        }

        outstanding = Math.max(0, outstanding - principalThisMonth);

        schedule.push({
            principal: Math.round(principalThisMonth),
            interest: Math.round(interestThisMonth),
            outstanding: Math.round(outstanding)
        });
    }

    console.log("[settlement-utils] calculateLoanDetails:", {
        loanAmount,
        downPayment,
        principalAmount,
        processingFee,
        insuranceCharges,
        netDisbursedAmount,
        interestRateAnnual,
        loanTermMonths,
        emiAmount,
        totalInterest
    });

    return {
        downPayment,
        principalAmount,
        netDisbursedAmount,
        emiAmount,
        totalInterest,
        loanTermMonths,
        interestRateAnnual,
        schedule
    };
}


export function injectLoanDetails(existingPayload: any, sessionData: any, details?: LoanDetails): LoanDetails {
    const d = details ?? calculateLoanDetails(sessionData, existingPayload);

    // Save to session for downstream use
    sessionData.down_payment = d.downPayment;
    sessionData.principal_amount = d.principalAmount;
    sessionData.net_disbursed_amount = d.netDisbursedAmount;
    sessionData.emi_amount = d.emiAmount;
    sessionData.total_interest = d.totalInterest;
    sessionData.loan_term_months = d.loanTermMonths;
    // NOTE: Do NOT clear sessionData.settlement_amount here.
    // It is calculated once in the `init` generator and must stay consistent
    // across all downstream generators (on_init, on_confirm, etc.).

    // Update quote.breakup
    const quote = existingPayload?.message?.order?.quote;
    if (quote) {
        const upsert = (title: string, value: number) => {
            const bkp: any[] = quote.breakup || [];
            const idx = bkp.findIndex((b: any) => (b?.title || "").toUpperCase() === title.toUpperCase());
            const row = { title, price: { value: String(Math.round(value)), currency: "INR" } };
            if (idx >= 0) bkp[idx] = row; else bkp.push(row);
            quote.breakup = bkp;
        };
        upsert("PRINCIPAL_AMOUNT", d.principalAmount);
        upsert("INTEREST_AMOUNT", d.totalInterest);
        upsert("NET_DISBURSED_AMOUNT", d.netDisbursedAmount);
        const processingFee = parseFloat((quote.breakup || []).find((b: any) => b.title === "PROCESSING_FEE")?.price?.value || "0");
        const insuranceCharges = parseFloat((quote.breakup || []).find((b: any) => b.title === "INSURANCE_CHARGES")?.price?.value || "0");
        const totalLoan = d.principalAmount + d.totalInterest + processingFee + insuranceCharges;
        quote.price = { currency: "INR", value: String(Math.round(totalLoan)) };
        console.log("[settlement-utils] Updated quote.price:", totalLoan);
    }

    // Update items INFO tags using the common exported utility
    injectItemInfoTags(existingPayload, d);

    // Update PRE_ORDER payment amount (= down payment)
    if (d.downPayment > 0) {
        const payments: any[] = existingPayload?.message?.order?.payments || [];
        const preOrder = payments.find((p: any) => p?.type === "PRE_ORDER");
        if (preOrder) {
            preOrder.params = preOrder.params || {};
            preOrder.params.amount = String(Math.round(d.downPayment));
            preOrder.params.currency = "INR";
            console.log(`[settlement-utils] Updated PRE_ORDER.params.amount = ${d.downPayment}`);
        }
    }

    return d;
}


export function injectItemInfoTags(existingPayload: any, details: LoanDetails): void {
    const items: any[] = existingPayload?.message?.order?.items || [];

    items.forEach((item: any) => {
        if (!Array.isArray(item.tags)) return;

        // Find or create the INFO tag
        let infoTag = item.tags.find((t: any) => t?.descriptor?.code === "INFO");
        if (!infoTag) {
            infoTag = { descriptor: { code: "INFO", name: "Information" }, display: true, list: [] };
            item.tags.push(infoTag);
        }
        if (!Array.isArray(infoTag.list)) infoTag.list = [];

        // Upsert: update value if entry exists, insert if it doesn't
        const upsert = (code: string, name: string, value: string) => {
            const entry = infoTag.list.find((i: any) => i?.descriptor?.code === code);
            if (entry) {
                entry.value = value;
            } else {
                infoTag.list.push({ descriptor: { code, name }, value });
            }
            console.log(`[settlement-utils] INFO.${code} = ${value}`);
        };

        upsert("INSTALLMENT_AMOUNT", "Installment Amount", `${Math.round(details.emiAmount)} INR`);
        upsert("NUMBER_OF_INSTALLMENTS", "Number of Installments", String(details.loanTermMonths));
        upsert("PRINCIPAL_AMOUNT", "Principal Amount", `${Math.round(details.principalAmount)} INR`);
        upsert("INTEREST_AMOUNT", "Interest Amount", `${Math.round(details.totalInterest)} INR`);
        upsert("NET_DISBURSED_AMOUNT", "Net Disbursed Amount", `${Math.round(details.netDisbursedAmount)} INR`);

    });
}



export function generateInstallmentPayments(
    existingPayload: any,
    sessionData: any,
    startFromContext = true
): void {
    const order = existingPayload?.message?.order;
    if (!order) return;

    // ── Resolve amortisation data from session ────────────────────────────────
    const loanTermMonths: number = sessionData?.loan_term_months
        ?? parseISODurationToMonths(sessionData?.loan_term ?? "P5M");

    const emiAmount: number = sessionData?.emi_amount
        ?? parseFloat(sessionData?.quote_price ?? "0");

    // If we already have a schedule in session, use it; otherwise recalculate.
    let schedule: Array<{ principal: number; interest: number; outstanding: number }> =
        sessionData?.schedule ?? [];

    if (schedule.length === 0 && loanTermMonths > 0) {
        const details = calculateLoanDetails(sessionData, existingPayload);
        schedule = details.schedule;
        // Persist for downstream reuse
        sessionData.schedule = schedule;
        sessionData.emi_amount = details.emiAmount;
        sessionData.loan_term_months = details.loanTermMonths;
    }

    // ── Determine start month ─────────────────────────────────────────────────
    const baseTs = startFromContext
        ? existingPayload?.context?.timestamp ?? new Date().toISOString()
        : new Date().toISOString();

    const baseDate = new Date(baseTs);

    // Helper: first moment of a given UTC month
    const monthStart = (year: number, month: number): string =>
        new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)).toISOString();

    // Helper: last moment of a given UTC month
    const monthEnd = (year: number, month: number): string =>
        new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString();

    // ── Strip existing POST_FULFILLMENT entries ───────────────────────────────
    const otherPayments: any[] = (order.payments || []).filter(
        (p: any) => p?.type !== "POST_FULFILLMENT"
    );

    // ── Build fresh instalment payments ──────────────────────────────────────
    const instalmentPayments: any[] = [];

    for (let i = 0; i < loanTermMonths; i++) {
        const instMonth = baseDate.getUTCMonth() + i;   // may exceed 11 → JS handles rollover
        const year = baseDate.getUTCFullYear() + Math.floor(instMonth / 12);
        const month = instMonth % 12;  // 0-based

        const schRow = schedule[i] ?? { principal: emiAmount, interest: 0, outstanding: 0 };
        const emiDisplay = Math.round(emiAmount);

        instalmentPayments.push({
            type: "POST_FULFILLMENT",
            id: `PID-${5000 + i + 1}`,
            params: {
                amount: String(emiDisplay),
                currency: "INR",
            },
            status: "NOT-PAID",
            time: {
                label: "INSTALLMENT",
                range: {
                    start: monthStart(year, month),
                    end: monthEnd(year, month),
                },
            },
            tags: [
                {
                    descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                    list: [
                        {
                            descriptor: {
                                code: "PRINCIPAL_AMOUNT",
                                name: "Principal",
                                short_desc: "Loan Principal",
                            },
                            value: `${schRow.principal} INR`,
                        },
                        {
                            descriptor: {
                                code: "INTEREST_AMOUNT",
                                name: "Interest",
                                short_desc: "Loan Interest",
                            },
                            value: `${schRow.interest} INR`,
                        },
                    ],
                },
            ],
        });
    }

    order.payments = [...otherPayments, ...instalmentPayments];
    console.log(
        `[settlement-utils] Generated ${instalmentPayments.length} POST_FULFILLMENT instalments (EMI=${emiAmount})`
    );
}

// export function applyPrepartInstallmentStatuses(
//     existingPayload: any,
//     sessionData: any,
//     unsolicited: boolean
// ): void {
//     const order = existingPayload?.message?.order;
//     if (!order) return;

//     // ── Use saved payments from on_update as the authoritative base ──────────
//     const savedPayments: any[] = Array.isArray(sessionData?.payments)
//         ? sessionData.payments
//         : [];

//     // Fall back if no saved payments
//     if (savedPayments.length === 0) {
//         console.warn("[settlement-utils] applyPrepartInstallmentStatuses: no saved payments, falling back to generateInstallmentPayments");
//         generateInstallmentPayments(existingPayload, sessionData);
//         return;
//     }

//     // ── Rebuild loan details for outstanding calculations ─────────────────────
//     let details: LoanDetails;
//     if (sessionData.schedule?.length && sessionData.emi_amount && sessionData.loan_term_months) {
//         details = {
//             downPayment: sessionData.down_payment ?? 0,
//             principalAmount: sessionData.principal_amount ?? 0,
//             netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
//             emiAmount: sessionData.emi_amount,
//             totalInterest: sessionData.total_interest ?? 0,
//             loanTermMonths: sessionData.loan_term_months,
//             interestRateAnnual: sessionData.interest_rate_annual ?? 12,
//             schedule: sessionData.schedule,
//         };
//     } else {
//         details = calculateLoanDetails(sessionData, existingPayload);
//     }

//     const { schedule, emiAmount, loanTermMonths, principalAmount } = details;

//     // ── Determine event month from context timestamp ──────────────────────────
//     const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
//     const eventDate = new Date(contextTs);
//     const eventYear = eventDate.getUTCFullYear();
//     const eventMonth = eventDate.getUTCMonth();

//     // Determine eventIdx (which installment index corresponds to the event month)
//     const loanStartDate: Date = sessionData.loan_start_date
//         ? new Date(sessionData.loan_start_date)
//         : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

//     const startYear = loanStartDate.getUTCFullYear();
//     const startMonth = loanStartDate.getUTCMonth();
//     const diff = (eventYear - startYear) * 12 + (eventMonth - startMonth);
//     const eventIdx = Math.max(0, Math.min(diff, loanTermMonths - 1));

//     // ── Calculate outstanding amounts at event month ───────────────────────────
//     let paidPrincipal = 0;
//     for (let i = 0; i < eventIdx && i < schedule.length; i++) {
//         paidPrincipal += schedule[i].principal;
//     }
//     const outstandingPrincipal = Math.round(principalAmount - paidPrincipal);

//     let outstandingInterest = 0;
//     for (let i = eventIdx; i < schedule.length; i++) {
//         outstandingInterest += schedule[i].interest;
//     }
//     outstandingInterest = Math.round(outstandingInterest);

//     // Pre-payment charge (from FORECLOSURE_FEE INFO tag or default 0.5%)
//     const getTagValue = (code: string, defaultVal: number): number => {
//         const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
//         for (const tag of tags) {
//             if (tag?.descriptor?.code === "INFO") {
//                 const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
//                 if (entry?.value) return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
//             }
//         }
//         return defaultVal;
//     };
//     const prepayPct = getTagValue("FORECLOSURE_FEE", 0.5);
//     const prePaymentCharge = Math.round(outstandingPrincipal * prepayPct / 100);
//     const specialAmount = outstandingPrincipal + outstandingInterest + prePaymentCharge;

//     // ── Upsert quote.breakup with outstanding amounts ─────────────────────────
//     const upsertBreakup = (title: string, value: number) => {
//         order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
//         order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];
//         const idx = order.quote.breakup.findIndex((b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase());
//         const row = { title, price: { value: String(Math.round(value)), currency: "INR" } };
//         if (idx >= 0) order.quote.breakup[idx] = row; else order.quote.breakup.push(row);
//     };
//     upsertBreakup("OUTSTANDING_PRINCIPAL", outstandingPrincipal);
//     upsertBreakup("OUTSTANDING_INTEREST", outstandingInterest);
//     upsertBreakup("PRE_PAYMENT_CHARGE", prePaymentCharge);

//     const refId = sessionData.message_id ?? order.id ?? "auto-ref";
//     const eventRow = schedule[eventIdx] ?? { principal: outstandingPrincipal, interest: outstandingInterest };
//     const monthStart = (y: number, m: number) => new Date(Date.UTC(y, m, 1)).toISOString();
//     const monthEnd = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999)).toISOString();

//     const breakupTags = [{
//         descriptor: { code: "BREAKUP", name: "Emi Breakup" },
//         list: [
//             { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
//             { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
//         ],
//     }];

//     // ── payments[0]: PID-8000 — the special PRE_PART_PAYMENT entry ────────────
//     let pid8000: any;
//     if (unsolicited) {
//         // Unsolicited: lender pushes notification back — PAID, has timestamp, no url
//         pid8000 = {
//             id: "PID-9000",
//             type: "POST_FULFILLMENT",
//             params: {
//                 amount: String(Math.round(specialAmount)),
//                 currency: "INR",
//                 transaction_id: `txn-prepart-${Date.now()}`,
//             },
//             status: "PAID",
//             time: {
//                 timestamp: monthStart(eventYear, eventMonth),
//                 label: "PRE_PART_PAYMENT",
//             },
//             tags: breakupTags,
//         };
//     } else {
//         const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

//         // Solicited: borrower-initiated — NOT-PAID, has url + payment window (P15D)
//         pid8000 = {
//             id: "PID-9000",
//             type: "POST_FULFILLMENT",
//             params: {
//                 amount: String(Math.round(specialAmount)),
//                 currency: "INR",
//             },
//             status: "NOT-PAID",
//             url: paymentUrl,
//             time: {
//                 duration: "P15D",
//                 label: "PRE_PART_PAYMENT",
//             },
//             tags: breakupTags,
//         };
//     }

//     // ── Process INSTALLMENT payments from saved session ───────────────────────
//     const installments = savedPayments.filter(
//         (p: any) => p?.type === "POST_FULFILLMENT" && p?.time?.label === "INSTALLMENT"
//     );

//     const updatedInstallments = installments.map((inst: any) => {
//         const rangeStart = inst?.time?.range?.start ?? inst?.time?.timestamp ?? "";
//         const instDate = new Date(rangeStart);
//         const instYear = instDate.getUTCFullYear();
//         const instMonth = instDate.getUTCMonth();
//         const monthDiff = (instYear - eventYear) * 12 + (instMonth - eventMonth);

//         let newStatus: string;
//         if (monthDiff < 0) {
//             // Past — keep PAID as-is with original transaction_id and timestamps
//             newStatus = inst.status ?? "PAID";
//             return { ...inst, status: newStatus };
//         } else if (monthDiff === 0) {
//             // Event month
//             newStatus = unsolicited ? "DEFERRED" : "NOT-PAID";
//         } else {
//             // Future
//             newStatus = "NOT-PAID";
//         }

//         // Remove transaction_id for non-PAID statuses
//         const params = { ...inst.params };
//         delete params.transaction_id;
//         return { ...inst, params, status: newStatus };
//     });

//     // ── Assemble final payments array ─────────────────────────────────────────
//     // Order: [PID-8000 PRE_PART] [PRE_ORDER] [ON_ORDER] [INSTALLMENTS...]
//     const freshNonPost = (order.payments ?? []).filter(
//         (p: any) => p?.type !== "POST_FULFILLMENT"
//     );

//     order.payments = [pid8000, ...freshNonPost, ...updatedInstallments];
//     console.log(
//         `[settlement-utils] applyPrepartInstallmentStatuses: unsolicited=${unsolicited}, ` +
//         `specialAmount=${specialAmount}, eventIdx=${eventIdx}, ` +
//         `${updatedInstallments.length} installments from saved payments`
//     );
// }

// export function applyMissedEmiInstallmentStatuses(
//     existingPayload: any,
//     sessionData: any,
//     unsolicited: boolean
// ): void {
//     const order = existingPayload?.message?.order;
//     if (!order) return;

//     // ── Saved payments from on_update ─────────────────────────────────────────
//     const savedPayments: any[] = Array.isArray(sessionData?.payments)
//         ? sessionData.payments
//         : [];

//     if (savedPayments.length === 0) {
//         console.warn("[settlement-utils] applyMissedEmiInstallmentStatuses: no saved payments, falling back to generateInstallmentPayments");
//         generateInstallmentPayments(existingPayload, sessionData);
//         return;
//     }

//     // ── Loan details ──────────────────────────────────────────────────────────
//     let details: LoanDetails;
//     if (sessionData.schedule?.length && sessionData.emi_amount && sessionData.loan_term_months) {
//         details = {
//             downPayment: sessionData.down_payment ?? 0,
//             principalAmount: sessionData.principal_amount ?? 0,
//             netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
//             emiAmount: sessionData.emi_amount,
//             totalInterest: sessionData.total_interest ?? 0,
//             loanTermMonths: sessionData.loan_term_months,
//             interestRateAnnual: sessionData.interest_rate_annual ?? 12,
//             schedule: sessionData.schedule,
//         };
//     } else {
//         details = calculateLoanDetails(sessionData, existingPayload);
//     }

//     const { schedule, emiAmount, loanTermMonths, principalAmount } = details;

//     // ── Event month from context ──────────────────────────────────────────────
//     const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
//     const eventDate = new Date(contextTs);
//     const eventYear = eventDate.getUTCFullYear();
//     const eventMonth = eventDate.getUTCMonth();

//     // eventIdx: which installment index is the "missed" one
//     const loanStartDate: Date = sessionData.loan_start_date
//         ? new Date(sessionData.loan_start_date)
//         : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

//     const startYear = loanStartDate.getUTCFullYear();
//     const startMonth = loanStartDate.getUTCMonth();
//     const diffMonths = (eventYear - startYear) * 12 + (eventMonth - startMonth);
//     const eventIdx = Math.max(0, Math.min(diffMonths, loanTermMonths - 1));

//     // ── Outstanding amounts for breakup ───────────────────────────────────────
//     let paidPrincipal = 0;
//     for (let i = 0; i < eventIdx && i < schedule.length; i++) paidPrincipal += schedule[i].principal;
//     const outstandingPrincipal = Math.round(principalAmount - paidPrincipal);

//     let outstandingInterest = 0;
//     for (let i = eventIdx; i < schedule.length; i++) outstandingInterest += schedule[i].interest;
//     outstandingInterest = Math.round(outstandingInterest);

//     // ── Late fee from DELAY_PENALTY_FEE info tag ──────────────────────────────
//     const getTagValue = (code: string, defaultVal: number): number => {
//         const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
//         for (const tag of tags) {
//             if (tag?.descriptor?.code === "INFO") {
//                 const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
//                 if (entry?.value) return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
//             }
//         }
//         return defaultVal;
//     };
//     const delayPenaltyPct = getTagValue("DELAY_PENALTY_FEE", 5);
//     const lateFee = Math.round(emiAmount * delayPenaltyPct / 100);
//     const specialAmount = Math.round(emiAmount + lateFee);

//     // ── Upsert quote.breakup ──────────────────────────────────────────────────
//     const upsertBreakup = (title: string, value: number) => {
//         order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
//         order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];
//         const idx = order.quote.breakup.findIndex((b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase());
//         const row = { title, price: { value: String(Math.round(value)), currency: "INR" } };
//         if (idx >= 0) order.quote.breakup[idx] = row; else order.quote.breakup.push(row);
//     };
//     upsertBreakup("OUTSTANDING_PRINCIPAL", outstandingPrincipal);
//     upsertBreakup("OUTSTANDING_INTEREST", outstandingInterest);
//     upsertBreakup("LATE_FEE_AMOUNT", lateFee);

//     // ── PID-8000 breakup tags (event month's EMI split) ──────────────────────
//     const refId = sessionData.message_id ?? order.id ?? "auto-ref";
//     const eventRow = schedule[eventIdx] ?? { principal: emiAmount, interest: 0 };
//     const monthStart = (y: number, m: number) => new Date(Date.UTC(y, m, 1)).toISOString();
//     const monthEnd = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999)).toISOString();

//     const breakupTags = [{
//         descriptor: { code: "BREAKUP", name: "Emi Breakup" },
//         list: [
//             { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
//             { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
//         ],
//     }];

//     // ── payments[0]: PID-8000 MISSED_EMI_PAYMENT ──────────────────────────────
//     let pid8000: any;
//     if (unsolicited) {
//         // Unsolicited: lender notifies payment was received — PAID, timestamp, range, no url
//         pid8000 = {
//             id: "PID-9000",
//             type: "POST_FULFILLMENT",
//             params: {
//                 amount: String(specialAmount),
//                 currency: "INR",
//                 transaction_id: `txn-missedemi-${Date.now()}`,
//             },
//             status: "PAID",
//             time: {
//                 label: "MISSED_EMI_PAYMENT",
//                 timestamp: monthStart(eventYear, eventMonth),
//                 range: { start: monthStart(eventYear, eventMonth), end: monthEnd(eventYear, eventMonth) },
//             },
//             tags: breakupTags,
//         };
//     } else {
//         const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

//         // Solicited: borrower missed EMI — NOT-PAID, url, P15D, range
//         pid8000 = {
//             id: "PID-9000",
//             type: "POST_FULFILLMENT",
//             params: { amount: String(specialAmount), currency: "INR" },
//             status: "NOT-PAID",
//             url: paymentUrl,
//             time: {
//                 duration: "P15D",
//                 label: "MISSED_EMI_PAYMENT",
//                 range: { start: monthStart(eventYear, eventMonth), end: monthEnd(eventYear, eventMonth) },
//             },
//             tags: breakupTags,
//         };
//     }

//     // ── INSTALLMENT payments from saved session ───────────────────────────────
//     const installments = savedPayments.filter(
//         (p: any) => p?.type === "POST_FULFILLMENT" && p?.time?.label === "INSTALLMENT"
//     );

//     const updatedInstallments = installments.map((inst: any) => {
//         const rangeStart = inst?.time?.range?.start ?? inst?.time?.timestamp ?? "";
//         const instDate = new Date(rangeStart);
//         const instYear = instDate.getUTCFullYear();
//         const instMonth = instDate.getUTCMonth();
//         const monthDiff = (instYear - eventYear) * 12 + (instMonth - eventMonth);

//         if (monthDiff < 0) {
//             // Past — keep PAID exactly as-is (real transaction_id, real timestamps)
//             return { ...inst, status: inst.status ?? "PAID" };
//         }

//         let newStatus: string;
//         if (monthDiff === 0) {
//             newStatus = unsolicited ? "DEFERRED" : "DELAYED";  // ← key difference from prepart
//         } else {
//             newStatus = "NOT-PAID";
//         }

//         const params = { ...inst.params };
//         delete params.transaction_id;
//         return { ...inst, params, status: newStatus };
//     });

//     // ── Assemble: [PID-8000] [PRE_ORDER] [ON_ORDER] [INSTALLMENTS...] ─────────
//     const freshNonPost = (order.payments ?? []).filter(
//         (p: any) => p?.type !== "POST_FULFILLMENT"
//     );

//     order.payments = [pid8000, ...freshNonPost, ...updatedInstallments];
//     console.log(
//         `[settlement-utils] applyMissedEmiInstallmentStatuses: unsolicited=${unsolicited}, ` +
//         `emiAmount=${emiAmount}, lateFee=${lateFee}, specialAmount=${specialAmount}, ` +
//         `eventIdx=${eventIdx}, ${updatedInstallments.length} installments`
//     );
// }

// export function applyForeclosureInstallmentStatuses(
//     existingPayload: any,
//     sessionData: any,
//     unsolicited: boolean
// ): void {
//     const order = existingPayload?.message?.order;
//     if (!order) return;

//     // ── Saved payments from on_update ─────────────────────────────────────────
//     const savedPayments: any[] = Array.isArray(sessionData?.payments)
//         ? sessionData.payments
//         : [];

//     if (savedPayments.length === 0) {
//         console.warn("[settlement-utils] applyForeclosureInstallmentStatuses: no saved payments, falling back to generateInstallmentPayments");
//         generateInstallmentPayments(existingPayload, sessionData);
//         return;
//     }

//     // ── Loan details ──────────────────────────────────────────────────────────
//     let details: LoanDetails;
//     if (sessionData.schedule?.length && sessionData.emi_amount && sessionData.loan_term_months) {
//         details = {
//             downPayment: sessionData.down_payment ?? 0,
//             principalAmount: sessionData.principal_amount ?? 0,
//             netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
//             emiAmount: sessionData.emi_amount,
//             totalInterest: sessionData.total_interest ?? 0,
//             loanTermMonths: sessionData.loan_term_months,
//             interestRateAnnual: sessionData.interest_rate_annual ?? 12,
//             schedule: sessionData.schedule,
//         };
//     } else {
//         details = calculateLoanDetails(sessionData, existingPayload);
//     }

//     const { schedule, loanTermMonths, principalAmount } = details;

//     // ── Event month from context ──────────────────────────────────────────────
//     const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
//     const eventDate = new Date(contextTs);
//     const eventYear = eventDate.getUTCFullYear();
//     const eventMonth = eventDate.getUTCMonth();

//     const loanStartDate: Date = sessionData.loan_start_date
//         ? new Date(sessionData.loan_start_date)
//         : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

//     const startYear = loanStartDate.getUTCFullYear();
//     const startMonth = loanStartDate.getUTCMonth();
//     const diffMonths = (eventYear - startYear) * 12 + (eventMonth - startMonth);
//     const eventIdx = Math.max(0, Math.min(diffMonths, loanTermMonths - 1));

//     // ── Outstanding amounts ───────────────────────────────────────────────────
//     let paidPrincipal = 0;
//     for (let i = 0; i < eventIdx && i < schedule.length; i++) paidPrincipal += schedule[i].principal;
//     const outstandingPrincipal = Math.round(principalAmount - paidPrincipal);

//     let outstandingInterest = 0;
//     for (let i = eventIdx; i < schedule.length; i++) outstandingInterest += schedule[i].interest;
//     outstandingInterest = Math.round(outstandingInterest);

//     // ── Foreclosure charge from FORECLOSURE_FEE info tag (default 0.5%) ──────
//     const getTagValue = (code: string, defaultVal: number): number => {
//         const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
//         for (const tag of tags) {
//             if (tag?.descriptor?.code === "INFO") {
//                 const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
//                 if (entry?.value) return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
//             }
//         }
//         return defaultVal;
//     };
//     const foreclosureFeePct = getTagValue("FORECLOSURE_FEE", 0.5);
//     const foreclosureCharges = Math.round(outstandingPrincipal * foreclosureFeePct / 100);
//     const specialAmount = outstandingPrincipal + outstandingInterest + foreclosureCharges;

//     // ── Upsert quote.breakup ──────────────────────────────────────────────────
//     const upsertBreakup = (title: string, value: number) => {
//         order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
//         order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];
//         const idx = order.quote.breakup.findIndex((b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase());
//         const row = { title, price: { value: String(Math.round(value)), currency: "INR" } };
//         if (idx >= 0) order.quote.breakup[idx] = row; else order.quote.breakup.push(row);
//     };
//     upsertBreakup("OUTSTANDING_PRINCIPAL", outstandingPrincipal);
//     upsertBreakup("OUTSTANDING_INTEREST", outstandingInterest);
//     upsertBreakup("FORECLOSURE_CHARGES", foreclosureCharges);

//     // ── PID-8000 breakup tags ─────────────────────────────────────────────────
//     const refId = sessionData.message_id ?? order.id ?? "auto-ref";
//     const monthStart = (y: number, m: number) => new Date(Date.UTC(y, m, 1)).toISOString();

//     const breakupTags = [{
//         descriptor: { code: "BREAKUP", name: "Emi Breakup" },
//         list: [
//             { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${outstandingPrincipal} INR` },
//             { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${outstandingInterest} INR` },
//         ],
//     }];

//     // ── payments[0]: PID-8000 FORECLOSURE ────────────────────────────────────
//     let pid8000: any;
//     if (unsolicited) {
//         // Lender-initiated (closed): PAID, timestamp, no url, no range
//         pid8000 = {
//             id: "PID-9000",
//             type: "POST_FULFILLMENT",
//             params: {
//                 amount: String(specialAmount),
//                 currency: "INR",
//                 transaction_id: `txn-foreclosure-${Date.now()}`,
//             },
//             status: "PAID",
//             time: {
//                 timestamp: monthStart(eventYear, eventMonth),
//                 label: "FORECLOSURE",
//             },
//             tags: breakupTags,
//         };
//     } else {
//         const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

//         // Borrower-initiated (requesting closure): NOT-PAID, url, PT90M window, no range
//         pid8000 = {
//             id: "PID-9000",
//             type: "POST_FULFILLMENT",
//             params: { amount: String(specialAmount), currency: "INR" },
//             status: "NOT-PAID",
//             url: paymentUrl,
//             time: {
//                 duration: "PT90M",
//                 label: "FORECLOSURE",
//             },
//             tags: breakupTags,
//         };
//     }

//     // ── INSTALLMENT payments from saved session ───────────────────────────────
//     const installments = savedPayments.filter(
//         (p: any) => p?.type === "POST_FULFILLMENT" && p?.time?.label === "INSTALLMENT"
//     );

//     const updatedInstallments = installments.map((inst: any) => {
//         const rangeStart = inst?.time?.range?.start ?? inst?.time?.timestamp ?? "";
//         const instDate = new Date(rangeStart);
//         const instYear = instDate.getUTCFullYear();
//         const instMonth = instDate.getUTCMonth();
//         const monthDiff = (instYear - eventYear) * 12 + (instMonth - eventMonth);

//         if (monthDiff < 0) {
//             // Past — keep PAID exactly as-is
//             return { ...inst, status: inst.status ?? "PAID" };
//         }

//         // Key difference vs prepart/missedEMI:
//         // Unsolicited (lender closed loan) → ALL remaining = DEFERRED
//         // Solicited   (borrower requested) → ALL remaining = NOT-PAID
//         const newStatus = unsolicited ? "DEFERRED" : "NOT-PAID";
//         const params = { ...inst.params };
//         delete params.transaction_id;
//         return { ...inst, params, status: newStatus };
//     });

//     // ── Assemble: [PID-8000] [PRE_ORDER] [ON_ORDER] [INSTALLMENTS...] ─────────
//     const freshNonPost = (order.payments ?? []).filter(
//         (p: any) => p?.type !== "POST_FULFILLMENT"
//     );

//     order.payments = [pid8000, ...freshNonPost, ...updatedInstallments];
//     console.log(
//         `[settlement-utils] applyForeclosureInstallmentStatuses: unsolicited=${unsolicited}, ` +
//         `outstandingPrincipal=${outstandingPrincipal}, foreclosureCharges=${foreclosureCharges}, ` +
//         `specialAmount=${specialAmount}, eventIdx=${eventIdx}, ${updatedInstallments.length} installments`
//     );
// }

export function applyForeclosureInstallmentStatuses(
    existingPayload: any,
    sessionData: any,
    unsolicited: boolean
): void {
    const order = existingPayload?.message?.order;
    if (!order) return;

    // ── Saved payments ─────────────────────────────────────────
    const savedPayments: any[] = Array.isArray(sessionData?.payments)
        ? sessionData.payments
        : [];

    if (savedPayments.length === 0) {
        console.warn("[settlement-utils] no saved payments, fallback");
        generateInstallmentPayments(existingPayload, sessionData);
        return;
    }

    // ── Loan details ───────────────────────────────────────────
    let details: LoanDetails;
    if (sessionData.schedule?.length && sessionData.emi_amount && sessionData.loan_term_months) {
        details = {
            downPayment: sessionData.down_payment ?? 0,
            principalAmount: sessionData.principal_amount ?? 0,
            netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
            emiAmount: sessionData.emi_amount,
            totalInterest: sessionData.total_interest ?? 0,
            loanTermMonths: sessionData.loan_term_months,
            interestRateAnnual: sessionData.interest_rate_annual ?? 12,
            schedule: sessionData.schedule,
        };
    } else {
        details = calculateLoanDetails(sessionData, existingPayload);
    }

    const { schedule, loanTermMonths, principalAmount } = details;

    // ── Event month ────────────────────────────────────────────
    const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
    const eventDate = new Date(contextTs);
    const eventYear = eventDate.getUTCFullYear();
    const eventMonth = eventDate.getUTCMonth();

    const loanStartDate: Date = sessionData.loan_start_date
        ? new Date(sessionData.loan_start_date)
        : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

    const startYear = loanStartDate.getUTCFullYear();
    const startMonth = loanStartDate.getUTCMonth();

    const diffMonths = (eventYear - startYear) * 12 + (eventMonth - startMonth);
    const eventIdx = Math.max(0, Math.min(diffMonths, loanTermMonths - 1));

    // ── Outstanding Principal (Correct) ────────────────────────
    let paidPrincipal = 0;
    for (let i = 0; i < eventIdx && i < schedule.length; i++) {
        paidPrincipal += schedule[i].principal;
    }
    const outstandingPrincipal = Math.round(principalAmount - paidPrincipal);

    // ── Outstanding Interest (FIXED) ───────────────────────────
    const outstandingInterest = Math.round(
        schedule[eventIdx]?.interest ?? 0
    );

    // ── Foreclosure Charges ────────────────────────────────────
    const getTagValue = (code: string, defaultVal: number): number => {
        const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
        for (const tag of tags) {
            if (tag?.descriptor?.code === "INFO") {
                const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
                if (entry?.value) {
                    return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
                }
            }
        }
        return defaultVal;
    };

    const foreclosureFeePct = getTagValue("FORECLOSURE_FEE", 0.5);
    const foreclosureCharges = Math.round(outstandingPrincipal * foreclosureFeePct / 100);

    // ── INSTALLMENTS ───────────────────────────────────────────
    const installments = savedPayments.filter(
        (p: any) => p?.type === "POST_FULFILLMENT" && p?.time?.label === "INSTALLMENT"
    );

    const updatedInstallments = installments.map((inst: any) => {
        const rangeStart = inst?.time?.range?.start ?? inst?.time?.timestamp ?? "";
        const instDate = new Date(rangeStart);

        const instYear = instDate.getUTCFullYear();
        const instMonth = instDate.getUTCMonth();

        const monthDiff = (instYear - eventYear) * 12 + (instMonth - eventMonth);

        if (monthDiff < 0) {
            return { ...inst, status: inst.status ?? "PAID" };
        }

        const newStatus = unsolicited ? "DEFERRED" : "NOT-PAID";

        const params = { ...inst.params };
        delete params.transaction_id;

        return { ...inst, params, status: newStatus };
    });

    // ── Calculate Quote from Installments (IMPORTANT) ──────────
    const calculateQuoteFromInstallments = (installments: any[]) => {
        let principal = 0;
        let interest = 0;

        for (const inst of installments) {
            if (inst.status === "NOT-PAID") {
                const breakup = inst.tags?.find((t: any) => t.descriptor?.code === "BREAKUP");

                const p = Number(
                    breakup?.list?.find((l: any) => l.descriptor?.code === "PRINCIPAL_AMOUNT")
                        ?.value?.replace(/[^0-9.]/g, "") || 0
                );

                const i = Number(
                    breakup?.list?.find((l: any) => l.descriptor?.code === "INTEREST_AMOUNT")
                        ?.value?.replace(/[^0-9.]/g, "") || 0
                );

                principal += p;
                interest += i;
            }
        }

        return { principal, interest };
    };

    let payablePrincipal = 0;
    let payableInterest = 0;

    if (!unsolicited) {
        const res = calculateQuoteFromInstallments(updatedInstallments);
        payablePrincipal = res.principal;
        payableInterest = res.interest;
    }

    // ── Quote Update ───────────────────────────────────────────
    const upsertBreakup = (title: string, value: number) => {
        order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
        order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];

        const idx = order.quote.breakup.findIndex(
            (b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase()
        );

        const row = {
            title,
            price: { value: String(Math.round(value)), currency: "INR" },
        };

        if (idx >= 0) order.quote.breakup[idx] = row;
        else order.quote.breakup.push(row);
    };

    upsertBreakup("OUTSTANDING_PRINCIPAL", payablePrincipal);
    upsertBreakup("OUTSTANDING_INTEREST", payableInterest);
    upsertBreakup("FORECLOSURE_CHARGES", foreclosureCharges);

    const specialAmount = payablePrincipal + payableInterest + foreclosureCharges;

    // ── Breakup Tags ───────────────────────────────────────────
    const breakupTags = [{
        descriptor: { code: "BREAKUP", name: "Emi Breakup" },
        list: [
            { descriptor: { code: "PRINCIPAL_AMOUNT" }, value: `${payablePrincipal} INR` },
            { descriptor: { code: "INTEREST_AMOUNT" }, value: `${payableInterest} INR` },
        ],
    }];

    const monthStart = (y: number, m: number) =>
        new Date(Date.UTC(y, m, 1)).toISOString();

    // ── PID-8000 ───────────────────────────────────────────────
    let pid8000: any;

    if (unsolicited) {
        pid8000 = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: {
                amount: String(specialAmount),
                currency: "INR",
                transaction_id: `txn-foreclosure-${Date.now()}`,
            },
            status: "PAID",
            time: {
                timestamp: monthStart(eventYear, eventMonth),
                label: "FORECLOSURE",
            },
            tags: breakupTags,
        };
    } else {
        const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

        pid8000 = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: {
                amount: String(specialAmount),
                currency: "INR",
            },
            status: "NOT-PAID",
            url: paymentUrl,
            time: {
                duration: "PT90M",
                label: "FORECLOSURE",
            },
            tags: breakupTags,
        };
    }

    // ── Final Payments ─────────────────────────────────────────
    const freshNonPost = (order.payments ?? []).filter(
        (p: any) => p?.type !== "POST_FULFILLMENT"
    );

    order.payments = [pid8000, ...freshNonPost, ...updatedInstallments];

    console.log(
        `[settlement-utils] foreclosure applied → principal=${payablePrincipal}, interest=${payableInterest}, charges=${foreclosureCharges}, total=${specialAmount}`
    );
}

export function applyMissedEmiInstallmentStatuses(
    existingPayload: any,
    sessionData: any,
    unsolicited: boolean
): void {
    const order = existingPayload?.message?.order;
    if (!order) return;

    // ── Saved payments ─────────────────────────────────────────
    const savedPayments: any[] = Array.isArray(sessionData?.payments)
        ? sessionData.payments
        : [];

    if (savedPayments.length === 0) {
        console.warn("[settlement-utils] no saved payments, fallback");
        generateInstallmentPayments(existingPayload, sessionData);
        return;
    }

    // ── Loan details ───────────────────────────────────────────
    let details: LoanDetails;
    if (sessionData.schedule?.length && sessionData.emi_amount && sessionData.loan_term_months) {
        details = {
            downPayment: sessionData.down_payment ?? 0,
            principalAmount: sessionData.principal_amount ?? 0,
            netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
            emiAmount: sessionData.emi_amount,
            totalInterest: sessionData.total_interest ?? 0,
            loanTermMonths: sessionData.loan_term_months,
            interestRateAnnual: sessionData.interest_rate_annual ?? 12,
            schedule: sessionData.schedule,
        };
    } else {
        details = calculateLoanDetails(sessionData, existingPayload);
    }

    const { schedule, emiAmount, loanTermMonths } = details;

    // ── Event month ────────────────────────────────────────────
    const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
    const eventDate = new Date(contextTs);
    const eventYear = eventDate.getUTCFullYear();
    const eventMonth = eventDate.getUTCMonth();

    const loanStartDate: Date = sessionData.loan_start_date
        ? new Date(sessionData.loan_start_date)
        : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

    const startYear = loanStartDate.getUTCFullYear();
    const startMonth = loanStartDate.getUTCMonth();

    const diffMonths = (eventYear - startYear) * 12 + (eventMonth - startMonth);
    const eventIdx = Math.max(0, Math.min(diffMonths, loanTermMonths - 1));

    // ── Late Fee ───────────────────────────────────────────────
    const getTagValue = (code: string, defaultVal: number): number => {
        const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
        for (const tag of tags) {
            if (tag?.descriptor?.code === "INFO") {
                const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
                if (entry?.value) {
                    return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
                }
            }
        }
        return defaultVal;
    };

    const delayPenaltyPct = getTagValue("DELAY_PENALTY_FEE", 5);
    const lateFee = Math.round(emiAmount * delayPenaltyPct / 100);

    // ── INSTALLMENTS ───────────────────────────────────────────
    const installments = savedPayments.filter(
        (p: any) => p?.type === "POST_FULFILLMENT" && p?.time?.label === "INSTALLMENT"
    );

    const updatedInstallments = installments.map((inst: any) => {
        const rangeStart = inst?.time?.range?.start ?? inst?.time?.timestamp ?? "";
        const instDate = new Date(rangeStart);

        const instYear = instDate.getUTCFullYear();
        const instMonth = instDate.getUTCMonth();

        const monthDiff = (instYear - eventYear) * 12 + (instMonth - eventMonth);

        if (monthDiff < 0) {
            return { ...inst, status: inst.status ?? "PAID" };
        }

        let newStatus: string;

        if (monthDiff === 0) {
            newStatus = unsolicited ? "DEFERRED" : "DELAYED";
        } else {
            newStatus = "NOT-PAID";
        }

        const params = { ...inst.params };
        delete params.transaction_id;

        return { ...inst, params, status: newStatus };
    });

    // ── Calculate Quote from Installments ──────────────────────
    const calculateQuoteFromInstallments = (installments: any[]) => {
        let principal = 0;
        let interest = 0;

        for (const inst of installments) {
            if (["NOT-PAID", "DELAYED"].includes(inst.status)) {
                const breakup = inst.tags?.find((t: any) => t.descriptor?.code === "BREAKUP");

                const p = Number(
                    breakup?.list?.find((l: any) => l.descriptor?.code === "PRINCIPAL_AMOUNT")
                        ?.value?.replace(/[^0-9.]/g, "") || 0
                );

                const i = Number(
                    breakup?.list?.find((l: any) => l.descriptor?.code === "INTEREST_AMOUNT")
                        ?.value?.replace(/[^0-9.]/g, "") || 0
                );

                principal += p;
                interest += i;
            }
        }

        return { principal, interest };
    };

    let payablePrincipal = 0;
    let payableInterest = 0;

    const res = calculateQuoteFromInstallments(updatedInstallments);
    payablePrincipal = res.principal;
    payableInterest = res.interest;

    // ── Quote Update ───────────────────────────────────────────
    const upsertBreakup = (title: string, value: number) => {
        order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
        order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];

        const idx = order.quote.breakup.findIndex(
            (b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase()
        );

        const row = {
            title,
            price: { value: String(Math.round(value)), currency: "INR" },
        };

        if (idx >= 0) order.quote.breakup[idx] = row;
        else order.quote.breakup.push(row);
    };

    upsertBreakup("OUTSTANDING_PRINCIPAL", payablePrincipal);
    upsertBreakup("OUTSTANDING_INTEREST", payableInterest);
    upsertBreakup("LATE_FEE_AMOUNT", lateFee);

    const specialAmount = payablePrincipal + payableInterest + lateFee;

    // ── Breakup Tags (event EMI only) ──────────────────────────
    const eventRow = schedule[eventIdx] ?? { principal: emiAmount, interest: 0 };

    const breakupTags = [{
        descriptor: { code: "BREAKUP", name: "Emi Breakup" },
        list: [
            { descriptor: { code: "PRINCIPAL_AMOUNT" }, value: `${eventRow.principal} INR` },
            { descriptor: { code: "INTEREST_AMOUNT" }, value: `${eventRow.interest} INR` },
        ],
    }];

    const monthStart = (y: number, m: number) =>
        new Date(Date.UTC(y, m, 1)).toISOString();

    const monthEnd = (y: number, m: number) =>
        new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999)).toISOString();

    // ── PID-8000 ───────────────────────────────────────────────
    let pid8000: any;

    if (unsolicited) {
        pid8000 = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: {
                amount: String(specialAmount),
                currency: "INR",
                transaction_id: `txn-missedemi-${Date.now()}`,
            },
            status: "PAID",
            time: {
                label: "MISSED_EMI_PAYMENT",
                timestamp: monthStart(eventYear, eventMonth),
                range: { start: monthStart(eventYear, eventMonth), end: monthEnd(eventYear, eventMonth) },
            },
            tags: breakupTags,
        };
    } else {
        const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

        pid8000 = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(specialAmount), currency: "INR" },
            status: "NOT-PAID",
            url: paymentUrl,
            time: {
                duration: "P15D",
                label: "MISSED_EMI_PAYMENT",
                range: { start: monthStart(eventYear, eventMonth), end: monthEnd(eventYear, eventMonth) },
            },
            tags: breakupTags,
        };
    }

    // ── Final Payments ─────────────────────────────────────────
    const freshNonPost = (order.payments ?? []).filter(
        (p: any) => p?.type !== "POST_FULFILLMENT"
    );

    order.payments = [pid8000, ...freshNonPost, ...updatedInstallments];

    console.log(
        `[settlement-utils] missed EMI applied → principal=${payablePrincipal}, interest=${payableInterest}, lateFee=${lateFee}, total=${specialAmount}`
    );
}

export function applyPrepartInstallmentStatuses(
    existingPayload: any,
    sessionData: any,
    unsolicited: boolean
): void {
    const order = existingPayload?.message?.order;
    if (!order) return;

    // ── Saved payments ─────────────────────────────────────────
    const savedPayments: any[] = Array.isArray(sessionData?.payments)
        ? sessionData.payments
        : [];

    if (savedPayments.length === 0) {
        console.warn("[settlement-utils] no saved payments, fallback");
        generateInstallmentPayments(existingPayload, sessionData);
        return;
    }

    // ── Loan details ───────────────────────────────────────────
    let details: LoanDetails;
    if (sessionData.schedule?.length && sessionData.emi_amount && sessionData.loan_term_months) {
        details = {
            downPayment: sessionData.down_payment ?? 0,
            principalAmount: sessionData.principal_amount ?? 0,
            netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
            emiAmount: sessionData.emi_amount,
            totalInterest: sessionData.total_interest ?? 0,
            loanTermMonths: sessionData.loan_term_months,
            interestRateAnnual: sessionData.interest_rate_annual ?? 12,
            schedule: sessionData.schedule,
        };
    } else {
        details = calculateLoanDetails(sessionData, existingPayload);
    }

    const { schedule, emiAmount, loanTermMonths } = details;

    // ── Event month ────────────────────────────────────────────
    const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
    const eventDate = new Date(contextTs);
    const eventYear = eventDate.getUTCFullYear();
    const eventMonth = eventDate.getUTCMonth();

    const loanStartDate: Date = sessionData.loan_start_date
        ? new Date(sessionData.loan_start_date)
        : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

    const startYear = loanStartDate.getUTCFullYear();
    const startMonth = loanStartDate.getUTCMonth();

    const diff = (eventYear - startYear) * 12 + (eventMonth - startMonth);
    const eventIdx = Math.max(0, Math.min(diff, loanTermMonths - 1));

    // ── Prepayment Charge ──────────────────────────────────────
    const getTagValue = (code: string, defaultVal: number): number => {
        const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
        for (const tag of tags) {
            if (tag?.descriptor?.code === "INFO") {
                const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
                if (entry?.value) {
                    return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
                }
            }
        }
        return defaultVal;
    };

    const prepayPct = getTagValue("FORECLOSURE_FEE", 0.5);
    let prePaymentCharge = 0;

    // ── INSTALLMENTS ───────────────────────────────────────────
    const installments = savedPayments.filter(
        (p: any) => p?.type === "POST_FULFILLMENT" && p?.time?.label === "INSTALLMENT"
    );

    const updatedInstallments = installments.map((inst: any) => {
        const rangeStart = inst?.time?.range?.start ?? inst?.time?.timestamp ?? "";
        const instDate = new Date(rangeStart);

        const instYear = instDate.getUTCFullYear();
        const instMonth = instDate.getUTCMonth();

        const monthDiff = (instYear - eventYear) * 12 + (instMonth - eventMonth);

        if (monthDiff < 0) {
            return { ...inst, status: inst.status ?? "PAID" };
        }

        let newStatus: string;

        if (monthDiff === 0) {
            newStatus = unsolicited ? "DEFERRED" : "NOT-PAID";
        } else {
            newStatus = "NOT-PAID";
        }

        const params = { ...inst.params };
        delete params.transaction_id;

        return { ...inst, params, status: newStatus };
    });

    // ── Calculate Quote from Installments ──────────────────────
    const calculateQuoteFromInstallments = (installments: any[]) => {
        let principal = 0;
        let interest = 0;

        for (const inst of installments) {
            if (inst.status === "NOT-PAID") {
                const breakup = inst.tags?.find((t: any) => t.descriptor?.code === "BREAKUP");

                const p = Number(
                    breakup?.list?.find((l: any) => l.descriptor?.code === "PRINCIPAL_AMOUNT")
                        ?.value?.replace(/[^0-9.]/g, "") || 0
                );

                const i = Number(
                    breakup?.list?.find((l: any) => l.descriptor?.code === "INTEREST_AMOUNT")
                        ?.value?.replace(/[^0-9.]/g, "") || 0
                );

                principal += p;
                interest += i;
            }
        }

        return { principal, interest };
    };

    const { principal: payablePrincipal, interest: payableInterest } =
        calculateQuoteFromInstallments(updatedInstallments);

    // calculate prepayment charge ONLY on payable principal
    prePaymentCharge = Math.round(payablePrincipal * prepayPct / 100);

    // ── Quote Update ───────────────────────────────────────────
    const upsertBreakup = (title: string, value: number) => {
        order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
        order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];

        const idx = order.quote.breakup.findIndex(
            (b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase()
        );

        const row = {
            title,
            price: { value: String(Math.round(value)), currency: "INR" },
        };

        if (idx >= 0) order.quote.breakup[idx] = row;
        else order.quote.breakup.push(row);
    };

    upsertBreakup("OUTSTANDING_PRINCIPAL", payablePrincipal);
    upsertBreakup("OUTSTANDING_INTEREST", payableInterest);
    upsertBreakup("PRE_PAYMENT_CHARGE", prePaymentCharge);

    const specialAmount = payablePrincipal + payableInterest + prePaymentCharge;

    // ── Breakup Tags (event EMI only) ──────────────────────────
    const eventRow = schedule[eventIdx] ?? { principal: emiAmount, interest: 0 };

    const breakupTags = [{
        descriptor: { code: "BREAKUP", name: "Emi Breakup" },
        list: [
            { descriptor: { code: "PRINCIPAL_AMOUNT" }, value: `${eventRow.principal} INR` },
            { descriptor: { code: "INTEREST_AMOUNT" }, value: `${eventRow.interest} INR` },
        ],
    }];

    const monthStart = (y: number, m: number) =>
        new Date(Date.UTC(y, m, 1)).toISOString();

    // ── PID-8000 ───────────────────────────────────────────────
    let pid8000: any;

    if (unsolicited) {
        pid8000 = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: {
                amount: String(specialAmount),
                currency: "INR",
                transaction_id: `txn-prepart-${Date.now()}`,
            },
            status: "PAID",
            time: {
                timestamp: monthStart(eventYear, eventMonth),
                label: "PRE_PART_PAYMENT",
            },
            tags: breakupTags,
        };
    } else {
        const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

        pid8000 = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: {
                amount: String(specialAmount),
                currency: "INR",
            },
            status: "NOT-PAID",
            url: paymentUrl,
            time: {
                duration: "P15D",
                label: "PRE_PART_PAYMENT",
            },
            tags: breakupTags,
        };
    }

    // ── Final Payments ─────────────────────────────────────────
    const freshNonPost = (order.payments ?? []).filter(
        (p: any) => p?.type !== "POST_FULFILLMENT"
    );

    order.payments = [pid8000, ...freshNonPost, ...updatedInstallments];

    console.log(
        `[settlement-utils] prepart applied → principal=${payablePrincipal}, interest=${payableInterest}, charge=${prePaymentCharge}, total=${specialAmount}`
    );
}


export type UpdatePaymentType =
    | "MISSED_EMI_SOLICITED"
    | "MISSED_EMI_UNSOLICITED"
    | "FORECLOSURE_SOLICITED"
    | "FORECLOSURE_UNSOLICITED"
    | "PRE_PART_SOLICITED"
    | "PRE_PART_UNSOLICITED";


export function generateUpdatePayments(
    existingPayload: any,
    sessionData: any,
    paymentType: UpdatePaymentType
): void {
    const order = existingPayload?.message?.order;
    if (!order) return;

    // ── Rebuild amortisation schedule ─────────────────────────────────────────
    let details: LoanDetails;
    if (
        sessionData.schedule && Array.isArray(sessionData.schedule) &&
        sessionData.schedule.length > 0 &&
        sessionData.emi_amount && sessionData.loan_term_months
    ) {
        // Re-use cached schedule
        details = {
            downPayment: sessionData.down_payment ?? 0,
            principalAmount: sessionData.principal_amount ?? 0,
            netDisbursedAmount: sessionData.net_disbursed_amount ?? 0,
            emiAmount: sessionData.emi_amount,
            totalInterest: sessionData.total_interest ?? 0,
            loanTermMonths: sessionData.loan_term_months,
            interestRateAnnual: sessionData.interest_rate_annual ?? 12,
            schedule: sessionData.schedule,
        };
    } else {
        details = calculateLoanDetails(sessionData, existingPayload);
        sessionData.schedule = details.schedule;
        sessionData.emi_amount = details.emiAmount;
        sessionData.loan_term_months = details.loanTermMonths;
        sessionData.total_interest = details.totalInterest;
        sessionData.principal_amount = details.principalAmount;
        sessionData.net_disbursed_amount = details.netDisbursedAmount;
    }

    const { schedule, emiAmount, loanTermMonths, principalAmount } = details;
    const monthlyRate = (details.interestRateAnnual / 12 / 100);

    // ── Constants ─────────────────────────────────────────────────────────────
    const contextTs = existingPayload?.context?.timestamp ?? new Date().toISOString();
    const eventDate = new Date(contextTs);
    const baseDate = new Date(contextTs);
    // Loan starts 1 month after context (i = 0 → next month after disbursal)
    // But we also support baseDate = sessionData.loan_start_date if set.
    const loanStartDate = sessionData.loan_start_date
        ? new Date(sessionData.loan_start_date)
        : new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth() - (loanTermMonths - 1), 1));

    const monthStart = (year: number, month: number) =>
        new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)).toISOString();
    const monthEnd = (year: number, month: number) =>
        new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString();

    // Determine which instalment index corresponds to the event month
    const eventYear = eventDate.getUTCFullYear();
    const eventMonth = eventDate.getUTCMonth();

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getTagValue = (code: string, defaultVal: number): number => {
        const tags: any[] = existingPayload?.message?.order?.items?.[0]?.tags ?? [];
        for (const tag of tags) {
            if (tag?.descriptor?.code === "INFO") {
                const entry = (tag.list ?? []).find((i: any) => i?.descriptor?.code === code);
                if (entry?.value) {
                    // e.g. "0.5 %" or "5 %"
                    return parseFloat(String(entry.value).replace(/[^0-9.]/g, "")) || defaultVal;
                }
            }
        }
        return defaultVal;
    };

    const upsertBreakup = (title: string, value: number) => {
        order.quote = order.quote ?? { price: { currency: "INR", value: "0" }, breakup: [] };
        order.quote.breakup = Array.isArray(order.quote.breakup) ? order.quote.breakup : [];
        const idx = order.quote.breakup.findIndex(
            (b: any) => (b?.title ?? "").toUpperCase() === title.toUpperCase()
        );
        const row = { title, price: { value: String(Math.round(value)), currency: "INR" } };
        if (idx >= 0) order.quote.breakup[idx] = row; else order.quote.breakup.push(row);
    };

    // ── Determine outstanding amounts at event month ───────────────────────────
    // Walk the schedule up to the event month index
    let eventIdx = 0;
    {
        const startYear = loanStartDate.getUTCFullYear();
        const startMonth = loanStartDate.getUTCMonth();
        const diff = (eventYear - startYear) * 12 + (eventMonth - startMonth);
        // Clamp to valid range [0, loanTermMonths-1]
        eventIdx = Math.max(0, Math.min(diff, loanTermMonths - 1));
    }

    // Outstanding principal = sum of principal remaining after eventIdx-1 paid instalments
    // = principalAmount - sum of principal[0..eventIdx-1]
    let paidPrincipal = 0;
    for (let i = 0; i < eventIdx && i < schedule.length; i++) {
        paidPrincipal += schedule[i].principal;
    }
    const outstandingPrincipal = Math.round(principalAmount - paidPrincipal);

    // Outstanding interest = interest on remaining months from eventIdx
    let outstandingInterest = 0;
    for (let i = eventIdx; i < schedule.length; i++) {
        outstandingInterest += schedule[i].interest;
    }
    outstandingInterest = Math.round(outstandingInterest);

    // ── Calculate special charges from item INFO tags ─────────────────────────
    let specialCharge = 0;
    let chargeTitle = "";
    let specialPaymentLabel = "";
    let specialPaymentAmount = 0;

    if (paymentType === "MISSED_EMI_SOLICITED" || paymentType === "MISSED_EMI_UNSOLICITED") {
        const delayPenaltyPct = getTagValue("DELAY_PENALTY_FEE", 5);
        specialCharge = Math.round(emiAmount * delayPenaltyPct / 100);
        chargeTitle = "LATE_FEE_AMOUNT";
        specialPaymentLabel = "MISSED_EMI_PAYMENT";
        specialPaymentAmount = emiAmount + specialCharge;
    } else if (paymentType === "FORECLOSURE_SOLICITED" || paymentType === "FORECLOSURE_UNSOLICITED") {
        const foreclosurePct = getTagValue("FORECLOSURE_FEE", 0.5);
        specialCharge = Math.round(outstandingPrincipal * foreclosurePct / 100);
        chargeTitle = "FORECLOSURE_CHARGES";
        specialPaymentLabel = "FORECLOSURE";
        specialPaymentAmount = outstandingPrincipal + outstandingInterest + specialCharge;
    } else if (paymentType === "PRE_PART_SOLICITED" || paymentType === "PRE_PART_UNSOLICITED") {
        const prepayPct = getTagValue("FORECLOSURE_FEE", 0.5);
        specialCharge = Math.round(outstandingPrincipal * prepayPct / 100);
        chargeTitle = "PRE_PAYMENT_CHARGE";
        specialPaymentLabel = "PRE_PART_PAYMENT";
        specialPaymentAmount = outstandingPrincipal + outstandingInterest + specialCharge;
    }

    // ── Inject dynamic quote breakup ──────────────────────────────────────────
    upsertBreakup("OUTSTANDING_PRINCIPAL", outstandingPrincipal);
    upsertBreakup("OUTSTANDING_INTEREST", outstandingInterest);
    upsertBreakup(chargeTitle, specialCharge);

    // Update quote total price
    const processingFee = parseFloat((order.quote?.breakup ?? []).find((b: any) => b.title === "PROCESSING_FEE")?.price?.value ?? "0");
    const insuranceCharges = parseFloat((order.quote?.breakup ?? []).find((b: any) => b.title === "INSURANCE_CHARGES")?.price?.value ?? "0");
    const totalQuote = details.principalAmount + details.totalInterest + processingFee + insuranceCharges + specialCharge;
    order.quote.price = { currency: "INR", value: String(Math.round(totalQuote)) };

    // ── Build instalment history array ────────────────────────────────────────
    const nonPostPayments: any[] = (order.payments ?? []).filter(
        (p: any) => p?.type !== "POST_FULFILLMENT"
    );

    const instalments: any[] = [];

    for (let i = 0; i < loanTermMonths; i++) {
        const instMonth = loanStartDate.getUTCMonth() + i;
        const year = loanStartDate.getUTCFullYear() + Math.floor(instMonth / 12);
        const month = instMonth % 12;
        const schRow = schedule[i] ?? { principal: emiAmount, interest: 0 };

        let status: string;
        if (i < eventIdx) {
            status = "PAID";
        } else if (i === eventIdx) {
            if (paymentType === "MISSED_EMI_SOLICITED") status = "DELAYED";
            else if (paymentType === "MISSED_EMI_UNSOLICITED") status = "DEFERRED";
            else if (paymentType === "FORECLOSURE_SOLICITED") status = "NOT-PAID";
            else if (paymentType === "FORECLOSURE_UNSOLICITED") status = "DEFERRED";
            else if (paymentType === "PRE_PART_SOLICITED") status = "NOT-PAID";
            else if (paymentType === "PRE_PART_UNSOLICITED") status = "DEFERRED";
            else status = "NOT-PAID";
        } else {
            // Future instalments
            if (paymentType === "FORECLOSURE_SOLICITED") status = "NOT-PAID";
            else if (paymentType === "FORECLOSURE_UNSOLICITED") status = "DEFERRED";
            else if (paymentType === "PRE_PART_UNSOLICITED") status = "DEFERRED";
            else status = "NOT-PAID";
        }
        const inst: any = {
            type: "POST_FULFILLMENT",
            id: `PID-${5000 + i + 1}`,
            params: { amount: String(emiAmount), currency: "INR" },
            status,
            time: {
                label: "INSTALLMENT",
                range: { start: monthStart(year, month), end: monthEnd(year, month) },
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${schRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${schRow.interest} INR` },
                ],
            }],
        };

        // Add transaction_id for past PAID instalments
        if (status === "PAID") {
            inst.params.transaction_id = `txn-auto-${i + 1}-${Date.now()}`;
        }

        instalments.push(inst);
    }

    // ── Special payment entry (first — the actual update event) ──────────────
    const refId = sessionData.message_id ?? order.id ?? "auto-ref";
    const eventRow = schedule[eventIdx] ?? { principal: outstandingPrincipal, interest: outstandingInterest };

    // ── Build specialEntry differently per payment type ───────────────────────
    let specialEntry: any;

    if (paymentType === "MISSED_EMI_SOLICITED") {
        // Borrower missed an EMI: NOT-PAID, with a 15-day payment window (range + duration)
        specialEntry = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(Math.round(specialPaymentAmount)), currency: "INR" },
            status: "NOT-PAID",
            url: `https://pg.icici.com/?amount=${Math.round(specialPaymentAmount)}&ref_id=${encodeURIComponent(refId)}`,
            time: {
                duration: "P15D",
                label: "MISSED_EMI_PAYMENT",
                range: { start: monthStart(eventYear, eventMonth), end: monthEnd(eventYear, eventMonth) },
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
                ],
            }],
        };

    } else if (paymentType === "MISSED_EMI_UNSOLICITED") {
        // Lender pushes missed EMI notice: PAID, timestamp, range, no url, no duration
        specialEntry = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(Math.round(specialPaymentAmount)), currency: "INR" },
            status: "PAID",
            time: {
                timestamp: monthStart(eventYear, eventMonth),
                label: "MISSED_EMI_PAYMENT",
                range: { start: monthStart(eventYear, eventMonth), end: monthEnd(eventYear, eventMonth) },
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
                ],
            }],
        };

    } else if (paymentType === "FORECLOSURE_SOLICITED") {
        // Borrower requests foreclosure: NOT-PAID (payment is pending), 90-min payment window
        specialEntry = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(Math.round(specialPaymentAmount)), currency: "INR" },
            status: "NOT-PAID",
            url: `https://pg.icici.com/?amount=${Math.round(specialPaymentAmount)}&ref_id=${encodeURIComponent(refId)}`,
            time: {
                duration: "PT90M",
                label: "FORECLOSURE",
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
                ],
            }],
        };

    } else if (paymentType === "FORECLOSURE_UNSOLICITED") {
        // Lender pushes foreclosure notification: PAID, timestamp only, no url
        specialEntry = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(Math.round(specialPaymentAmount)), currency: "INR" },
            status: "PAID",
            time: {
                timestamp: monthStart(eventYear, eventMonth),
                label: "FORECLOSURE",
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
                ],
            }],
        };

    } else if (paymentType === "PRE_PART_SOLICITED") {
        // PRE_PART_PAYMENT solicited: NOT-PAID, duration 15 days, with url
        specialEntry = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(Math.round(specialPaymentAmount)), currency: "INR" },
            status: "NOT-PAID",
            url: `https://pg.icici.com/?amount=${Math.round(specialPaymentAmount)}&ref_id=${encodeURIComponent(refId)}`,
            time: {
                duration: "P15D",
                label: specialPaymentLabel,
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
                ],
            }],
        };

    } else if (paymentType === "PRE_PART_UNSOLICITED") {
        // PRE_PART_PAYMENT unsolicited: PAID, timestamp only, no url
        specialEntry = {
            id: "PID-9000",
            type: "POST_FULFILLMENT",
            params: { amount: String(Math.round(specialPaymentAmount)), currency: "INR" },
            status: "PAID",
            time: {
                timestamp: monthStart(eventYear, eventMonth),
                label: specialPaymentLabel,
            },
            tags: [{
                descriptor: { code: "BREAKUP", name: "Emi Breakup" },
                list: [
                    { descriptor: { code: "PRINCIPAL_AMOUNT", name: "Principal", short_desc: "Loan Principal" }, value: `${eventRow.principal} INR` },
                    { descriptor: { code: "INTEREST_AMOUNT", name: "Interest", short_desc: "Loan Interest" }, value: `${eventRow.interest} INR` },
                ],
            }],
        };
    }

    // Order: special event first, then non-POST_FULFILLMENT (ON_ORDER, PRE_ORDER), then all instalment history
    order.payments = [specialEntry, ...nonPostPayments, ...instalments];
    console.log(
        `[settlement-utils] generateUpdatePayments type=${paymentType}: ` +
        `eventIdx=${eventIdx}, outstandingPrincipal=${outstandingPrincipal}, ` +
        `outstandingInterest=${outstandingInterest}, specialCharge=${specialCharge}, ` +
        `specialPaymentAmount=${specialPaymentAmount}`
    );
}
