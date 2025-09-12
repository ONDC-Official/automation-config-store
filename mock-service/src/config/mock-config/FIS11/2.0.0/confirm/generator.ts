/**
 * Confirm Generator for TRV14
 * 
 * Logic:
 * 1. Load fields from session: items, fulfillments, provider, billing, tags
 * 2. Update payments with transaction_id and amount from session
 * 3. Payments structure comes pre-injected from default.yaml
 */

export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {
  // Load items from session
  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  
  // Load fulfillments from session
  if (sessionData.selected_fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
  }
  
  // Load provider from session
  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
  // Load billing from session
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  
  // Load tags from session (BAP_TERMS and BPP_TERMS)
  if (sessionData.tags) {
    existingPayload.message.order.tags = sessionData.tags;
  }
  
  // Update payments with transaction_id and amount from session
  if (existingPayload.message.order.payments && Array.isArray(existingPayload.message.order.payments)) {
    existingPayload.message.order.payments.forEach((payment: any) => {
      if (payment.params) {
        // Update transaction_id from session
        if (sessionData.transaction_id) {
          payment.params.transaction_id = sessionData.transaction_id;
        }
        
        // Update amount from session quote
        if (sessionData.quote && sessionData.quote.price && sessionData.quote.price.value) {
          payment.params.amount = sessionData.quote.price.value;
          payment.params.currency = sessionData.quote.price.currency || "INR";
        }
      }
    });
  }
  
  return existingPayload;
} 