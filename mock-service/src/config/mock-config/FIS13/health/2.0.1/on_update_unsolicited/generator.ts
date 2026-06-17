
import { resolveSessionIds, applyResolvedIdsToPayload, updateProposalIdTag, applyFlowTypeOverrides } from '../id-helper';

export async function onUpdateUnsolicitedDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }

  // Generate new message_id for unsolicited update
   if (sessionData.message_id && existingPayload.context) {
     existingPayload.context.message_id = crypto.randomUUID();
  }
  // Setupdated_at to current date
  if (existingPayload.message?.order) {
    const now = new Date().toISOString();
    if (existingPayload.message.order.updated_at) {
      existingPayload.message.order.updated_at = now;
      existingPayload.message.order.created_at = sessionData.created_at;
    }
  }

  

  const ids = resolveSessionIds(sessionData);

  // Load order from session data
  if (existingPayload.message) {
    const order = existingPayload.message.order || (existingPayload.message.order = {});

    // Map order.id from session data (carry-forward from confirm)
    if (sessionData.order_id) {
      order.id = sessionData.order_id;
    }
  }

  // Apply all resolved IDs to payload (provider, items, fulfillment, quote)
  applyResolvedIdsToPayload(existingPayload, ids, sessionData);

  // Update PROPOSAL_ID tag value with dynamic quote ID from session
  updateProposalIdTag(existingPayload, ids.quoteId);
  // Handle offline_contract: when true, set BFF to 0 and remove SETTLEMENT_AMOUNT/SETTLEMENT_BASIS
  if (existingPayload.message?.order?.payments?.[0]?.tags) {
    const paymentTags = existingPayload.message.order.payments[0].tags;
    const settlementTermsTag = paymentTags.find((t: any) => t.descriptor?.code === 'SETTLEMENT_TERMS');
    const offlineContract = settlementTermsTag?.list?.find((item: any) => item.descriptor?.code === 'OFFLINE_CONTRACT');
    if (offlineContract?.value === 'true') {
      const bffTag = paymentTags.find((t: any) => t.descriptor?.code === 'BUYER_FINDER_FEES');
      if (bffTag?.list) {
        bffTag.list.forEach((item: any) => {
          if (item.descriptor?.code === 'BUYER_FINDER_FEES_PERCENTAGE') item.value = '0';
          if (item.descriptor?.code === 'BUYER_FINDER_FEES_AMOUNT') item.value = '0';
        });
      }
      if (settlementTermsTag?.list) {
        settlementTermsTag.list = settlementTermsTag.list.filter(
          (item: any) => item.descriptor?.code !== 'SETTLEMENT_AMOUNT' && item.descriptor?.code !== 'SETTLEMENT_BASIS'
        );
      }
    }
  }
    // Recalculate total quote price from all breakup items
    const totalPrice = existingPayload.message.order.quote.breakup.reduce(
      (sum: number, b: any) => sum + (parseFloat(b.price?.value) || 0), 0
    );
    if (existingPayload.message.order.quote.price) {
      existingPayload.message.order.quote.price.value = String(totalPrice);
    }
    // Sync payment amount with calculated quote price
    if (existingPayload.message?.order?.payments?.[0]?.params) {
      existingPayload.message.order.payments[0].params.amount = String(totalPrice);
    }


  // Update document URLs to use dynamic form service URLs
if (existingPayload.message?.order?.documents) {
    existingPayload.message.order.documents = existingPayload.message.order.documents.map((doc: any) => {
        const renewFlows = ['Renew_Health_Insurance(Individual)', 'Renew_Health_Insurance(Family)'];
         const claimFlows = ['Claim_Health_Insurance(Individual)', 'Claim_Health_Insurance(Family)'];

      if (doc.descriptor?.code === 'RENEW_DOC' && doc.mime_type === 'application/html'&& renewFlows.includes(sessionData.flow_id)) {
        doc.url = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/renew_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;
      }
      if (doc.descriptor?.code === 'CLAIM_DOC' && doc.mime_type === 'application/html' && claimFlows.includes(sessionData.flow_id)) {
        doc.url = `${process.env.FORM_SERVICE}/forms/${sessionData.domain}/claim_form?session_id=${sessionData.session_id}&flow_id=${sessionData.flow_id}&transaction_id=${existingPayload.context.transaction_id}`;
      }

      return doc;
    });
  }



  return existingPayload;
}
