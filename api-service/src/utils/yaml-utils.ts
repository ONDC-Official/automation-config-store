import yaml from "js-yaml";
import RefParser from "@apidevtools/json-schema-ref-parser";

export async function loadAndDereferenceYaml<T>(yamlData: string) {
	const raw = yaml.load(yamlData);
	const data = (await dereferenceSchema(raw)) as T;
	return data;
}

async function dereferenceSchema(schema: any) {
	try {
		const dereferencedSchema = await RefParser.dereference(schema);
		return dereferencedSchema;
	} catch (error) {
		console.error("Error dereferencing schema:", error);
	}
}
