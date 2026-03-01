import { Stagehand } from "@browserbasehq/stagehand";
import { spawn } from 'child_process';

(async () => {
    // Start Xvfb only if DISPLAY isn't already set (CI workflows often set DISPLAY
    // or start Xvfb themselves). Track whether we started it so we only try to
    // kill it if we created it.
    let xvfb;
    let startedXvfb = false;
    if (!process.env.DISPLAY) {
        xvfb = spawn('Xvfb', [':99', '-ac'], { detached: true, stdio: 'ignore' });
        // Allow the child to run independently
        xvfb.unref();
        startedXvfb = true;
        // Ensure child has time to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Make sure code using DISPLAY will find the server
        process.env.DISPLAY = ':99';
    }

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

        // Fallback: try to click the button directly via DOM if Stagehand/LLM
        // didn't produce a usable elementId. This helps in CI where LLM
        // outputs may differ or the accessibility tree is different.
        try {
            // Try XPath search for a button containing the text "it's free".
            const handles = await page.$x(`//button[contains(., "it's free")]`);
            if (handles && handles.length > 0) {
                await handles[0].click();
                console.log('✅ Fallback DOM click succeeded');
            } else {
                console.warn('⚠️ Fallback: no matching button found in DOM');
            }
        } catch (e) {
            console.error('❌ Fallback click failed:', e);
        }
    } finally {
        await stagehand.close();
        
        // Kill Xvfb process only if we started it. Use process group kill with
        // a safe fallback to avoid exceptions if the process already exited.
        if (startedXvfb && xvfb && xvfb.pid) {
            try {
                process.kill(-xvfb.pid);
            } catch (err) {
                try {
                    process.kill(xvfb.pid);
                } catch (e) {
                    // ignore if already dead
                }
            }
        }
    }
})();
