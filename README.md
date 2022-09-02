# GitHub Screenshot Taker 🤳

A [Puppeteer](https://github.com/GoogleChrome/puppeteer) script to take a screenshot of your GitHub account everyday.

It can result in cool looking gifs like this one:
https://twitter.com/i/status/1092813820706189313

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
