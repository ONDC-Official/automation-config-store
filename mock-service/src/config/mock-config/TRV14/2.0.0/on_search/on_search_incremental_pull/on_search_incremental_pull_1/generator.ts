import dayjs from "dayjs";

function getRandomDateBetween(start: any, end: any) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diff = endDate.diff(startDate, 'day');
  const randomOffset = Math.floor(Math.random() * (diff + 1));
  return startDate.add(randomOffset, 'day');
}

export async function onSearchIncrementalPull1Generator(existingPayload: any, sessionData: any) {
  
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
    const startTime = Array.isArray(sessionData.start_time) ? sessionData.start_time[0] : sessionData.start_time;
    const endTime = Array.isArray(sessionData.end_time) ? sessionData.end_time[0] : sessionData.end_time;
    existingPayload.message.catalog.providers[0].time = {
        range: {
            start: startTime,
            end: endTime
        }
    };
}

// Update city codes in locations dynamically
const provider = existingPayload.message?.catalog?.providers?.[0];
if (provider && Array.isArray(provider.locations)) {
    const cityCode = Array.isArray(sessionData.city_code) ? sessionData.city_code[0] : (sessionData.city_code ?? "std:011");
    provider.locations.forEach((loc: any) => {
        if (!loc.city) loc.city = {};
        loc.city.code = cityCode;
    });
}

// NOTE: sessionData.items is NOT used here because page 1 contains no items
// Items catalog starts from on_search_seller_pagination_2 and on_search_seller_pagination_3

return existingPayload;
} 



