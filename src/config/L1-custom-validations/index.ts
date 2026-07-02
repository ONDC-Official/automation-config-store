import { validationOutput } from "./types";

export async function performL1CustomValidations(
  _payload: any,
  action: string,
  _subscriberUrl: string,
  _allErrors = false,
  _externalData = {}
): Promise<validationOutput> {
  console.log("Skipping custom L1 validations for action: " + action);
  return [];
}