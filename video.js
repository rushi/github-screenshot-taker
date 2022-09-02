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
            console.log(`Cannot crop ${rawFile}`);
            console.log(e);
        }

        filesCropped++;
        console.log(`${filesCropped}/${rawFiles.length} files cropped...`);
    }

    // Create the temporary list file
    try {
        await fs.writeFileSync("./tmp/list.txt", "");
    } catch (e) {
        console.log("Error creating ./tmp/list.txt");
        console.log(e);
        process.exit(1);
    }

    const croppedFiles = fs
        .readdirSync("./tmp/")
        .filter((item) => !ignoredFiles.includes(item))
        .map((item) => `./tmp/${item}`)
        .sort((a, b) => {
            const dateA = getDateFromFilename(a.replace("./tmp/", "").replace(".png", ""));
            const dateB = getDateFromFilename(b.replace("./tmp/", "").replace(".png", ""));
            return dateB - dateA;
        })
        .reverse();

    console.log("Creating the video...");
    try {
        for (const file of croppedFiles) {
            try {
                await fs.appendFileSync("./tmp/list.txt", `\nfile '${file.replace("./tmp/", "")}'`);
                await fs.appendFileSync("./tmp/list.txt", "\nduration 0.10");
            } catch (e) {
                console.log(`Cannot write ${file}`);
            }
        }

        await execSync("ffmpeg -y -f concat -i ./tmp/list.txt -codec libx264 screenshots/video.mp4 ");
        console.log("Cleaning up tmp files");
        for (const file of fs.readdirSync("./tmp/").filter((item) => item !== ".gitignore")) {
            try {
                console.log(`Deleting ${file}`);
                await fs.unlinkSync(`./tmp/${file}`);
            } catch (e) {
                console.log(`Cannot unlink ${file}`, e);
            }
        }

        console.log(`Video created: screenshots/video.mp4`);
    } catch (e) {
        console.log("Cannot create the video");
        console.log(e);
    }
};

run();

function getDateFromFilename(date) {
    const dateParts = date.split("-");
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}
