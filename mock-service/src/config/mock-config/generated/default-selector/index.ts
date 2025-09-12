import search from "./api-tests/search";
import on_search from "./api-tests/on_search";
import select from "./api-tests/select";
import on_select from "./api-tests/on_select";
import init from "./api-tests/init";
import on_init from "./api-tests/on_init";
import confirm from "./api-tests/confirm";
import on_confirm from "./api-tests/on_confirm";
import status from "./api-tests/status";
import cancel from "./api-tests/cancel";
import on_cancel from "./api-tests/on_cancel";

export function defaultSelectionCodeTests(
    action: string,
    payload: any,
    allErrors = false,
    externalData = {},
) {
    switch (action) {
        case "search":
            return search({
                payload: payload,
                externalData: externalData,
                config: {
                    runAllValidations: allErrors,
                },
            });
        case "on_search":
            return on_search({
                payload: payload,
                externalData: externalData,
                config: {
                    runAllValidations: allErrors,
                },
            });
        case "select":
            return select({
                payload: payload,
                externalData: externalData,
                config: {
                    runAllValidations: allErrors,
                },
            });
        case "on_select":
            return on_select({
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
        case "on_init":
            return on_init({
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
        case "on_confirm":
            return on_confirm({
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
        case "on_cancel":
            return on_cancel({
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
