const express = require('express');
const chromium = require('chrome-aws-lambda');
const app = express();
const port = process.env.PORT || 3000;

app.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('No URL provided');
    }

    try {
        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const screenshot = await page.screenshot({ encoding: 'binary' });
        await browser.close();
        res.setHeader('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error('Error generating screenshot:', error);  // Log the detailed error
        res.status(500).send('Error generating screenshot: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
