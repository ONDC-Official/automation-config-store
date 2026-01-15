import logger from "@ondc/automation-logger";
export async function select2Generator(existingPayload: any, sessionData: any) {
  // Replace the entire items array with sessionData.items if available, then inject xinput into each item
  // let submission_id = sessionData?.user_inputs?.form_submission_id || "F01_SUBMISSION_ID"
  console.log("sessionData----", JSON.stringify(sessionData));
  logger.info(`sessionData---- ${JSON.stringify(sessionData)}`);

  let submission_id =
    sessionData?.submission_id ||
    sessionData?.form_data?.additional_details_form?.submission_id ||
    "F02_SUBMISSION_ID";

  if (
    existingPayload &&
    existingPayload.message &&
    existingPayload.message.order
  ) {
    if (Array.isArray(sessionData.selected_items)) {
      existingPayload.message.order.items = sessionData.selected_items.map(
        (item: any, index: number) => ({
          ...item,
          xinput: {
            form: {
              id: "F01",
            },
            form_response: {
              status: "SUCCESS",
              submission_id: submission_id,
            },
          },
        })
      );
    }
    if (sessionData.selected_provider) {
      existingPayload.message.order.provider = sessionData.selected_provider;
    }
    if (sessionData.selected_fulfillments) {
      existingPayload.message.order.fulfillments =
        sessionData.selected_fulfillments;
    }
  }
  return existingPayload;
}
