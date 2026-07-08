
function mergeAddOnsWithSelection(fullAddOns: any[], selectedAddOns: any[], selectedItemQuantity: number): any[] {
  return fullAddOns.map((fullAddOn: any) => {
    const selectedAddOn = selectedAddOns.find((s: any) => s.id === fullAddOn.id);
    const count = selectedAddOn?.quantity?.selected?.count ?? selectedItemQuantity ?? 1;
    return {
      ...fullAddOn,
      quantity: {
        selected: { count }
      }
    };
  });
}

function createItemWithSelection(fullItem: any, selectedItem: any): any {
  const itemPayload = { ...fullItem };
  if (selectedItem.quantity?.selected) {
    itemPayload.quantity = {
      ...itemPayload.quantity,
      selected: { count: selectedItem.quantity.selected.count }
    };
  }

  if (selectedItem.add_ons && fullItem.add_ons) {
    itemPayload.add_ons = mergeAddOnsWithSelection(fullItem.add_ons, selectedItem.add_ons, selectedItem.quantity?.selected?.count ?? 1);
  }
  return itemPayload;
}

function calculateQuote(items: any[]): any {
  const breakup: any[] = [];
  let totalValue = 0;

  const priceableItems = items.filter((item: any) =>
    item.price && item.quantity?.selected && item.price.value && item.quantity.selected.count
  );

  priceableItems.forEach((item: any) => {
    const itemPrice = parseFloat(item.price.value);
    const quantity = item.quantity.selected.count;
    const itemTotal = itemPrice * quantity;
    breakup.push({
      title: "BASE_FARE",
      item: {
        id: item.id,
        price: {
          currency: item.price.currency,
          value: item.price.value
        },
        quantity: {
          selected: {
            count: quantity
          }
        }
      },
      price: {
        currency: item.price.currency,
        value: itemTotal.toString()
      }
    });

    totalValue += itemTotal;
  });

  breakup.push({
    title: "TAX",
    price: {
      currency: "INR",
      value: "0"
    }
  });

  breakup.push({
    title: "CONVENIENCE_FEE",
    price: {
      currency: "INR",
      value: "0"
    }
  });

  priceableItems.forEach((item: any) => {
    if (item.add_ons && Array.isArray(item.add_ons)) {
      item.add_ons.forEach((addOn: any) => {
        if (addOn.price && addOn.quantity?.selected) {
          const addOnPrice = parseFloat(addOn.price.value);
          const addOnQuantity = addOn.quantity.selected.count;
          const addOnTotal = addOnPrice * addOnQuantity;
          breakup.push({
            title: "ADD_ONS",
            item: {
              id: item.id,
              add_ons: [{ id: addOn.id }]
            },
            price: {
              currency: addOn.price.currency,
              value: addOnTotal.toString()
            }
          });
          totalValue += addOnTotal;
        }
      });
    }
  });
  return {
    breakup,
    price: {
      currency: "INR",
      value: totalValue.toString()
    }
  };
}

export async function onSelectDefaultGenerator(existingPayload: any, sessionData: any) {

  const responseItems: any[] = [];
  const addedParentIds: Set<string> = new Set();

  sessionData.selected_items.forEach((selectedItem: any) => {
    const fullItem = sessionData.items.find((item: any) => item.id === selectedItem.id);
    if (fullItem) {
      if (fullItem.parent_item_id && !addedParentIds.has(fullItem.parent_item_id)) {
        const parentItem = sessionData.items.find((item: any) => item.id === fullItem.parent_item_id);
        if (parentItem) {
          const parentItemCopy = { ...parentItem };

          delete parentItemCopy.cancellation_terms;
          delete parentItemCopy.replacement_terms;

          responseItems.push(parentItemCopy);
          addedParentIds.add(fullItem.parent_item_id);
        }
      }
      delete fullItem.cancellation_terms;
      delete fullItem.replacement_terms;

      const mergedItem = createItemWithSelection(fullItem, selectedItem);
      responseItems.push(mergedItem);
    }
  });

  existingPayload.message.order.items = responseItems;

  existingPayload.message.order.quote = calculateQuote(responseItems);

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments?.filter((fulfillment: any) => fulfillment.id === sessionData.selected_fulfillments[0].id);
  }

  // Update locations city codes dynamically under provider
  const provider = existingPayload.message.order.provider;
  if (provider && Array.isArray(provider.locations)) {
    const cityCode = Array.isArray(sessionData.city_code) ? sessionData.city_code[0] : (sessionData.city_code ?? "std:011");
    provider.locations.forEach((loc: any) => {
      if (!loc.city) loc.city = {};
      loc.city.code = cityCode;
    });
  }

  existingPayload.message.order.xinput = {
    head: {
      descriptor: {
        name: "Additional Details"
      },
      index: {
        min: 0,
        cur: 0,
        max: 0
      },
      headings: [
        "ADDITIONAL_DETAILS"
      ]
    },
    form: {
      id: "first_form_testing",
      mime_type: "text/html",
      url: `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/additional_details_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`,
      resubmit: false,
    },
    required: true
  };

  return existingPayload;
}