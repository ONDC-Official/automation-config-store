import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../classes/mock-action";
import { SessionData } from "../../session-types";
import { onSearchSellerPagination1Generator } from "./generator";

export class MockOnSearchClass extends MockAction {
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
        // Sample input structure for this mock
        return {
            // page: 1,
            // pageSize: 10,
            // sellerId: "seller-123",
            // filters: {
            //     category: "electronics",
            //     priceRange: { min: 100, max: 1000 }
            // }
        };
    }

    name(): string {
        return "on_search_seller_pagination_1";
    }
    get description(): string {
        return "Mock for on_search_seller_pagination_1";
    }
    generator(existingPayload: any, sessionData: SessionData): Promise<any> {
        return onSearchSellerPagination1Generator(existingPayload, sessionData);
    }
    
    async validate(targetPayload: any): Promise<MockOutput> {
        // Example validation: check required fields
        // if (!targetPayload || typeof targetPayload !== "object") {
        //     return { valid: false, message: "Payload must be an object" };
        // }
        // if (typeof targetPayload.page !== "number" || targetPayload.page < 1) {
        //     return { valid: false, message: "'page' must be a positive number" };
        // }
        // if (typeof targetPayload.pageSize !== "number" || targetPayload.pageSize < 1) {
        //     return { valid: false, message: "'pageSize' must be a positive number" };
        // }
        // if (!targetPayload.sellerId) {
        //     return { valid: false, message: "'sellerId' is required" };
        // }
        return { valid: true };
    }
    async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
        // Example: always valid, or add logic as needed
        // if(!sessionData.collected_by){
        //     return {valid:false,message: "Some Error message"}
        // }
        return { valid: true };
    }
}