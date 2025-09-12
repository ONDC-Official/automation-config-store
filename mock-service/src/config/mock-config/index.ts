import { readFileSync } from "fs";
import { logger } from "../../utils/logger";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./FIS11/session-types";
import { createMockResponse } from "./FIS11/version-factory";
import { getMockAction } from "./FIS11/action-factory";

export { MockSessionData };

const actionConfig = yaml.load(
	readFileSync(path.join(__dirname, "./FIS11/factory.yaml"), "utf8")
) as any;

export const defaultSessionData = () =>
	yaml.load(
		readFileSync(path.join(__dirname, "./FIS11/session-data.yaml"), "utf8")
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

export function getMockActionObject(actionId: string) {
	return getMockAction(actionId);
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
		`./TRV13/${version}/${action}`
	);
	const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
	const fileContent = readFileSync(saveDataFilePath, "utf8");
	const cont = yaml.load(fileContent) as any;
	console.log(cont);
	return cont;
}
