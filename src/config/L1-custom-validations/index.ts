import { validationOutput } from "./types";
import { search } from "./apiTests/search";
import { onSearch } from "./apiTests/on_search";
import { init } from "./apiTests/init";
import { onInit } from "./apiTests/on_init";
import { confirm } from "./apiTests/confirm";
import { cancel } from "./apiTests/cancel";

export function performL1CustomValidations(
  payload: any,
  action: string,
  allErrors = false,
  externalData = {}
): validationOutput {
  console.log("Performing custom L1 validations for action: " + action);

  switch (action) {
    case "search":
      return search(payload);
    case "on_search":
      return onSearch(payload);
    case "init":
      return init(payload);
    case "on_init":
      return onInit(payload);
    case "confirm":
      return confirm(payload);
    case "on_confirm":
      return confirm(payload);
    case "cancel":
      return cancel(payload);
    default: // Fixed default case
      return [
        {
          valid: true,
          code: 200,
          description: "Custom validation passed", // description is optional
        },
      ];
  }
}
