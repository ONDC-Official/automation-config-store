
export async function initGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.location.city.code = sessionData?.city_code

  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items.flat();
  }


  if (sessionData.selected_fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }


  return existingPayload;
}

