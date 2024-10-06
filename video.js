const fs = require("fs");
const sharp = require("sharp");
const execSync = require("child_process").execSync;
const ignoredFiles = [".gitignore", "list.txt", "video.mp4"];

const run = async () => {
    const rawFiles = fs
        .readdirSync("./screenshots/")
        .filter((item) => !ignoredFiles.includes(item))
        .map((item) => `screenshots/${item}`);

    let filesCropped = 0;
    for (const rawFile of rawFiles) {
        try {
            await sharp(rawFile)
                .extract({ width: 1920, height: 900, left: 0, top: 300 })
                .toFile(`./tmp/${rawFile.replace("screenshots/screenshot-", "")}`);
        } catch (e) {
            process.stdout.write('\x1b[2K\r');
            console.log(`Cannot crop ${rawFile}`);
            console.log(e);
        }

        filesCropped++;
        process.stdout.write('\x1b[2K\r');
        process.stdout.write(`${filesCropped}/${rawFiles.length} files cropped...`);
    }

    // Create the temporary list file
    await fs.writeFileSync("./tmp/list.txt", "");

    const croppedFiles = fs
        .readdirSync("./tmp/")
        .filter((item) => !ignoredFiles.includes(item))
        .map((item) => `./tmp/${item}`)
        .sort((a, b) => {
            const dateA = new Date(a.replace("./tmp/", "").replace(".png", ""));
            const dateB = new Date(b.replace("./tmp/", "").replace(".png", ""));
            return dateB - dateA;
        })
        .reverse();

    const now = (new Date()).toISOString().slice(0, 10);
    const filename = `screenshots/video-${now}.mp4`;
    console.log(`\nGenerating video file ${filename}\n`);
    try {
        for (const file of croppedFiles) {
            try {
                await fs.appendFileSync("./tmp/list.txt", `\nfile '${file.replace("./tmp/", "")}'`);
                await fs.appendFileSync("./tmp/list.txt", "\nduration 0.10");
            } catch (e) {
                console.log(`Cannot write ${file}`);
            }
        }

        await execSync(`ffmpeg -y -f concat -i ./tmp/list.txt -codec libx264 ${filename}`);

        console.log(`\nDeleting ${croppedFiles.length} temporary files`);
        for (const file of fs.readdirSync("./tmp/").filter((item) => item !== ".gitignore")) {
            try {
                await fs.unlinkSync(`./tmp/${file}`);
            } catch (e) {
                console.log(`Cannot unlink ${file}`, e);
            }
        }

        console.log(`\nVideo created: ${filename}\n`);
    } catch (e) {
        console.log("Cannot create the video");
        console.log(e);
    }
};

run();
