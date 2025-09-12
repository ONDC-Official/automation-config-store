/**
 * Init Generator for TRV14
 * 
 * Logic:
 * 1. Use same structure as select generator
 * 2. Pull data from session stored by select: selected_items, selected_fulfillments, selected_provider
 * 3. Update fulfillment timestamps to match context timestamp
 * 4. Add tags from session data
 */

export async function initGenerator(existingPayload: any, sessionData: any) {
  // Use selected items from session (stored by select)
  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  
  // Use selected fulfillments from session (stored by select)
  if (sessionData.selected_fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
  }
  
  // Use selected provider from session (stored by select)
  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
  
  return existingPayload;
} 





