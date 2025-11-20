import { readFileSync } from "fs";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./TRV11/session-types";
import { createMockResponse } from "./TRV11/version-factory";
import { getMockAction, listMockActions } from "./TRV11/action-factory";
import logger from "@ondc/automation-logger";
export { MockSessionData };

export const actionConfig = yaml.load(
	readFileSync(path.join(__dirname, "./TRV11/factory.yaml"), "utf8")
) as any;

export const defaultSessionData = () =>
	yaml.load(
		readFileSync(path.join(__dirname, "./TRV11/session-data.yaml"), "utf8")
	) as { session_data: MockSessionData };

export async function generateMockResponse(
	session_id: string,
	sessionData: any,
	action_id: string,
	input?: any
) {
	try {
		const response = await createMockResponse(
			session_id,
			sessionData,
			action_id,
			input
		);
		response.context.timestamp = new Date().toISOString();
		return response;
	} catch (e) {
		logger.error("Error in generating mock response", e);
		throw e;
	}
}

export function getMockActionObject(actionId: string, sessionId?: string) {
	return getMockAction(actionId);
}

export function getAllMockActionIds() {
	return listMockActions();
}

export function getActionData(code: number) {
	const actionData = actionConfig.codes.find(
		(action: any) => action.code === code
	);
	if (actionData) {
		return actionData;
	}
	throw new Error(`Action code ${code} not found`);
}

export function getSaveDataContent(version: string, action: string) {
	let actionFolderPath = path.resolve(
		__dirname,
		`./TRV11/${version}/${action}`
	);
	const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
	const fileContent = readFileSync(saveDataFilePath, "utf8");
	const cont = yaml.load(fileContent) as any;
	return cont;
}

export function getUiMetaKeys(): (keyof MockSessionData)[] {
	return ["first_form_testing" as any];
}
