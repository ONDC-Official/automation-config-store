import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export function init(payload: any): validationOutput {
  // Extract payload, context, domain and action
  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  console.log(`Running validations for ${domain}/${action}`);

  // Initialize results array
  const results: validationOutput = [];

  //validate items
  if (!validateItems(payload)) {
    results.push({
      valid: false,
      code: 66002,
      description: `LSP is unable to validate the order request : Selected item does not exist in the catalog provided in /on_search`,
    });
  }

  // If no issues found, return a success result
  if (results.length === 0) {
    results.push({ valid: true, code: 200 });
  }

  return results;
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
  const provider = payload?.messsage?.order?.provider?.id;
  if (!Array.isArray(items) || !transaction_id) return false;

  let onSearchItems: any = await RedisService.getKey(
    `${transaction_id}:${provider}:onSearchItems`
  );

  if (!onSearchItems) return false;

  try {
    onSearchItems = JSON.parse(onSearchItems);
    if (!Array.isArray(onSearchItems)) return false;
  } catch (error) {
    console.error("Error parsing onInitItems from Redis:", error);
    return false;
  }

  return items.every((item) =>
    onSearchItems.some(
      (onSearchItem) =>
        item.id === onSearchItem.id &&
        JSON.stringify(item.fulfillment_id || []) ===
          JSON.stringify(onSearchItem.fulfillment_id || []) &&
        JSON.stringify(item.fulfillment_ids || []) ===
          JSON.stringify(onSearchItem.fulfillment_ids || []) &&
        item.category_id === onSearchItem.category_id
    )
  );
}
