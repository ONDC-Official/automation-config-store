import select from "./api-tests/select";
import init from "./api-tests/init";
import confirm from "./api-tests/confirm";
import status from "./api-tests/status";
import cancel from "./api-tests/cancel";

export function performL2Validations(
	action: string,
	payload: any,
	allErrors = false,
	externalData = {}
) {
	switch (action) {
		case "select":
			return select({
				payload: payload,
				externalData: externalData,
				config: {
					runAllValidations: allErrors,
				},
			});
		case "init":
			return init({
				payload: payload,
				externalData: externalData,
				config: {
					runAllValidations: allErrors,
				},
			});
		case "confirm":
			return confirm({
				payload: payload,
				externalData: externalData,
				config: {
					runAllValidations: allErrors,
				},
			});
		case "status":
			return status({
				payload: payload,
				externalData: externalData,
				config: {
					runAllValidations: allErrors,
				},
			});
		case "cancel":
			return cancel({
				payload: payload,
				externalData: externalData,
				config: {
					runAllValidations: allErrors,
				},
			});
		default:
			throw new Error("Action not found");
	}
}
