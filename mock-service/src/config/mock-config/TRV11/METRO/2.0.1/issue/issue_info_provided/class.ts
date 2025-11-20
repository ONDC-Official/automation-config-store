import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { issueStatusGenerator } from "../generator";

export class MockIssueInfoProvidedClass extends MockAction {
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
    return "issue_info_provided";
  }
  get description(): string {
    return "Mock for issue_info_provided";
  }
  generator(
    existingPayload: any,
    sessionData: SessionData,
    inputs?: any
  ): Promise<any> {
    return issueStatusGenerator(
      existingPayload,
      {
        ...sessionData,
        igm_action: "issue_info_provided",
      },
      sessionData?.user_inputs
    );
  }
  async validate(
    targetPayload: any,
    sessionData: SessionData
  ): Promise<MockOutput> {
    return { valid: true };
  }
  async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
    // Validate required session data for confirm generator
    return { valid: true };
  }
}
