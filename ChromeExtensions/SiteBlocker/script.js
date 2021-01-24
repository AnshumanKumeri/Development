// console.log("Inside popup.js");
const button = document.querySelector(".btn");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

populate();
//  when you will click on popup
// init => populate popup with data from  background
async function populate() {
    let list = await sendTobackground("getlist");
    console.log(list);
    // 
    for (let i = 0; i < list.length; i++) {
        addToList(list[i].site);
    }
}

// user input 
button.addEventListener("click", async function () {
    let toBeBlocked = input.value;
    if (toBeBlocked) {
        // send Site to background
        await sendTobackground(toBeBlocked);
        addToList(toBeBlocked);
        input.value = "";
    }
})

//  reintialize => bg request => populate list 
function addToList(toBeBlocked) {
    let li = document.createElement("li");
    li.setAttribute("class", "list-group-item");
    li.innerHTML = `${toBeBlocked} <i class="fas fa-times"></i>`;
    ul.appendChild(li);
    let i = li.querySelector("i");
    i.addEventListener("click", async function () {
        console.log("mesdghsgdhs  "+i.parentNode.textContent+" herer");
        // removefromdb(i.parentNode.textContent);
        let remove = await sendTobackground(i.parentNode.textContent);
        // console.log(remove);
        i.parentNode.remove();
    })
}

async function removefromdb(site)
{
    await sendTobackground(site+"");
}

function sendTobackground(message) {
    return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(message, function (response
        ) {
            // console.log("recieved from background.js")
            resolve(response);
        });
    })
}