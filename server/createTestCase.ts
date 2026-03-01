import fs from "fs";
import path from "path";

export function createTestCase(innerTestCase: string): string {
  const template = fs.readFileSync(
    path.join(import.meta.dirname, "testTemplate.js"),
    "utf8"
  );
  console.log("innerTestCase: ", innerTestCase);
  return template.replace("{{BODY}}", innerTestCase);
}
