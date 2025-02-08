const urlParams = new URLSearchParams(window.location.search);
const listingData = JSON.parse(urlParams.get("listingData")); //Listing-to-seller collection data
const buyerData = JSON.parse(urlParams.get("buyerData")); //Buyer data
const userRole = urlParams.get("userRole"); //User role
const chatID = urlParams.get("chatID"); //Chat ID

const onlineChatUrl = "https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat";
const onlineChatMessagesUrl = "https://mokesellfed-153b.restdb.io/rest/chat-message";
let chatMsgData = [];

console.log("Listing data: ", listingData);
console.log("Buyer data: ", buyerData);
console.log("User role: ", userRole);
console.log("Chat ID: ", chatID);

if (userRole == "buyer") {
    document.querySelector(".other-person-name").innerText = listingData.seller[0].username;
} else {
    document.querySelector(".other-person-name").innerText = buyerData.username;
}
document.querySelector(".conversation-subject").innerText = listingData.listing[0].name;

conversation();
async function conversation() {
    chatMsgData = await fetchConversation();
    console.log("Chat message data: ", chatMsgData);
    createChatMessageElements(chatMsgData);

    async function fetchConversation() {
        if (chatID != null) {
            //If chat ID is provided, fetch conversation using chat ID
            console.log("Chat id", chatID);
            return fetchAPI(onlineChatMessagesUrl + `?q={"chat-id._id":"${chatID}"}`, "conversation search");
        }

        const chatData = await fetchAPI(
            onlineChatUrl + `?q={"listing._id":"${listingData.listing[0]._id}", "buyer._id":"${buyerData._id}"}`,
            "conversation search"
        );

        if (chatData.length == 0) {
            console.log("No conversation found. Creating new conversation.");
            //If no conversation is found, create a new conversation
            chatMsgData = createConversationData();
        } else {
            chatMsgData = await fetchAPI(onlineChatMessagesUrl + `?q={"chat-id._id":"${chatData[0]._id}"}`, "conversation search");
        }
        return chatMsgData;
    }

    async function createConversationData() {
        //A chat is initiated by the buyer. Thus, it is safe to assume that the logged in user is the buyer.
        const chatData = {
            listing: listingData.listing[0],
            buyer: buyerData,
        };
        //Create a new conversation
        await fetchAPI(onlineChatUrl, "conversation creation", apiPOSTsettings(chatData));
        return [];
    }
}

function createChatMessageElements(chatMsgData) {
    const chatContainer = document.querySelector(".chat-container");
    for (const message of chatMsgData) {
        if (userRole == "buyer") {
            if (message.originator[0].originator == "seller") {
                const messageContainer = document.createElement("div");
                messageContainer.classList.add("row", "other-person-message");
                chatContainer.appendChild(messageContainer);

                const textContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
                createAppendElement("p", message.message, textContainer, ["m-0", "fs-2", "bg-info-subtle"]);
                createAppendElement("div", "", messageContainer, ["col"]);
            } else {
                const messageContainer = document.createElement("div");
                messageContainer.classList.add("row", "this-person-message");
                chatContainer.appendChild(messageContainer);

                createAppendElement("div", "", messageContainer, ["col"]);
                const textContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
                createAppendElement("p", message.message, textContainer, ["m-0", "fs-2", "bg-info"]);
            }
        } else {
            if (message.originator[0].originator == "buyer") {
                const messageContainer = document.createElement("div");
                messageContainer.classList.add("row", "other-person-message");
                chatContainer.appendChild(messageContainer);

                const textContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
                createAppendElement("p", message.message, textContainer, ["m-0", "fs-2", "bg-info-subtle"]);
                createAppendElement("div", "", messageContainer, ["col"]);
            } else {
                const messageContainer = document.createElement("div");
                messageContainer.classList.add("row", "this-person-message");
                chatContainer.appendChild(messageContainer);

                createAppendElement("div", "", messageContainer, ["col"]);
                const textContainer = creataeAppendElement("div", "", messageContainer, ["col-auto"]);
                createAppendElement("p", message.message, textContainer, ["m-0", "fs-2", "bg-info"]);
            }
        }
    }
}

// const listingInfo = listingData.listing[0]; //Listing info
// const sellerInfo = listingData.seller[0]; //Seller info
// const buyerInfo = JSON.parse(localStorage.getItem("userAccount")); //Logged in account info
// let chatInfo = []; //Chat info
// let sellerOriginatorInfo = []; //Seller originator info for when posting messages
// let buyerOriginatorInfo = []; //Buyer originator info for when posting messages
// let chatMessageNumber = 0; //Message number to assign to the next message posted

// document.querySelector(".other-person-name").innerText = sellerInfo.username;
// document.querySelector(".conversation-subject").innerText = listingInfo.name;

// async function asdf() {
//     if (chatID == null) {
//         chatInfo = await fetchAPI(onlineChatUrl + `?q={"listing._id":"${listingInfo._id}", "buyer._id":"${buyerInfo._id}"}`, "conversation search");
//     } else chatInfo = await fetchAPI(onlineChatUrl + `?q={"_id":"${chatID}"}`, "conversation search");

//     console.log("Chat info: ", chatInfo);

//     if (chatInfo.length == 0) {
//         console.log("No conversation found. Creating new conversation.");
//         chatInfo = await createConversationOnBackend();
//     } else {
//         console.log("Conversation found. Loading conversation.");
//         const chatMessages = await fetchConversationFromBackend();
//         chatMessageNumber = chatMessages.length;
//         for (const message of chatMessages) {
//             createChatMessageElement(message.message, message.originator[0].originator);
//         }
//     }

//     function createConversationOnBackend() {
//         return fetchAPI(onlineChatUrl, "conversation creation", apiPOSTsettings({ listing: listingInfo, buyer: buyerInfo }));
//     }

//     function fetchConversationFromBackend() {
//         return fetchAPI(onlineChatMessagesUrl + `?q={"chat-id._id":"${chatInfo[0]._id}"}&sort=message-number&dir-1`, "conversation load");
//     }

//     const chatForm = document.querySelector("#chat-form");
//     chatForm.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const newChatMessage = document.querySelector("textarea");
//         newChatMessage.value = newChatMessage.value.trim();

//         if (newChatMessage.value != "") {
//             const chat_id = chatInfo[0];
//             const messageNumber = chatMessageNumber;
//             const datetime = new Date();
//             const originator = buyerOriginatorInfo;
//             const message = newChatMessage.value;

//             postMessageToBackend(chat_id, messageNumber, datetime, originator, message);
//             createChatMessageElement(message, buyerOriginatorInfo[0].originator);
//         }
//         newChatMessage.value = "";
//     });

//     function createChatMessageElement(message, originator) {
//         const chatContainer = document.querySelector(".chat-container");
//         switch (originator) {
//             case "seller":
//                 messageContainer = createAppendElement("div", "", chatContainer, ["row", "other-chatter"]);
//                 messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
//                 createAppendElement("p", message, messageTextContainer, ["bg-info"]);
//                 createAppendElement("div", "", messageContainer, ["col"]);
//                 break;
//             case "buyer":
//                 messageContainer = createAppendElement("div", "", chatContainer, ["row", "current-chatter"]);
//                 createAppendElement("div", "", messageContainer, ["col"]);
//                 messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
//                 createAppendElement("p", message, messageTextContainer, ["bg-info-subtle"]);
//                 break;
//         }
//     }

//     function postMessageToBackend(chatID, messageNumber, datetime, originator, message) {
//         const jsondata = {
//             "chat-id": chatID,
//             "message-number": messageNumber,
//             "message-datetime": datetime,
//             originator: originator,
//             message: message,
//         };

//         const postSettings = apiPOSTsettings(jsondata);
//         fetchAPI(onlineChatMessagesUrl, "message post", postSettings);
//     }
// }

// miscellaneousCalls();
// async function miscellaneousCalls() {
//     const originators = await getOriginatorInfo();
//     sellerOriginatorInfo = originators.filter((originator) => originator.originator == "seller");
//     buyerOriginatorInfo = originators.filter((originator) => originator.originator == "buyer");

//     function getOriginatorInfo() {
//         const onlineOriginatorUrl = "https://mokesellfed-153b.restdb.io/rest/chat-originator";
//         return fetchAPI(onlineOriginatorUrl, "originator search");
//     }
// }
