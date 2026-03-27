import { randomUUID } from 'crypto';
import { SessionData } from "../../../session-types";
import { updateChecklist } from '../utils/updateChecklist';

export async function on_confirmDefaultGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("=== on_confirm Generator Start ===");

    // Update timestamp
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
    }

    // Update IDs from session
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
    }

    // Update order ID
    if (sessionData.order_id && existingPayload.message?.order) {
        existingPayload.message.order.id = sessionData.order_id;
    }

    // Generate folio number (mutual funds specific)
    if (existingPayload.message?.order?.items?.[0]?.tags) {
        const folioTag = existingPayload.message.order.items[0].tags.find(
            (tag: any) => tag.descriptor?.code === 'FOLIO_INFO'
        );
        if (folioTag && folioTag.list) {
            const folioItem = folioTag.list.find(
                (item: any) => item.descriptor?.code === 'FOLIO_NUMBER'
            );
            if (folioItem) {
                // Generate or use existing folio number
                const folioNumber = sessionData.folio_number || `FN${Date.now()}`;
                folioItem.value = folioNumber;
                console.log("Generated/Updated folio number:", folioNumber);
            }
        }
    }

    // Generate dynamic form URL for payment mandate
    if (existingPayload.message?.order?.items?.[0]?.xinput?.form) {
        const form = existingPayload.message.order.items[0].xinput.form;

        // Generate form ID for payment mandate
        const formId = `form_${randomUUID()}`;
        form.id = formId;

        // Generate dynamic form URL
        const formUrl = `${process.env.FORM_SERVICE || 'http://localhost:3001'}/forms/${sessionData.domain}/payment_mandate_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;
        form.url = formUrl;

        console.log("Generated payment mandate form URL:", formUrl);
    }


    // Update fulfillment type based on flow_id
    if (sessionData.flow_id && existingPayload.message?.order?.fulfillments?.[0]) {
        if (sessionData.flow_id.toLowerCase().includes('lumpsum')) {
            existingPayload.message.order.fulfillments[0].type = 'LUMPSUM';
            console.log("Updated fulfillment type to LUMPSUM based on flow_id");
        }
    }


    // Update payment collected_by from session
    if (sessionData.payment_collected_by && existingPayload.message?.order?.payments?.[0]) {
        existingPayload.message.order.payments[0].collected_by = sessionData.payment_collected_by;
        const paymentUrl = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/payment_url_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;
        existingPayload.message.order.payments[0].url = paymentUrl;

    }

    if (existingPayload.message?.order) {
        const now = new Date().toISOString();
        existingPayload.message.order.created_at = now;
        existingPayload.message.order.updated_at = now;
    }

    const submission_id = sessionData?.form_data?.E_sign_verification_status?.form_submission_id || sessionData?.E_sign_verification_status

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
    const formId = sessionData?.form_id || "E_sign_verification_status";
    if (existingPayload.message?.order?.xinput?.form) {
        existingPayload.message.order.xinput.form.id = formId
    }
    console.log("=== on_confirm Generator End ===");

    const updates = {
        APPLICATION_FORM_WITH_KYC: sessionData?.investor_details_form || "",
        KYC: sessionData.verification_status || "",
        ESIGN: sessionData.E_sign_verification_status || ""
    };

    const updatedOrder = updateChecklist(existingPayload.message.order, updates);
    existingPayload.message.order = updatedOrder
    return existingPayload;
}
