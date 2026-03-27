import { randomUUID } from 'crypto';
import { SessionData } from "../../../session-types";
import { updateChecklist } from '../utils/updateChecklist';

export async function on_select_2DefaultGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("=== on_select_2 Generator Start ===");

    // Update timestamp and IDs
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
    }

    // Update transaction_id and message_id from session
    if (sessionData.transaction_id && existingPayload.context) {
        existingPayload.context.transaction_id = sessionData.transaction_id;
    }
    if (sessionData.message_id && existingPayload.context) {
        existingPayload.context.message_id = sessionData.message_id;
    }

    // Update provider and item from session
    const selectedProvider = sessionData.selected_provider || sessionData.provider_id;
    if (selectedProvider && existingPayload.message?.order?.provider) {
        if (typeof selectedProvider === 'string') {
            existingPayload.message.order.provider.id = selectedProvider;
        } else if (selectedProvider.id) {
            existingPayload.message.order.provider.id = selectedProvider.id;
        }
    }

    const selectedItem = sessionData.selected_item_id || sessionData.item;
    if (selectedItem && existingPayload.message?.order?.items?.[0]) {
        if (typeof selectedItem === 'string') {
            existingPayload.message.order.items[0].id = selectedItem;
        } else if (selectedItem.id) {
            existingPayload.message.order.items[0].id = selectedItem.id;
        }
    }

    // Generate quote ID
    if (existingPayload.message?.order?.quote) {
        if (!existingPayload.message.order.quote.id || existingPayload.message.order.quote.id.startsWith("QUOTE")) {
            existingPayload.message.order.quote.id = `quote_${randomUUID()}`;
            console.log("Generated quote.id:", existingPayload.message.order.quote.id);
        }
    }

    if (existingPayload.message?.order?.xinput?.form) {
        existingPayload.message.order.xinput.form.id = "investor_details_form";
        existingPayload.message.order.xinput.form_response.submission_id = sessionData?.investor_details_form
    }

    console.log("=== on_select_2 Generator End ===");

    const updates = {
        APPLICATION_FORM: sessionData?.investor_details_form || "",
    };

    const updatedOrder = updateChecklist(existingPayload.message.order, updates);
    existingPayload.message.order = updatedOrder
    return existingPayload
}
