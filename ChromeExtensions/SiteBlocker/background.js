let blockedSites = [];
// listener 
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        if (request == "getlist") {
            return sendResponse(blockedSites);
        }
        else
        {
            console.log("Inside else in background");
            for (let i = 0; i < blockedSites.length; i++)
            {
              console.log(request + "->" + blockedSites[i].site);  
              if(blockedSites[i].site == request.trim())
              {
                console.log("Inside if");
                console.log("Before Removing " + blockedSites.length);
                blockedSites.splice(i,1);
                console.log("After Removing " + blockedSites.length);
                return sendResponse(blockedSites);
              }  
            }   
        }

        blockedSites.push({ site: request, time: 10 });
    })

async function init() {

    if (blockedSites.length > 0) {
        // query => current tab 
        // query for current tab
        let tab = await getCurrentTab();
        // console.log(tab);
        if (tab) {
            let cTabUrl = tab.url;
            for (let i = 0; i < blockedSites.length; i++) {
                let isMatching = cTabUrl.includes(blockedSites[i].site);
                if (isMatching) {

                    chrome.browserAction.setBadgeText({ text: blockedSites[i].time + "" });
                    blockedSites[i].time--;
                    console.log("time remaining  " + blockedSites[i].time);
                    if (blockedSites[i].time <= 0) {
                        // close current tab
                        await closeTab(tab.id);
                        console.log("closed" + blockedSites[i].site);
                        chrome.browserAction.setBadgeText({ text: "" });
                    }
                }

            }
        }
        // console.log("Polling");
    }
}
function getCurrentTab() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({ active: true, 
            currentWindow: true }, function (tabs) {
            resolve(tabs[0]);
        })
    })

}
setInterval(init, 1000);



function closeTab(id) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.remove(id, function () {
            resolve();
        });
    })
}