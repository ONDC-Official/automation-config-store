export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.location.city.code = sessionData?.city_code

  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items.flat();
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments.map((fulfillment: any) => {
      const { tags, ...rest } = fulfillment;
      return rest;
    });
  }
  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  if (sessionData.payments) {
    existingPayload.message.order.payments = sessionData.payments.map((payment: any) => {
      const { url, ...rest } = payment;
      return rest;
    });
  }
  return existingPayload;
}   
