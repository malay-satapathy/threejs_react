const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle0', timeout: 30000 });
  
  console.log("Page loaded. Waiting for physics to stabilize...");
  
  for (let i = 0; i < 3; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const yPos = await page.evaluate(() => window.playerY);
    console.log(`Time ${i + 1}s - Player Y position: ${yPos}`);
  }
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log('Screenshot saved to screenshot.png');
  
  await browser.close();
})();
