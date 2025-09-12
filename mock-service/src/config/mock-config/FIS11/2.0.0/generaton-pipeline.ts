import { SessionData } from "../session-types";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import logger from "@ondc/automation-logger";
import { createContext } from "./create-context";
import { getMockAction } from "../action-factory";

function loadFactoryYaml(filePath: string): any {
	try {
		const fileContents = fs.readFileSync(filePath, "utf8");
		const data: any = yaml.load(fileContents) as any;
		return data;
	} catch (error) {
		console.error("Error reading factory YAML:", error);
		throw error;
	}
}
function getDetailsByActionId(
	actionId: string,
	factoryData: any
): { default: string; action: string; message_id: boolean } {
	const entry = factoryData.codes.find(
		(item: any) => item.action_id === actionId
	);
	if (actionId.startsWith("dyn_on_status")) {
		return {
			default: "GROCERY/1.2.5/on_status/dyn_on_status/default.yaml",
			action: "on_status",
			message_id: true,
		};
	}
	if (entry) {
		return {
			default: entry.default,
			action: entry.action,
			message_id: entry.message_id,
		};
	}
	throw new Error("Invalid action id found! " + actionId);
}
function yamlToJson(filePath: string): object {
	try {
		// Read the YAML file contents
		const fileContents = fs.readFileSync(filePath, "utf8");

		// Convert the YAML content to a JSON-compatible JavaScript object
		const jsonData = yaml.load(fileContents) as any;
		// Return the converted JSON data
		return jsonData;
	} catch (error: any) {
		console.error(
			`Error reading or parsing YAML file at ${filePath}: ${error.message}`
		);
		throw error;
	}
}

export async function createMockResponseFIS11_200(
	actionID: string,
	sessionData: SessionData
) {
	const factoryData = loadFactoryYaml(
		path.resolve(__dirname, "../factory.yaml")
	);
	let api_details: any = {};
	if (actionID.startsWith("dyn_on_status")) {
		api_details = getDetailsByActionId("dyn_on_status", factoryData);
	}
	api_details = getDetailsByActionId(actionID, factoryData);
	const context_object = {
		action: api_details?.action,
		transaction_id: sessionData?.transaction_id,
		bap_id: sessionData?.bap_id,
		bap_uri: sessionData?.bap_uri,
		bpp_id: sessionData?.bpp_id,
		bpp_uri: sessionData?.bpp_uri,
		location: {
			city: {
				code: sessionData.city_code ?? "std:011",
			},
			country: {
				code: "IND",
			},
		},
	};
	let context = createContext(context_object);
	if (!api_details.message_id) {
		context.message_id = sessionData.message_id as string;
	}
	const default_message = yamlToJson(
		path.resolve(__dirname, `../../${api_details.default}`)
	);
	// Build payload ensuring error is at top-level, not under message
	const payload: any = { context };
	if (
		default_message &&
		typeof default_message === "object" &&
		"error" in (default_message as any)
	) {
		payload.error = (default_message as any).error;
	} else {
		payload.message = default_message;
	}
	if (sessionData.error_code && sessionData.error_message) {
		const error_message = {
			code: `${sessionData.error_code}`,
			message: sessionData.error_message,
		};
		delete payload.message;
		payload.error = error_message;
		logger.info(`L2 error found: ${JSON.stringify(error_message)}`);
		return payload;
	}
	const mockAction = getMockAction(actionID);

	const requirements = await mockAction.meetRequirements(sessionData);
	if (!requirements.valid && requirements.message) {
		return {
			context: context,
			error: {
				code: "400",
				message: requirements.message,
			},
		};
	}
	return mockAction.generator(payload, sessionData);
}
