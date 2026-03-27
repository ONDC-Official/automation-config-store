import { randomUUID } from 'crypto';
import { SessionData } from "../../../session-types";

export async function on_selectDefaultGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("=== on_select Generator Start ===");

    // Update timestamp
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
    }

    // Update transaction_id and message_id from session
    if (sessionData.transaction_id && existingPayload.context) {
        existingPayload.context.transaction_id = sessionData.transaction_id;
    }
    if (sessionData.message_id && existingPayload.context) {
        existingPayload.context.message_id = sessionData.message_id;
    }

    // Update provider.id and item.id from session
    const selectedProvider = sessionData.selected_provider || sessionData.provider_id;
    if (selectedProvider && existingPayload.message?.order?.provider) {
        if (typeof selectedProvider === 'string') {
            existingPayload.message.order.provider.id = selectedProvider;
        } else if (selectedProvider.id) {
            existingPayload.message.order.provider.id = selectedProvider.id;
        }
    }

    const selectedItem = sessionData.selected_item_id || sessionData.item;
    if (selectedItem && existingPayload.message?.order?.items?.[0]) {
        if (typeof selectedItem === 'string') {
            existingPayload.message.order.items[0].id = selectedItem;
        } else if (selectedItem.id) {
            existingPayload.message.order.items[0].id = selectedItem.id;
        }
    }


    // Handle xinput forms - support both multi-stage KYC and regular forms
    const xinput = existingPayload.message?.order?.xinput;

    if (xinput?.form) {
        const flowId = sessionData.flow_id || '';
        const isKYCFlow = flowId.includes('KYC');
        const submissionId = sessionData?.form_data?.investor_details_form?.form_submission_id;
        const kycStage = sessionData.kyc_stage || 0;

        // Multi-stage KYC flow (New Folio w/ KYC)
        if (isKYCFlow && xinput.head) {
            // If we have a submission for the current stage, move to next stage
            // If it's the first call (no submission), start at 0
            const nextStage = submissionId ? kycStage + 1 : kycStage;

            // Check if we exhausted stages (assuming 3 stages: 0, 1, 2)
            if (nextStage > 2) {
                xinput.required = false;
                console.log("KYC Flow completed, xinput.required = false");
            } else {
                // Update index based on next stage
                xinput.head.index.cur = nextStage;

                // Update form based on current stage
                const formId = `investor_details_form`;
                xinput.form.id = formId;

                // Map stage to form URL
                const formUrlMap: Record<number, string> = {
                    0: 'account_opening_kyc_form',
                    1: 'kyc_verification_form',
                    2: 'esign_form'
                };

                const baseUrl = process.env.FORM_SERVICE || 'http://localhost:3001';
                const formUrlKey = formUrlMap[nextStage] || 'investor_details_form';
                xinput.form.url = `${baseUrl}/forms/${sessionData.domain}/investor_details_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

                console.log(`KYC Stage ${nextStage}: ${xinput.head.headings?.[nextStage] || 'Stage ' + nextStage} - Form URL generated`);
            }
        }
        // Regular single-form flow (New Folio but no KYC tag)
        else {
            // If form is already submitted, we are done
            if (submissionId) {
                xinput.required = false;
                console.log("Single Form submitted, xinput.required = false");
            } else {
                const formId = sessionData.form_id || `form_${randomUUID()}`;
                xinput.form.id = "investor_details_form";

                const baseUrl = process.env.FORM_SERVICE || 'http://localhost:3001';
                xinput.form.url = `${baseUrl}/forms/${sessionData.domain}/investor_details_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;

                console.log("Generated form URL:", xinput.form.url);
                console.log("Using form ID:", formId);
            }
        }
    }


    // Update fulfillment type based on flow_id
    if (sessionData.flow_id && existingPayload.message?.order?.fulfillments?.[0]) {
        if (sessionData.flow_id.toLowerCase().includes('lumpsum')) {
            existingPayload.message.order.fulfillments[0].type = 'LUMPSUM';
            console.log("Updated fulfillment type to LUMPSUM based on flow_id");
        }
    }

    console.log("=== on_select Generator End ===");
    return existingPayload;
}
