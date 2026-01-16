export async function onStatusTechnicalCancellationGenerator(existingPayload: any, sessionData: any) {
  // Load order details from session
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  // Update order status to COMPLETED
  existingPayload.message.order.status = "COMPLETED";
  if (sessionData.flow_id === "technical_cancellation" || sessionData.flow_id === "technical_cancellation_with_form") {
    existingPayload.message.order.status = "ACTIVE";
  }

  if (sessionData.flow_id === "technical_cancellation") {
    existingPayload.message.order.status = "ACTIVE";
  }

  // Load items from session
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Load fulfillments from session and update state + authorization status
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

  // Load quote from session
  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  // Load cancellation_terms from session
  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms?.flat();
  }

  // Load replacement_terms from session
  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms?.flat();
  }

  // Load tags from session
  if (sessionData.tags) {
    existingPayload.message.order.tags = sessionData.tags;
  }

  // Load timestamps from session
  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }

  if (sessionData.updated_at) {
    existingPayload.message.order.updated_at = sessionData.updated_at;
  }

  return existingPayload;
} 