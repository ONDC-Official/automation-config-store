import { MockSearchClass } from "./2.0.0/search/class";
import { MockOnSearchClass } from "./2.0.0/on_search/class";
import { MockSelectClass } from "./2.0.0/select/class";
import { MockOnSelectClass } from "./2.0.0/on_select/class";
import { MockInitClass } from "./2.0.0/init/class";
import { MockOnInitClass } from "./2.0.0/on_init/class";
import { MockConfirmClass } from "./2.0.0/confirm/class";
import { MockOnConfirmDefaultClass } from "./2.0.0/on_confirm/class";
import { MockConfirmSuccessClass } from "./2.0.0/confirm/confirm_card_balance_success/class";
import { MockConfirmFaliureClass } from "./2.0.0/confirm/confirm_card_balance_faliure/class";
import { MockOnConfirmSuccessDefaultClass } from "./2.0.0/on_confirm/on_confirm_card_balance_success/class";
import { MockOnConfirmFaliureDefaultClass } from "./2.0.0/on_confirm/on_confirm_card_balance_faliure/class";

export function getMockAction(actionId: string) {
  switch (actionId) {
    case "search":
      return new MockSearchClass();
    case "on_search":
      return new MockOnSearchClass();
    case "select":
      return new MockSelectClass();
    case "on_select":
      return new MockOnSelectClass();
    case "init":
      return new MockInitClass();
    case "on_init":
      return new MockOnInitClass();
    case "confirm":
      return new MockConfirmClass();
    case "confirm_card_balance_success":
      return new MockConfirmSuccessClass();
    case "confirm_card_balance_faliure":
      return new MockConfirmFaliureClass();
    case "on_confirm":
      return new MockOnConfirmDefaultClass();
    case "on_confirm_card_balance_success":
      return new MockOnConfirmSuccessDefaultClass();
    case "on_confirm_card_balance_faliure":
      return new MockOnConfirmFaliureDefaultClass();
    default:
      throw new Error(`Action with ID ${actionId} not found`);
  }
}
