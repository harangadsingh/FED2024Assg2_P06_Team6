const userAccountID = localStorage.getItem("userAccountID");
let userListingData = []; //User's listings

fetchListings();
async function fetchListings() {
    userListingData = await fetchViaID();
    function fetchViaID() {
        const onlineListingUrl = "https://mokesellfed-153b.restdb.io/rest/listing-to-seller";
        const onlineListingQuery = `?q={"seller._id":"${userAccountID}"}`;
        return fetchAPI(onlineListingUrl + onlineListingQuery, "user listings");
    }

    for (const listing of userListingData) {
        const imgSrc = listing.listing[0].images.split("\n")[0]; //Get first img
        const title = listing.listing[0].name;
        const id = listing.listing[0]._id;
        const card = createListingCard(imgSrc, title, id);
        card.querySelector("form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const listingID = card.querySelector("input").value;
            deleteListing(listingID);
            card.classList.add("d-none");
        });
        document.querySelector("#delete-listings-container").appendChild(card);
    }
}

const deleteListing = async (listingID) => {
    const listingToSellerEntry = await fetchAPI(
        `https://mokesellfed-153b.restdb.io/rest/listing-to-seller?q={"listing._id":"${listingID}"}`,
        "listing-to-seller"
    );
    const listingToSellerEntryID = listingToSellerEntry[0]._id;

    let chatEntryID = "";
    const chatEntry = await fetchAPI(
        `https://mokesellfed-153b.restdb.io/rest/seller-buyer-chat?q={"listing._id":"${listingID}"}`,
        "seller-buyer-chat"
    );
    try {
        chatEntryID = chatEntry[0]._id;
    } catch (e) {}

    let collections = ["listing", "listing-to-seller", "seller-buyer-chat"];
    let recordIDs = [listingID, listingToSellerEntryID, chatEntryID];

    for (let i = 0; i < collections.length; i++) {
        if (recordIDs[i] == "") continue;

        const url = `https://mokesellfed-153b.restdb.io/rest/${collections[i]}/${recordIDs[i]}`;
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey,
            },
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`Listing deleted from ${collections[i]}:`, data);
        } catch (error) {
            console.error(`Error deleting listing from ${collections[i]}:`, error);
        }
    }
};

function createListingCard(imgSrc, title, id) {
    const cardHTML = `
    <div class="col-auto">
    <form class="delete-listing-form" action="">
        <div class="card" style="width: 18rem">
            <img src="${imgSrc}" class="card-img-top card-img" alt="..." />
            <div class="card-body">
                <h5 class="card-title">${title}</h5>   
                <input type="hidden" value="${id}" name="listingID" />
                <button class="btn btn-danger">Delete listing</a>    
            </div>
        </div>
        </form>
    </div>`;

    const template = document.createElement("template");
    template.innerHTML = cardHTML.trim();
    return template.content.firstChild;
}
