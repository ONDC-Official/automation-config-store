import { getMockAction } from "../FIS11/action-factory";
import { testFlow, testUnitApi } from "./mock-testing";

// (async () => {
// 	await testFlow();
// })();

(async () => {
	const action = getMockAction("search");
	console.log(action.mockActionConfig.generator);
})();
