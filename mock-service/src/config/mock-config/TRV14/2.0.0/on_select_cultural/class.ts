import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { onSelectDefaultGenerator } from "./generator";

export class MockOnSelectPurchaseCultFormClass extends MockAction {
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
    async validate(targetPayload: any): Promise<MockOutput> {
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