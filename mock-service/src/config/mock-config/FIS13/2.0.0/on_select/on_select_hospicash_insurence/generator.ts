


export async function onSelectDefaultGenerator(existingPayload: any, sessionData: any) {
  let breakup: any[] = [];
  let totalAmt: any;
  existingPayload.context.location.city.code = sessionData?.city_code

  let orderItems: any[] = [];
  sessionData.selected_items.flat().forEach((selectedItem: any) => {
    const fullItem = sessionData.items.find((item: any) => item.id === selectedItem.id);
    if (fullItem) {
      const generalInfo = fullItem.tags?.find(
        (f: any) => f.descriptor?.code === "GENERAL_INFO"
      );

      if (generalInfo?.list) {
        const itemBreakup = generalInfo.list
          .filter((entry: any) =>
            ["BASE_PRICE", "CONVIENCE_FEE", "PROCESSING_FEE", "TAX"].includes(
              entry.descriptor?.code
            )
          )
          .map((entry: any) => ({
            title: entry.descriptor.code,
            price: {
              value: entry.value,
              currency: fullItem.price.currency,
            },
          }));

        breakup.push(...itemBreakup);

        totalAmt = (totalAmt || 0) + itemBreakup.reduce(
          (sum: number, b: any) => sum + Number(b.price.value || 0),
          0
        );
      }
      const filteredTags = fullItem.tags.map((tag: { descriptor: { code: string; }; list: any[]; }) => {
        if (tag.descriptor.code === "GENERAL_INFO") {
          return {
            descriptor: tag.descriptor,
            list: tag.list.filter((l: { descriptor: { code: string; }; }) => l.descriptor.code === "COVERAGE_AMOUNT")
          };
        }
        if (["INCLUSIONS", "EXCLUSIONS"].includes(tag.descriptor.code)) {
          return tag;
        }
        return null;
      }).filter(Boolean);

      orderItems.push({
        ...fullItem,
        tags: filteredTags
      });
    }
  });

  existingPayload.message.order.items = orderItems;
  existingPayload.message.order.quote = {
    ...(existingPayload.message.order.quote || {}),
    breakup,
    price: {
      currency: "INR",
      value: String(totalAmt),
    },
  };

  const nomineeTag = existingPayload.message.order.fulfillments
    .flatMap((f: any) => f.tags || [])
    .find((t: any) => t.descriptor?.code === "NOMINEE_DETAILS");

  if (nomineeTag?.list) {
    const nomineeField = nomineeTag.list.find(
      (l: any) => l.descriptor?.code === "NOMINEE_NAME"
    );
    if (nomineeField) {
      nomineeField.value = "-";
    }
  }


  const provider = sessionData.on_search_provider

  existingPayload.message.order.provider = {
    descriptor: provider.descriptor,
    id: provider.id,
    tags: provider.tags

  }

  return existingPayload;
} 