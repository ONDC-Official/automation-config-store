/**
 * On_Select_2 Generator for TRV14
 * 
 * Logic:
 * 1. Reuse data from session (stored from on_select_1): items, fulfillments, provider, quote, cancellation_terms, replacement_terms
 * 2. Only modify xinput in items to show form response status
 */

export async function onSelect2Generator(existingPayload: any, sessionData: any) {
  // Reuse data from session (stored from on_select_1)
  const submission_id = sessionData.submission_id || "F01_SUBMISSION_ID"
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms?.flat();
  }

  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms?.flat();
  }

  // Modify xinput in items to show form response status
  if (existingPayload.message.order.items && Array.isArray(existingPayload.message.order.items)) {
    existingPayload.message.order.items.forEach((item: any) => {
      // Only add xinput to child items (items with parent_item_id)
      if (item.parent_item_id) {
        item.xinput = {
          form: {
            id: "F01"
          },
          form_response: {
            status: "SUCCESS",
            submission_id: submission_id
          }
        };
      }
    });
  }

  return existingPayload;
} 
