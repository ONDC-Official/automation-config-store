import { randomUUID } from 'crypto';
import { SessionData } from "../../../session-types";

export async function confirmDefaultGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("=== confirm Generator Start ===");

    // Update timestamp
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
        existingPayload.context.action = "confirm";
    }

    // Update transaction_id
    if (sessionData.transaction_id && existingPayload.context) {
        existingPayload.context.transaction_id = sessionData.transaction_id;
    }

    // Generate new message_id for confirm
    if (existingPayload.context) {
        existingPayload.context.message_id = randomUUID();
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
    }

    // Update order ID from session (from on_init)
    if (sessionData.order_id && existingPayload.message?.order) {
        existingPayload.message.order.id = sessionData.order_id;
    }

    // Update quote ID
    if (sessionData.quote_id && existingPayload.message?.order?.quote) {
        existingPayload.message.order.quote.id = sessionData.quote_id;
    }

    const submission_id = sessionData?.flow_id === "Lumpsum_New_Folio" ? sessionData?.investor_details_form : sessionData?.form_data?.E_sign_verification_status?.form_submission_id || sessionData?.E_sign_verification_status

    if (existingPayload.message?.order?.xinput?.form_response) {
        if (submission_id) {
            existingPayload.message.order.xinput.form_response.status = "SUCCESS"

            existingPayload.message.order.xinput.form_response.submission_id = submission_id;
            console.log("Updated form_response with submission_id:", submission_id);
        } else {
            console.warn("⚠️ No submission_id found for E_sign_verification_status");
        }
    }

    // Ensure form ID matches from on_select
    const formId = sessionData.flow_id === "Lumpsum_New_Folio" ? "investor_details_form" : sessionData?.form_id || "E_sign_verification_status";
    if (existingPayload.message?.order?.xinput?.form) {
        existingPayload.message.order.xinput.form.id = formId
    }
    console.log("=== confirm Generator End ===");

    if (sessionData.flow_id === "Lumpsum_Existing_Folio") {
        existingPayload.message.order.fulfillments[0].customer.person.creds = [
            {
                "id": "1562162434/45",
                "type": "FOLIO"
            },
            {
                "id": "115.245.207.90",
                "type": "IP_ADDRESS"
            }
        ]

        delete existingPayload.message?.order?.xinput;
    }
    return existingPayload;
}
