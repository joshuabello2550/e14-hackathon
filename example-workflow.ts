/*
  Stagehand is the reliable and production-ready framework for
  automating the web with AI.

  Need help? https://www.stagehand.dev/slack
  Check out the docs! https://docs.stagehand.dev/

  To start - click "Run" (top right corner ↗️).
*/

import { Stagehand } from "@browserbasehq/stagehand";

// 1 - Initialize Stagehand
// Provide an explicit env so Stagehand knows whether to launch a local
// browser or connect to Browserbase. The script is intended to run locally,
// so set env to "LOCAL". Adjust to "BROWSERBASE" if you use Browserbase.
const stagehand = new Stagehand({
  model: "anthropic/claude-sonnet-4-20250514",
  env: "LOCAL",
});

await stagehand.init();

const page = stagehand.context.pages()[0];

// 2 - Open Google
 try {
        // Navigate to the page
        await page.goto('https://ossy.ai/welcome');

        // Step 1
        await stagehand.act("click the button with text '(it's free)'");
        // // Step 2
        // await stagehand.act("click the subject selector dropdown in the transcript settings panel");
        // // Step 3
        // await stagehand.act("click the toggle switch in the transcript settings panel");
        // // Step 4
        // await stagehand.act("click the checkbox in the transcript settings panel");
        // // Step 5
        // await stagehand.act("click the checkbox input in the transcript settings panel");
        // // Step 6
        // await stagehand.act("click the close settings panel button");
        // // Step 7
        // await stagehand.act("click the 'Sign in with Google' button");       
        // // Step 8
        // await stagehand.act("click the empty button in the tab row with light blue background");
        // // Step 9
        // await stagehand.act("click the button with blue background in the center of the content area");
        // // Step 10
        // await stagehand.act("click the button with an input field inside it");
        // // Step 11
        // await stagehand.act("click the 'Browse files' button");
        // // Step 12
        // await stagehand.act("click the button with 'Browse files' text");
        // // Step 13
        // await stagehand.act("click the blue button with padding in the centered area");
        // // Step 14
        // await stagehand.act("click the blue button with an input field inside it");
        // // Step 15
        // await stagehand.act("fill the input field inside the dodgerblue button with '<UNKNOWN>'");
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await stagehand.close();
    }