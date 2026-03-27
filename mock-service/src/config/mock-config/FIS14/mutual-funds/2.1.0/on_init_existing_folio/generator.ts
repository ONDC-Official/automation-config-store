import { randomUUID } from 'crypto';
import { SessionData } from "../../../session-types";
import { updateChecklist } from '../utils/updateChecklist';

export async function on_initDefaultGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("=== on_init Generator Start ===");

    // Update timestamp
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
    }

    // Update transaction_id and message_id
    if (sessionData.transaction_id && existingPayload.context) {
        existingPayload.context.transaction_id = sessionData.transaction_id;
    }
    if (sessionData.message_id && existingPayload.context) {
        existingPayload.context.message_id = sessionData.message_id;
    }

    // Update provider and item IDs
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
        //update checklist 
    }

    // Generate order ID
    if (existingPayload.message?.order) {
        if (!existingPayload.message.order.id || existingPayload.message.order.id.startsWith("ORDER")) {
            existingPayload.message.order.id = `order_${randomUUID()}`;
            console.log("Generated order.id:", existingPayload.message.order.id);
        }
    }

    // Update quote ID
    if (sessionData.quote_id && existingPayload.message?.order?.quote) {
        existingPayload.message.order.quote.id = sessionData.quote_id;
    }


    // Generate payment URL
    if (existingPayload.message?.order?.payments?.[0]) {
        const payment = existingPayload.message.order.payments[0];

        // Update collected_by from session
        if (sessionData.payment_collected_by) {
            payment.collected_by = sessionData.payment_collected_by;
        }

        if (payment.url && payment.url.startsWith("http")) {
            // Generate dynamic payment URL
            payment.url = `${process.env.PAYMENT_SERVICE || 'https://payment.example.com'}/pay/${existingPayload.message.order.id}`;
            console.log("Generated payment URL:", payment.url);
        }
    }


    // Update fulfillment type based on flow_id
    if (sessionData.flow_id && existingPayload.message?.order?.fulfillments?.[0]) {
        if (sessionData.flow_id.toLowerCase().includes('lumpsum')) {
            existingPayload.message.order.fulfillments[0].type = 'LUMPSUM';
            console.log("Updated fulfillment type to LUMPSUM based on flow_id");
        }
    }

    // Handle form response

    if (existingPayload.message?.order) {
        const now = new Date().toISOString();
        existingPayload.message.order.created_at = now;
        existingPayload.message.order.updated_at = now;
    }

    // redirection to be done
    if (existingPayload.message?.order?.xinput?.form) {
        existingPayload.message.order.xinput.form.id = "investor_details_form";
        existingPayload.message.order.xinput.form.form_response.submission_id = sessionData?.investor_details_form
    }

    console.log("=== on_select_2 Generator End ===");

    const updates = {
        APPLICATION_FORM_WITH_KYC: sessionData?.investor_details_form || "",
    };

    const updatedOrder = updateChecklist(existingPayload.message.order, updates);
    existingPayload.message.order = updatedOrder

    return existingPayload;
}
