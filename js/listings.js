//Some variables that need to initialized first
const onlineSettings = { headers: { "x-apikey": "67960fb80acc0626570d3648" } };
const urlParams = new URLSearchParams(window.location.search);
let searchQuery = urlParams.get("query") ? urlParams.get("query") : "";
let searchCategory = urlParams.get("category") ? urlParams.get("category") : "Category";

let listingNumber = 0; //How many listings have been created, used like i in for loops

let listingQualitys = []; //Listing quality data. Brand new, used, etc.
let listingCategoryIDs = []; //Listing category IDs.  _id of Electronics, Mobile Phones, etc.
let createdListingsData = []; //Data of listings fetched from API
let createdListingsElements = []; //Elements of listings created from data
let currentListingIndex = 0; //Index of the current listing being displayed

// #region  SEARCH QUERY
//Get search query from searchbar

//If there is no search query, then hide the "Results for..." header.
if (searchQuery == "") {
    const searchQueryHeader = document.querySelector(".search-query-header");
    searchQueryHeader.style.visibility = "hidden";
}

//If there is no category searched, then hide the "In [category]" span.
if (searchCategory == "Category") {
    const searchCategorySpan = document.querySelector(".search-category-span");
    searchCategorySpan.style.visibility = "hidden";
}

let searchbarInput = "";
let searchbarCategory = "";

//Using a very scuffed way to ensure these elements exist before assigning them, because these are created by template-replace.js.
//God bless Godot's "await get_tree().create_timer(0.1).timeout"
setTimeout(() => {
    searchbarInput = document.querySelector("#searchbar-input");
    searchbarCategory = document.querySelector("#searchbar-category");
    searchbarInput.value = searchQuery;
    searchbarCategory.value = searchCategory;
}, 100);

searchCategory = searchCategory[0].toUpperCase() + searchCategory.slice(1); //Capitalize first letter to be shown in span

const searchQuerySpan = document.querySelector("#search-query");
searchQuerySpan.innerText = searchQuery;
const searchCategorySpan = document.querySelector("#search-category");
searchCategorySpan.innerText = searchCategory;
// #endregion

// #region  FETCHING API
function fetchAPI(url, purpose, settings = onlineSettings) {
    return fetch(url, settings)
        .then((res) => {
            console.log(`Fetching data for ${purpose} successful.`);
            return res.json();
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            console.log(`Fetching data for ${purpose} failed.`);
            console.log(e);
        });
}

//Fetch listing quality
fetchListingQuality();
async function fetchListingQuality() {
    listingQualitys = await fetchAPI("https://mokesellfed-153b.restdb.io/rest/listing-quality", "listing quality");
}

//Fetch listings
fetchListings();
async function fetchListings() {
    const apiSearchQuery = searchQuery == "" ? "" : `?q={"listing.name":{"$regex":"${searchQuery}"}}`;
    const onlineListingsUrl = `https://mokesellfed-153b.restdb.io/rest/listing-to-seller${apiSearchQuery}`;
    const listingsData = await fetchAPI(onlineListingsUrl, "listings");

    await fetchListingCategories();
    const categoryFilteredData = filterCategory(listingsData);
    createdListingsData = categoryFilteredData;

    createListings(categoryFilteredData);

    async function fetchListingCategories() {
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

        let categoryQuery = categoryQueries[searchCategory];

        let onlineCategoriesUrl = `https://mokesellfed-153b.restdb.io/rest/listing-sub-category${categoryQuery}`;
        const categories = await fetchAPI(onlineCategoriesUrl, "listing categories");

        const categoryIDs = [];
        for (const category of categories) {
            categoryIDs.push(category._id);
        }

        listingCategoryIDs = categoryIDs;
    }

    function filterCategory(data) {
        const filteredData = [];
        for (const listingSellerPair of data) {
            const categoryIDOfListing = listingSellerPair.listing[0].category[0];
            if (listingCategoryIDs.includes(categoryIDOfListing)) {
                filteredData.push(listingSellerPair);
            }
        }
        return filteredData;
    }

    function fetchLikes(listingID) {
        const onlineLikesUrl = `https://mokesellfed-153b.restdb.io/rest/listing-to-likes?q={"listing._id":"${listingID}"}`;
        const likes = fetchAPI(onlineLikesUrl, "likes");
        return likes;
    }

    async function createListings(filteredData) {
        console.log(filteredData);
        const createdElements = [];
        for (const listingSellerPair of filteredData) {
            const newListing = createListingElements(listingSellerPair, likes.length);
            createdElements.push(newListing);
        }
        createdElements[0].classList.remove("d-none"); //Unhide the first listing created
        createdListingsElements = createdElements;
    }
}
// #endregion

// #region  CREATE LISTING ELEMENTS
const listingsContainer = document.querySelector(".listing");
function createListingElements(listingSellerPair, likesCount) {
    const listing = listingSellerPair.listing[0];
    const seller = listingSellerPair.seller[0];

    const listingName = listing.name;
    const itemPrice = listing.price;
    const itemDesc = listing.description;
    const qualityDesc = listingQualitys.find((quality) => quality._id == listing.quality).quality;
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
        const imageCarousel = createImageCarousel(imageArray);
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
    createAppendElement("button", "Chat with Seller", sellerTextContainer, ["col", "btn", "btn-primary", "row"]);

    listingNumber++;
    return container;
}

function createAppendElement(elementType, text, parent = "", classes = "") {
    const element = document.createElement(elementType);
    element.innerText = text;
    classes != "" && element.classList.add(...classes); //If there is a class, add it
    parent != "" && parent.append(element); //If there is a parent, append the element to it
    return element;
}

function createImageCarousel(images) {
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

// #region  LISTENERS
//Listing controls
window.addEventListener("keydown", (e) => {
    console.log("key pressed");
    if ((e.code == "ArrowRight" || e.code == "ArrowLeft") && currentListingIndex < createdListingsElements.length - 1) {
        console.log("sdfasdas");
        if (e.code == "ArrowRight") {
            addListingToLikes(createdListingsData[currentListingIndex]);
            moveToNextListing();
        } else if (e.code == "ArrowLeft") {
            moveToNextListing();
        }

        moveToNextListing();
    }
});

//Listing buttons
const trashButton = document.querySelector("#trash-listing");
trashButton.addEventListener("click", () => {
    moveToNextListing();
});
const likeButton = document.querySelector("#like-listing");
likeButton.addEventListener("click", () => {
    addListingToLikes(createdListingsData[currentListingIndex]);
    if (currentListingIndex < createdListingsElements.length - 1) {
        moveToNextListing();
    }
});

const filterOptions = document.querySelectorAll(".filter");
const applyFilterButton = document.querySelector("#apply-filters");

applyFilterButton.addEventListener("click", (e) => {
    e.preventDefault();
});

for (const option of filterOptions) {
    option.addEventListener("click", (e) => {
        applyFilterButton.classList.add("btn-primary");
        applyFilterButton.classList.remove("btn-secondary");

        if (e.target.checked) {
            qualityFilter.push(e.target.value);
            console.log(qualityFilter);
        } else {
            qualityFilter = qualityFilter.filter((quality) => quality != e.target.value);
            console.log(qualityFilter);
        }
    });
}

function moveToNextListing() {
    createdListingsElements[currentListingIndex].classList.add("d-none");
    currentListingIndex++;
    createdListingsElements[currentListingIndex].classList.remove("d-none");
}

function addListingToLikes(listing) {
    console.log("liked.");
    return;
    if (localStorage.getItem("userAccount") == null) {
        return;
    }
    console.log("Added to likes.");

    const account = JSON.parse(localStorage.getItem("userAccount"));

    for (let likedListing of account.likes) {
        if (likedListing._id == createdListingsData[currentListingIndex]._id) {
            alert("You have already liked this listing!");
            return;
        }
    }

    account.likes.push(createdListingsData[currentListingIndex]);
    console.log(account);
    localStorage.setItem("userAccount", JSON.stringify(account));

    createdListingsData[currentListingIndex].likes.push(account);
    console.log(createdListingsData[currentListingIndex]);
}
// #endregion
