import { BecknContext } from "../../session-types";

export function createContext(partialContext: Partial<BecknContext>) {
    // const newContext
    const newContext: BecknContext = {
        action: "search",
        bap_id: "bap_id_not_set",
        bap_uri: "bap_uri_not_set",
        domain: "ONDC:FIS12",
        location: {
            city: {
                code: "*",
            },
            country: {
                code: "IND",
            },
        },
        message_id: generateUuid(),
        timestamp: new Date().toISOString(),
        transaction_id: generateUuid(),
        ttl: "PT30S",
        version: "2.0.1",
    };

    return { ...newContext, ...partialContext };
}

function generateUuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0;
        const value = char === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}
