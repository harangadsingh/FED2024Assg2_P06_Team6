const apiKey = "67960fb80acc0626570d3648";
const getSettings = { headers: { "x-apikey": apiKey } };

const urlParams = new URLSearchParams(window.location.search);
const listingData = JSON.parse(urlParams.get("listingData"));
const listingId = listingData.listing[0]._id;
const buyerId = JSON.parse(localStorage.getItem("userAccount"))._id;
let chatID = "";
let nextMessageNumber = 0;
let onlineChatMessagesUrl = "";

createConversation();
function createConversation() {
    const onlineChatUrl = `https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat?q={"listing._id":"${listingId}","buyer._id":"${buyerId}"}`;
    fetch(onlineChatUrl, getSettings)
        .then((res) => res.json())
        .then((data) => {
            if (data.length != 0) {
                chatID = data[0]._id;
                loadConversation();
            }
        })
        .catch((e) => {
            console.error(e);
        });
}

function loadConversation() {
    onlineChatMessagesUrl = `https://mokesellfed-153b.restdb.io/rest/chat-message?q={"chat-id._id":"${chatID}"}&sort=message-number&dir-1`;

    fetch(onlineChatMessagesUrl, getSettings)
        .then((res) => res.json())
        .then((data) => {
            createConversationElements(data);
        })
        .catch((e) => {
            console.error(e);
        });
}

function createConversationElements(chatMessages) {
    const sellerNameHeader = document.querySelector(".seller-name");
    const listingNameHeader = document.querySelector(".conversation-subject");

    sellerNameHeader.innerText = listingData.seller[0].username;
    listingNameHeader.innerText = listingData.listing[0].name;

    console.log(chatMessages);
    nextMessageNumber = chatMessages.length; //The numbers start from 0
    const chatContainer = document.querySelector(".chat-container");

    for (const message of chatMessages) {
        if (message.originator[0].originator == "seller") {
            const messageContainer = createAppendElement("div", "", chatContainer, ["row", "other-chatter"]);
            const messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
            createAppendElement("p", message.message, messageTextContainer);
            createAppendElement("div", "", messageContainer, ["col"]);
        } else {
            const messageContainer = createAppendElement("div", "", chatContainer, ["row", "current-chatter"]);
            createAppendElement("div", "", messageContainer, ["col"]);
            const messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
            createAppendElement("p", message.message, messageTextContainer);
        }
    }
}

function createAppendElement(elementType, text, parent = "", classes = "") {
    const element = document.createElement(elementType);
    element.innerText = text;
    classes != "" && element.classList.add(...classes); //If there is a class, add it
    parent != "" && parent.append(element); //If there is a parent, append the element to it
    return element;
}

const chatForm = document.querySelector("#chat-form");
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const chatMsg = document.querySelector("textarea").value;
    if (chatMsg == "") return;

    const chatContainer = document.querySelector(".chat-container");

    const messageContainer = createAppendElement("div", "", chatContainer, ["row", "current-chatter"]);
    createAppendElement("div", "", messageContainer, ["col"]);
    const messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
    createAppendElement("p", chatMsg, messageTextContainer);

    let chat = "";
    await fetch(`https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat?q={"_id":"${chatID}"}`, getSettings)
        .then((res) => res.json())
        .then((data) => {
            chat = data[0];
        })
        .catch((e) => {
            console.error(e);
        });

    const jsondata = {
        "chat-id": chat,
        "message-number": nextMessageNumber,
        originator: "buyer",
        "message-datetime": new Date().toLocaleTimeString(),
        message: chatMsg,
    };
    let postSettings = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey,
        },
        body: JSON.stringify(jsondata),
    };

    fetch(onlineChatMessagesUrl, postSettings)
        .then((res) => {
            console.log("Message sent to backend.");
        })
        .catch((e) => {
            console.error(e);
        });
});
