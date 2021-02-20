const puppeteer = require('puppeteer');

// target this url
const baseUrl = 'jira url'

// your jira credential 
const cred = {
    username : 'email@emaim.com',
    password: 'password'
};

// helper to login
const login = async (page, {username, password}) => {
    await page.type('#username', username);
    await page.click('#login-submit')
    await page.waitFor(200);
    await page.type('#password', password);
    await page.click('#login-submit');    
}

// helper to go to some url
const goToUrl = async (page, address, wait = 'networkidle0') => {
    await page.goto(address, { waitUntil: wait });
}

// IIFE : execute function immediatly on load
/*
    @param min - type Number => min value of ticket
    @param max - type Number => max value of ticket
    example : https://www.xxx/browse/board-2690
*/
(async (min, max) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // overwrite default viewport of Chromium
  await page.setViewport({ width: 1680, height: 836 });
  
  // go to homepage
  await goToUrl(page, baseUrl);
  await page.waitFor(200);
  
  // set credentials values
  await login(page, cred);
 
  // when window.COMPILED is true we can consider that jira is loaded
  await page.waitForFunction('window.COMPILED === true');
 
  // iterate over all pages and take screenshot
  for(let i = min; i <= max; i++){
      console.time('screen');
      await goToUrl(page, `${baseUrl}-${i}`, 'networkidle2');
      await page.screenshot({path: `${__dirname}/screen/screen_${i}.png`, fullPage: true});
      console.timeEnd('screen');
  }
  // close browser
  await browser.close();
})(2500, 2760);
