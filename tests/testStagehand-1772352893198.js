import { Stagehand } from "@browserbasehq/stagehand";
import { spawn } from 'child_process';

(async () => {
    let xvfb;
    let startedXvfb = false;
    if (!process.env.DISPLAY) {
        xvfb = spawn('Xvfb', [':99', '-ac'], { detached: true, stdio: 'ignore' });
        xvfb.unref();
        startedXvfb = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        process.env.DISPLAY = ':99';
    }

    const stagehand = new Stagehand({
        model: "anthropic/claude-sonnet-4-20250514",
        env: "LOCAL",
    });

    await stagehand.init();
    const page = stagehand.context.pages()[0];

    try {
            // Step 1 - Navigate to starting URL
    await page.goto('http://localhost:5173/#generate');
    // Step 2
    await stagehand.act("click the 'Get started' button");
    // Step 3
    await stagehand.act("click the input field in the generate form");
    // Step 4
    // Unknown action: change
    // Step 5
    await stagehand.act("click the input field in the generate form");
    // Step 6
    // Unknown action: change



    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    } finally {
        await stagehand.close();
        if (startedXvfb && xvfb && xvfb.pid) {
            try { process.kill(-xvfb.pid); } catch { try { process.kill(xvfb.pid); } catch { } }
        }
    }
})();
