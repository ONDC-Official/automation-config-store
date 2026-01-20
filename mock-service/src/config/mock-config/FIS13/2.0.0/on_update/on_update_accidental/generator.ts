


export async function selectDefaultGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.location.city.code = sessionData?.city_code
  const currentTime = new Date(new Date());

  const policy_tags = {
    descriptor: {
      code: "POLICY_INFO",
      name: "Policy Info",
    },
    list: [
      {
        descriptor: {
          code: "POLICY_START_DATE",
          name: "Policy Start Date",
        },
        value: new Date().toISOString().split('T')[0],
      },
      {
        descriptor: {
          code: "POLICY_END_DATE",
          name: "Policy End Date",
        },
        value: new Date(currentTime.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        descriptor: {
          code: "POLICY_RENEWAL_DATE",
          name: "Policy Renewal Date",
        },
        value: new Date(currentTime.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        descriptor: {
          code: "CLAIMS_HELPDESK_CONTACT_NUMBER",
          name: "Claims Helpdesk - Contact Number",
        },
        value: "1860 266 7766",
      },
      {
        descriptor: {
          code: "CLAIMS_HELPDESK_EMAIL_ID",
          name: "Claims Helpdesk - Email ID",
        },
        value: "helpdesk@fistestbpp.com",
      },
    ],
  };
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.status = sessionData.order_status;
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
    existingPayload.message.order.items.forEach((item: any) => {
      item.tags.push(policy_tags)
    });
  } existingPayload.message.order.provider = sessionData.provider
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
  const newData = new Date().toISOString()
  existingPayload.context.timestamp = newData;
  existingPayload.message.order.updated_at = newData

  return existingPayload;
}

