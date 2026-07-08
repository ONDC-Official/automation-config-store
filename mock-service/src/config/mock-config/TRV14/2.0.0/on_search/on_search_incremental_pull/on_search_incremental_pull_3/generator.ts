



import dayjs from "dayjs";


function getRandomDateBetween(start: any, end: any) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diff = endDate.diff(startDate, 'day');
  const randomOffset = Math.floor(Math.random() * (diff + 1));
  return startDate.add(randomOffset, 'day');
}

export async function onSearchIncrementalPull3Generator(existingPayload: any, sessionData: any) {
  const provider = existingPayload.message.catalog.providers[0];
  
  // Set collected_by from session data
  if (sessionData.collected_by && provider.payments && provider.payments[0]) {
    provider.payments[0].collected_by = sessionData.collected_by;
  }
  
  // Set tags (includes business terms and pagination info)
  // if (sessionData.tags) {
  //   existingPayload.message.catalog.tags .push( sessionData.tags);
  // }
  
  // Set dynamic timerange with random date generation
  if (sessionData.start_time && sessionData.end_time) {
    const startTime = Array.isArray(sessionData.start_time) ? sessionData.start_time[0] : sessionData.start_time;
    const endTime = Array.isArray(sessionData.end_time) ? sessionData.end_time[0] : sessionData.end_time;
    provider.time = {
      range: {
        start: startTime,
        end: endTime
      }
    };

    // Update city codes in locations dynamically
    if (provider && Array.isArray(provider.locations)) {
      const cityCode = Array.isArray(sessionData.city_code) ? sessionData.city_code[0] : (sessionData.city_code ?? "std:011");
      provider.locations.forEach((loc: any) => {
        if (!loc.city) loc.city = {};
        loc.city.code = cityCode;
      });
    }
    
    // ADVANCED: Set fulfillments stops time fields to match provider time window
    // Handles both timestamp and range formats for maximum compatibility
    if (Array.isArray(provider.fulfillments)) {
      provider.fulfillments.forEach((fulfillment: any) => {
        if (Array.isArray(fulfillment.stops)) {
          fulfillment.stops.forEach((stop: any) => {
            if (stop.time) {
              if ('timestamp' in stop.time) {
                stop.time.timestamp = provider.time.range.start;
              }
              if ('range' in stop.time) {
                stop.time.range.start = provider.time.range.start;
                stop.time.range.end = provider.time.range.end;
              }
            }
          });
        }
      });
    }

    // Sync item times with provider time if items exist in template
    if (Array.isArray(provider.items)) {
      provider.items = provider.items.map((item: any) => {
        // Merge provider time with existing item time properties from template
        item.time = { ...item.time, ...provider.time };
        return item;
      });
    }
  }

  // NOTE: Items come from existingPayload (default.yaml template), NOT from sessionData
  // sessionData.items doesn't exist yet during on_search generation
  // Items will be saved to session AFTER this response is generated

  return existingPayload;
} 