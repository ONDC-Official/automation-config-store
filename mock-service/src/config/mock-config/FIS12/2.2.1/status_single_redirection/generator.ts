export async function statusGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }

  console.log("sessionData for status", sessionData);
  
  if (existingPayload.context?.transaction_id) {
    existingPayload.message = existingPayload.message || {};
    existingPayload.message.ref_id = existingPayload.context.transaction_id;
    delete existingPayload.message.transaction_id;
  } 
  

  return existingPayload;
}
