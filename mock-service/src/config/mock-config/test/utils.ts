import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { Flow } from "../../../types/flow-types";
import { defaultSessionData, getSaveDataContent, MockSessionData } from "..";
import { updateSessionData } from "../../../services/data-services";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export function loadFlowConfig() {
	const filePath = path.resolve(__dirname, "./flow-config.yaml");
	const data = readFileSync(filePath, "utf8");
	const loadedData = yaml.load(data) as {
		flows: Flow[];
	};
	return loadedData.flows;
}

export async function saveDataForUnit(
	lastAction: string,
	action: string,
	payload: any,
	flowId: string,
	errorData?: {
		code: number;
		message: string;
	}
) {
	const sessionData = loadMockSessionDataUnit(lastAction, flowId);
	const saveData = getSaveDataContent(
		payload?.context?.version || payload?.context?.core_version,
		action
	);
	updateSessionData(saveData["save-data"], payload, sessionData, errorData);
	if (!existsSync(path.resolve(__dirname, "./session-data"))) {
		mkdirSync(path.resolve(__dirname, "./session-data"));
	}
	const filePath = path.resolve(__dirname, `./session-data/${action}.json`);
	writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
}

export function loadMockSessionDataUnit(action: string, flowId: string) {
	const filePath = path.resolve(__dirname, `./session-data/${action}.json`);
	let sessionData: MockSessionData = {} as MockSessionData;
	if (!existsSync(filePath)) {
		customConsoleLog(
			"### LAST ACTION NOT FOUND RETURNING DEFAULT SAVE-DATA ###"
		);
		const raw = defaultSessionData();
		sessionData = raw.session_data;
		sessionData.transaction_id = uuidv4();
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		sessionData.bap_uri = "https://dev-automation.ondc.org/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/seller";
		sessionData.subscriber_url = "test-subscriber-url";
		return sessionData;
	}
	return JSON.parse(readFileSync(filePath, "utf8") ?? "{}");
}

export function customConsoleLog(message: string, ...meta: any[]) {
	console.log(`${message}`, ...meta, `\n`);
}

export async function testWithApiService(payload: any, action: string) {
	const apiLayerUrl = `${process.env.API_SERVICE_LAYER}/${
		payload.context.domain
	}/${payload.context.version ?? payload.context.core_version}/test/${action}`;
	const response = await axios.post(apiLayerUrl, payload);
	console.log(response.data);
	return response.data;
}
