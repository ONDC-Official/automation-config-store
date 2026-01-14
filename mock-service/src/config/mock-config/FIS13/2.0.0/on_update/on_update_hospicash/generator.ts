


export async function selectDefaultGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.location.city.code = sessionData?.city_code

  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.status = sessionData.order_status;
  existingPayload.message.order.items = sessionData.items
  existingPayload.message.order.provider = sessionData.provider
  existingPayload.message.order.quote = sessionData.quote
  existingPayload.message.order.fulfillments = sessionData.fulfillments.map((item: {
    [x: string]: any; type: any
  }) => {
    item.state.descriptor.code = "GRANTED"
    return item;
  })

  existingPayload.message.order.cancellation_terms = [sessionData.cancellation_terms]
  existingPayload.message.order.payments = sessionData.payments

  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
}

