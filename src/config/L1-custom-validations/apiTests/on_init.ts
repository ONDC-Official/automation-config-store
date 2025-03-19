import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export function onInit(payload: any): validationOutput {
  // Extract payload, context, domain and action

  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  const transaction_id = context?.transaction_id;
  const items = payload?.message?.items;
  const quote = payload?.message?.order?.quote;
  const fulfillments = payload?.message?.order?.fulfillments;
  console.log(`Running validations for ${domain}/${action}`);

  // Initialize results array
  const results: validationOutput = [];

  RedisService.setKey(
    `${transaction_id}:onInitQuote`,
    JSON.stringify({ quote })
  );

  RedisService.setKey(
    `${transaction_id}:onInitItems`,
    JSON.stringify({ items })
  );

  RedisService.setKey(
    `${transaction_id}:onInitFulfillments`,
    JSON.stringify({ fulfillments })
  );

  // If no issues found, return a success result
  if (results.length === 0) {
    results.push({ valid: true, code: 200 });
  }

  return results;
}
