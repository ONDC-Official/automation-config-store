/**
 * Confirm Generator for TRV14
 * 
 * Logic:
 * 1. Load fields from session: items, fulfillments, provider, billing, tags
 * 2. Update payments with transaction_id and amount from session
 * 3. Payments structure comes pre-injected from default.yaml
 */

function createItemPayload(selectedItem: any): any {
  const itemPayload: any = {
    id: selectedItem.id,
    quantity: {
      selected: {
        count: 1
      }
    }
  };

  // Add parent_item_id if it exists
  if (selectedItem.parent_item_id) {
    itemPayload.parent_item_id = selectedItem.parent_item_id;
  }

  // Add add-ons if they exist
  if (selectedItem.add_ons && Array.isArray(selectedItem.add_ons) && selectedItem.add_ons.length > 0) {
    itemPayload.add_ons = selectedItem.add_ons.map((addOn: any) => ({
      id: addOn.id,
      quantity: {
        selected: {
          count: 1
        }
      }
    }));
  }

  return itemPayload;
}
export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {
  // Select the first item (index 0)
  let selectedItem: any;
  if(sessionData.items.length > 0){
     selectedItem = sessionData.items[1];
  }
  else{
     selectedItem = sessionData.items[0];
  }
  
  // Create item payload for the selected item only (don't include parent in select payload)
  const selectedItemPayload = createItemPayload(selectedItem);

  // Update the payload with only the selected item
  existingPayload.message.order.items = [selectedItemPayload];

  // Handle provider ID
  existingPayload.message.order.provider.id = sessionData.provider_id;

  // Handle fulfillments: use 0th fulfillment ID from selected item
  if (selectedItem.fulfillment_ids && Array.isArray(selectedItem.fulfillment_ids) && selectedItem.fulfillment_ids.length > 0) {
    const selectedFulfillmentId = selectedItem.fulfillment_ids[0];
    existingPayload.message.order.fulfillments = (existingPayload.message.order.fulfillments || []).filter((f: any) =>
      f.id === selectedFulfillmentId
    );
  }

  // Update fulfillment timestamps to match context timestamp
  if (Array.isArray(existingPayload.message.order.fulfillments) && existingPayload.context?.timestamp) {
    const contextTimestamp = existingPayload.context.timestamp;
    existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
      if (Array.isArray(fulfillment.stops)) {
        fulfillment.stops.forEach((stop: any) => {
          if (stop.time?.timestamp) {
            stop.time.timestamp = contextTimestamp;
          }
        });
      }
    });
  }

  return existingPayload;
} 