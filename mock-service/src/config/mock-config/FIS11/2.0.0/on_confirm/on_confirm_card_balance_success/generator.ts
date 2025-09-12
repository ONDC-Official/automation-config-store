/**
 * On_Confirm Generator for TRV14
 *
 * Logic:
 * 1. Load most fields from session (items, fulfillments, provider, billing, payments, tags, etc.)
 * 2. Add order ID (UUID)
 * 3. Add hardcoded order status and fulfillment state
 * 4. Add authorization with QR token (UUID) and +5 days validity
 * 5. Add created_at and updated_at from session
 */

import { v4 as uuidv4 } from 'uuid';

export async function onConfirmGenerator(existingPayload: any, sessionData: any) {
  // Load items from session
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }
  
  // Load fulfillments from session and add state + authorization
  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    
    // Add fulfillment state and authorization
    if (Array.isArray(existingPayload.message.order.fulfillments)) {
      existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
        // Add hardcoded fulfillment state
        fulfillment.state = {
          descriptor: {
            code: "CONFIRMED"
          }
        };
        
        // Add authorization with QR token and +5 days validity
        if (Array.isArray(fulfillment.stops)) {
          fulfillment.stops.forEach((stop: any) => {
            if (stop.type === "START") {
              // Calculate +5 days from current timestamp
              const currentTime = new Date(stop.time?.timestamp || new Date());
              const validTo = new Date(currentTime.getTime() + (5 * 24 * 60 * 60 * 1000)); // +5 days
              
              stop.authorization = {
                type: "QR",
                token: uuidv4().replace(/-/g, ''), // UUID without dashes for QR token
                valid_to: validTo.toISOString(),
                status: "UNCLAIMED"
              };
            }
          });
        }
      });
    }
  }
  
  // Load provider from session
  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }
  
  // Load cancellation_terms from session
  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms[0];
  }
  
  // Load replacement_terms from session
  if (sessionData.replacement_terms) {
    existingPayload.message.order.replacement_terms = sessionData.replacement_terms[0];
  }
  
  // Load quote from session
  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  
  // Add order ID (UUID)
  existingPayload.message.order.id = uuidv4().substring(0, 8); // Short UUID for order ID
  
  existingPayload.message.order.status = "COMPLETE";
  existingPayload.message.order.quote.id = uuidv4(); 
  // Add hardcoded order status
  
  // Add created_at and updated_at from session
  if (sessionData.created_at) {
    existingPayload.message.order.created_at = existingPayload.context.timestamp;
  }
  if (sessionData.updated_at) {
    existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  }
  return existingPayload;
} 
