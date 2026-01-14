export async function onInitGenerator(existingPayload: any, sessionData: any) {
  let fulfillmentIds: string[] = [];
  let paymentIds: string[] = [];
  existingPayload.context.location.city.code = sessionData?.city_code

  const buyerName = sessionData?.user_tags?.list?.find(
    (t: any) => t.descriptor?.code === "BUYER_NAME"
  );

  const buyerPhone = sessionData?.user_tags?.list?.find(
    (t: any) => t.descriptor?.code === "BUYER_PHONE_NUMBER"
  );


  if (sessionData.fulfillments) {
    sessionData.fulfillments.map((fulfillment: any) => {
      fulfillmentIds.push(fulfillment.id);
      fulfillment.customer = {
        "person": {
          "name": buyerName.value,
        },
        "contact": {
          "phone": buyerPhone.value,
        }
      };
    });
    existingPayload.message.order.fulfillments = sessionData.fulfillments.map((fulfillment: { tags: any; }) => {
      delete fulfillment.tags;
      return {
        ...fulfillment
      }
    });
  }

  if (sessionData.payments) {
    existingPayload.message.order.payments = sessionData.payments;
    existingPayload.message.order.payments.forEach((payment: any, index: number) => {
      payment.id = `P${index}`
      // payment.url = `https://fis.test.bpp.io/pg-gateway/payment?amount=1000&txn_id=${payment.id}`;
      paymentIds.push(payment.id);
    });
  }

  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
    existingPayload.message.order.items.map((item: any) => {
      item.fulfillment_ids = fulfillmentIds;
      item.payment_ids = paymentIds;
      return item;
    });
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }



  return existingPayload;
} 