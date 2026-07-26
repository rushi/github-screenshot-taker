# GitHub Screenshot Taker 🤳

A [puppeteer](https://github.com/puppeteer/puppeteer) script to take a screenshot of your GitHub account everyday. It can result in cool looking gif/videos of your GitHub profile and it's evolution over time.

For fun I have been running this since September 2022 with 100+ screenshots captured, and it makes for a nice visual.

<img width="640" height="300" alt="gif-2026-07-26-smaller" src="https://github.com/user-attachments/assets/5d37699f-abaa-4f5f-84d5-517438fb7038" />

## Setup

To setup this app just setup the `.env` file and update it to have the URL of your Github profile. 

```bash
cp .env.example .env
# edit .env
npm install
```

You can run it once, or setup a crontab to run it everyday

```bash
// Add this to your crontab
0 0 * * * cd {path/to/github-screenshot-bot} && node app.js
```

## Making a video

Once you've collected screenshots, use `video.js` to crop them and stitch them into an mp4 (requires `ffmpeg`):

```bash
node video.js
```

It crops each screenshot in `screenshots/`, sorts them by date, then runs `ffmpeg` to produce `output/video-{date}.mp4`.

## Making a gif

Same idea as `video.js`, but produces an animated gif instead (requires `ffmpeg`):

```bash
node gif.js
```

It crops each screenshot, generates an optimized color palette, then runs `ffmpeg` to produce `output/gif-{date}.gif`.
