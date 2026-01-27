export async function onSearchGenerator(existingPayload: any, sessionData: any) {
    existingPayload.context.location.city.code = sessionData?.city_code
    existingPayload.message.catalog.providers.forEach((provider: { tags: any, id: string }) => {
        provider.tags = [sessionData.tags]
        provider.id = sessionData.provider_id
    })
    return existingPayload;
} 