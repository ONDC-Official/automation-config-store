import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { selectDefaultGenerator } from "./generator";

export class MockSelectClass extends MockAction {
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
        return "select_default";
    }
    get description(): string {
        return "Mock for select_default";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return selectDefaultGenerator(existingPayload, sessionData);
    }
    async validate(targetPayload: any): Promise<MockOutput> {
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Validate required session data for select generator
        if (!sessionData.items || !Array.isArray(sessionData.items) || sessionData.items.length === 0) {
            return { 
                valid: false, 
                message: "No items available in session data" 
            };
        }
        
        if (!sessionData.provider_id) {
            return { 
                valid: false, 
                message: "No provider_id available in session data" 
            };
        }
        
        return { valid: true };
    }
} 