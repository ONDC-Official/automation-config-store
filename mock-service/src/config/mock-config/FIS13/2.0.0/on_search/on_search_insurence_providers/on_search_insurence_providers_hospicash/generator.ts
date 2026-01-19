export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {

    if (sessionData.collected_by && existingPayload.message?.catalog?.providers?.[0]?.payments?.[0]) {
        existingPayload.message.catalog.providers[0].payments[0].collected_by = sessionData.collected_by;
    }
    existingPayload.context.location.city.code= sessionData?.city_code

    if (sessionData.start_time && sessionData.end_time) {
       existingPayload.message.catalog.providers[0].time = {
            range: {
                 start: sessionData.start_time,
                end: sessionData.end_time
            }
        };
    }
  return existingPayload;
} 