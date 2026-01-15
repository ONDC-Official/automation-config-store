import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { onInitGenerator } from "./generator";

export class MockOnInitClass extends MockAction {
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
        return "on_init_default";
    }
    get description(): string {
        return "Mock for on_init_default";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onInitGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for on_init generator
        if (!sessionData.items || !Array.isArray(sessionData.items)) {
            return {
                valid: false,
                message: "No items available in session data",
                code: "MISSING_ITEMS"
            };
        }

        if (sessionData.items.length === 0) {
            return {
                valid: false,
                message: "Items array is empty",
                code: "EMPTY_ITEMS"
            };
        }

        if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
            return {
                valid: false,
                message: "No fulfillments available in session data",
                code: "MISSING_FULFILLMENTS"
            };
        }

        if (sessionData.fulfillments.length === 0) {
            return {
                valid: false,
                message: "Fulfillments array is empty",
                code: "EMPTY_FULFILLMENTS"
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

        if (!sessionData.payments || !Array.isArray(sessionData.payments)) {
            return {
                valid: false,
                message: "No payments available in session data",
                code: "MISSING_PAYMENTS"
            };
        }

        if (!sessionData.billing) {
            return {
                valid: false,
                message: "No billing information available in session data",
                code: "MISSING_BILLING"
            };
        }

        if (!sessionData.cancellation_terms || !Array.isArray(sessionData.cancellation_terms)) {
            return {
                valid: false,
                message: "No cancellation terms available in session data",
                code: "MISSING_CANCELLATION_TERMS"
            };
        }

        if (!sessionData.replacement_terms || !Array.isArray(sessionData.replacement_terms)) {
            return {
                valid: false,
                message: "No replacement terms available in session data",
                code: "MISSING_REPLACEMENT_TERMS"
            };
        }

        return { valid: true };
    }
} 