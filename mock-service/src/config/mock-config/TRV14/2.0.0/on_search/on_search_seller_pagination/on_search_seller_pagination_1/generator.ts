
export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {

    if (sessionData.collected_by && existingPayload.message?.catalog?.providers?.[0]?.payments?.[0]) {
        existingPayload.message.catalog.providers[0].payments[0].collected_by = sessionData.collected_by;
    }


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

    const provider = existingPayload.message?.catalog?.providers?.[0];
    if (provider && Array.isArray(provider.locations)) {
        const cityCode = Array.isArray(sessionData.city_code) ? sessionData.city_code[0] : (sessionData.city_code ?? "std:011");
        provider.locations.forEach((loc: any) => {
            if (!loc.city) loc.city = {};
            loc.city.code = cityCode;
        });
    }



    return existingPayload;
} 