import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { MockAction, MockOutput, saveType } from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { initGenerator } from "./generator";

export class MockOnInitErrorResponseClass extends MockAction {
  get saveData(): saveType {
    return yaml.load(
      readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
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
    return "init_default";
  }
  get description(): string {
    return "Mock for init_default";
  }
  generator(existingPayload: any, sessionData: SessionData): Promise<any> {
    return initGenerator(existingPayload, sessionData);
  }
  async validate(targetPayload: any, sessionData: any): Promise<MockOutput> {
    return { valid: false };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    return { valid: true };
  }
}
