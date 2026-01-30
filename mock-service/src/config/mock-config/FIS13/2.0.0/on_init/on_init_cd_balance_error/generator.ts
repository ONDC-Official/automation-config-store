import { error } from "console"

export async function onInitCDBalanceErrorGenerator(existingPayload: any, sessionData: any) {
    // Mostly static error response, but we can update and return here if needed.
    const { context, message } = existingPayload
    return {
        context,
        error: {
            code: "81201",
            message: "Insufficient CD Balance"
        }
    }
}
