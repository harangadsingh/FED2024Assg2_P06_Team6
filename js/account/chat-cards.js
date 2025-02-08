let userListingData = []; //User's listings
let chatDataWhereUserIsSeller = []; //Chats where other person is the buyer + their data
let chatDataWhereUserIsBuyer = []; //Chats where other person is the seller + their data

chats();
async function chats() {
    await fetchChats();
    createChats();
    async function fetchChats() {
        const onlineChatUrl = "https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat";
        const onlineListingUrl = "https://mokesellfed-153b.restdb.io/rest/listing-to-seller";

        userListingData = await fetchListingsBySeller();
        chatDataWhereUserIsSeller = await fetchChatsWhereUserIsSeller();
        chatDataWhereUserIsBuyer = await fetchChatsWhereuserIsBuyer();

        function fetchListingsBySeller() {
            const onlineListingQuery = `?q={"seller._id":"${userAccountID}"}`;
            return fetchAPI(onlineListingUrl + onlineListingQuery, "user listings");
        }

        function fetchChatsWhereUserIsSeller() {
            let listingIDArray = userListingData.map((listing) => listing.listing[0]._id);
            const onlineChatQuery = `?q={"listing._id":{"$in":${JSON.stringify(listingIDArray)}}}`;
            const chatData = fetchAPI(onlineChatUrl + onlineChatQuery, "user chats by listing");
            return chatData;
        }

        async function fetchChatsWhereuserIsBuyer() {
            const onlineChatQuery = `?q={"buyer._id":"${userAccountID}"}`;
            const chatData = await fetchAPI(onlineChatUrl + onlineChatQuery, "user chats by buyer");

            //Get seller's data
            const listingIDArray = chatData.map((chat) => chat.listing[0]._id);
            const sellerData = await fetchSellersByListing(listingIDArray);

            //Combine chat data with seller data
            chatDataWithSellerData = chatData.map((value, index) => ({
                chat: value,
                "listing-to-seller": sellerData[index],
            }));

            return chatDataWithSellerData;

            function fetchSellersByListing(listingIDArray) {
                const onlineListingQuery = `?q={"listing._id":{"$in":${JSON.stringify(listingIDArray)}}}`;
                return fetchAPI(onlineListingUrl + onlineListingQuery, "user listings");
            }
        }
    }

    function createChats() {
        createChatsWhereUserIsSeller();
        createChatsWhereUserIsBuyer();

        function createChatsWhereUserIsSeller() {
            for (const chat of chatDataWhereUserIsSeller) {
                const imgSrc = chat.listing[0].images.split("\n")[0]; //Get first img
                const title = chat.listing[0].name;
                const text = chat.buyer[0].username;
                const chatID = chat._id;
                const listingData = JSON.stringify(userListingData.find((listing) => listing.listing[0]._id == chat.listing[0]._id));
                const chatCard = createChatCard(imgSrc, title, text, chatID, "seller", listingData);
                document.querySelector("#chats-with-customer").innerHTML += chatCard;
            }
        }
        function createChatsWhereUserIsBuyer() {
            for (const chat of chatDataWhereUserIsBuyer) {
                const imgSrc = chat["listing-to-seller"].listing[0].images.split("\n")[0]; //Get first img
                const title = chat["listing-to-seller"].listing[0].name;
                const text = chat["listing-to-seller"].seller[0].username;
                const chatID = chat.chat._id;
                const listingData = JSON.stringify(chat["listing-to-seller"]);
                const chatCard = createChatCard(imgSrc, title, text, chatID, "buyer", listingData);
                document.querySelector("#chats-with-seller").innerHTML += chatCard;
            }
        }
    }
}

function createChatCard(imgSrc, title, text, chatID, userRole, listingData) {
    return `
    <div class="col mb-5 mx-1 p-0">
        <div class="card" style="width: 18rem">
            <img src="${imgSrc}" class="card-img-top card-img" alt="..." />
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${text}</p>
                <form action="/chat-page.html" method="GET">
                    <input type="hidden" value="${chatID}" name="chatID" />
                    <input type="hidden" value="${userRole}" name="userRole" />
                    <input type="hidden" value='${listingData}' name="listingData" />
                    <button type="submit" class="btn btn-primary">Chat</a>
                </form>
            </div>
        </div>
    </div>`;
}
