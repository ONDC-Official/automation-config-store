import { randomUUID } from 'crypto';
import { SessionData } from "../../../session-types";
import { updateChecklist } from '../utils/updateChecklist';

export async function on_update_unsolicitedDefaultGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("=== on_update_unsolicited Generator Start ===");

    // Update timestamp
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
    }

    // Update IDs from session
    if (sessionData.transaction_id && existingPayload.context) {
        existingPayload.context.transaction_id = sessionData.transaction_id;
    }

    // Generate new message_id for unsolicited callback
    if (existingPayload.context) {
        existingPayload.context.message_id = randomUUID();
    }

    // Update order ID
    if (sessionData.order_id && existingPayload.message?.order) {
        existingPayload.message.order.id = sessionData.order_id;
    }

    // Update folio number from session
    if (sessionData.folio_number && existingPayload.message?.order?.items?.[0]?.tags) {
        const folioTag = existingPayload.message.order.items[0].tags.find(
            (tag: any) => tag.descriptor?.code === 'FOLIO_INFO'
        );
        if (folioTag && folioTag.list) {
            const folioItem = folioTag.list.find(
                (item: any) => item.descriptor?.code === 'FOLIO_NUMBER'
            );
            if (folioItem) {
                folioItem.value = sessionData.folio_number;
            }
        }
    }

    // Update SIP status to ACTIVE
    if (existingPayload.message?.order) {
        existingPayload.message.order.status = "ACTIVE";
        console.log("Updated order status to ACTIVE (SIP activated)");
    }

    // Update fulfillment status
    if (existingPayload.message?.order?.fulfillments?.[0]) {
        existingPayload.message.order.fulfillments[0].state = {
            descriptor: {
                code: "ACTIVE",
                name: "SIP Active"
            }
        };
    }

    if (existingPayload.message?.order) {
        const now = new Date().toISOString();
        existingPayload.message.order.created_at = sessionData.order.created_at;
        existingPayload.message.order.updated_at = now;
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
    console.log("=== on_update_unsolicited Generator End ===");
    return existingPayload;
}
