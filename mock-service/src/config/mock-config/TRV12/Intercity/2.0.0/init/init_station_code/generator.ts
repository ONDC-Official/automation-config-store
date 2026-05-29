import { SessionData } from "../../../../session-types";

function parseISODuration(durationStr: string) {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(`Invalid ISO duration format: ${durationStr}`);
  }

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export async function initGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const quoteTTL = sessionData?.quote?.ttl;

  if (quoteTTL) {
    const delay = parseISODuration(quoteTTL);

    console.log(`Waiting for quote TTL expiry: ${quoteTTL}`);

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  existingPayload.context.location.city.code = sessionData.city_code;

  existingPayload.message.order.items = [sessionData.select_items];
  const fulfillments = Array.isArray(sessionData.select_2_fulfillments)
    ? sessionData.select_2_fulfillments.flat()
    : [sessionData.select_2_fulfillments];
  existingPayload.message.order.fulfillments = transformFulfillments(
    fulfillments
  );
  console.log(" existingPayload.message.order.fulfillments in init_station_code", JSON.stringify(existingPayload.message.order.fulfillments));

  existingPayload.message.order.provider = { id: sessionData.provider_id };

  existingPayload.message.order.billing = {
    name: "Joe Adams",
    phone: "+91-9988776655",
    tax_id: "GSTIN:22AAAAA0000A1Z5",
  };

  const price: any = sessionData.quote.price.value;
  const feePercentage: any = "1";
  const feeAmount = (price * feePercentage) / 100;
  const collectedBy: any = "BAP";
  const finalAmount = collectedBy === "BAP" ? price - feeAmount : feeAmount;

  existingPayload.message.order.payments = [
    {
      id: "PA1",
      collected_by: "BAP",
      status: "NOT-PAID",
      type: "PRE-ORDER",
      tags: [
        {
          descriptor: { code: "BUYER_FINDER_FEES" },
          display: false,
          list: [
            {
              descriptor: { code: "BUYER_FINDER_FEES_PERCENTAGE" },
              value: "1",
            },
          ],
        },
        {
          descriptor: { code: "SETTLEMENT_TERMS" },
          display: false,
          list: [
            { descriptor: { code: "SETTLEMENT_WINDOW" }, value: "PT60M" },
            { descriptor: { code: "SETTLEMENT_BASIS" }, value: "Delivery" },
            { descriptor: { code: "SETTLEMENT_TYPE" }, value: "upi" },
            { descriptor: { code: "MANDATORY_ARBITRATION" }, value: "true" },
            { descriptor: { code: "COURT_JURISDICTION" }, value: "New Delhi" },
            { descriptor: { code: "DELAY_INTEREST" }, value: "2.5" },
            {
              descriptor: { code: "STATIC_TERMS" },
              value: "https://www.abc.com/settlement-terms/",
            },
            { descriptor: { code: "SETTLEMENT_AMOUNT" }, value: finalAmount.toString() },
          ],
        },
      ],
    },
  ];

  return existingPayload;
}

function transformFulfillments(fulfillments: any) {
  console.log("TRV12/Intercity/2.0.0/init/init_station_code/generator fulfillments", JSON.stringify(fulfillments));

  const customers = [
    {
      person: { name: "Joe Adams", age: "30", gender: "MALE" },
      contact: { phone: "+91-9988776655" },
    },
    {
      person: { name: "RACHEL ADAMS", age: "27", gender: "FEMALE" },
      contact: { phone: "+91-9723797890" },
    },
    {
      person: { name: "John Doe", age: "35", gender: "MALE" },
      contact: { phone: "+91-9876543210" },
    },
    {
      person: { name: "Jane Smith", age: "29", gender: "FEMALE" },
      contact: { phone: "+91-9123456789" },
    },
  ];

  const stopsFulfillment = fulfillments.find((f: any) => f.stops);
  const tagFulfillments = fulfillments.filter((f: any) => f.tags);

  const result: any[] = [];

  if (stopsFulfillment) {
    result.push({
      id: stopsFulfillment.id,
      stops: stopsFulfillment.stops,
    });
  }

  tagFulfillments.forEach((f: any, index: number) => {
    const customer = customers[index % customers.length];
    result.push({
      id: f.id,
      customer,
      tags: (f.tags || []).map((tag: any) => ({
        descriptor: tag.descriptor,
        list: (tag.list || []).filter(
          (item: any) => item.descriptor?.code === "NUMBER"
        ),
      })),
    });
  });

  return result;
}