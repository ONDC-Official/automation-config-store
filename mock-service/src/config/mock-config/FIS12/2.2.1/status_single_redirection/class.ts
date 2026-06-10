import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { statusGenerator } from "./generator";

export class MockStatusSingleRedirectionClass extends MockAction {
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
        return {
            transaction_id: {
                label: "Transaction ID",
                type: "text",
                required: true
            }
        };
    }
    name(): string { return "status"; }
    get description(): string { return "Mock for status - Status request from BAP"; }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> { return statusGenerator(existingPayload, sessionData); }
    async validate(targetPayload: any): Promise<MockOutput> { return { valid: true }; }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        if (!sessionData.transaction_id) {
            return {
                valid: false,
                message: "No transaction_id available in session data"
            };
        }
        return { valid: true };
    }
}
