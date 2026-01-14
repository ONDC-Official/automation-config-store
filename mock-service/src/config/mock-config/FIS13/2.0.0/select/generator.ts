
export async function selectDefaultGenerator(existingPayload: any, sessionData: any) {
  let selectedItem: any;
  existingPayload.context.location.city.code = sessionData?.city_code



  existingPayload.message.order.items = sessionData.user_inputs;
  existingPayload.message.order.provider.id = sessionData.provider_id;



  return existingPayload;
}

