import { MockSelectClass } from "./2.0.0/select/class";
import { MockSelectPartialCancellationClass } from "./2.0.0/select/select_partial_cancellation/class";
import { MockSelectForPartialCancellationClass } from "./2.0.0/select_for_partial_cancellation/class";
import { MockOnSelectClass } from "./2.0.0/on_select/class";
import { MockOnSelectWithoutFormClass } from "./2.0.0/on_select_without_form/class";
import { MockInitClass } from "./2.0.0/init/class";
import { MockOnInitClass } from "./2.0.0/on_init/class";
import { MockConfirmClass } from "./2.0.0/confirm/class";
import { MockOnConfirmDefaultClass } from "./2.0.0/on_confirm/class";
import { MockStatusDefaultClass } from "./2.0.0/status/class";
import { MockOnStatusDefaultClass } from "./2.0.0/on_status/class";
import { MockCancelClass } from "./2.0.0/cancel/class";
import { MockOnCancelDefaultClass } from "./2.0.0/on_cancel/class";
// on_search
import { MockOnSearchSellerPagination1Class } from "./2.0.0/on_search/on_search_seller_pagination/on_search_seller_pagination_1/class";
import { MockOnSearchSellerPagination2Class } from "./2.0.0/on_search/on_search_seller_pagination/on_search_seller_pagination_2/class";
import { MockOnSearchSellerPagination3Class } from "./2.0.0/on_search/on_search_seller_pagination/on_search_seller_pagination_3/class";
import { MockOnSearchIncrementalPull1Class } from "./2.0.0/on_search/on_search_incremental_pull/on_search_incremental_pull_1/class";
import { MockOnSearchIncrementalPull2Class } from "./2.0.0/on_search/on_search_incremental_pull/on_search_incremental_pull_2/class";
import { MockOnSearchIncrementalPull3Class } from "./2.0.0/on_search/on_search_incremental_pull/on_search_incremental_pull_3/class";
// on_confirm
import { MockOnConfirmTechnicalCancellationClass } from "./2.0.0/on_confirm/on_confirm_technical_cancellation/class";
import { MockOnConfirmUserCancellationClass } from "./2.0.0/on_confirm/on_confirm_user_cancellation/class";
import { MockOnConfirmPartialCancellationClass } from "./2.0.0/on_confirm/on_confirm_partial_cancellation/class";
// status
import { MockStatusUserCancellationClass } from "./2.0.0/status/status_user_cancellation/class";
import { MockStatusTechnicalCancellationClass } from "./2.0.0/status/status_technical_cancellation/class";
// on_status
import { MockOnStatusUserCancellationClass } from "./2.0.0/on_status/on_status_user_cancellation/class";
import { MockOnStatusTechnicalCancellationClass } from "./2.0.0/on_status/on_status_technical_cancellation/class";
// cancel
import { MockCancelSoftUserCancellationClass } from "./2.0.0/cancel/cancel_soft_user_cancellation/class";
import { MockCancelSoftPartialCancellationClass } from "./2.0.0/cancel/cancel_soft_partial_cancellation/class";
import { MockCancelSoftTechnicalCancellationClass } from "./2.0.0/cancel/cancel_soft_technical_cancellation/class";
import { MockCancelConfirmUserCancellationClass } from "./2.0.0/cancel/cancel_confirm_user_cancellation/class";
import { MockCancelConfirmTechnicalCancellationClass } from "./2.0.0/cancel/cancel_confirm_technical_cancellation/class";
// on_cancel
import { MockOnCancelSoftUserCancellationClass } from "./2.0.0/on_cancel/on_cancel_soft_user_cancellation/class";
import { MockOnCancelSoftPartialCancellationClass } from "./2.0.0/on_cancel/on_cancel_soft_partial_cancellation/class";
import { MockOnCancelSoftTechnicalCancellationClass } from "./2.0.0/on_cancel/on_cancel_soft_technical_cancellation/class";
import { MockOnCancelConfirmUserCancellationClass } from "./2.0.0/on_cancel/on_cancel_confirm_user_cancellation/class";
import { MockOnCancelConfirmTechnicalCancellationClass } from "./2.0.0/on_cancel/on_cancel_confirm_technical_cancellation/class";
import { search_seller_pagination_class } from "./2.0.0/search/search_pagination/class";
import { search_incremental_pull_class } from "./2.0.0/search/search_incremental_pull/class";
import { MockSelect2Class } from "./2.0.0/select_form_submission/class";
import { MockOnSelect2Class } from "./2.0.0/on_select_form_submission/class";
import { MockOnCancelRejectedClass } from "./2.0.0/on_cancel/on_cancel_rejected/class";
// update
import { MockUpdateSoftPartialCancellationClass } from "./2.0.0/update/update_soft_partial_cancellation/class";
import { MockUpdateConfirmPartialCancellationClass } from "./2.0.0/update/update_confirm_partial_cancellation/class";
// on_update
import { MockOnUpdateSoftPartialCancellationClass } from "./2.0.0/on_update/on_update_soft_partial_cancellation/class";
import { MockOnUpdateConfirmPartialCancellationClass } from "./2.0.0/on_update/on_update_confirm_partial_cancellation/class";
import { MockFirstFormTestingClass } from "./2.0.0/form/first_form_testing";
import { MockAction } from "./classes/mock-action";
import { MockIssueEscalateClass, MockIssueOpenClass } from "./2.0.0/issue/issue_open/class";
import { MockIssueOpen2Class } from "./2.0.0/issue/issue_open_2/class";
import { MockOnIssueProcessing1Class, MockOnIssueProcessing2Class, MockOnIssueProcessingClass } from "./2.0.0/on_issue/on_issue_processing/class";
import { MockOnIssueNeedMoreInfoClass } from "./2.0.0/on_issue/on_issue_need_more_info/class";
import { MockIssueInfoProvidedClass } from "./2.0.0/issue/issue_info_provided/class";
import { MockOnIssueProvidedClass } from "./2.0.0/on_issue/on_issue_provided/class";
import { MockOnIssueResolution1Class, MockOnIssueResolution2Class, MockOnIssueResolutionClass, MockOnIssueResolutionIGM3Class } from "./2.0.0/on_issue/on_issue_resolution/class";
import { MockIssueResolutionAcceptClass, MockIssueResolutionAcceptIGM3Class, MockIssueResolutionRejectClass } from "./2.0.0/issue/issue_resolution_accept/class";
import { MockOnIssueResolvedClass, MockOnIssueResolvedIGM3Class } from "./2.0.0/on_issue/on_issue_resolved/class";
import { MockIssueCloseClass, MockIssueCloseIGM3Class } from "./2.0.0/issue/issue_close/class";
import { MockSelectPurchaseCultureClass } from "./2.0.0/select_form_submission_cultural/class";
import { MockOnSelectPurchaseCultureClass } from "./2.0.0/on_select_form_submission_culture/class";
import { MockOnSelectPurchaseCultFormClass } from "./2.0.0/on_select_cultural/class";
// types/helpers
type Ctor<T> = new () => T;

// === keep your imports exactly as they are ===

// Build a single source of truth registry
const registry = {
	// search
	search_seller_pagination: search_seller_pagination_class,
	search_incremental_pull: search_incremental_pull_class,

	// on_search
	on_search_seller_pagination_1: MockOnSearchSellerPagination1Class,
	on_search_seller_pagination_2: MockOnSearchSellerPagination2Class,
	on_search_seller_pagination_3: MockOnSearchSellerPagination3Class,
	on_search_incremental_pull_1: MockOnSearchIncrementalPull1Class,
	on_search_incremental_pull_2: MockOnSearchIncrementalPull2Class,
	on_search_incremental_pull_3: MockOnSearchIncrementalPull3Class,

	// select
	select: MockSelectClass,
	select_partial_cancellation: MockSelectPartialCancellationClass,
	select_for_partial_cancellation: MockSelectForPartialCancellationClass,
	on_select: MockOnSelectClass,
	on_select_without_form: MockOnSelectWithoutFormClass,
	on_select_form_submission_culture: MockOnSelectPurchaseCultureClass,
	on_select_submission_cultural: MockOnSelectPurchaseCultFormClass,
	select_form_submission: MockSelect2Class,
	select_form_submission_cultural: MockSelectPurchaseCultureClass,
	on_select_form_submission: MockOnSelect2Class,
	select_2: MockSelect2Class,
	on_select_2: MockOnSelect2Class,

	// init / on_init
	init: MockInitClass,
	on_init: MockOnInitClass,

	// confirm / on_confirm
	confirm: MockConfirmClass,
	on_confirm: MockOnConfirmDefaultClass,
	on_confirm_technical_cancellation: MockOnConfirmTechnicalCancellationClass,
	on_confirm_user_cancellation: MockOnConfirmUserCancellationClass,
	on_confirm_partial_cancellation: MockOnConfirmPartialCancellationClass,

	// status / on_status
	status: MockStatusDefaultClass,
	on_status: MockOnStatusDefaultClass,
	status_technical_cancellation: MockStatusTechnicalCancellationClass,
	on_status_technical_cancellation: MockOnStatusTechnicalCancellationClass,
	status_user_cancellation: MockStatusUserCancellationClass,
	on_status_user_cancellation: MockOnStatusUserCancellationClass,

	// cancel / on_cancel
	cancel: MockCancelClass,
	on_cancel: MockOnCancelDefaultClass,
	cancel_soft_user_cancellation: MockCancelSoftUserCancellationClass,
	on_cancel_soft_user_cancellation: MockOnCancelSoftUserCancellationClass,
	cancel_soft_partial_cancellation: MockCancelSoftPartialCancellationClass,
	on_cancel_soft_partial_cancellation: MockOnCancelSoftPartialCancellationClass,
	cancel_soft_technical_cancellation: MockCancelSoftTechnicalCancellationClass,
	on_cancel_soft_technical_cancellation:
		MockOnCancelSoftTechnicalCancellationClass,
	cancel_confirm_user_cancellation: MockCancelConfirmUserCancellationClass,
	on_cancel_confirm_user_cancellation: MockOnCancelConfirmUserCancellationClass,
	cancel_confirm_technical_cancellation:
		MockCancelConfirmTechnicalCancellationClass,
	on_cancel_confirm_technical_cancellation:
		MockOnCancelConfirmTechnicalCancellationClass,
	on_cancel_rejected: MockOnCancelRejectedClass,

	// update / on_update
	update_soft_partial_cancellation: MockUpdateSoftPartialCancellationClass,
	update_confirm_partial_cancellation:
		MockUpdateConfirmPartialCancellationClass,
	on_update_soft_partial_cancellation: MockOnUpdateSoftPartialCancellationClass,
	on_update_confirm_partial_cancellation:
		MockOnUpdateConfirmPartialCancellationClass,

	// forms
	first_form_testing: MockFirstFormTestingClass,

	// _____________________IGM BUS (2.0.1)____________________________
	issue_open: MockIssueOpenClass,
	issue_escalate: MockIssueEscalateClass,
	issue_open_2: MockIssueOpen2Class,

	on_issue_processing: MockOnIssueProcessingClass,
	on_issue_processing_1: MockOnIssueProcessing1Class,
	on_issue_processing_2: MockOnIssueProcessing2Class,

	on_issue_need_more_info: MockOnIssueNeedMoreInfoClass,

	issue_info_provided: MockIssueInfoProvidedClass,

	on_issue_provided: MockOnIssueProvidedClass,

	on_issue_resolution: MockOnIssueResolutionClass,
	on_issue_resolution_1: MockOnIssueResolution1Class,
	on_issue_resolution_2: MockOnIssueResolution2Class,
	on_issue_resolution_igm_3: MockOnIssueResolutionIGM3Class,

	issue_resolution_accept: MockIssueResolutionAcceptClass,
	issue_resolution_accept_igm_3: MockIssueResolutionAcceptIGM3Class,

	issue_resolution_reject: MockIssueResolutionRejectClass,

	on_issue_resolved: MockOnIssueResolvedClass,
	on_issue_resolved_igm_3: MockOnIssueResolvedIGM3Class,

	issue_close: MockIssueCloseClass,
	issue_close_igm_3: MockIssueCloseIGM3Class,
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
