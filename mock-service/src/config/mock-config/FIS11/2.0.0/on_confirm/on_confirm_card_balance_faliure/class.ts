import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { onConfirmGenerator } from "./generator";
import { MockAction, MockOutput, saveType } from "../../../classes/mock-action";
import { SessionData } from "../../../session-types";

export class MockOnConfirmFaliureDefaultClass extends MockAction {
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
        return "on_confirm_default";
    }
    get description(): string {
        return "Mock for on_confirm_default";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onConfirmGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for on_confirm generator
        if (!sessionData.items || !Array.isArray(sessionData.items) || sessionData.items.length === 0) {
            return { 
                valid: false, 
                message: "No items available in session data" 
            };
        }
        
        if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
            return { 
                valid: false, 
                message: "No fulfillments available in session data" 
            };
        }
        
        if (!sessionData.provider_id) {
            return { 
                valid: false, 
                message: "No provider available in session data" 
            };
        }
    
        return { valid: true };
    }
} 