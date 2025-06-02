# Output Types

```
export type validationOutput = {
	valid: boolean;
	code: number;
	description?: string;
}[];
```

# L1 Custom Validations

```
import { validationOutput } from "./types";

export function performL1CustomValidations(
	payload: any,
	action: string,
	allErrors = false,
	externalData = {}
): validationOutput {
	console.log("Performing custom L1 validations for action: " + action);
	return [
		{
			valid: true,
			code: 200,
			description: "Custom validation passed",
		},
	];
}
```

**How to Add Custom L1 Validations**

To implement domain-specific validations, modify the performL1CustomValidations function according to your needs while ensuring the following:

    1. Maintain the function signature
        • Keep the same parameters and return type.

    2. Return the output in the validationOutput format
        • Each validation result should be an object containing valid, code, and an optional description.

    3. Keep the same function name (performL1CustomValidations)
        • As it is already used in api service layer for L1 custom validations.

By following these guidelines, you can easily integrate and customize L1 validations for different use cases. 🚀
