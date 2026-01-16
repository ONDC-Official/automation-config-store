/**
 * On_Init Generator for TRV14
 * 
 * Logic:
 * 1. Reuse data from session: items, fulfillments, provider, quote, cancellation_terms, replacement_terms, payments, billing, tags
 * 2. Combine bpp_terms and bap_terms from session into tags array
 * 3. No xinput injection needed for on_init
 */

export async function onInitGenerator(existingPayload: any, sessionData: any) {
  // Reuse data from session (same as on_select_2)
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms?.flat();
  }

  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms?.flat();
  }

  if (sessionData.payments) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  // Combine bpp_terms and bap_terms from session into tags array
  const tags = [];
  const settlemntAmount = (sessionData.quote.price.value / 100)

  const bapTerms =
  {
    "descriptor": {
      "code": "BAP_TERMS",
      "name": "BAP Terms of Engagement"
    },
    "display": false,
    "list": [
      {
        "descriptor": {
          "code": "BUYER_FINDER_FEES_PERCENTAGE"
        },
        "value": "1"
      },
      {
        "descriptor": {
          "code": "BUYER_FINDER_FEES_TYPE"
        },
        "value": "percent"
      },
      {
        "descriptor": {
          "code": "STATIC_TERMS"
        },
        "value": "https://dev-automation.ondc.org/booking/terms"
      },
      {
        "descriptor": {
          "code": "SETTLEMENT_BASIS"
        },
        "value": "INVOICE_RECEIPT"
      },
      {
        "descriptor": {
          "code": "SETTLEMENT_WINDOW"
        },
        "value": "P30D"
      }
    ]

  }
  tags.push(bapTerms)
  // Add BPP Terms structure
  const bppTerms = {
    "descriptor": {
      "code": "BPP_TERMS",
      "name": "BPP Terms of Engagement"
    },
    "display": false,
    "list": [
      {
        "descriptor": {
          "code": "BUYER_FINDER_FEES_PERCENTAGE"
        },
        "value": "1"
      },
      {
        "descriptor": {
          "code": "BUYER_FINDER_FEES_TYPE"
        },
        "value": "percent"
      },
      {
        "descriptor": {
          "code": "STATIC_TERMS"
        },
        "value": "https://dev-automation.ondc.org/booking/terms"
      },
      {
        "descriptor": {
          "code": "MANDATORY_ARBITRATION"
        },
        "value": "true"
      },
      {
        "descriptor": {
          "code": "COURT_JURISDICTION"
        },
        "value": "std:011"
      },
      {
        "descriptor": {
          "code": "DELAY_INTEREST"
        },
        "value": "2.5 %"
      },
      {
        "descriptor": {
          "code": "SETTLEMENT_AMOUNT"
        },
        "value": `${(sessionData.quote.price.value - settlemntAmount).toFixed(2)}`
      },
      {
        "descriptor": {
          "code": "SETTLEMENT_TYPE"
        },
        "value": "upi"
      },
      {
        "descriptor": {
          "code": "SETTLEMENT_BANK_CODE"
        },
        "value": "XXXXXXXX"
      },
      {
        "descriptor": {
          "code": "SETTLEMENT_BANK_ACCOUNT_NUMBER"
        },
        "value": "xxxxxxxxxxxxxx"
      }
    ]
  };

  tags.push(bppTerms);


  // Set the combined tags array
  if (tags.length > 0) {
    existingPayload.message.order.tags = tags;
  }

  return existingPayload;
} 
