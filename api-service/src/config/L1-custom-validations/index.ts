import { validationOutput } from "./types";

export async function performL1CustomValidations(
  payload: any,
  action: string,
  _subscriberUrl: string,
  _allErrors = false,
  _externalData = {}
): Promise<validationOutput> {
  payload = structuredClone(payload);
  console.log("Skipping custom L1 validations for action: " + action);
  return [];
}