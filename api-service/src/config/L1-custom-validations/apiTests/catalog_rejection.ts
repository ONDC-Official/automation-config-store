/* eslint-disable no-prototype-builtins */
import _ from "lodash";
import { checkContext, checkBppIdOrBapId } from "../utils/helper";
import constants from "../utils/constants";

interface ValidationError {
  valid: boolean;
  code: number;
  description: string;
}

// -------------------- ERROR CODES --------------------
const ERROR_CODES = {
  INVALID_RESPONSE: 20006,
  INTERNAL_ERROR: 23001,
};

// Utility to create an error object
const createError = (description: string, code: number): ValidationError => ({
  valid: false,
  code,
  description,
});

// -------------------- MAIN VALIDATOR --------------------
export async function catalogRejectionValidator(data: any) {
  const result: ValidationError[] = [];

  try {
    if (!data || typeof data !== "object") {
      result.push(createError("Invalid JSON: Body cannot be empty", ERROR_CODES.INVALID_RESPONSE));
      return result;
    }

    const { context, errors } = data;

    // -------------------------------------------------------------------------
    // STEP 1: Validate Context
    // -------------------------------------------------------------------------
    if (!context || _.isEmpty(context)) {
      result.push(createError("Missing /context in catalog_rejection", ERROR_CODES.INVALID_RESPONSE));
      return result;
    }

    const ctxRes = checkContext(context, constants.CATALOG_REJECTION);
    if (!ctxRes?.valid) {
      ctxRes?.ERRORS?.forEach((err: string) =>
        result.push(createError(err, ERROR_CODES.INVALID_RESPONSE))
      );
    }

    // Validate bap_id & bpp_id must not be URLs
    if (checkBppIdOrBapId(context?.bap_id)) {
      result.push(createError("context/bap_id should not be a URL", ERROR_CODES.INVALID_RESPONSE));
    }
    if (checkBppIdOrBapId(context?.bpp_id)) {
      result.push(createError("context/bpp_id should not be a URL", ERROR_CODES.INVALID_RESPONSE));
    }

    // -------------------------------------------------------------------------
    // STEP 2: Validate errors array
    // -------------------------------------------------------------------------
    if (!Array.isArray(errors) || errors.length === 0) {
      result.push(createError("'errors' must be a non-empty array", ERROR_CODES.INVALID_RESPONSE));
      return result;
    }

    errors.forEach((errObj: any, index: number) => {
      if (!errObj.type) {
        result.push(createError(`Missing 'type' in errors[${index}]`, ERROR_CODES.INVALID_RESPONSE));
      }
      if (!errObj.code) {
        result.push(createError(`Missing 'code' in errors[${index}]`, ERROR_CODES.INVALID_RESPONSE));
      }
      if (!errObj.path) {
        result.push(createError(`Missing 'path' in errors[${index}]`, ERROR_CODES.INVALID_RESPONSE));
      }
      if (!errObj.message) {
        result.push(createError(`Missing 'message' in errors[${index}]`, ERROR_CODES.INVALID_RESPONSE));
      }
    });

    return result;
  } catch (err: any) {
    console.error("!!Error in catalogRejectionValidator:", err);
    result.push(
      createError(
        `Internal error while validating /catalog_rejection: ${err.message}`,
        ERROR_CODES.INTERNAL_ERROR
      )
    );
    return result;
  }
}
