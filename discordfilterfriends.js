const XMLHttpRequest = require('xhr2');
const puppeteer = require("puppeteer");
const { youtubeApiKey } = require('./apikey.json');
let youtubeID; let subCount = -1; let arrayAcceptedPeople = []; let username; let rowIndex = 1;

(async () => {

  const link = 'ws://127.0.0.1:9222/devtools/browser/43cc4cb8-8472-4c4e-9633-879982a3f028';
  const browser = await puppeteer.connect({
      headless: true,
      defaultViewport: null,
      browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  await page.goto("https://discord.com/channels/@me", { waitUntil: "networkidle2" })

  await page.waitForTimeout(3000);
  await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div.content-1SgpWY > main > section > div.children-3xh0VB > div.tabBar-ra-EuL.topPill-3DJJNV > div:nth-child(3)');
  await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div.content-1SgpWY > main > section > div.children-3xh0VB > div.tabBar-ra-EuL.topPill-3DJJNV > div:nth-child(3)');

  const numberOfRequests = 2; // set the amount of friend requests you have here
  let index = -1;

  go();

    async function go() {
        index++;

        if (index == numberOfRequests) {
            sendEmail(browser, arrayAcceptedPeople);
            await page.waitForTimeout(10000);
        }

        await page.waitForTimeout(500);
        await page.waitForXPath('//*[@id="pending-tab"]/div[3]/div[1]/div['+rowIndex+']/div/div[1]/div[2]/div[1]/span[1]');
        let [getNameXPath] = await page.$x('//*[@id="pending-tab"]/div[3]/div[1]/div['+rowIndex+']/div/div[1]/div[2]/div[1]/span[1]');
        username = await page.evaluate(getNameXPath => getNameXPath.textContent, getNameXPath);
        //console.log("Username: "+username);
        await page.waitForTimeout(500);

        await page.waitForSelector('#pending-tab > div.peopleList-2VBrVI.auto-2K3UW5.scrollerBase-_bVAAt > div:nth-child(1) > div:nth-child('+rowIndex+') > div');
        await page.click('#pending-tab > div.peopleList-2VBrVI.auto-2K3UW5.scrollerBase-_bVAAt > div:nth-child(1) > div:nth-child('+rowIndex+') > div');

        await page.waitForTimeout(500);
        let connectionsExists = await page.$('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.body-1Ukv50 > div > div.connectedAccounts-2R5M4w.userInfoSection-2u2hir')+"";

        if (connectionsExists != "null") { // if connections exist
            await page.waitForTimeout(500);
            let element = await page.$eval('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.body-1Ukv50 > div > div.connectedAccounts-2R5M4w.userInfoSection-2u2hir', e => e.innerHTML);
            const regex = /href="https:\/\/www.youtube.com.*?"/;
            let found = element.match(regex)+"";

            if (found != "null") { // if (we found a youtube link)
                youtubeID = found.replace(/\"/g, "");
                youtubeID = youtubeID.slice(37); // need this for API
                getSubscriberCount(go, youtubeID, youtubeApiKey, page, username);
            }

            else { 
                checkUserInfo(go, youtubeID, youtubeApiKey, page, username);
            }
        }

        else {
            checkUserInfo(go, youtubeID, youtubeApiKey, page, username)
        }  

    }
  
})(); 

async function checkUserInfo(go, youtubeID, youtubeApiKey, page, username) {

    let linkExists = await page.$('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.body-1Ukv50 > div > div:nth-child(1) > div.userInfoText-2MFCmH.markup-eYLPri > div > a');
    if (linkExists != "null") { // links are wrapped in their own class; checking if it exists

        await page.waitForXPath('//*[@id="app-mount"]/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div[1]/div[1]/div/a');
        let [getLinkXPath] = await page.$x('//*[@id="app-mount"]/div[2]/div/div[3]/div[2]/div/div/div[2]/div/div[1]/div[1]/div/a');
        link = await page.evaluate(getLinkXPath => getLinkXPath.textContent, getLinkXPath);

        if (link.includes("https://www.youtube.com/channel/")) {
            youtubeID = link.slice(32);
            getSubscriberCount(go, youtubeID, youtubeApiKey, page, username);
        }

        else {
            removeRequest(go, page);
        }
    
    }

    else {
        removeRequest(go, page);
    }
}

async function removeRequest(go, page) { 
    await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.topSection-13QKHs > header > div.header-S26rhB > div.headerTop-1PNKck > div.relationshipButtons-3ByBpj > div.pendingIncoming-3g05VP > button.actionButton-iarQTd.actionRightButton-1oVkpk.button-f2h6uQ.lookFilled-yCfaCM.colorPrimary-2AuQVo.sizeSmall-wU2dO-.grow-2sR_-F');
    await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.topSection-13QKHs > header > div.header-S26rhB > div.headerTop-1PNKck > div.relationshipButtons-3ByBpj > div.pendingIncoming-3g05VP > button.actionButton-iarQTd.actionRightButton-1oVkpk.button-f2h6uQ.lookFilled-yCfaCM.colorPrimary-2AuQVo.sizeSmall-wU2dO-.grow-2sR_-F');
    await page.keyboard.press('Escape');
    
    go();
}

async function acceptRequest(go, page, username) {
    arrayAcceptedPeople.push(username);

    // code to autoaccept; you would then not increment rowIndex

    //await page.waitForSelector('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.topSection-13QKHs > header > div.header-S26rhB > div.headerTop-1PNKck > div.relationshipButtons-3ByBpj > div.pendingIncoming-3g05VP > button.actionButton-iarQTd.button-f2h6uQ.lookFilled-yCfaCM.colorGreen-3y-Z79.sizeSmall-wU2dO-.grow-2sR_-F > div');
    //await page.click('#app-mount > div.appDevToolsWrapper-1QxdQf > div > div:nth-child(3) > div.layer-1Ixpg3 > div > div > div.topSection-13QKHs > header > div.header-S26rhB > div.headerTop-1PNKck > div.relationshipButtons-3ByBpj > div.pendingIncoming-3g05VP > button.actionButton-iarQTd.button-f2h6uQ.lookFilled-yCfaCM.colorGreen-3y-Z79.sizeSmall-wU2dO-.grow-2sR_-F > div');

    await page.keyboard.press('Escape');

    console.log(username+" has over 50k, will be emailed when I'm done");
    rowIndex++;

    go();
}

async function getSubscriberCount(go, youtubeID, youtubeApiKey, page, username) {
    let text; let json;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {

            text = this.responseText;
			json = JSON.parse(text);
            subCount = json.items[0].statistics.subscriberCount;
            //console.log("Subcount: "+subCount);

            if (subCount >= 1) { // subscriber minimum
                acceptRequest(go, page, username);
            }

            else {
                removeRequest(go, page);
            }
            
        }
    });
    

    xhr.open("GET", `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youtubeID}&key=${youtubeApiKey}`, true); // false for synchronous request (which won't work)
    xhr.send(null);

}

async function sendEmail(browser, arrayAcceptedPeople) {

    const page2 = await browser.newPage();
    await page2.goto("https://mail.google.com/mail/u/0/#inbox", { waitUntil: "networkidle2" })
  
    await page2.waitForSelector('body > div:nth-child(20) > div.nH > div > div.nH.aqk.aql.bkL > div.aeN.WR.nH.oy8Mbf > div.aic > div > div');
    await page2.click('body > div:nth-child(20) > div.nH > div > div.nH.aqk.aql.bkL > div.aeN.WR.nH.oy8Mbf > div.aic > div > div');

    await page2.waitForTimeout(500);
    await page2.type("#\\:qd", "bence.lukacsy@gmail.com");
    await page2.type("#\\:pv", "List of all discord reqs w/ above 50k (bot rejected the rest anyways)");  
    await page2.type("#\\:r1", arrayAcceptedPeople.join('\n'));
    
    await page2.waitForTimeout(500);
    await page2.waitForSelector("#\\:pl");
    await page2.click("#\\:pl");
    
    await page2.waitForTimeout(1000);
    console.log("Email Sent");
    browser.disconnect();
}
