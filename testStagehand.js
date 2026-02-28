import { Stagehand } from "@browserbasehq/stagehand";
import { spawn } from 'child_process';

(async () => {
    // Start Xvfb
    const xvfb = spawn('Xvfb', [':99', '-ac'], { detached: true });

    // Wait for a moment to allow Xvfb to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    const stagehand = new Stagehand({
        model: "anthropic/claude-sonnet-4-20250514",
        env: "LOCAL",
    });

    await stagehand.init();
    const page = stagehand.context.pages()[0];

    // Test actions
    try {
        await page.goto('https://ossy.ai/welcome');
        await stagehand.act("click the button with text '(it's free)'");
        console.log("✅ Done!");
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await stagehand.close();
        
        // Kill Xvfb process
        process.kill(xvfb.pid);
    }
})();
