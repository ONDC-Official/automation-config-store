
export async function onSearchSellerPagination2Generator(existingPayload: any, sessionData: any) {
  const provider = existingPayload.message.catalog.providers[0];

  if (sessionData.collected_by && provider.payments && provider.payments[0]) {
    provider.payments[0].collected_by = sessionData.collected_by;
  }

  if (sessionData.start_time && sessionData.end_time) {
    provider.time = {
      range: {
        start: sessionData.start_time,
        end: sessionData.end_time
      }
    };

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

    if (Array.isArray(provider.items)) {
      provider.items = provider.items.map((item: any) => {
        item.time = { ...item.time, ...provider.time };
        return item;
      });
    }
  }

  return existingPayload;
} 