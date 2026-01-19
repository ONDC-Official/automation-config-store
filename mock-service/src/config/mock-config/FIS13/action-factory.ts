import { MockSearchClass } from "./2.0.0/search/search/class";
import { MockOnSearchClass } from "./2.0.0/on_search/on_search/class";
import { MockSelectClass } from "./2.0.0/select/class";
import { MockOnSelectHospicashInsurencClass } from "./2.0.0/on_select/on_select_hospicash_insurence/class";
import { MockInitTransitInsurenceClass } from "./2.0.0/init/init_transit_insurence/class";
import { MockOnInitTransitClass } from "./2.0.0/on_init/on_init_transit_insurence/class";
import { MockConfirmTransitClass } from "./2.0.0/confirm/confirm_transit_insurence/class";
import { MockSearchPurchaseJourneyTransitClass } from "./2.0.0/search/search_purchase_journey_transit/class";
import { MockOnSearchPurchaseJourneyTransitClass } from "./2.0.0/on_search/on_search_purchase_journey_transit/class";
import { MockOnSelectTransitInsurenceClass } from "./2.0.0/on_select/on_select_transit_insurence/class";
import { MockInitHospicashClass } from "./2.0.0/init/init_hospicash_insurence/class";
import { MockOnInitHospicashClass } from "./2.0.0/on_init/on_init_hospicash_insurence/class";
import { MockConfirmHospicashClass } from "./2.0.0/confirm/confirm_hospicash_insurence/class";
import { MockOnConfirmHospicashClass } from "./2.0.0/on_confirm/on_confirm_hospicash_insurence/class";
import { MockOnConfirmTransitClass } from "./2.0.0/on_confirm/on_confirm_transit_insurence/class";
import { MockOnupdateTransitClass } from "./2.0.0/on_update/on_update_transit/class";
import { MockOnupdateHospicashClass } from "./2.0.0/on_update/on_update_hospicash/class";
import { MockSearchPurchaseJourneyHospicashClass } from "./2.0.0/search/search_purchase_journey_hospicash/class";
import { MockOnSearchPurchaseJourneyHospicashClass } from "./2.0.0/on_search/on_search_purchase_journey_hospicash/class";
import { MockSearchDiscoverProductHospicashClass } from "./2.0.0/search/search_discover_products/search_discover_product_hospicash/class";
import { MockSearchDiscoverProductTransitClass } from "./2.0.0/search/search_discover_products/search_discover_product_transit/class";
import { MockOnSearchDiscoverHospicashClass } from "./2.0.0/on_search/on_search_discover_product/on_search_discover_product_hospicash/class";
import { MockOnSearchDiscoverTransitClass } from "./2.0.0/on_search/on_search_discover_product/on_search_discover_product_transit/class";
import { MockAction } from "./classes/mock-action";
import { MockOnSearchDiscoverAccidentalClass } from "./2.0.0/on_search/on_search_discover_product/on_search_discover_product_accidental/class";
import { MockSearchDiscoverProductAccidentalClass } from "./2.0.0/search/search_discover_products/search_discover_product_accidental/class";
import { MockSearchPurchaseJourneyAccidentalClass } from "./2.0.0/search/search_purchase_journey_accidental/class";
import { MockInitAccidentalClass } from "./2.0.0/init/init_accidental_insurence/class";
import { MockOnInitAccidentalClass } from "./2.0.0/on_init/on_init_accidental_insurence/class";
import { MockConfirmAccidentalClass } from "./2.0.0/confirm/confirm_accidental_insurence/class";
import { MockOnConfirmAccidentalClass } from "./2.0.0/on_confirm/on_confirm_accidental_insurence/class";
import { MockOnupdateAccidentalClass } from "./2.0.0/on_update/on_update_accidental/class";
import { MockOnSearchPurchaseJourneyAccidentalClass } from "./2.0.0/on_search/on_search_purchase_journey_accidental/class";
import { MockOnSelectAccidentalInsurencClass } from "./2.0.0/on_select/on_select_accidental_insurence/class";
import { MockSearchInsurenceTransitProviderClass } from "./2.0.0/search/search_insurence_provider/search_insurence_provider_transit/class";
import { MockSearchInsurenceHospicashProviderClass } from "./2.0.0/search/search_insurence_provider/search_insurence_provider_hospicash/class";
import { MockOnSearchInsurenceProvidersTransitClass } from "./2.0.0/on_search/on_search_insurence_providers/on_search_insurence_providers_transit/class";
import { MockOnSearchInsurenceProvidersHospicashClass } from "./2.0.0/on_search/on_search_insurence_providers/on_search_insurence_providers_hospicash/class";
import { MockOnSearchInsurenceProvidersAccidentalClass } from "./2.0.0/on_search/on_search_insurence_providers/on_search_insurence_providers_accidental/class";

// Type helper for constructor
type Ctor<T> = new () => T;

// Build a single source of truth registry
const registry = {
	// search
	search: MockSearchClass,
	search_purchase_journey_transit: MockSearchPurchaseJourneyTransitClass,
	search_purchase_journey_hospicash: MockSearchPurchaseJourneyHospicashClass,
	search_insurence_transit_provider: MockSearchInsurenceTransitProviderClass,
	search_insurence_hospicash_provider: MockSearchInsurenceHospicashProviderClass,
	search_insurence_accidental_provider: MockSearchInsurenceTransitProviderClass,
	search_discover_product_hospicash: MockSearchDiscoverProductHospicashClass,
	search_discover_product_transit: MockSearchDiscoverProductTransitClass,
	search_discover_product_accidental: MockSearchDiscoverProductAccidentalClass,
	search_purchase_journey_accidental: MockSearchPurchaseJourneyAccidentalClass,

	// on_search
	on_search_purchase_journey_hospicash: MockOnSearchPurchaseJourneyHospicashClass,
	on_search_purchase_journey_transit: MockOnSearchPurchaseJourneyTransitClass,
	on_search_purchase_journey_accidental: MockOnSearchPurchaseJourneyAccidentalClass,
	on_search: MockOnSearchClass,
	on_search_insurence_provider_transit: MockOnSearchInsurenceProvidersTransitClass,
	on_search_insurence_provider_hospicash: MockOnSearchInsurenceProvidersHospicashClass,
	on_search_insurence_provider_accidental: MockOnSearchInsurenceProvidersAccidentalClass,
	on_search_discover_product_tranist: MockOnSearchDiscoverTransitClass,
	on_search_discover_product_hospicash: MockOnSearchDiscoverHospicashClass,
	on_search_discover_product_accidental: MockOnSearchDiscoverAccidentalClass,

	// select / on_select
	select: MockSelectClass,
	on_select: MockOnSelectTransitInsurenceClass,
	on_select_hospicash: MockOnSelectHospicashInsurencClass,
	on_select_accidental: MockOnSelectAccidentalInsurencClass,

	// init / on_init
	init: MockInitTransitInsurenceClass,
	init_hospicash: MockInitHospicashClass,
	init_accidental: MockInitAccidentalClass,

	on_init: MockOnInitTransitClass,
	on_init_hospicash: MockOnInitHospicashClass,
	on_init_accidental: MockOnInitAccidentalClass,

	// confirm / on_confirm
	confirm: MockConfirmTransitClass,
	confirm_hospicash: MockConfirmHospicashClass,
	confirm_accidental: MockConfirmAccidentalClass,

	on_confirm: MockOnConfirmTransitClass,
	on_confirm_hospicash: MockOnConfirmHospicashClass,
	on_confirm_accidental: MockOnConfirmAccidentalClass,

	// update / on_update
	on_update: MockOnupdateTransitClass,
	on_update_hospicash: MockOnupdateHospicashClass,
	on_update_accidental: MockOnupdateAccidentalClass,
} as const satisfies Record<string, Ctor<MockAction>>;

type MockActionId = keyof typeof registry;

// Construct by id
export function getFIS13MockAction(actionId: string): MockAction {
	console.log("actionIdactionIdactionIdactionId", actionId);
	const Ctor = registry[actionId as MockActionId];
	if (!Ctor) {
		throw new Error(`Action with ID ${actionId} not found`);
	}
	return new Ctor();
}

// List all possible ids — stays in sync automatically
export function listFIS13MockActions(): MockActionId[] {
	return Object.keys(registry) as MockActionId[];
}