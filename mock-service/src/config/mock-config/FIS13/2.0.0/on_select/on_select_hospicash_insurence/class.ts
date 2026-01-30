import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";
import { onSelectDefaultGenerator } from "./generator";

export class MockOnSelectHospicashInsurencClass extends MockAction {
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
        if (!sessionData.items || !Array.isArray(sessionData.items)) {
            return {
                valid: false,
                message: "No items available in session data"
            };
        }

        if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
            return {
                valid: false,
                message: "No selected_items available in session data"
            };
        }

        if (sessionData.selected_items.flat().length === 0) {
            return {
                valid: false,
                message: "selected_items array is empty"
            };
        }

        return { valid: true };
    }
} 