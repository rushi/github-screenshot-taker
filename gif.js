const fs = require("fs");
const sharp = require("sharp");
const execSync = require("child_process").execSync;
const ignoredFiles = [".gitignore", "list.txt", "video.mp4"];

const run = async () => {
    const rawFiles = fs
        .readdirSync("./screenshots/")
        .filter((item) => !ignoredFiles.includes(item) && item.startsWith("screenshot-"))
        .map((item) => `screenshots/${item}`);

    let filesCropped = 0;
    for (const rawFile of rawFiles) {
        try {
            await sharp(rawFile)
                .extract({ width: 1920, height: 900, left: 0, top: 300 })
                .toFile(`./tmp/${rawFile.replace("screenshots/screenshot-", "")}`);
        } catch (e) {
            process.stdout.write("\x1b[2K\r");
            console.log(`Cannot crop ${rawFile}`);
            console.log(e);
        }

        filesCropped++;
        process.stdout.write("\x1b[2K\r");
        process.stdout.write(`${filesCropped}/${rawFiles.length} files cropped...`);
    }

    const croppedFiles = fs
        .readdirSync("./tmp/")
        .filter((item) => !ignoredFiles.includes(item))
        .sort((a, b) => {
            const dateA = new Date(a.replace(".png", ""));
            const dateB = new Date(b.replace(".png", ""));
            return dateA - dateB;
        });

    fs.mkdirSync("./output", { recursive: true });

    const now = new Date().toISOString().slice(0, 10);
    const filename = `output/gif-${now}.gif`;
    const paletteFile = "./tmp/palette.png";
    const listFile = "./tmp/gif-list.txt";

    fs.writeFileSync(listFile, croppedFiles.map((file) => `file '${file}'`).join("\n"));

    console.log(`\nGenerating gif file ${filename}\n`);
    try {
        execSync(`ffmpeg -y -r 10 -f concat -safe 0 -i ${listFile} -vf palettegen ${paletteFile}`);
        execSync(`ffmpeg -y -r 10 -f concat -safe 0 -i ${listFile} -i ${paletteFile} -lavfi paletteuse ${filename}`);

        console.log(`\nDeleting temporary files`);
        for (const file of fs.readdirSync("./tmp/").filter((item) => item !== ".gitignore")) {
            try {
                fs.unlinkSync(`./tmp/${file}`);
            } catch (e) {
                console.log(`Cannot unlink ${file}`, e);
            }
        }

        console.log(`\nGif created: ${filename}\n`);
    } catch (e) {
        console.log("Cannot create the gif");
        console.log(e);
    }
};

run();
