const urlParams = new URLSearchParams(window.location.search);
const listingData = JSON.parse(urlParams.get("listingData")); //Listing-to-seller collection data
const buyerData = JSON.parse(urlParams.get("buyerData")); //Buyer data
const userRole = urlParams.get("userRole"); //User role
let chatID = urlParams.get("chatID"); //Chat ID
let originatorData = "";

const onlineChatUrl = "https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat";
const onlineChatMessagesUrl = "https://mokesellfed-153b.restdb.io/rest/chat-message";
let chatMsgData = [];
let messageNumber = 0;

if (userRole == "buyer") {
    document.querySelector(".other-person-name").innerText = listingData.seller[0].username;
} else {
    document.querySelector(".other-person-name").innerText = buyerData.username;
}
document.querySelector(".conversation-subject").innerText = listingData.listing[0].name;

originators();
async function originators() {
    originatorData = await fetchOriginators();

    async function fetchOriginators() {
        const onlineOriginatorUrl = "https://mokesellfed-153b.restdb.io/rest/chat-originator";
        const onlineOriginatorQueryForSeller = `?q={"originator": "seller"}`;
        const onlineOriginatorQueryForBuyer = `?q={"originator": "buyer"}`;
        return [
            await fetchAPI(onlineOriginatorUrl + onlineOriginatorQueryForSeller, "originator search"),
            await fetchAPI(onlineOriginatorUrl + onlineOriginatorQueryForBuyer, "originator search"),
        ];
    }
}

conversation();
async function conversation() {
    chatMsgData = await fetchConversation();
    chatMsgData = chatMsgData.sort((a, b) => a["message-number"] - b["message-number"]);
    createChatMessageElements(chatMsgData);

    async function fetchConversation() {
        if (chatID != null) {
            //If chat ID is provided, fetch conversation using chat ID
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
            chatID = chatData[0]._id;
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
        const newChatData = await fetchAPI(
            onlineChatUrl + `?q={"listing._id":"${listingData.listing[0]._id}", "buyer._id":"${buyerData._id}"}`,
            "conversation search"
        );
        chatID = newChatData[0]._id;
        return [];
    }
}

function createChatMessageElements(chatMsgData) {
    const chatContainer = document.querySelector(".chat-container");
    for (const message of chatMsgData) {
        messageNumber++;
        if (userRole == "buyer") {
            if (message.originator[0].originator == "seller") {
                chatContainer.append(createOtherPersonMessage(message.message));
            } else {
                chatContainer.append(createThisPersonMessage(message.message));
            }
        } else {
            if (message.originator[0].originator == "buyer") {
                chatContainer.append(createOtherPersonMessage(message.message));
            } else {
                chatContainer.append(createThisPersonMessage(message.message));
            }
        }
    }

    function createOtherPersonMessage(message) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("row", "other-person-message");
        const textContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
        createAppendElement("p", message, textContainer, ["m-0", "fs-2", "bg-info-subtle"]);
        createAppendElement("div", "", messageContainer, ["col"]);

        return messageContainer;
    }

    function createThisPersonMessage(message) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("row", "this-person-message");
        createAppendElement("div", "", messageContainer, ["col"]);
        const textContainer = createAppendElement("div", "", messageContainer, ["col-auto"]);
        createAppendElement("p", message, textContainer, ["m-0", "fs-2", "bg-info"]);

        return messageContainer;
    }

    const messageButton = document.querySelector("#send-message");
    const newChatMessage = document.querySelector("textarea");
    messageButton.addEventListener("click", (e) => {
        const message = newChatMessage.value.trim();
        if (message == "") return;

        createThisPersonMessage(message);
        chatContainer.append(createThisPersonMessage(message));

        const originator = userRole == "buyer" ? originatorData[1] : originatorData[0];

        jsondata = {
            "chat-id": chatID,
            "message-number": messageNumber,
            "message-datetime": new Date(),
            originator: originator,
            message: newChatMessage.value,
        };
        fetchAPI(onlineChatMessagesUrl, "message post", apiPOSTsettings(jsondata));

        newChatMessage.value = "";
        messageNumber++;
    });

    newChatMessage.addEventListener("keydown", (e) => {
        if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
        }

        if (e.key == "Enter" && e.shiftKey) {
            newChatMessage.value += "\n";
        }
    });
}
