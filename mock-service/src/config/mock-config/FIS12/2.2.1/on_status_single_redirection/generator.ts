export async function onStatusGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  console.log("sessionData for on_status", sessionData);

  const submission_id = sessionData?.form_data?.E_sign_verification_status?.form_submission_id || sessionData.E_sign_verification_status;
  
  const form_status = sessionData?.form_data?.E_sign_verification_status?.idType || sessionData.E_sign_verification_status;
  
  // Update transaction_id and message_id from session data (carry-forward mapping)
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  
  // Update provider information from session data (carry-forward from previous flows)
  if (sessionData.provider_id) {
    existingPayload.message = existingPayload.message || {};
    existingPayload.message.order = existingPayload.message.order || {};
    existingPayload.message.order.provider = existingPayload.message.order.provider || {};
    existingPayload.message.order.provider.id = sessionData.provider_id;
  }

  // Fix items: ensure ID consistency and form status
  if (existingPayload.message?.order?.items?.[0]) {
    const item = existingPayload.message.order.items[0];
    
    // Ensure item ID matches previous calls (carry-forward from previous flows)
    if (sessionData.item_id) {
      item.id = sessionData.item_id;
    } else {
      item.id = "ITEM_ID_GOLD_LOAN_2"; // Consistent ID
    }
    
    // Update location_ids from session data (carry-forward from previous flows)
    const selectedLocationId = sessionData.selected_location_id;
    if (selectedLocationId) {
      item.location_ids = [selectedLocationId];
      console.log("Updated location_ids:", selectedLocationId);
    }
    
    // Update form ID from session data (carry-forward from previous flows)
    if (item.xinput?.form) {
      console.log("sessionDatasaaaaaaaaaaaa",sessionData,sessionData.form_data,sessionData.form_id)
      // Use form ID from session data or default to FO3 (from on_select_2/on_status_unsolicited)
      const formId = sessionData.form_id || "E_sign_verification_status";
      item.xinput.form.id = formId;
      console.log("Updated form ID:", formId);
    }
    
    // Set form status to OFFLINE_PENDING
    if (item.xinput?.form_response) {
      item.xinput.form_response.status = form_status;
      if (submission_id) {
        item.xinput.form_response.submission_id = submission_id;
      }
    }
  }

  // Fix fulfillments: remove customer details and state
  if (existingPayload.message?.order?.fulfillments) {
    existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
      // Remove customer details
      delete fulfillment.customer;
      // Remove state
      delete fulfillment.state;
    });
  }

  // Remove documents section completely
  if (existingPayload.message?.order?.documents) {
    delete existingPayload.message.order.documents;
  }

  // Update quote information if provided
  if (sessionData.quote_amount && existingPayload.message?.order?.quote) {
    existingPayload.message.order.quote.price.value = sessionData.quote_amount;
  }

  // Update loan amount in items if provided
  if (sessionData.loan_amount && existingPayload.message?.order?.items?.[0]) {
    existingPayload.message.order.items[0].price.value = sessionData.loan_amount;
  }

  return existingPayload;
}
