

export async function onUpdateSoftPartialCancellationGenerator(existingPayload: any, sessionData: any) {

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }


  existingPayload.message.order.status = "SOFT_CANCEL";


  if (sessionData.items) {
    const items = [...sessionData.items];


    const selectedItem = sessionData.selected_items?.[0];
    const updatedItem = sessionData.updated_items;
    if (selectedItem) {
      const itemIndex = items.findIndex((item: any) => item.id === selectedItem.id);
      if (itemIndex < 0) {

        items[itemIndex] = {
          ...items[itemIndex],
          quantity: {
            ...items[itemIndex].quantity,
            selected: {
              count: 1
            }
          }
        };

        if (items[itemIndex].add_ons) {
          items[itemIndex].add_ons = items[itemIndex].add_ons.map((addOn: any) => ({
            ...addOn,
            quantity: {
              selected: {
                count: updatedItem.add_ons[0].quantity.selected.count
              }
            }
          }));
        }
      }
    }

    existingPayload.message.order.items = items;
  }


  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.payments) {
    existingPayload.message.order.payments = sessionData.payments;
  }


  if (sessionData.tags) {
    existingPayload.message.order.tags = sessionData.tags;
  }


  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms?.flat();
  }

  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms?.flat();
  }


  const selectedItem = sessionData.selected_items?.[0];
  const updatedItem = sessionData.updated_items;
  const cancelItemQty = Math.max(selectedItem.quantity.selected.count - updatedItem.quantity.selected.count, 0)
  if (sessionData.quote && selectedItem) {
    const breakup = [...sessionData.quote.breakup];
    const addOnItemPrice = sessionData.items[1].add_ons[0].price;
    const itemPrice = sessionData.items[1].price


    let refundAmount = cancelItemQty * Number(itemPrice.value);


    if (selectedItem.add_ons) {
      refundAmount = Number(refundAmount) + Number(addOnItemPrice.value)
    }


    breakup.push({
      title: "REFUND",
      item: {
        id: selectedItem.id,
        price: {
          currency: itemPrice?.currency || "INR",
          value: `-${(cancelItemQty * itemPrice.value).toFixed(2)}`
        },
        quantity: {
          selected: {
            count: cancelItemQty
          }
        },
        ...(selectedItem.add_ons && {
          add_ons: selectedItem.add_ons.map((addOn: any) => ({
            id: addOn.id,
            price: {
              currency: addOnItemPrice.currency || "INR",
              value: addOnItemPrice.value
            }
          }))
        })
      },
      price: {
        currency: selectedItem.price?.currency || "INR",
        value: `-${refundAmount}`
      }
    });

    breakup.push({
      title: "CANCELLATION_CHARGES",
      price: {
        currency: "INR",
        value: "0"
      }
    });


    const originalTotal = parseFloat(sessionData.quote.price.value);
    const newTotal = originalTotal - refundAmount;

    existingPayload.message.order.quote = {
      breakup,
      price: {
        currency: sessionData.quote.price.currency || "INR",
        value: newTotal.toString()
      }
    };
  }

  const finalSettlementAmount = Number(existingPayload.message.order.quote.price.value) * 99 / 100;
  if (sessionData.tags) {
    existingPayload.message.order.tags = sessionData.tags.map((tag: any) => {
      if (tag.descriptor?.code === "BPP_TERMS") {
        return {
          ...tag,
          list: tag.list.map((item: any) => {
            if (item.descriptor?.code === "SETTLEMENT_AMOUNT") {
              return {
                ...item,
                value: finalSettlementAmount.toFixed(2)
              };
            }
            return item;
          })
        };
      }
      return tag;
    });
  }
  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  return existingPayload;
}