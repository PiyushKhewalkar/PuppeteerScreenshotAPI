const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/screenshot', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        console.log(`Launching browser to capture screenshot of: ${url}`);
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url);
        const screenshotBuffer = await page.screenshot();
        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshotBuffer);
    } catch (error) {
        console.error('Error generating screenshot:', error);
        res.status(500).send('Error generating screenshot');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
