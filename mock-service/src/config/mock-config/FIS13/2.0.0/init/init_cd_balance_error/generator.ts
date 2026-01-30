export async function init_cd_balance_error_generator(existingPayload: any, sessionData: any) {


    if (sessionData.selected_items) {
        existingPayload.message.order.items = sessionData.selected_items.flat();
    }


    if (sessionData.selected_provider) {
        existingPayload.message.order.provider = sessionData.selected_provider;
    }

    return existingPayload;
}
