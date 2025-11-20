import { SessionData } from "./session-types";
import { RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../../../types/api-session-cache";
import { createBuyerUrl, createSellerUrl } from "../../../utils/request-utils";
import { createMockResponseTRV11_BUS_200 } from "./BUS/2.0.0/generation-pipeline";
import { createMockResponseTRV11_METRO_201 } from "./METRO/2.0.1/generation-pipeline";
import { createMockResponseTRV11_BUS_201 } from "./BUS/2.0.1/generation-pipeline";

export async function createMockResponse(
  session_id: string,
  sessionData: SessionData,
  action_id: string,
  input?: Record<any, any>
) {
  RedisService.useDb(0);
  const api_session = (await RedisService.getKey(session_id)) ?? "";
  const data = JSON.parse(api_session) as SessionCache;
  const { version, usecaseId } = data;
  sessionData.user_inputs = input as any;
  let payload: any = {};
  if (usecaseId === "Metro") {
    if (version === "2.0.0") {
      payload = await createMockResponseTRV11_METRO_201(action_id, sessionData);
    } else if (version === "2.0.1") {
      payload = await createMockResponseTRV11_METRO_201(
        action_id,
        sessionData,
        input
      );
    }
  } else if (usecaseId === "Bus") {
    if (version === "2.0.0") {
      payload = await createMockResponseTRV11_BUS_200(action_id, sessionData);
    } else if (version === "2.0.1") {
      payload = await createMockResponseTRV11_BUS_201(
        action_id,
        sessionData,
        input
      );
    }
  }
  if (data.npType === "BAP") {
    payload.context.bap_uri = data.subscriberUrl;
    payload.context.bpp_uri = createSellerUrl(data.domain, data.version);
  } else {
    if (payload.context.action !== "search") {
      payload.context.bpp_uri = data.subscriberUrl;
    }
    payload.context.bap_uri = createBuyerUrl(data.domain, data.version);
  }
  return payload;
}
