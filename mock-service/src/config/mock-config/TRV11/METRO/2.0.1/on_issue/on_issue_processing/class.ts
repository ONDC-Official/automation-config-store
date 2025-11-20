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

export class MockOnIssueProcessingClass extends MockAction {
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
    return "on_issue_processing";
  }
  get description(): string {
    return "Mock for on_issue_processing";
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
        igm_action: "on_issue_processing",
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

export class MockOnIssueProcessing1Class extends MockAction {
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
    return "on_issue_processing_1";
  }
  get description(): string {
    return "Mock for on_issue_processing_1";
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
        igm_action: "on_issue_processing_1",
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

export class MockOnIssueProcessing2Class extends MockAction {
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
    return "on_issue_processing_2";
  }
  get description(): string {
    return "Mock for on_issue_processing_2";
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
        igm_action: "on_issue_processing_2",
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
