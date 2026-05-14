import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { onSelectDefaultGenerator } from "./generator";

export class MockOnSelectClass extends MockAction {
    get saveData(): saveType {
        return yaml.load(
            readFileSync(path.resolve(__dirname, "./save-data.yaml"), "utf8")
        ) as saveType;
    }
    get defaultData(): any {
        return yaml.load(
            readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8")
        );
    }
    get inputs(): any {
        return {};
    }
    name(): string {
        return "on_select_default";
    }
    get description(): string {
        return "Mock for on_select_default";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onSelectDefaultGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any, sessionData: SessionData): Promise<MockOutput> {
        const order = targetPayload?.message?.order;
        if (!order) return { valid: false, message: "Order not found in message", code: "MISSING_ORDER" };

        const provider = order.provider;
        if (!provider) return { valid: false, message: "Provider not found in order", code: "MISSING_PROVIDER" };

        if (sessionData.selected_provider && provider.id !== sessionData.selected_provider.id)
            return { valid: false, message: `Provider ID mismatch with selected provider: ${sessionData.selected_provider.id}`, code: "ID_MISMATCH" };

        const fulfillments = order.fulfillments;
        if (sessionData.selected_fulfillments && fulfillments) {
            const validFulfillmentIds = new Set(sessionData.selected_fulfillments.map((f: any) => f.id));
            const invalidFulfillmentIds = fulfillments.filter((f: any) => !validFulfillmentIds.has(f.id)).map((f: any) => f.id);
            if (invalidFulfillmentIds.length) {
                return { valid: false, message: `Fulfillment IDs [${invalidFulfillmentIds.join(", ")}] not found in selected fulfillments`, code: "FULFILLMENT_ID_MISMATCH" };
            }
        }

        const items = sessionData.items;
        if (items) {
            if (sessionData.selected_items) {
                const selectedIds = sessionData.selected_items.map((i: any) => i.id);

                const allParentIds: string[] = [];
                selectedIds.forEach((selectedId: string) => {
                    const item = (sessionData.items || []).find((i: any) => i.id === selectedId);
                    let currentParentId = item?.parent_item_id;
                    while (currentParentId) {
                        allParentIds.push(currentParentId);
                        const parentItem = (sessionData.items || []).find((i: any) => i.id === currentParentId);
                        currentParentId = parentItem?.parent_item_id;
                    }
                });

                const validItemIds = new Set([...selectedIds, ...allParentIds]);
                const invalidItemIds = items.filter((i: any) => !validItemIds.has(i.id)).map((i: any) => i.id);

                // if (invalidItemIds.length) {
                //     return { valid: false, message: `Item IDs [${invalidItemIds.join(", ")}] not found in selected items or their parents`, code: "ITEM_ID_MISMATCH" };
                // }
            }
        }

        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for on_select
        if (!sessionData.items || !Array.isArray(sessionData.items)) {
            return {
                valid: false,
                message: "No items available in session data",
                code: "MISSING_ITEMS"
            };
        }

        if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
            return {
                valid: false,
                message: "No selected_items available in session data",
                code: "MISSING_SELECTED_ITEMS"
            };
        }

        if (sessionData.selected_items.length === 0) {
            return {
                valid: false,
                message: "selected_items array is empty",
                code: "EMPTY_SELECTED_ITEMS"
            };
        }

        if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
            return {
                valid: false,
                message: "No fulfillments available in session data",
                code: "MISSING_FULFILLMENTS"
            };
        }

        if (!sessionData.selected_fulfillments || !Array.isArray(sessionData.selected_fulfillments)) {
            return {
                valid: false,
                message: "No selected_fulfillments available in session data",
                code: "MISSING_SELECTED_FULFILLMENTS"
            };
        }

        return { valid: true };
    }
} 