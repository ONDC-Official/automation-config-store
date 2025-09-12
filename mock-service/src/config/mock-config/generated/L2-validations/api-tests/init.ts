import payloadUtils from "../utils/json-path-utils";
import validations from "../utils/validation-utils";
import {
    testFunctionArray,
    validationInput,
    validationOutput,
} from "../types/test-config";

export default function init(input: validationInput): validationOutput {
    const scope = payloadUtils.getJsonPath(input.payload, "$");
    let subResults: validationOutput = [];
    let valid = true;
    for (const testObj of scope) {
        testObj._EXTERNAL = input.externalData;

        function buyer_finder_fees_needs_to_be_equal(
            input: validationInput,
        ): validationOutput {
            const scope = payloadUtils.getJsonPath(input.payload, "$");
            let subResults: validationOutput = [];
            let valid = true;
            for (const testObj of scope) {
                testObj._EXTERNAL = input.externalData;
                const buyer_finder_fees = payloadUtils.getJsonPath(
                    testObj,
                    "$.message.order.payments[*].tags[?(@.descriptor.code == 'BUYER_FINDER_FEES')].list[?(@.descriptor.code == 'BUYER_FINDER_FEES_PERCENTAGE')].value",
                );
                const buyer_fee = payloadUtils.getJsonPath(
                    testObj,
                    "$._EXTERNAL.buyer_app_fee",
                );

                const validate = validations.equalTo(
                    buyer_finder_fees,
                    buyer_fee,
                );
                console.log(buyer_finder_fees,buyer_fee)
                console.log("The value for validate is", validate)
                if (!validate) {
                    return [
                        {
                            valid: false,
                            code: 30000,
                            description: `- **condition buyer_finder_fees_needs_to_be_equal**: $.message.order.payments[*].tags[?(@.descriptor.code == 'BUYER_FINDER_FEES')].list[?(@.descriptor.code == 'BUYER_FINDER_FEES_PERCENTAGE')].value must be equal to $._EXTERNAL.buyer_app_fee`,
                        },
                    ];
                }

                delete testObj._EXTERNAL;
            }
            return [{ valid: valid, code: 200 }, ...subResults];
        }
        function all_item_ids_are_there_which_were_present_in_select(
            input: validationInput,
        ): validationOutput {
            const scope = payloadUtils.getJsonPath(input.payload, "$");
            let subResults: validationOutput = [];
            let valid = true;
            for (const testObj of scope) {
                testObj._EXTERNAL = input.externalData;
                const item_ids = payloadUtils.getJsonPath(
                    testObj,
                    "$.message.order.items[*].id",
                );
                const saved_item_ids = payloadUtils.getJsonPath(
                    testObj,
                    "$._EXTERNAL.selected_item_ids[*]",
                );

                const validate =
                    validations.allIn(item_ids, saved_item_ids) &&
                    validations.allIn(saved_item_ids, item_ids);

                if (!validate) {
                    return [
                        {
                            valid: false,
                            code: 30000,
                            description: `- **condition all_item_ids_are_there_which_were_present_in_select**: all of the following sub conditions must be met:

  - **condition all_item_ids_are_there_which_were_present_in_select.1**: every element of $.message.order.items[*].id must be in $._EXTERNAL.selected_item_ids[*]
  - **condition all_item_ids_are_there_which_were_present_in_select.2**: every element of $._EXTERNAL.selected_item_ids[*] must be in $.message.order.items[*].id`,
                        },
                    ];
                }

                delete testObj._EXTERNAL;
            }
            return [{ valid: valid, code: 200 }, ...subResults];
        }

        const testFunctions: testFunctionArray = [
            buyer_finder_fees_needs_to_be_equal,
            all_item_ids_are_there_which_were_present_in_select,
        ];

        let invalidResults: validationOutput = [];
        for (const fn of testFunctions) {
            const subResult = fn(input);
            // .filter(r => !r.valid);
            invalidResults = [...invalidResults, ...subResult];
            if (!input.config.runAllValidations && invalidResults.length > 0) {
                return invalidResults;
            }
        }
        if (invalidResults.length > 0) {
            // return invalidResults;
            subResults = invalidResults;
            valid = subResults.every((r) => r.valid);
        }

        delete testObj._EXTERNAL;
    }
    return [{ valid: valid, code: 200 }, ...subResults];
}
