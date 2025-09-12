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
        
        if (!sessionData.provider) {
            return { 
                valid: false, 
                message: "No provider available in session data" 
            };
        }
        
        if (!sessionData.quote) {
            return { 
                valid: false, 
                message: "No quote available in session data" 
            };
        }
        
        return { valid: true };
    }
} 