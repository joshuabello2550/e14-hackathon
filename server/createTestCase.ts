import fs from "fs";
import path from "path";

export function createTestCase(innerTestCase: string): string {
  const template = fs.readFileSync(
    path.join(import.meta.dirname, "testTemplate.js"),
    "utf8"
  );
  return template.replace("{{BODY}}", innerTestCase);
}
