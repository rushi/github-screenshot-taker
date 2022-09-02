require("dotenv").config();

const puppeteer = require("puppeteer");
const today = formatDate(new Date());
const dimensions = { width: 1920, height: 1080 };

const capturePhoto = async () => {
    console.log("1. Initializing browser");
    const browser = await puppeteer.launch({
        headless: true, // Change this to false if you want to see the browser
        args: [
            "--no-sandbox",
            "--ash-host-window-bounds=1920x1080",
            `--window-size=${dimensions.width},${dimensions.height}`,
            "--window-position=0,0",
        ],
    });

    console.log("2. Opening new page");
    const page = await browser.newPage();
    await page.setViewport(dimensions);
    await page.goto(process.env.GITHUB_URL);
    const filename = `screenshots/screenshot-${today}.png`;
    console.log(`3. Taking screenshot to ${filename}`);
    await page.screenshot({ path: filename, fullPage: true });

    await browser.close();
    console.log("4. Browser closed");
};

const start = async () => {
    try {
        await capturePhoto();
    } catch (e) {
        console.log(e);
    } finally {
        console.log("5. Process completed");
        process.exit();
    }
};

start();

function formatDate(date = new Date()) {
    const pad = (num) => String(num).padStart(2, "0");
    return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-");
}
