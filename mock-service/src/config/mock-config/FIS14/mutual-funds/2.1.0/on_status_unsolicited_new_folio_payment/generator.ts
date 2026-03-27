import { randomUUID } from 'crypto';
import { updateChecklist } from '../utils/updateChecklist';

export async function on_status_unsolicitedDefaultGenerator(
    existingPayload: any,
    sessionData: any
) {
    if (existingPayload.context) {
        existingPayload.context.timestamp = new Date().toISOString();
    }

    console.log("sessionData for on_status", sessionData);

    // Update transaction_id and message_id from session data (carry-forward mapping)
    if (sessionData.transaction_id && existingPayload.context) {
        existingPayload.context.transaction_id = sessionData.transaction_id;
    }

    if (sessionData.message_id && existingPayload.context) {
        existingPayload.context.message_id = randomUUID();
    }

    // Update provider information from session data (carry-forward from previous flows)
    if (sessionData?.order) {
        sessionData.order.payments = existingPayload.message.order.payments
        existingPayload.message.order = sessionData?.order || {};
        if (existingPayload.message?.order) {
            const order = existingPayload.message.order;
            order.xinput = {
                "form": {
                    "id": "F04"
                },
                "form_response": {
                    "status": "SUBMITTED",
                    "submission_id": "F04_SUBMISSION_ID"
                }
            }
            if (order.xinput?.form) {
                // Use form ID from session data or default to FO3 (from on_select_2/on_status_unsolicited)
                const formId = sessionData.form_id || "E_sign_verification_status";
                order.xinput.form.id = formId;
                console.log("Updated form ID:", formId);

                const submission_id =
                    formId === "E_sign_verification_status"
                        ? sessionData.E_sign_verification_status : sessionData.verification_status;

                // const form_status =
                //     formId === "E_sign_verification_status"
                //         ? sessionData?.form_data?.E_sign_verification_status?.idType
                //         : formId === "Emanadate_verification_status" ? sessionData?.form_data?.Emanadate_verification_status?.idType
                //             : sessionData?.form_data?.Ekyc_details_verification_status?.idType;
                // Set form status to OFFLINE_PENDING
                if (order.xinput?.form_response) {
                    if (submission_id) {
                        order.xinput.form_response.submission_id = submission_id;
                    }
                }

            }
        }
    }

    // Set created_at and updated_at to current timestamp
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
    return existingPayload;
}
