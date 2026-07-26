# GitHub Screenshot Taker 🤳

A [Puppeteer](https://github.com/GoogleChrome/puppeteer) script to take a screenshot of your GitHub account everyday.

It can result in cool looking gifs of your GitHub profile changing over time.

For fun I have been running this since September 2022 with 100+ screenshots captured, and it makes for a nice visual.

## Setup

To setup this repository code, you just have to:

```bash
cp .env.example .env
```

Edit `.env` with your Github profile URL

```bash
npm install
```

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
