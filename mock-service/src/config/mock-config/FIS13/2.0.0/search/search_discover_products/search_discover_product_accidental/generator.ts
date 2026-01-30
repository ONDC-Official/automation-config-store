import { SessionData } from "../../../../session-types";

export async function search_accidental_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;
	if (
		existingPayload?.message?.intent?.provider?.tags &&
		Array.isArray(existingPayload.message.intent.provider.tags)
	) {
		existingPayload.message.intent.provider.tags.forEach((tag: any) => {
			if (Array.isArray(tag.list)) {
				tag.list.forEach((item: any) => {
					if (item?.descriptor?.code === "POLICY_ID") {
						item.value = sessionData.user_inputs?.policy_id;
					}
				});
			}
		});
	}

	return existingPayload;
} 
