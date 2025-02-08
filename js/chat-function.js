const urlParams = new URLSearchParams(window.location.search);
const listingData = JSON.parse(urlParams.get("listingData")); //Listing-to-seller collection data
const userRole = urlParams.get("userRole"); //User role
const chatID = urlParams.get("chatID"); //Chat ID

console.log("Listing data: ", listingData);
console.log("User role: ", userRole);
console.log("Chat ID: ", chatID);

const listingInfo = listingData.listing[0]; //Listing info
const sellerInfo = listingData.seller[0]; //Seller info
const buyerInfo = JSON.parse(localStorage.getItem("userAccount")); //Logged in account info
let chatInfo = []; //Chat info
let sellerOriginatorInfo = []; //Seller originator info for when posting messages
let buyerOriginatorInfo = []; //Buyer originator info for when posting messages
let chatMessageNumber = 0; //Message number to assign to the next message posted

document.querySelector(".seller-name").innerText = sellerInfo.username;
document.querySelector(".conversation-subject").innerText = listingInfo.name;

conversation();
async function conversation() {
    const onlineChatUrl = "https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat";
    const onlineChatMessagesUrl = "https://mokesellfed-153b.restdb.io/rest/chat-message";
    chatInfo = await fetchAPI(onlineChatUrl + `?q={"listing._id":"${listingInfo._id}", "buyer._id":"${buyerInfo._id}"}`, "conversation search");

    if (chatInfo.length == 0) {
        console.log("No conversation found. Creating new conversation.");
        chatInfo = await createConversationOnBackend();
    } else {
        console.log("Conversation found. Loading conversation.");
        const chatMessages = await fetchConversationFromBackend();
        chatMessageNumber = chatMessages.length;
        for (const message of chatMessages) {
            createChatMessageElement(message.message, message.originator[0].originator);
        }
    }

    function createConversationOnBackend() {
        return fetchAPI(onlineChatUrl, "conversation creation", apiPOSTsettings({ listing: listingInfo, buyer: buyerInfo }));
    }

    function fetchConversationFromBackend() {
        return fetchAPI(onlineChatMessagesUrl + `?q={"chat-id._id":"${chatInfo[0]._id}"}&sort=message-number&dir-1`, "conversation load");
    }

    const chatForm = document.querySelector("#chat-form");
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newChatMessage = document.querySelector("textarea");
        newChatMessage.value = newChatMessage.value.trim();

        if (newChatMessage.value != "") {
            const chat_id = chatInfo[0];
            const messageNumber = chatMessageNumber;
            const datetime = new Date();
            const originator = buyerOriginatorInfo;
            const message = newChatMessage.value;

            postMessageToBackend(chat_id, messageNumber, datetime, originator, message);
            createChatMessageElement(message, buyerOriginatorInfo[0].originator);
        }
        newChatMessage.value = "";
    });

    function createChatMessageElement(message, originator) {
        const chatContainer = document.querySelector(".chat-container");
        switch (originator) {
            case "seller":
                messageContainer = createAppendElement("div", "", chatContainer, ["row", "other-chatter"]);
                messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
                createAppendElement("p", message, messageTextContainer);
                createAppendElement("div", "", messageContainer, ["col"]);
                break;
            case "buyer":
                messageContainer = createAppendElement("div", "", chatContainer, ["row", "current-chatter"]);
                createAppendElement("div", "", messageContainer, ["col"]);
                messageTextContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
                createAppendElement("p", message, messageTextContainer);
                break;
        }
    }

    function postMessageToBackend(chatID, messageNumber, datetime, originator, message) {
        const jsondata = {
            "chat-id": chatID,
            "message-number": messageNumber,
            "message-datetime": datetime,
            originator: originator,
            message: message,
        };

        const postSettings = apiPOSTsettings(jsondata);
        fetchAPI(onlineChatMessagesUrl, "message post", postSettings);
    }
}

miscellaneousCalls();
async function miscellaneousCalls() {
    const originators = await getOriginatorInfo();
    sellerOriginatorInfo = originators.filter((originator) => originator.originator == "seller");
    buyerOriginatorInfo = originators.filter((originator) => originator.originator == "buyer");

    function getOriginatorInfo() {
        const onlineOriginatorUrl = "https://mokesellfed-153b.restdb.io/rest/chat-originator";
        return fetchAPI(onlineOriginatorUrl, "originator search");
    }
}
