// switch (action_id) {
//     case "search_seller_pagination":
//         // return new MockSearch()
//         return await searchDefaultGenerator(existingPayload, sessionData);
//     case "on_search_seller_pagination_1":
//         return await onSearchDefaultGenerator(existingPayload, sessionData);
//                     // return new MockSearch()
//     case "on_search_seller_pagination_2":
//         return await onSearchDefaultGenerator(existingPayload, sessionData);
//     case "on_search_seller_pagination_3":
//         return await onSearchDefaultGenerator(existingPayload, sessionData);
//     case "search_incremental_pull":
//         return await searchIncrementalPullGenerator(existingPayload, sessionData);
//     case "on_search_incremental_pull_1":
//         return await onSearchIncrementalPull1Generator(existingPayload, sessionData);
//     case "on_search_incremental_pull_2":
//         return await onSearchIncrementalPull2Generator(existingPayload, sessionData);
//     case "on_search_incremental_pull_3":
//         return await onSearchIncrementalPull3Generator(existingPayload, sessionData);
//     case "select":
//         return await selectDefaultGenerator(existingPayload, sessionData);
//     case "on_select":
//         return await onSelectDefaultGenerator(existingPayload, sessionData);
//     case "init":
//         return await initDefaultGenerator(existingPayload, sessionData);
//     case "on_init":
//         return await onInitDefaultGenerator(existingPayload, sessionData);
//     case "confirm":
//         return await confirmDefaultGenerator(existingPayload, sessionData);
//     case "on_confirm":
//         return await onConfirmDefaultGenerator(existingPayload, sessionData);
//     case "status":
//         return await statusDefaultGenerator(existingPayload, sessionData);
//     case "on_status":
//         return await onStatusDefaultGenerator(existingPayload, sessionData);
//     case "cancel":
//         return await cancelDefaultGenerator(existingPayload, sessionData);
//     case "on_cancel":
//         return await onCancelDefaultGenerator(existingPayload, sessionData);
//     case "on_confirm_technical_cancellation":
//         return await onConfirmTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "status_technical_cancellation":
//         return await statusTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "on_status_technical_cancellation":
//         return await onStatusTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "cancel_soft_technical_cancellation":
//         return await cancelSoftTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "on_cancel_soft_technical_cancellation":
//         return await onCancelSoftTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "cancel_confirm_technical_cancellation":
//         return await cancelConfirmTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "on_cancel_confirm_technical_cancellation":
//         return await onCancelConfirmTechnicalCancellationGenerator(existingPayload, sessionData);
//     case "on_confirm_user_cancellation":
//         return await onConfirmUserCancellationGenerator(existingPayload, sessionData);
//     case "status_user_cancellation":
//         return await statusUserCancellationGenerator(existingPayload, sessionData);
//     case "on_status_user_cancellation":
//         return await onStatusUserCancellationGenerator(existingPayload, sessionData);
//     case "cancel_soft_user_cancellation":
//         return await cancelSoftUserCancellationGenerator(existingPayload, sessionData);
//     case "on_cancel_soft_user_cancellation":
//         return await onCancelSoftUserCancellationGenerator(existingPayload, sessionData);
//     case "cancel_confirm_user_cancellation":
//         return await cancelConfirmUserCancellationGenerator(existingPayload, sessionData);
//     case "on_cancel_confirm_user_cancellation":
//         return await onCancelConfirmUserCancellationGenerator(existingPayload, sessionData);
//     case "on_confirm_partial_cancellation":
//         return await onConfirmPartialCancellationGenerator(existingPayload, sessionData);
//     case "cancel_soft_partial_cancellation":
//         return await cancelSoftPartialCancellationGenerator(existingPayload, sessionData);
//     case "on_cancel_soft_partial_cancellation":
//         return await onCancelSoftPartialCancellationGenerator(existingPayload, sessionData);
//     default:
//         throw new Error(`Invalid request type ${action_id}`);
// }