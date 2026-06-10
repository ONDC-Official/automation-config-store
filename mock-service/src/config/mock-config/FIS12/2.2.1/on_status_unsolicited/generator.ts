
export async function onStatusUnsolicitedGenerator(
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
    existingPayload.context.message_id = crypto.randomUUID();
  }

  // Update provider information from session data (carry-forward from previous flows)
  if (sessionData?.order) {
    existingPayload.message.order = sessionData?.order || {};
    if (existingPayload.message?.order?.items?.[0]) {
      const item = existingPayload.message.order.items[0];
      item.xinput = {
        "form": {
          "id": "F04"
        },
        "form_response": {
          "status": sessionData?.flow_id?.includes("Single_Redirection") ? "PENDING" : "SUCCESS",
          "submission_id": "F04_SUBMISSION_ID"
        }
      }
      if (item.xinput?.form) {
        // Use form ID from session data or default to FO3 (from on_select_2/on_status_unsolicited)
        const formId = sessionData.form_id || "E_sign_verification_status";
        item.xinput.form.id = formId;
        console.log("Updated form ID:", formId);

        const submission_id =
          formId === "Ekyc_details_verification_status"
            ? sessionData.Ekyc_details_verification_status : formId === "Emanadate_verification_status" ? sessionData.Emanadate_verification_status
              : sessionData.E_sign_verification_status;

        const form_status =
          formId === "E_sign_verification_status"
            ? sessionData?.form_data?.E_sign_verification_status?.idType
            : formId === "Emanadate_verification_status" ? sessionData?.form_data?.Emanadate_verification_status?.idType
              : sessionData?.form_data?.Ekyc_details_verification_status?.idType;

        if (item.xinput?.form_response) {
          item.xinput.form_response.status = sessionData?.flow_id?.includes("Single_Redirection") ? "PENDING" : form_status || "APPROVED";
          if (submission_id) {
            item.xinput.form_response.submission_id = submission_id;
          }
        }
      }
    }
  }
  return existingPayload;
}
