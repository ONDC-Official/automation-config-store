import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { onSelect2Generator } from "./generator";

export class MockOnSelectPurchaseCultureClass extends MockAction {
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
        return "on_select_2";
    }
    get description(): string {
        return "Mock for on_select_2";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onSelect2Generator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        if (!sessionData.items || !Array.isArray(sessionData.items)) {
            return {
                valid: false,
                message: "No items available in session data",
                code: "MISSING_ITEMS"
            };
        }

        if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
            return {
                valid: false,
                message: "No fulfillments available in session data",
                code: "MISSING_FULFILLMENTS"
            };
        }

        if (!sessionData.provider) {
            return {
                valid: false,
                message: "No provider available in session data",
                code: "MISSING_PROVIDER"
            };
        }

        if (!sessionData.quote) {
            return {
                valid: false,
                message: "No quote available in session data",
                code: "MISSING_QUOTE"
            };
        }

        return { valid: true };
    }
} 