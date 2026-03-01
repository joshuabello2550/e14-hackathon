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
        import { Stagehand } from "@browserbasehq/stagehand";

export async function test() {
  try {
    const stagehand = new Stagehand({
      env: "BROWSERBASE",
      apiKey: process.env.BROWSERBASE_API_KEY,
      projectId: process.env.BROWSERBASE_PROJECT_ID,
      model: {
        modelName: "anthropic/claude-sonnet-4-20250514",
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
    });
    const result = await stagehand.init();
    console.log("🔗 Watch live:", result.debugUrl);
    const page = stagehand.context.pages()[0];
    // Step 1 - Navigate to starting URL
    await page.goto('https://ossy.ai/t/zdteo');
    // Step 2
    await stagehand.act("click the 'Not Now' button in the modal dialog");
    // Step 3
    await stagehand.act("click the 'ossy' logo link in the header");
    // Step 4
    await stagehand.act("click the blue button in the left sidebar");
    // Step 5
    await stagehand.act("click the 'Live Transcript' option in the dropdown menu");
    // Step 6
    await stagehand.act("click the toggle switch in the transcript settings panel");
    // Step 7
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 8
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 9
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 10
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 11
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 12
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 13
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 14
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 15
    await stagehand.act("click the 'Start Transcribing' button");
    // Step 16
    await stagehand.act("click the 'Start Transcribing' button in the transcript settings panel");
    // Step 17
    await stagehand.act("click the button in the control bar at the bottom");
    // Step 18
    await stagehand.act("click the 'Not Now' button in the modal dialog");
    // Step 19
    await stagehand.act("click the transcript card titled 'Patient Transfer and Hospital Coordination' with the preview text starting with 'Hospital. Hi, this is Rebecca, a social worker calling from Baycrest Hospital'");
    // Step 20
    await stagehand.act("click the 'ossy' logo link in the sidebar");
    // Step 21
    await stagehand.act("click the transcript card titled 'Scheduling a Family Meeting to Discuss Care Concerns'");
    // Step 22
    await stagehand.act("click the transcript summary text about Rebecca contacting Tamal to arrange a family meeting");
    // Step 23
    await stagehand.act("click the 'New' button in the left sidebar");
    // Step 24
    await stagehand.act("click the 'Live Transcript' option in the dropdown menu");
    // Step 25
    await stagehand.act("click the toggle switch in the transcript settings panel");
    // Step 26
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 27
    await stagehand.act("click the checkbox toggle in the transcript settings panel");
    // Step 28
    await stagehand.act("click the 'Start Transcribing' button");
    // Step 29
    await stagehand.act("click the 'Start Transcribing' button in the transcript settings panel");
    // Step 30
    await stagehand.act("click the green button in the bottom action bar");
    // Step 31
    await stagehand.act("click the 'Not Now' button");
    // Step 32
    await stagehand.act("click the 'New' button in the sidebar");
    // Step 33
    await stagehand.act("click the 'Live Transcript' option in the dropdown menu");
    // Step 34
    await stagehand.act("click the 'Start Transcribing' button");
    // Step 35
    await stagehand.act("click the 'Start Transcribing' button in the transcript settings panel");
    // Step 36
    await stagehand.act("click the gray button in the control panel at the bottom of the screen");


      await stagehand.close();
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

test();

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
