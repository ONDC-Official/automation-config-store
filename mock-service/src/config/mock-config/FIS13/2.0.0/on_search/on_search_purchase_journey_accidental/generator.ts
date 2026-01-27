export async function onSearchGenerator(existingPayload: any, sessionData: any) {
    existingPayload.context.location.city.code = sessionData?.city_code

    existingPayload.message.catalog.providers.forEach((provider: { tags: any, id: string }) => {
        provider.id = sessionData.provider_id,
            provider.tags = [sessionData.tags]
    })

    return existingPayload;
} 