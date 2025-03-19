import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export function onConfirm(payload: any): validationOutput {
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

  //validate quote
  if (!validQuote) {
    results.push({
      valid: false,
      code: 63002,
      description: `LBNP is unable to validate the order request : Quote price does not match with /confirm`,
    });
  }

  //validate items
  if (!validItems) {
    results.push({
      valid: false,
      code: 63002,
      description: `LBNP is unable to validate the order request : Items array does not match with /confirm`,
    });
  }

  //validate fulfillments
  if (!validFulfillments) {
    results.push({
      valid: false,
      code: 63002,
      description: `LBNP is unable to validate the order request : Fulfillments array does not match with /confirm`,
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

  const onInitQuoteRaw = await RedisService.getKey(
    `${transaction_id}:confirmQuote`
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

  if (!Array.isArray(items) || !transaction_id) return false;

  let onInitItems: any = await RedisService.getKey(
    `${transaction_id}:confirmItems`
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

  if (!Array.isArray(fulfillments) || !transaction_id) return false;

  let onInitFulfillments: any = await RedisService.getKey(
    `${transaction_id}:confirmFulfillments`
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
