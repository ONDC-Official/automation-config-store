// iterate -> generate -> save -> log
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { updateAllJsonPaths } from "../../../utils/json-editor-utils/jsonPathEditor";
import { createMockResponseFIS11_200 } from "../FIS11/2.0.0/generaton-pipeline";
import {
	customConsoleLog,
	loadFlowConfig,
	loadMockSessionDataUnit,
	saveDataForUnit,
} from "./utils";
import path from "path";
const inputsData = {
	RTO_And_Part_Cancellation_Flow: {
		select: {
			provider: "P1",
			provider_location: ["L1"],
			location_gps: "12.1233,12.9992",
			location_pin_code: "110092",
			items: [
				{
					itemId: "I1",
					quantity: 1,
					location: "L1",
				},
				{
					itemId: "I3",
					quantity: 1,
					location: "L1",
				},
				{
					itemId: "I2",
					quantity: 1,
				},
			],
			offers_FLAT50: false,
			offers_buy2get3: false,
			offers_combo1: "combo1",
		},
	},
	Return_Flow: {
		select: {
			provider: "P1",
			provider_location: ["L1"],
			location_gps: "12.1233,12.9992",
			location_pin_code: "110092",
			items: [
				{
					itemId: "I1",
					quantity: 2,
					location: "L1",
				},
				{
					itemId: "I2",
					quantity: 49,
					location: "L1",
				},
			],
			offers_FLAT50: "FLAT50",
			offers_buy2get3: false,
			offers_combo1: false,
		},
	},
};

const inputPathChanges = {
	Discovery_Flow: {
		search: {
			"$.context.city": "std:80",
		},
	},
};

export async function testFlow() {
	customConsoleLog("### TESTING FLOW ###");
	const flows = loadFlowConfig();
	customConsoleLog(
		"-- loaded flow with id: ",
		flows.map((f) => f.id)
	);
	let lastAction = "null";

	for (const flow of flows) {
		rmSync(path.resolve(__dirname, "./session-data"), {
			recursive: true,
			force: true,
		});
		for (const step of flow.sequence) {
			customConsoleLog(
				`--> testing step with key: ${step.key} and type: ${step.type}`
			);
			await testUnitApi(step.key, step.type, lastAction, flow.id);
			lastAction = step.type;
		}
	}
}

export async function testUnitApi(
	actionId: string,
	action: string,
	lastAction: string,
	flowId: string
) {
	const sesData = loadMockSessionDataUnit(lastAction, flowId);
	// @ts-ignore
	sesData.user_inputs = inputsData["RTO_And_Part_Cancellation_Flow"][actionId];
	let mockResponse = await createMockResponseFIS11_200(actionId, sesData);
	// @ts-ignore
	if (inputPathChanges[flowId] && inputPathChanges[flowId][actionId]) {
		// @ts-ignore
		const changes = inputPathChanges[flowId][actionId];
		mockResponse = updateAllJsonPaths(mockResponse, changes);
	}
	await saveDataForUnit(lastAction, action, mockResponse, flowId);
	const folderPath = path.resolve(__dirname, `./logs/${flowId}`);
	const filePath = path.resolve(folderPath, `${actionId}.json`);
	if (!existsSync(filePath)) {
		mkdirSync(folderPath, { recursive: true });
	}
	// await testWithApiService(mockResponse, action);
	writeFileSync(filePath, JSON.stringify(mockResponse, null, 2));
	customConsoleLog(
		`-- DONE -- saved mock response for action: ${action} in file: ${filePath}`
	);
}
