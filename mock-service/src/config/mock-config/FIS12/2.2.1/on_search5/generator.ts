import axios from "axios";
import { loadMockSessionData } from "../../../../../services/data-services";
import { randomUUID } from "node:crypto";

export async function onSearchDefaultGenerator(existingPayload: any, sessionData: any) {
  console.log("existingPayload on search", sessionData.form_data);
  console.log("existingPayload on searchFROM", JSON.stringify(sessionData.form_data));

  // Set payment_collected_by if present in session data
  if (sessionData.collected_by && existingPayload.message?.catalog?.providers?.[0]?.payments?.[0]) {
    existingPayload.message.catalog.providers[0].payments[0].collected_by = sessionData.collected_by;
  }

  // Update message_id from session data
  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  console.log("sessionData.message_id", JSON.stringify(sessionData));
  if (sessionData.provider_id) {
    existingPayload.message.catalog.providers[0].id = sessionData.provider_id
  }

  if (sessionData?.categories) {
    existingPayload.message.catalog.providers[0].categories = sessionData.categories
  }
  // Extract customer ID from session data
  const form_data = await loadMockSessionData(`form_data_${sessionData.transaction_id}`, "");
  console.log("mockSessionDatamockSessionData", JSON.stringify(form_data))
  sessionData.form_data = form_data
  const contactNumber = sessionData.form_data?.personal_details_information_form?.contactNumber;

  //Inject Random consent handler into payload tags
  // if (existingPayload.message?.catalog?.providers?.[0]?.items?.[0]) {
  //   const item = existingPayload.message.catalog.providers[0].items[0];
  //   item.xinput = sessionData.selected_items_xinput
  //   // Initialize tags array if it doesn't exist
  //   if (!item.tags) {
  //     item.tags = [];
  //   }

  //   // Find existing CONSENT_INFO tag or create new one
  //   let consentInfoTag = item.tags.find((tag: any) =>
  //     tag.descriptor?.code === 'CONSENT_INFO'
  //   );

  //   if (!consentInfoTag) {
  //     // Create new CONSENT_INFO tag structure
  //     consentInfoTag = {
  //       descriptor: {
  //         code: 'CONSENT_INFO',
  //         name: 'Consent Information'
  //       },
  //       list: [],
  //       display: false
  //     };
  //     item.tags.push(consentInfoTag);
  //   }

  //   // Update or add CONSENT_HANDLER in the list
  //   const consentHandlerItem = {
  //     descriptor: {
  //       code: 'CONSENT_HANDLER',
  //       name: 'Consent Handler'
  //     },
  //     value: randomUUID()
  //   };

  //   // Find and update existing CONSENT_HANDLER or add new one
  //   const existingHandlerIndex = consentInfoTag.list?.findIndex((item: any) =>
  //     item.descriptor?.code === 'CONSENT_HANDLER'
  //   );

  //   if (existingHandlerIndex !== undefined && existingHandlerIndex >= 0) {
  //     consentInfoTag.list[existingHandlerIndex] = consentHandlerItem;
  //     console.log("Updated existing CONSENT_HANDLER in tags");
  //   } else {
  //     if (!consentInfoTag.list) {
  //       consentInfoTag.list = [];
  //     }
  //     consentInfoTag.list.push(consentHandlerItem);
  //     console.log("Added new CONSENT_HANDLER to tags");
  //   }

  //   console.log("✅ Finvu AA integration successful - consent handler injected into payload");
  // } else {
  //   console.warn("⚠️ Cannot inject consent handler - items[0] not found in payload");
  // }

  if (contactNumber) {
    const custId = `${contactNumber}@finvu`;
    console.log("Customer ID for consent:", custId);

    try {
      // Call Finvu AA Service to generate consent handler
      const finvuServiceUrl = process.env.FINVU_AA_SERVICE_URL || 'http://localhost:3002';
      const consentUrl = `${finvuServiceUrl}/finvu-aa/consent/generate`;

      console.log("Calling Finvu AA Service:", consentUrl);

      const consentRequest = {
        custId: custId,
        templateName: "FINVUDEMO_TESTING",
        consentDescription: "Purchase Finance Account Aggregator Consent",
        redirectUrl: "https://google.co.in"
      };

      console.log("Consent request payload:", consentRequest);

      const response = await axios.post(consentUrl, consentRequest, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      const consentHandler = response.data.consentHandler;
      console.log("✅ Consent handler generated:", consentHandler);

      // Store consent handler in session data for later use (verify step)
      sessionData.consent_handler = consentHandler;
      console.log("Stored consent_handler in session data");

      // Inject consent handler into payload tags
      if (existingPayload.message?.catalog?.providers?.[0]?.items?.[0]) {
        const item = existingPayload.message.catalog.providers[0].items[0];
        item.xinput = sessionData.selected_items_xinput
        // Initialize tags array if it doesn't exist
        if (!item.tags) {
          item.tags = [];
        }

        // Find existing CONSENT_INFO tag or create new one
        let consentInfoTag = item.tags.find((tag: any) =>
          tag.descriptor?.code === 'CONSENT_INFO'
        );

        if (!consentInfoTag) {
          // Create new CONSENT_INFO tag structure
          consentInfoTag = {
            descriptor: {
              code: 'CONSENT_INFO',
              name: 'Consent Information'
            },
            list: [],
            display: false
          };
          item.tags.push(consentInfoTag);
        }

        // Update or add CONSENT_HANDLER in the list
        const consentHandlerItem = {
          descriptor: {
            code: 'CONSENT_HANDLER',
            name: 'Consent Handler'
          },
          value: consentHandler
        };

        // Find and update existing CONSENT_HANDLER or add new one
        const existingHandlerIndex = consentInfoTag.list?.findIndex((item: any) =>
          item.descriptor?.code === 'CONSENT_HANDLER'
        );

        if (existingHandlerIndex !== undefined && existingHandlerIndex >= 0) {
          consentInfoTag.list[existingHandlerIndex] = consentHandlerItem;
          console.log("Updated existing CONSENT_HANDLER in tags");
        } else {
          if (!consentInfoTag.list) {
            consentInfoTag.list = [];
          }
          consentInfoTag.list.push(consentHandlerItem);
          console.log("Added new CONSENT_HANDLER to tags");
        }

        console.log("✅ Finvu AA integration successful - consent handler injected into payload");
      } else {
        console.warn("⚠️ Cannot inject consent handler - items[0] not found in payload");
      }

    } catch (error: any) {
      console.error("❌ Finvu AA consent generation failed:", error.message);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code
      });

      // Fail-safe: Continue without consent handler (or you can throw error to stop flow)
      console.warn("⚠️ Continuing without consent handler due to error");
    }
  } else {
    console.warn("⚠️ No contact number found in session data - skipping Finvu AA integration");
    console.log("Available form data:", sessionData.form_data);
  }


  // Update form URLs for items with session data (preserve existing structure)
  if (existingPayload.message?.catalog?.providers?.[0]?.items) {
    existingPayload.message.catalog.providers[0].items = existingPayload.message.catalog.providers[0].items.map((item: any) => {
      if (sessionData.item_id) {
        item.id = sessionData.item_id
      }
      item.category_ids = sessionData.item.category_ids
      if (item.xinput?.form) {
        item.xinput.form.id = "personal_details_information_form";
        item.xinput.form_response.status = "SUCCESS";
        item.xinput.form_response.submission_id = sessionData.personal_details_information_form;
        console.log("Updated form_response with status and submission_id");
      }
      return item;
    });
  }

  console.log("session data of on_search", sessionData);
  return existingPayload;
} 