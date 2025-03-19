import { RedisService } from "ondc-automation-cache-lib";
import { validationOutput } from "../types";

export function onSearch(
  payload : any
): validationOutput {
  // Extract payload, context, domain and action
  const context = payload?.context;
  const domain = context?.domain;
  const action = context?.action;
  const transaction_id = context?.transaction_id;
  const providers = payload?.message?.catalog["bpp/providers"];

  console.log(`Running validations for ${domain}/${action}`);

  // Initialize results array
  const results: validationOutput = [];

    providers.array.forEach((provider: any) => {
      const items = provider?.items;
      const fulfillments = provider?.fulfillments
      RedisService.setKey(
        `${transaction_id}:${provider}:onSearchItems`,
        JSON.stringify({ items })
      );

      RedisService.setKey(
        `${transaction_id}:${provider}:onSearchFulfillments`,
        JSON.stringify({ fulfillments })
      );
    });
    // If no issues found, return a success result
    if (results.length === 0) {
      results.push({ valid: true, code: 200 });
    }
  
  return results;
}
