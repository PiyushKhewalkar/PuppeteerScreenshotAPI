const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });
    await browser.close();
    
    res.sendFile(screenshotPath);
  } catch (error) {
    console.error('Error generating screenshot:', error);
    res.status(500).send('Error generating screenshot');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
