/**
 * On_Update Confirm Partial Cancellation Generator for TRV14
 * 
 * Logic:
 * 1. Returns order with ACTIVE status (cancellation confirmed)
 * 2. Updates item quantity from 2 to 1
 * 3. Adds REFUND entry in quote breakup for cancelled quantity
 * 4. Recalculates total price
 */

export async function onUpdateConfirmPartialCancellationGenerator(existingPayload: any, sessionData: any) {
  // Load order details from session
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  // Set order status to ACTIVE (confirmed partial cancellation)
  existingPayload.message.order.status = "ACTIVE";

  // Load items from session with updated quantities
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items_partial_cancel?.flat();
  }

  // Load fulfillments from session
  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }
  // Load provider from session
  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }
  // Load billing from session
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  // Load payments from session
  if (sessionData.payments) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  // Load tags from session
  if (sessionData.tags) {
    existingPayload.message.order.tags = sessionData.tags;
  }

  // Load cancellation_terms from session
  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms?.flat();
  }
  // Load replacement_terms from session
  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms?.flat();
  }

  // Calculate updated quote with refund
  if (sessionData.quote) {

    existingPayload.message.order.quote = sessionData.quote_partial_cancel
  }

  // Add timestamps
  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  return existingPayload;
}