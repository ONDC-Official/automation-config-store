import { SessionData } from "../../../session-types";

export async function search_seller_pagination_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;

	const now = new Date();
	const end = new Date(now);
	end.setDate(now.getDate() + 2);
	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);

	const formattedToday = today.toISOString().split("T")[0];
	const formattedTomorrow = tomorrow.toISOString().split("T")[0];

	if (sessionData.user_inputs) {
		existingPayload.message.intent.provider = sessionData.user_inputs.provider;
		const items = existingPayload.message?.intent?.provider?.items || [];

		if (items.length > 0) {
			const tags = items[0].tags?.find(
				(t: any) => t.descriptor?.code === "BAP_INPUTS"
			);

			if (tags?.list) {
				tags.list.forEach((entry: any) => {
					switch (entry.descriptor?.code) {
						case "BUYER_NAME":
							if (entry.value && entry.value !== "-") {
								entry.value = formatName(entry.value)
							}
							break;
						case "BUYER_PHONE_NUMBER":
							if (entry.value && entry.value !== "-") {
								entry.value = ensureCountryCode(entry.value)
							}
							break;
					}
				});
			}
		}
	}


	if (
		existingPayload.message?.intent?.fulfillment?.stops?.[0]?.time?.range
	) {
		existingPayload.message.intent.fulfillment.stops[0].time.range.start =
			now.toISOString();
		existingPayload.message.intent.fulfillment.stops[0].time.range.end =
			end.toISOString();
	}

	if (sessionData.user_inputs?.city_code) {
		existingPayload.context.location.city.code =
			sessionData.user_inputs.city_code;
	}

	return existingPayload;
}

function formatName(input: string): string {
	return input.trim().split(/\s+/).join(' | ');
}

function ensureCountryCode(phoneNumber: string): string {
	const trimmed = phoneNumber.trim();
	return trimmed.startsWith('+91') ? trimmed : '+91-' + trimmed;
}