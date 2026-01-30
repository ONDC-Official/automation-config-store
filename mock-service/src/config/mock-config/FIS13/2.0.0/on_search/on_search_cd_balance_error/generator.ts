export async function onSearchCDBalanceErrorGenerator(existingPayload: any, sessionData: any) {


    existingPayload.message.catalog.providers.forEach((provider: { tags: any, id: string }) => {
        if (sessionData.provider_id) {
            provider.id = sessionData.provider_id;
        }
        if (sessionData.tags) {
            provider.tags = [sessionData.tags];
        }
    });

    return existingPayload;
} 
