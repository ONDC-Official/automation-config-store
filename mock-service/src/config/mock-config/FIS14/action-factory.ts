// Mutual Funds 2.1.0 imports
import { MockSearchClass } from "./mutual-funds/2.1.0/search/class";
import { MockOnSearchClass } from "./mutual-funds/2.1.0/on_search/class";
import { MockSelectClass } from "./mutual-funds/2.1.0/select/class";
import { MockOnSelectClass } from "./mutual-funds/2.1.0/on_select/class";
import { MockOnSelectExistingFolioClass } from "./mutual-funds/2.1.0/on_select_existing_folio/class";
import { MockSelect_2Class } from "./mutual-funds/2.1.0/select_2/class";
import { MockOnSelect_2Class } from "./mutual-funds/2.1.0/on_select_2/class";
import { MockInitClass } from "./mutual-funds/2.1.0/init/class";
import { MockOnInitClass } from "./mutual-funds/2.1.0/on_init/class";
import { MockConfirmClass } from "./mutual-funds/2.1.0/confirm/class";
import { MockOnConfirmClass } from "./mutual-funds/2.1.0/on_confirm/class";
import { MockOnStatusUnsolicitedClass } from "./mutual-funds/2.1.0/on_status_unsolicited/class";
import { MockOnUpdateUnsolicitedClass } from "./mutual-funds/2.1.0/on_update_unsolicited/class";
import { MockOnStatusClass } from "./mutual-funds/2.1.0/on_status/class";
import { MockOnUpdateClass } from "./mutual-funds/2.1.0/on_update/class";
import { MockInvestorDetailsFormClass } from "./mutual-funds/2.1.0/investor_details_form/investor_details_form"
import type { MockAction } from "../FIS14/classes/mock-action";
import { MockOnSearchIncrementClass } from "./mutual-funds/2.1.0/on_search_incremental_pull/class";
import { MockSearchIncrementClass } from "./mutual-funds/2.1.0/search_incremental_pull/class";
import { MockSelectFinalClass } from "./mutual-funds/2.1.0/select_final/class";
import { MockOnSelectEsignClass } from "./mutual-funds/2.1.0/on_select_esign/class";
import { MockSelectEsignClass } from "./mutual-funds/2.1.0/select_esign/class";
import { MockOnSelectFinalClass } from "./mutual-funds/2.1.0/on_select_final/class";
import { MockVerificationStatusFormClass } from "./mutual-funds/2.1.0/verification_status/verification_status";
import { MockESignVerificationStatusFormClass } from "./mutual-funds/2.1.0/E_sign_verification_status/E_sign_verification_status";
import { MockPaymentFormClass } from "./mutual-funds/2.1.0/payment_url_form/payment_url_form";
import { MockOnStatusUnsolicitedPaymentClass } from "./mutual-funds/2.1.0/on_status_unsolicited_payment/class";
import { MockUpdatePaymentClass } from "./mutual-funds/2.1.0/update_payment_retry/class";
import { MockOnUpdatePaymentUnsolicitedClass } from "./mutual-funds/2.1.0/on_update_payment_retry/class";
import { MockOnStatusUnsolicitedEsignClass } from "./mutual-funds/2.1.0/on_status_unsolicited_esign/class";
import { MockOnSelectRedemptionClass } from "./mutual-funds/2.1.0/on_select_redemption/class";
import { MockInitRedemptionClass } from "./mutual-funds/2.1.0/init_redemption/class";
import { MockOnInitRedemptionClass } from "./mutual-funds/2.1.0/on_init_redemption/class";
import { MockOnConfirmRedemptionClass } from "./mutual-funds/2.1.0/on_confirm_redemption/class";
import { MockOnUpdateRedemptionClass } from "./mutual-funds/2.1.0/on_update_redemption/class";
import { MockRetryPaymentFormClass } from "./mutual-funds/2.1.0/retry_payment_url_form/retry_payment_url_form";
import { MockOnStatusUnsolicitedPaymentSuccessClass } from "./mutual-funds/2.1.0/on_status_unsolicited_payment_success/class";
import { MockOnConfirmExistingFolioClass } from "./mutual-funds/2.1.0/on_confirm_existing_folio/class";
import { MockOnInitExistingFolioClass } from "./mutual-funds/2.1.0/on_init_existing_folio/class";
import { MockOnStatusUnsolicitedPaymentExistingFolioClass } from "./mutual-funds/2.1.0/on_status_unsolicited_existing_folio_payment/class";
import { MockOnUpdateUnsolicitedExistingFolioClass } from "./mutual-funds/2.1.0/on_update_unsolicited_existing_folio/class";
import { MockOnSelect1NewFolioClass } from "./mutual-funds/2.1.0/on_select_1_new_folio/class";
import { MockOnSelect2NewFolioClass } from "./mutual-funds/2.1.0/on_select_2_new_folio/class";
import { MockOnInitNewFolioClass } from "./mutual-funds/2.1.0/on_init_new_folio/class";
import { MockOnConfirmNewFolioClass } from "./mutual-funds/2.1.0/on_confirm_new_folio/class";
import { MockOnStatusUnsolicitedPaymentNewFolioClass } from "./mutual-funds/2.1.0/on_status_unsolicited_new_folio_payment/class";
import { MockOnUpdateUnsolicitedNewFolioClass } from "./mutual-funds/2.1.0/on_update_unsolicited_new_folio/class";

type Ctor<T> = new () => T;

const registry = {
    // Mutual Funds 2.1.0 actions
    search: MockSearchClass,
    search_incremental_pull: MockSearchIncrementClass,

    // on_search
    on_search: MockOnSearchClass,
    on_search_incremental_pull: MockOnSearchIncrementClass,

    // select
    select: MockSelectClass,
    on_select: MockOnSelectClass,
    on_select_existing_folio: MockOnSelectExistingFolioClass,
    select_2: MockSelect_2Class,
    on_select_2: MockOnSelect_2Class,
    select_esign: MockSelectEsignClass,
    select_final: MockSelectFinalClass,
    on_select_esign: MockOnSelectEsignClass,
    on_select_final: MockOnSelectFinalClass,
    verification_status: MockVerificationStatusFormClass,
    E_sign_verification_status: MockESignVerificationStatusFormClass,
    // init / on_init
    init: MockInitClass,
    on_init: MockOnInitClass,

    // confirm / on_confirm
    confirm: MockConfirmClass,
    on_confirm: MockOnConfirmClass,
    payment_url_form: MockPaymentFormClass,
    retry_payment_url_form: MockRetryPaymentFormClass,

    // solicited status/update
    on_status: MockOnStatusClass,
    update_payment_retry: MockUpdatePaymentClass,
    on_update_payment_retry: MockOnUpdatePaymentUnsolicitedClass,
    on_update: MockUpdatePaymentClass,
    on_status_unsolicited_payment_success: MockOnStatusUnsolicitedPaymentSuccessClass,
    on_update_unsolicited_success: MockOnUpdatePaymentUnsolicitedClass,
    // unsolicited callbacks
    on_status_unsolicited_payment: MockOnStatusUnsolicitedPaymentClass,
    on_status_unsolicited_esign: MockOnStatusUnsolicitedEsignClass,
    on_status_unsolicited: MockOnStatusUnsolicitedClass,
    on_status_esign_unsolicited: MockOnStatusUnsolicitedClass,
    on_update_unsolicited: MockOnUpdateUnsolicitedClass,
    on_update_unsolicited_failed: MockOnUpdateUnsolicitedClass,
    // forms
    investor_details_form: MockInvestorDetailsFormClass,

    /***LUMPSUM EXISTING FOLIO CALLS START*/
    on_confirm_existing_folio: MockOnConfirmExistingFolioClass,
    on_init_existing_folio: MockOnInitExistingFolioClass,
    on_status_unsolicited_existing_folio_payment: MockOnStatusUnsolicitedPaymentExistingFolioClass,
    on_update_unsolicited_existing_folio: MockOnUpdateUnsolicitedExistingFolioClass,
    /***EXISTING FOLIO CALLS END*/

    /**LUMPSUM NEW FOLIO START */
    on_select_1_new_folio: MockOnSelect1NewFolioClass,
    on_select_2_new_folio: MockOnSelect2NewFolioClass,
    on_init_new_folio: MockOnInitNewFolioClass,
    on_confirm_new_folio: MockOnConfirmNewFolioClass,
    on_status_unsolicited_new_folio_payment: MockOnStatusUnsolicitedPaymentNewFolioClass,
    on_update_unsolicited_new_folio: MockOnUpdateUnsolicitedNewFolioClass,

    /**LUMPSUM NEW FOLIO END */

    // Redemption flows
    on_select_redemption: MockOnSelectRedemptionClass,
    init_redemption: MockInitRedemptionClass,
    on_init_redemption: MockOnInitRedemptionClass,
    confirm_redemption: MockInitRedemptionClass,
    on_confirm_redemption: MockOnConfirmRedemptionClass,
    on_update_redemption: MockOnUpdateRedemptionClass,

} as const satisfies Record<string, Ctor<MockAction>>;

type MockActionId = keyof typeof registry;

// Construct by id
export function getMockAction(actionId: string): MockAction {
    const Ctor = registry[actionId as MockActionId];
    if (!Ctor) {
        throw new Error(`Action with ID ${actionId as string} not found`);
    }
    return new Ctor();
}

// List all possible ids — stays in sync automatically
export function listMockActions(): MockActionId[] {
    return Object.keys(registry) as MockActionId[];
}
