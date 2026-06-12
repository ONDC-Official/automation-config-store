import { randomUUID } from 'crypto';
import { injectSettlementAmount } from '../settlement-utils';
import logger from "@ondc/automation-logger";

export async function onInitDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("sessionData for on_init", sessionData);

  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  // Update transaction_id from session data (carry-forward mapping)
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }

  // // Use the same message_id as init (matching pair)
  // if (sessionData.message_id && existingPayload.context) {
  //   existingPayload.context.message_id = sessionData.message_id;
  //   console.log("Using matching message_id from init:", sessionData.message_id);
  // }

  logger.info("init_message_id: ", sessionData.message_id);

  // Generate or update provider.id with gold_loan_ prefix
  if (existingPayload.message?.order?.provider) {
    if (sessionData.selected_provider?.id) {
      existingPayload.message.order.provider.id = sessionData.selected_provider.id;
      console.log("Updated provider.id from session:", sessionData.selected_provider.id);
    } else if (!existingPayload.message.order.provider.id ||
      existingPayload.message.order.provider.id === "PROVIDER_ID" ||
      existingPayload.message.order.provider.id.startsWith("PROVIDER_ID")) {
      existingPayload.message.order.provider.id = `gold_loan_${randomUUID()}`;
      console.log("Generated provider.id:", existingPayload.message.order.provider.id);
    }
  }

  // Generate or update item.id with gold_loan_ prefix
  const selectedItem = sessionData.item || (Array.isArray(sessionData.items) ? sessionData.items[0] : undefined);
  if (existingPayload.message?.order?.items?.[0]) {
    if (selectedItem?.id) {
      existingPayload.message.order.items[0].id = selectedItem.id;
      console.log("Updated item.id from session:", selectedItem.id);
    } else if (!existingPayload.message.order.items[0].id ||
      existingPayload.message.order.items[0].id === "ITEM_ID_GOLD_LOAN_1" ||
      existingPayload.message.order.items[0].id === "ITEM_ID_GOLD_LOAN_2" ||
      existingPayload.message.order.items[0].id.startsWith("ITEM_ID_GOLD_LOAN")) {
      existingPayload.message.order.items[0].id = `gold_loan_${randomUUID()}`;
      console.log("Generated item.id:", existingPayload.message.order.items[0].id);
    }
  }
  console.log("Updated quote.id from session:", sessionData.quote_id);
  // Generate or update quote.id with gold_loan_ prefix
  if (existingPayload.message?.order?.quote) {
    // Prefer quote_id if present, but also support quote.id being stored as an object in session.
    const sessionQuoteId =
      sessionData?.quote_id ||
      sessionData?.quote?.id ||
      sessionData?.order?.quote?.id;

    if (sessionQuoteId) {
      existingPayload.message.order.quote.id = sessionQuoteId;
      console.log("Updated quote.id from session:", sessionQuoteId);
    } else if (
      !existingPayload.message.order.quote.id ||
      existingPayload.message.order.quote.id === "LOAN_LEAD_ID_OR_SIMILAR" ||
      existingPayload.message.order.quote.id.startsWith("LOAN_LEAD_ID")
    ) {
      existingPayload.message.order.quote.id = `gold_loan_${randomUUID()}`;
      console.log("Generated quote.id:", existingPayload.message.order.quote.id);
    }
  }

  // Update location_ids from session data (carry-forward from previous flows)
  const selectedLocationId = sessionData.selected_location_id;
  if (selectedLocationId && existingPayload.message?.order?.items?.[0]) {
    existingPayload.message.order.items[0].location_ids = [selectedLocationId];
    console.log("Updated location_ids:", selectedLocationId);
  }

  // Update customer name in fulfillments if available from session data
  if (sessionData.customer_name && existingPayload.message?.order?.fulfillments?.[0]?.customer?.person) {
    existingPayload.message.order.fulfillments[0].customer.person.name = sessionData.customer_name;
    console.log("Updated customer name:", sessionData.customer_name);
  }

  // Update customer contact information if available from session data
  if (sessionData.customer_phone && existingPayload.message?.order?.fulfillments?.[0]?.customer?.contact) {
    existingPayload.message.order.fulfillments[0].customer.contact.phone = sessionData.customer_phone;
    console.log("Updated customer phone:", sessionData.customer_phone);
  }

  if (sessionData.customer_email && existingPayload.message?.order?.fulfillments?.[0]?.customer?.contact) {
    existingPayload.message.order.fulfillments[0].customer.contact.email = sessionData.customer_email;
    console.log("Updated customer email:", sessionData.customer_email);
  }


  if (existingPayload.message?.order?.payments?.length) {
    const contextDate = existingPayload.context?.timestamp
      ? new Date(existingPayload.context.timestamp)
      : new Date();

    // First installment starts next month to ensure it's after context timestamp
    const base = new Date(Date.UTC(contextDate.getUTCFullYear(), contextDate.getUTCMonth() + 1, 1));

    const setMonthRange = (baseDate: Date, monthOffset: number) => {
      const start = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + monthOffset, 1));
      // Day 0 of next month gives last day of target month
      const end = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + monthOffset + 1, 0, 23, 59, 59, 999));
      return { start: start.toISOString(), end: end.toISOString() };
    };

    let installmentIndex = 0;
    existingPayload.message.order.payments.forEach((payment: any) => {
      if (payment?.type === "POST_FULFILLMENT" && payment?.time?.range) {
        const range = setMonthRange(base, installmentIndex);
        payment.time.range.start = range.start;
        payment.time.range.end = range.end;
        installmentIndex += 1;
        console.log(`Updated installment #${installmentIndex} range:`, range);
      }
    });

    // Generate unique IDs for all payments (matching on_confirm pattern)
    let installmentCounter = 1;
    existingPayload.message.order.payments.forEach((payment: any) => {
      if (payment.type === 'POST_FULFILLMENT' && payment.time?.label === 'INSTALLMENT') {
        payment.id = `installment_${installmentCounter}_${randomUUID()}`;
        console.log(`Generated unique installment ID: ${payment.id}`);
        installmentCounter++;
      } else if (payment.type === 'ON_ORDER') {
        payment.id = `on_order_${randomUUID()}`;
        console.log(`Generated unique on-order payment ID: ${payment.id}`);
      }
    });
  }

  console.log("payments in on_init near return", JSON.stringify(existingPayload.message?.order?.payments));
  console.log("payments in session data near return", JSON.stringify(sessionData.payments));
    logger.info("init_message_id after: ", existingPayload.context?.message_id);
  // Dynamically inject SETTLEMENT_AMOUNT derived from BAP_TERMS fee data
  injectSettlementAmount(existingPayload, sessionData);

  return existingPayload;
}
