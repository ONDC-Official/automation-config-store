export async function select_cd_balance_error_generator(existingPayload: any, sessionData: any) {

    if (sessionData.user_inputs) {
        existingPayload.message.order.items = sessionData.user_inputs;
    }
    if (sessionData.provider_id) {
        existingPayload.message.order.provider.id = sessionData.provider_id;
    }

    return existingPayload;
}
