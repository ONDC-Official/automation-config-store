

export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {

  existingPayload.context.location.city.code = sessionData?.city_code
  existingPayload.message.catalog.providers.forEach((provider: { tags: any[], id: string }) => {
    provider.id = sessionData.provider_id,
      provider.tags.forEach((tag: { descriptor: { code: string; }; list: any[]; }) => {
        if (tag.descriptor.code === "MASTER_POLICY") {
          tag.list.forEach((item: { descriptor: { code: string; }; value: any; }) => {
            if (item.descriptor.code === "POLICY_ID") {
              item.value = sessionData.policy_id;
            }
          });
        }
      });
  });
  return existingPayload;
} 