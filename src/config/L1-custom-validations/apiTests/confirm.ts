import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export function confirm(payload: any): validationOutput {
  // Extract payload, context, domain and action
  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  console.log(`Running validations for ${domain}/${action}`);

  // Initialize results array
  const results: validationOutput = [];

  const validQuote = validateQuote(payload);
  const validItems = validateItems(payload);
  const validFulfillments = validateFulfillments(payload);
  const validOrderDimensions = validateOrderDimensions(payload);
  const acceptLSPterms = validateLSPterms(payload);
  const validTAT = validateTAT(payload);
  //validate quote
  if (!validQuote) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Quote price does not match with /on_init`,
    });
  }

  //validate items
  if (!validItems) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Items array does not match with /on_init`,
    });
  }

  //validate fulfillments
  if (!validFulfillments) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Fulfillments array does not match with /on_init`,
    });
  }

  //validate order dimensions
  if (!validOrderDimensions) {
    results.push({
      valid: false,
      code: 60011,
      description: `LSP is unable to validate the order request : Order dimensions/weight does not match with /search`,
    });
  }

  //validate LSP terms
  if (!acceptLSPterms) {
    results.push({
      valid: false,
      code: 62501,
      description: `LSP is unable to validate the order request : LSP terms are not accepted by LBNP`,
    });
  }

  //validate S2D TAT and avg pickup time
  if (!validTAT) {
    results.push({
      valid: false,
      code: 60008,
      description: `LSP is unable to validate the order request : S2D TAT or avg pickup time are different from what was quoted earlier in /on_search`,
    });
  }

  // If no issues found, return a success result
  if (results.length === 0) {
    results.push({ valid: true, code: 200 });
  }

  return results;
}

/**
 * Validates that the quote object is valid
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateQuote(payload: Record<string, any>): Promise<boolean> {
  const transaction_id = payload?.context?.transaction_id;
  if (!transaction_id) return false; // Ensure transaction_id is valid

  const quotePrice = payload?.message?.order?.quote?.price;
  if (!quotePrice) return false; // Ensure quotePrice is present

  RedisService.setKey(
    `${transaction_id}:confirmQuote`,
    JSON.stringify({ quotePrice })
  );
  const onInitQuoteRaw = await RedisService.getKey(
    `${transaction_id}:onInitQuote`
  );
  if (!onInitQuoteRaw) return true; // If no initial quote, assume validation passes

  const onInitQuote = JSON.parse(onInitQuoteRaw);
  return quotePrice !== onInitQuote?.price;
}

/**
 * Validates that the items object is valid
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateItems(payload: Record<string, any>): Promise<boolean> {
  const items = payload?.message?.order?.items;
  const transaction_id = payload?.context?.transaction_id;
  RedisService.setKey(
    `${transaction_id}:confirmItems`,
    JSON.stringify({ items })
  );
  if (!Array.isArray(items) || !transaction_id) return false;

  let onInitItems: any = await RedisService.getKey(
    `${transaction_id}:onInitItems`
  );

  if (!onInitItems) return false;

  try {
    onInitItems = JSON.parse(onInitItems);
    if (!Array.isArray(onInitItems)) return false;
  } catch (error) {
    console.error("Error parsing onInitItems from Redis:", error);
    return false;
  }

  return items.every((item) =>
    onInitItems.some(
      (onInitItem) =>
        item.id === onInitItem.id &&
        JSON.stringify(item.fulfillment_id || []) ===
          JSON.stringify(onInitItem.fulfillment_id || []) &&
        JSON.stringify(item.fulfillment_ids || []) ===
          JSON.stringify(onInitItem.fulfillment_ids || []) &&
        item.category_id === onInitItem.category_id
    )
  );
}

/**
 * Validates that the fulfillments object is valid
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateFulfillments(
  payload: Record<string, any>
): Promise<boolean> {
  const fulfillments = payload?.message?.order?.fulfillments;
  const transaction_id = payload?.context?.transaction_id;
  RedisService.setKey(
    `${transaction_id}:confirmFulfillments`,
    JSON.stringify({ fulfillments })
  );
  if (!Array.isArray(fulfillments) || !transaction_id) return false;

  let onInitFulfillments: any = await RedisService.getKey(
    `${transaction_id}:onInitFulfillments`
  );

  if (!onInitFulfillments) return false;

  try {
    onInitFulfillments = JSON.parse(onInitFulfillments);
    if (!Array.isArray(onInitFulfillments)) return false;
  } catch (error) {
    console.error("Error parsing onInitFulfillments from Redis:", error);
    return false;
  }

  return fulfillments.every((fulfillment) =>
    onInitFulfillments.some(
      (onInitFulfillment) =>
        fulfillment.id === onInitFulfillment.id &&
        fulfillment.type === onInitFulfillment.type
    )
  );
}

/**
 * Validates that the order dimensions and weight are valid
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateOrderDimensions(
  payload: Record<string, any>
): Promise<boolean> {
  const payloadDetails = payload.message.order["@ondc/org/payload_details"];
  const dimensions = payloadDetails?.dimensions;
  const weight = payloadDetails?.weight;

  if (!dimensions || !weight) return false;

  const transaction_id = payload?.context?.transaction_id;
  let searchDetails: any = await RedisService.getKey(
    `${transaction_id}:orderDetails`
  );

  if (!searchDetails) return false;

  try {
    searchDetails = JSON.parse(searchDetails);
  } catch (error) {
    console.error("Error parsing order details from Redis:", error);
    return false;
  }

  // Function to compare dimensions object
  function compareDimensions(obj1: any, obj2: any): boolean {
    return (
      obj1?.length?.unit === obj2?.length?.unit &&
      obj1?.length?.value === obj2?.length?.value &&
      obj1?.breadth?.unit === obj2?.breadth?.unit &&
      obj1?.breadth?.value === obj2?.breadth?.value &&
      obj1?.height?.unit === obj2?.height?.unit &&
      obj1?.height?.value === obj2?.height?.value
    );
  }

  // Function to compare weight object
  function compareWeight(obj1: any, obj2: any): boolean {
    return obj1?.unit === obj2?.unit && obj1?.value === obj2?.value;
  }

  return (
    compareDimensions(dimensions, searchDetails.dimensions) &&
    compareWeight(weight, searchDetails.weight)
  );
}

/**
 * Validates that the LSP terms have been accepted
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateLSPterms(
  payload: Record<string, any>
): Promise<boolean> {
  const tags = payload?.message?.order?.tags;

  if (!Array.isArray(tags)) return false;

  return tags.some(
    (tag) =>
      tag.code === "bap_terms" &&
      Array.isArray(tag.list) &&
      tag.list.some(
        (item: { code: string; value: string }) =>
          item.code === "accept_bpp_terms" && item.value === "yes"
      )
  );
}

/**
 * Validate S2D TAT and avg pickup time from on_search
 *
 * @param payload The request payload
 * @returns boolean indicating if validation passed
 */
async function validateTAT(payload: Record<string, any>): Promise<boolean> {
  const items = payload?.message?.order?.items;
  const fulfillments = payload?.message?.order?.fulfillments;
  const provider = payload?.message?.order?.provider?.id;
  const transaction_id = payload?.context?.transaction_id;

  if (!Array.isArray(items) || !Array.isArray(fulfillments) || !transaction_id)
    return false;

  let onSearchItems: any = await RedisService.getKey(
    `${transaction_id}:${provider}:onSearchItems`
  );
  let onSearchFulfillments: any = await RedisService.getKey(
    `${transaction_id}:${provider}:onSearchFulfillments`
  );

  if (!onSearchItems || !onSearchFulfillments) return false;

  try {
    onSearchItems = JSON.parse(onSearchItems);
    onSearchFulfillments = JSON.parse(onSearchFulfillments);
    if (!Array.isArray(onSearchItems) || !Array.isArray(onSearchFulfillments))
      return false;
  } catch (error) {
    console.error("Error parsing data from Redis:", error);
    return false;
  }

  const onSearchItemMap = new Map(
    onSearchItems.map((item) => [item.id, item.time])
  );
  const onSearchFulfillmentMap = new Map(
    onSearchFulfillments.map((f) => [f.id, f.start?.time?.duration])
  );

  const itemsValid = items.every((item) => {
    const onSearchTime = onSearchItemMap.get(item.id);
    return (
      onSearchTime &&
      item.time?.label === onSearchTime.label &&
      item.time?.duration === onSearchTime.duration &&
      item.time?.timestamp === onSearchTime.timestamp
    );
  });

  const fulfillmentsValid = fulfillments.every((f) => {
    if (f.type !== "Delivery") return true; // Only validate 'Delivery' type fulfillments
    const onSearchDuration = onSearchFulfillmentMap.get(f.id);
    return onSearchDuration && f.start?.time?.duration === onSearchDuration;
  });

  return itemsValid && fulfillmentsValid;
}
