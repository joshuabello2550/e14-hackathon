import type { StagehandAction } from "./stagehand.types";

/**
 * Generate imports section
 */
export function generateImports(): string {
  return 'import { Stagehand } from "@browserbasehq/stagehand";\n';
}

/**
 * Generate setup section
 */
export function generateSetup(): string {
  let setup = "";

  setup += "  const stagehand = new Stagehand({\n";
  setup += '    env: "BROWSERBASE",\n';
  setup += "    apiKey: process.env.BROWSERBASE_API_KEY,\n";
  setup += "    projectId: process.env.BROWSERBASE_PROJECT_ID,\n";
  setup += "    model: {\n";
  setup += '      modelName: "anthropic/claude-sonnet-4-20250514",\n';
  setup += "      apiKey: process.env.ANTHROPIC_API_KEY,\n";
  setup += "    },\n";
  setup += "  });\n\n";

  setup += "  const result = await stagehand.init();\n";
  setup += '  console.log("🔗 Watch live:", result.debugUrl);\n\n';
  setup += "  const page = stagehand.context.pages()[0];\n\n";

  return setup;
}

/**
 * Generate action code
 */
export function generateActionCode(
  action: StagehandAction,
  stepNumber: number
): string {
  let code = `  // Step ${stepNumber}`;

  if (action.reasoning) {
    code += ` - ${action.reasoning.substring(0, 60)}`;
  }
  code += "\n";

  switch (action.action) {
    case "navigate":
      code += `  await page.goto('${action.target}');\n`;
      break;
    case "click":
      code += `  await stagehand.act("click ${action.target}");\n`;
      break;
    case "fill": {
      const fillValue = action.value || "{{VALUE}}";
      code += `  await stagehand.act("fill ${action.target} with '${fillValue}'");\n`;
      break;
    }
    case "select":
      code += `  await stagehand.act("select ${action.target}");\n`;
      break;
    default:
      code += `  // Unknown action: ${action.action}\n`;
  }

  return code;
}

/**
 * Generate test steps
 */
export function generateTestSteps(
  actions: StagehandAction[],
  initialUrl?: string
): string {
  let code = "";
  let stepNumber = 1;

  // Add initial navigation if URL provided
  if (initialUrl) {
    code += `  // Step ${stepNumber} - Navigate to starting URL\n`;
    code += `  await page.goto('${initialUrl}');\n`;
    stepNumber++;
  }

  for (let i = 0; i < actions.length; i++) {
    code += generateActionCode(actions[i], stepNumber);
    stepNumber++;
  }

  return code;
}

/**
 * Generate cleanup section
 */
export function generateCleanup(): string {
  return "  await stagehand.close();\n";
}

/**
 * Generate complete Stagehand test code
 */
export function generateStagehandCode(
  actions: StagehandAction[],
  initialUrl?: string
): string {
  let code = "";

  // // Imports
  // code += generateImports();
  // code += "\n";

  // // Main function
  // code += "export async function test() {\n";
  // code += "  try {\n";

  // // Setup (indented)
  // const setup = generateSetup();
  // setup.split("\n").forEach((line) => {
  //   if (line) {
  //     code += `  ${line}\n`;
  //   }
  // });

  // Test steps (indented)
  const steps = generateTestSteps(actions, initialUrl);
  steps.split("\n").forEach((line) => {
    if (line) {
      code += `  ${line}\n`;
    } else {
      code += "\n";
    }
  });

  code += "\n";

  // // Cleanup (indented)
  // const cleanup = generateCleanup();
  // cleanup.split("\n").forEach((line) => {
  //   if (line) {
  //     code += `    ${line}\n`;
  //   }
  // });

  // // Error handling
  // code += "  } catch (error) {\n";
  // code += '    console.error("❌ Test failed:", error);\n';
  // code += "    throw error;\n";
  // code += "  }\n";
  // code += "}\n\n";

  // // Run the test
  // code += "test();\n";

  return code;
}

/**
 * Generate code statistics
 */
export function getCodeStats(actions: StagehandAction[]): {
  totalActions: number;
  actionsByType: Record<string, number>;
  hasPopups: boolean;
  avgConfidence: number;
} {
  const actionsByType: Record<string, number> = {};

  actions.forEach((action) => {
    actionsByType[action.action] = (actionsByType[action.action] || 0) + 1;
  });

  return {
    totalActions: actions.length,
    actionsByType,
    hasPopups: false,
    avgConfidence: 0,
  };
}
