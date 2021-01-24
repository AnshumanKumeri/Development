console.log("I will execute when popup will be clicked");
const button = document.querySelector("button");

button.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, "message from popup")
    })
})

// let message = { greeting: "hello" };

// chrome.runtime.sendMessage(message, function (response) {
//     console.log("recieved from background.js")
//     console.log(response)
// });