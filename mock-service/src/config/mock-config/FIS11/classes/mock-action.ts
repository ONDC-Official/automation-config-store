import { SessionData } from "../session-types";

export abstract class MockAction {
	/**
	 * The name of the action_id.
	 */
	abstract name(): string;

	/**
	 * A brief description of the action.
	 */
	abstract get description(): string;

	/**
	 * Generates a payload based on the existing payload and session data.
	 * @param existingPayload The existing payload to modify.
	 * @param sessionData The session data to use for generating the new payload.
	 * @returns A promise that resolves to the modified payload.
	 */
	abstract generator(
		existingPayload: any,
		sessionData: SessionData
	): Promise<any>;

	/**
	 * Validates the target payload.
	 * @param targetPayload The payload to validate.
	 * @returns A promise that resolves to an object indicating whether the validation was successful and an optional message.
	 */
	abstract validate(targetPayload: any): Promise<MockOutput>;
	/**
	 * Checks if the preconditions for generating a payload with given actionID are met.
	 * @param sessionData The session data to check against.
	 * @return A promise that resolves to an object indicating whether the requirements are met and an optional message.
	 */
	abstract meetRequirements(sessionData: SessionData): Promise<MockOutput>;
	/**
	 * gets the save data for the action.
	 * @returns An object containing the save data.
	 */
	abstract get saveData(): saveType;
	abstract get defaultData(): any;
	abstract get inputs(): any;

	get mockActionConfig() {
		return {
			name: this.name(),
			description: this.description,
			inputs: this.inputs,
			defaultData: this.defaultData,
			saveData: this.saveData,
			generator: this.generator.toString(),
			validate: this.validate.toString(),
			meetRequirements: this.meetRequirements.toString(),
		};
	}
}

export type MockOutput = {
	valid: boolean;
	message?: string;
	code?: string;
};

export type saveType = {
	["save-data"]: {
		[key: string]: string;
	};
};
