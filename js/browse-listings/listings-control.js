let listingQualityData = [];
let listingCategoryData = []; //Listing category data. Filtered by search category.
let nameFilteredListingData = [];
let nameAndCategoryFilteredListingData = [];
let nameAndCategoryFilteredListingIDs = [];
let likesArray = []; //I don't really know why the naming convention of this is so different but it is and i'm used to it
let createdListingElements = []; //Array of all the listing elements created
let currentListingIndex = 0; //The index of the listing that is currently being displayed

listings();
async function listings() {
    //This needs to be fetched to reference with the listings, since listing-to-seller only has the ID of these fields.
    listingQualityData = await fetchListingQualities();
    listingCategoryData = await fetchListingCategories();

    nameFilteredListingData = await fetchListings();
    nameAndCategoryFilteredListingData = await filterListingsThroughCategory();
    nameAndCategoryFilteredListingIDs = getListingIDs(nameAndCategoryFilteredListingData);
    likesArray = await fetchLikes(nameAndCategoryFilteredListingIDs);
    createListings(nameAndCategoryFilteredListingData, likesArray);

    function fetchListingQualities() {
        const onlineListingQualitiesUrl = "https://mokesellfed-153b.restdb.io/rest/listing-quality";
        return fetchAPI(onlineListingQualitiesUrl, "listing qualities");
    }

    function fetchListingCategories() {
        const onlineListingCategoriesUrl = "https://mokesellfed-153b.restdb.io/rest/listing-sub-category";
        const categoryQueries = {
            Category: "",
            Electronics: `?q={"category.Category":"Electronics"}`,
            "Mobile Phones": `?q={"sub-category":"Mobile Phones"}`,
            "Game Consoles": `?q={"sub-category":"Game Consoles"}`,
            Computers: `?q={"sub-category":"Computers"}`,
            Apparel: `?q={"category.Category":"Apparel"}`,
            Jackets: `?q={"sub-category":"Jackets"}`,
            "T-Shirts": `?q={"sub-category":"T-Shirts"}`,
            Pants: `?q={"sub-category":"Pants"}`,
        };
        const onlineListingCategoriesQuery = categoryQueries[searchCategory];

        return fetchAPI(onlineListingCategoriesUrl + onlineListingCategoriesQuery, "listing categories");
    }

    function fetchListings() {
        const onlineListingsUrl = "https://mokesellfed-153b.restdb.io/rest/listing-to-seller";

        //If there is a search query, add it to the URL. Elses, leave it blank.
        const onlineListingsQuery = searchQuery == "" ? "" : `?q={"listing.name":{"$regex":"${searchQuery}"}}`;
        return fetchAPI(onlineListingsUrl + onlineListingsQuery, "listings");
    }

    function filterListingsThroughCategory() {
        const filteredData = [];
        for (const listingData of nameFilteredListingData) {
            const categoryIDofListing = listingData.listing[0].category[0];
            //Create an array of just the IDs of the categories, then match it to the listing's category ID.
            if (listingCategoryData.map((category) => category._id).includes(categoryIDofListing)) {
                filteredData.push(listingData);
            }
        }
        return filteredData;
    }

    function getListingIDs(data) {
        return data.map((listingData) => listingData.listing[0]._id);
    }

    function fetchLikes(listingIDs) {
        const onlineLikesUrl = "https://mokesellfed-153b.restdb.io/rest/listing-to-likes";
        const onlineLikesQuery = `?q={"listing._id":{"$in":[${listingIDs.map((id) => `"${id}"`).join(",")}]}}`;
        return fetchAPI(onlineLikesUrl + onlineLikesQuery, "likes");
    }

    function createListings(listingData, likesArray) {
        for (let i = 0; i < listingData.length; i++) {
            const listingSellerPair = listingData[i];
            const likeCount = likesArray.filter((like) => like.listing[0]._id == listingSellerPair.listing[0]._id).length;
            createdListingElements.push(createListingElements(listingSellerPair, likeCount, i));
        }
        createdListingElements[0].classList.remove("d-none");
    }
}

// #region  CREATE LISTING ELEMENTS
const listingsContainer = document.querySelector(".listing");
function createListingElements(listingSellerPair, likesCount, listingNumber) {
    const listing = listingSellerPair.listing[0];
    const seller = listingSellerPair.seller[0];

    const listingName = listing.name;
    const itemPrice = listing.price;
    const itemDesc = listing.description;
    const qualityDesc = listingQualityData.find((quality) => quality._id == listing.quality).quality;
    const deliveryDesc = listing.delivery;
    const imageArray = listing.images.split("\n");
    const sellerProfilePictureImg = seller["profile-picture"];
    const sellerUsername = seller.username;
    const likes = likesCount;

    //Create listing container.
    const container = document.createElement("div");
    container.classList.add("container", "d-none", "listing-container");
    listingsContainer.append(container);
    const row = createAppendElement("div", "", container, ["row"]);

    //Create images
    const imageCol = createAppendElement("div", "", row, ["col-12", "col-xl-5"]);
    if (imageArray.length == 1) {
        const img = createAppendElement("img", "", imageCol, ["listing-img"]);
        img.src = imageArray[0];
    } else {
        const imageCarousel = createImageCarousel(imageArray, listingNumber);
        imageCol.append(imageCarousel);
    }

    //Create listing details
    const textCol = createAppendElement("div", "", row, ["col", "ms-1", "listing-text-start"]);

    //Title
    const title = createAppendElement("h2", listingName, textCol, ["fs-1", "m-0"]);

    //Likes
    createAppendElement("span", likes, title, ["badge", "text-bg-danger", "ms-2"]);

    //Category
    createAppendElement("h4", "Electronics, Mobile Phone", textCol, ["fs-6"]);

    //Price
    createAppendElement("h4", `$${itemPrice}`, textCol, ["fs-4"]);

    //Description
    createAppendElement("p", itemDesc, textCol);
    createAppendElement("hr", "", textCol);

    //Quality
    createAppendElement("h3", "Quality", textCol, ["fs-4"]);
    createAppendElement("p", qualityDesc, textCol);
    createAppendElement("hr", "", textCol);

    //Delivery
    createAppendElement("h3", "Delivery", textCol, ["fs-4"]);
    createAppendElement("p", deliveryDesc, textCol);
    createAppendElement("hr", "", textCol);

    //Seller info
    const sellerContainer = createAppendElement("div", "", textCol, ["seller-container", "row"]);
    createAppendElement("h3", "Seller", sellerContainer, ["fs-4"]);
    //PFP
    const sellerProfilePictureDisplay = createAppendElement("img", "", sellerContainer, ["account-profile-picture"]);
    sellerProfilePictureDisplay.src = sellerProfilePictureImg;

    const sellerTextContainer = createAppendElement("div", "", sellerContainer, ["col", "mt-2"]);
    //Username
    createAppendElement("h3", sellerUsername, sellerTextContainer, ["col-auto", "row"]);

    //Chat button
    const chatWithSellerForm = createAppendElement("form", "", sellerTextContainer, ["col", "row"]);
    chatWithSellerForm.action = "/chat-page.html";
    chatWithSellerForm.method = "GET";
    createAppendElement("button", "Chat with Seller", chatWithSellerForm, ["btn", "btn-primary", "col-auto"]).type = "submit";
    const hiddenInput = createAppendElement("input", "", chatWithSellerForm, ["d-none"]);
    hiddenInput.name = "listingData";
    hiddenInput.value = JSON.stringify(listingSellerPair);

    if (localStorage.getItem("userAccountID") == null) {
        chatWithSellerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Please log in to chat with sellers.");
        });
    }

    return container;
}

function createImageCarousel(images, listingNumber) {
    const carouselContainer = createAppendElement("div", "", "", ["carousel", "slide"]);
    carouselContainer.id = `carousel${listingNumber}`;
    const carouselInnerContainer = createAppendElement("div", "", carouselContainer, ["carousel-inner"]);

    for (let i = 0; i < images.length; i++) {
        const carouselItem = createAppendElement("div", "", carouselInnerContainer, ["carousel-item"]);
        const imgElement = createAppendElement("img", "", carouselItem, ["d-block", "listing-img"]);
        imgElement.src = images[i];

        i == 0 && carouselItem.classList.add("active");
    }
    carouselContainer.innerHTML += `
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel${listingNumber}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carousel${listingNumber}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>`;

    return carouselContainer;
}
// #endregion

window.addEventListener("keydown", (e) => {
    if ((e.code == "ArrowRight" || e.code == "ArrowLeft") && currentListingIndex < createdListingElements.length - 1) {
        if (e.code == "ArrowRight") {
            addListingToLikes(nameAndCategoryFilteredListingData[currentListingIndex].listing[0]);
        }
        moveToNextListing();
    }
});

const trashButton = document.querySelector("#trash-listing");
trashButton.addEventListener("click", () => {
    moveToNextListing();
});
const likeButton = document.querySelector("#like-listing");
likeButton.addEventListener("click", () => {
    addListingToLikes(nameAndCategoryFilteredListingData[currentListingIndex].listing[0]);
    if (currentListingIndex < createdListingElements.length - 1) {
        moveToNextListing();
    }
});

function moveToNextListing() {
    createdListingElements[currentListingIndex].classList.add("d-none");
    currentListingIndex++;
    createdListingElements[currentListingIndex].classList.remove("d-none");
}

async function addListingToLikes(listingData) {
    if (localStorage.getItem("userAccount") == null) {
        alert("Please log in to like listings.");
        return;
    }

    const listingID = listingData._id;
    const accountID = JSON.parse(localStorage.getItem("userAccount"))._id;
    const onlineLikesUrl = "https://mokesellfed-153b.restdb.io/rest/listing-to-likes";
    const onlineLikesQuery = `?q={"listing._id":"${listingID}", "account._id":"${accountID}"}`;

    //Check if there is already an entry in the database with the same listing and account ID.
    const alreadyLiked = await fetchAPI(onlineLikesUrl + onlineLikesQuery, "like listing get");
    if (alreadyLiked.length != 0) {
        alert("You have already liked this listing.");
        return;
    }

    let jsondata = { listing: listingData, account: JSON.parse(localStorage.getItem("userAccount")) };

    fetchAPI(onlineLikesUrl, "like listing post", apiPOSTsettings(jsondata));
}
