import { SessionData } from "../../../session-types";

export async function search_seller_pagination_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;
	if (
		sessionData?.user_inputs?.provider
	) {
		existingPayload.message.intent.provider = sessionData?.user_inputs?.provider

	}
	return existingPayload;
} 