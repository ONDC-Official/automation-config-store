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
              currency: fullItem.price?.currency || "INR",
            },
          }));

        breakup.push(...itemBreakup);

        totalAmt = (totalAmt || 0) + itemBreakup.reduce(
          (sum: number, b: any) => sum + Number(b.price.value || 0),
          0
        );
      }
      const excludedCodes = [
        "BASE_PRICE",
        "CONVIENCE_FEE",
        "PROCESSING_FEE",
        "TAX",
        "OFFER_VALIDITY"
      ];

      const filteredTags = fullItem.tags
        .map((tag: { descriptor: { code: string }; list: any[] }) => {
          if (["GENERAL_INFO", "INCLUSIONS", "EXCLUSIONS"].includes(tag.descriptor.code)) {
            const filteredList = tag.list?.filter(
              (item) => !excludedCodes.includes(item.descriptor?.code)
            );
            return { ...tag, list: filteredList };
          }
          return null;
        })
        .filter(Boolean);

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