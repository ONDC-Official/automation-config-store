/**
 * On_Confirm Generator for TRV14
 * 
 * Logic:
 * 1. Load most fields from session (items, fulfillments, provider, billing, payments, tags, etc.)
 * 2. Add order ID (UUID)
 * 3. Add hardcoded order status and fulfillment state
 * 4. Add authorization with QR token (UUID) and +5 days validity
 * 5. Add created_at and updated_at from session
 */



export async function onConfirmGenerator(
  existingPayload: any,
  sessionData: any
) {
  return existingPayload;
}