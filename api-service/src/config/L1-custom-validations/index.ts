import { validationOutput } from "./types";
import search from "./apiTests/search";
import onSearch from "./apiTests/on_search";
import select from "./apiTests/select";
import onSelect from "./apiTests/on_select";
import init from "./apiTests/init";
import onInit from "./apiTests/on_init";
import { catalogRejectionValidator } from "./apiTests/catalog_rejection";
// import { confirm } from "./apiTests/confirm";
// import { cancel } from "./apiTests/cancel";

export function performL1CustomValidations(
  payload: any,
  action: string,
  subUrl: string,
  allErrors = false,
  externalData = {}
): Promise<validationOutput> {
  console.log("Performing custom L1 validations for action: " + action);

  switch (action) {
    case "search":
      return search(payload);
    case "on_search":
      return onSearch(payload);
    case "select":
      return select(payload);
    case "on_select":
      return onSelect(payload);
    case "init":
      return init(payload);
    case "on_init":
      return onInit(payload);
    case "catalog_rejection":
      return catalogRejectionValidator(payload)
    // case "confirm":
    //   return confirm(payload);
    // case "on_confirm":
    //   return confirm(payload);
    // case "cancel":
    //   return cancel(payload);
    default:
      return Promise.resolve([
        {
          valid: true,
          code: 0,
          description: "No custom validations required for this action.",
        },
      ]);
  }
}
