import dayjs from "dayjs";

/**
 * ON_SEARCH_SELLER_PAGINATION_1 GENERATOR
 * 
 * PURPOSE:
 * This is the FIRST PAGE of paginated search results for TRV14 (Travel) domain.
 * It serves as the initial catalog response that provides metadata and pagination info.
 * 
 * KEY FEATURES:
 * ✅ NO ITEMS CATALOG - This page intentionally contains NO items array
 * ✅ METADATA ONLY - Focuses on provider info, categories, locations, and business terms
 * ✅ PAGINATION SETUP - Establishes pagination structure (MAX_PAGE_NUMBER: 2)
 * ✅ BUSINESS TERMS - Sets BAP/BPP terms, fees, and policies
 * ✅ PROVIDER INFO - Static provider details, categories, and locations
 * ✅ TIME RANGE - Dynamic time range generation based on search parameters
 * ✅ PAYMENT CONFIG - Sets payment collection method from session data
 * 
 * PAGINATION FLOW:
 * Page 1 (this): Metadata + pagination info (no items)
 * Page 2: First set of items (I0, I1, I2, some items)
 * Page 3: Second set of items (I3, I4, I5, remaining items)
 * 
 * SESSION DATA USED:
 * - sessionData.collected_by: Sets payment collection method
 * - sessionData.tags: Sets business terms and pagination tags
 * - sessionData.start_time: Start of availability window
 * - sessionData.end_time: End of availability window
 * 
 * RESPONSE STRUCTURE:
 * {
 *   catalog: {
 *     descriptor: { provider catalog info },
 *     providers: [{
 *       id: "P1",
 *       descriptor: { provider details },
 *       categories: [{ service categories }],
 *       time: { availability window },
 *       locations: [{ service locations }],
 *       payments: [{ payment config }],
 *       items: [] // ❌ INTENTIONALLY EMPTY - Items start from page 2
 *     }],
 *     tags: [{ business terms, pagination info }]
 *   }
 * }
 * 
 * IMPORTANT NOTES:
 * - This generator does NOT handle sessionData.items (not needed for page 1)
 * - Items catalog starts from on_search_seller_pagination_2
 * - This establishes the foundation for subsequent paginated responses
 * - Random date generation ensures dynamic availability windows
 */

function getRandomDateBetween(start: any, end: any) {

  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diff = endDate.diff(startDate, 'day');
  const randomOffset = Math.floor(Math.random() * (diff + 1));
  return startDate.add(randomOffset, 'day');
}

export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {

    // Set payment_collected_by if present
    if (sessionData.collected_by && existingPayload.message?.catalog?.providers?.[0]?.payments?.[0]) {
        existingPayload.message.catalog.providers[0].payments[0].collected_by = sessionData.collected_by;
    }

    // Set tags if present // wrong in developer guide bap_terms shouldn't be in on_search
    // if (sessionData.tags && existingPayload.message?.catalog) {
    //     existingPayload.message.catalog.tags = [...existingPayload.message.catalog.tags, ...sessionData.tags[0]]
    // }

    // Set timerange
    if (sessionData.start_time && sessionData.end_time) {
        // const randomDate = getRandomDateBetween(sessionData.start_time, sessionData.end_time);
        existingPayload.message.catalog.providers[0].time = {
            range: {
                // start: randomDate.hour(5).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                // end: randomDate.hour(23).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                start: sessionData.start_time,
                end: sessionData.end_time
            }
        };
    }

    // NOTE: sessionData.items is NOT used here because page 1 contains no items
    // Items catalog starts from on_search_seller_pagination_2 and on_search_seller_pagination_3

    return existingPayload;
} 