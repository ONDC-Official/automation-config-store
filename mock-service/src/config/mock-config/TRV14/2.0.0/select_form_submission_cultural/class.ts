import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { selectPurchaseCultureGenerator } from "./generator";

export class MockSelectPurchaseCultureClass extends MockAction {
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
        return "select_2";
    }
    get description(): string {
        return "Mock for select_2";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return selectPurchaseCultureGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items) || sessionData.selected_items.length === 0) {
            return {
                valid: false,
                message: "Selected items are required in session data",
                code: "MISSING_SELECTED_ITEMS"
            };
        }

        if (!sessionData.selected_provider) {
            return {
                valid: false,
                message: "Selected provider is required in session data",
                code: "MISSING_SELECTED_PROVIDER"
            };
        }

        if (!sessionData.selected_fulfillments || !Array.isArray(sessionData.selected_fulfillments) || sessionData.selected_fulfillments.length === 0) {
            return {
                valid: false,
                message: "Selected fulfillments are required in session data",
                code: "MISSING_SELECTED_FULFILLMENTS"
            };
        }

        return { valid: true };
    }
} 