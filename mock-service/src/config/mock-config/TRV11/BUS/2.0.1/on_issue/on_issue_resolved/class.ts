import { readFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import {
  MockAction,
  MockOutput,
  saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import { onIssueStatusGenerator } from "../generator";

export class MockOnIssueResolvedClass extends MockAction {
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
    return "on_issue_resolved";
  }
  get description(): string {
    return "Mock for on_issue_resolved";
  }
  generator(
    existingPayload: any,
    sessionData: SessionData,
    inputs?: any
  ): Promise<any> {
    return onIssueStatusGenerator(
      existingPayload,
      {
        ...sessionData,
        igm_action: "on_issue_resolved",
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

export class MockOnIssueResolvedIGM3Class extends MockAction {
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
    return "on_issue_resolved_igm_3";
  }
  get description(): string {
    return "Mock for on_issue_resolved_igm_3";
  }
  generator(
    existingPayload: any,
    sessionData: SessionData,
    inputs?: any
  ): Promise<any> {
    return onIssueStatusGenerator(
      existingPayload,
      {
        ...sessionData,
        igm_action: "on_issue_resolved_igm_3",
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
