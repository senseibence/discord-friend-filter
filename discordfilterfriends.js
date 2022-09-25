const XMLHttpRequest = require('xhr2');
const puppeteer = require("puppeteer");
const youtubeApiKey = require('./apikey.json'); // apikey in seperate file
let youtubeID;

(async () => {

  const link = 'ws://127.0.0.1:9222/devtools/browser/95add02f-4ed1-45e0-9f31-148dc1a61622';
  const browser = await puppeteer.connect({
      headless: true,
      defaultViewport: null,
      browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  await page.goto("https://discord.com/channels/@me", { waitUntil: "networkidle2" })

  // sometimes discord logs you out in browser
  if (await page.$('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > section > div > h3')+"" != "null") {
    await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > section > div > button.marginTop8-24uXGp.marginCenterHorz-574Oxy.linkButton-2ax8wP.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorLink-1Md3RZ.sizeMin-DfpWCE.grow-2sR_-F > div');
    await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > section > div > button.marginTop8-24uXGp.marginCenterHorz-574Oxy.linkButton-2ax8wP.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorLink-1Md3RZ.sizeMin-DfpWCE.grow-2sR_-F > div');

    await page.waitForTimeout(500);
    await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > section > div > div.list-3-WAYB > div > div > div.userActions-2T4MMd > button.button-f2h6uQ.lookFilled-yCfaCM.colorPrimary-2AuQVo.sizeMedium-2bFIHr.grow-2sR_-F');
    await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > section > div > div.list-3-WAYB > div > div > div.userActions-2T4MMd > button.button-f2h6uQ.lookFilled-yCfaCM.colorPrimary-2AuQVo.sizeMedium-2bFIHr.grow-2sR_-F');

    await page.waitForTimeout(2000);
    await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > div > form > div > div > div.mainLoginContainer-wHmAjP > div.block-3uVSn4.marginTop20-2T8ZJx > button.marginBottom8-emkd0_.button-1cRKG6.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ.sizeLarge-3mScP9.fullWidth-fJIsjq.grow-2sR_-F');
    await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div > div > div > form > div > div > div.mainLoginContainer-wHmAjP > div.block-3uVSn4.marginTop20-2T8ZJx > button.marginBottom8-emkd0_.button-1cRKG6.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ.sizeLarge-3mScP9.fullWidth-fJIsjq.grow-2sR_-F');
    await page.waitForTimeout(4000);
  }

  await page.waitForTimeout(1000);
  await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div.content-1SgpWY > div.container-2cd8Mz > section > div.children-3xh0VB > div.tabBar-ra-EuL.topPill-3DJJNV > div:nth-child(3)');
  await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div.content-1SgpWY > div.container-2cd8Mz > section > div.children-3xh0VB > div.tabBar-ra-EuL.topPill-3DJJNV > div:nth-child(3)');

  const numberOfRequests = 3; // I'm sure it tells you how many friend requests you have (change this number)
  for (let i = 1; i < numberOfRequests; i++) {

    await page.waitForTimeout(1000);
    await page.waitForSelector('#pending-tab > div.peopleList-2VBrVI.auto-2K3UW5.scrollerBase-_bVAAt > div:nth-child(1) > div:nth-child('+i+') > div');
    await page.click('#pending-tab > div.peopleList-2VBrVI.auto-2K3UW5.scrollerBase-_bVAAt > div:nth-child(1) > div:nth-child('+i+') > div');

    await page.waitForTimeout(1000);
    await page.waitForXPath('//*[@id="app-mount"]/div[2]/div/div[3]/div[2]/div/div/div[1]/header/div[2]/span[1]');
    let [getNameXPath] = await page.$x('//*[@id="app-mount"]/div[2]/div/div[3]/div[2]/div/div/div[1]/header/div[2]/span[1]');
    let username = await page.evaluate(getNameXPath => getNameXPath.textContent, getNameXPath);

    await page.waitForTimeout(1000);
    let exists = await page.$('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.body-1Ukv50 > div > div.connectedAccounts-2R5M4w.userInfoSection-2u2hir')+"";

    if (exists != "null") {
        let element = await page.$eval('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.body-1Ukv50 > div > div.connectedAccounts-2R5M4w.userInfoSection-2u2hir', e => e.innerHTML);
        const regex = /href="https:\/\/www.youtube.com.*?"/;
        let found = element.match(regex)+"";

        if (found != "null") { // if (we found a youtube link)
            youtubeID = found.replace(/\"/g, "");
            youtubeID = youtubeID.slice(37); // need this for API

            await page.waitForTimeout(500);
            getSubscriberCount(youtubeID, youtubeApiKey, browser, username, page);
            
            
        }
        
    }
    
    await page.bringToFront();
    page.keyboard.press('Escape');

  }

})(); 

async function getSubscriberCount(youtubeID, youtubeApiKey, browser, username, page) {
    let text; let json;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {

            text = this.responseText;
			json = JSON.parse(text);
            const subCount = json.items[0].statistics.subscriberCount;
            console.log(subCount);
            console.log(username);

            if (subCount >= 1) {
                sendEmail(browser, username, page);
            }

        }
    });
    

    xhr.open("GET", `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youtubeID}&key=${youtubeApiKey}`, true); // false for synchronous request
    xhr.send(null);

}

async function sendEmail(browser, username, page) {

    const page2 = await browser.newPage();
    await page2.goto("https://mail.google.com/mail/u/0/#inbox", { waitUntil: "networkidle2" })
  
    await page2.waitForSelector('body > div:nth-child(20) > div.nH > div > div.nH.aqk.aql.bkL > div.aeN.WR.nH.oy8Mbf > div.aic > div > div');
    await page2.click('body > div:nth-child(20) > div.nH > div > div.nH.aqk.aql.bkL > div.aeN.WR.nH.oy8Mbf > div.aic > div > div');
    await page2.waitForTimeout(500)
    await page2.type("#\\:qd", "bence.lukacsy@gmail.com");
    await page2.type("#\\:pv", "The user "+username+" has over 50k subscribers");  

    await page2.waitForTimeout(500);
    await page2.waitForSelector("#\\:pl");
    await page2.click("#\\:pl");
    
    await page2.waitForTimeout(500);
    await page2.close();
    
    console.log("Email Sent");
}
