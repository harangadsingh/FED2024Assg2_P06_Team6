//Some variables that need to initialized first
let searchQuery = "";
let searchCategory = "";
let createdListings = [];
let currentListingIndex = 0;
let listingNumber = 0;

// #region  SEARCH QUERY
//Get search query from searchbar
const urlParams = new URLSearchParams(window.location.search);
searchQuery = urlParams.get("query") ? urlParams.get("query") : "";
searchCategory = urlParams.get("category") ? urlParams.get("category") : "Category";

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
const localListings = "json/listings.json";
const onlineListings = {
    async: true,
    crossDomain: true,
    url: "https://mokesellfed-153b.restdb.io/rest/listing",
    method: "GET",
    headers: {
        "content-type": "application/json",
        "x-apikey": "<your CORS apikey here>",
        "cache-control": "no-cache",
    },
};

function fetchListings(settings) {
    fetch(settings)
        .then((res) => {
            console.log("Successful read.");
            return res.json();
        })
        .then((data) => {
            console.log(data);
            createListings(data);
        })
        .catch((e) => {
            console.log(e);
        });
}

function createListings(data) {
    const filteredData = [];
    for (const element of data) {
        if (element.name.includes(searchQuery)) {
            filteredData.push(element);
        }
    }

    for (const listing of filteredData) {
        const newListing = createListingElements(listing);
        createdListings.push(newListing);
    }

    createdListings[0].classList.remove("d-none"); //Unhide the first listing created
}

fetchListings(localListings);
// #endregion

// #region  CREATE LISTING ELEMENTS
const listingsContainer = document.querySelector(".listing");
function createListingElements(listing) {
    const listingName = listing.name;
    const itemDesc = listing.description;
    const qualityDesc = listing.quality[0].quality;
    const deliveryDesc = listing.delivery;
    const imageArray = listing.images.split("\n");
    const sellerProfilePictureImg = listing.seller[0]["profile-picture"];
    const sellerUsername = listing.seller[0].username;

    //Create listing container.
    const container = document.createElement("div");
    container.classList.add("container", "me-5", "p-0", "d-none");
    listingsContainer.append(container);
    const row = createAppendElement("div", "", container, ["row"]);

    //Create images
    const imageCol = createAppendElement("div", "", row, ["col-5"]);
    if (imageArray.length == 1) {
        const img = createAppendElement("img", "", imageCol, ["listing-img"]);
        img.src = imageArray[0];
    } else {
        const imageCarousel = createImageCarousel(imageArray);
        imageCol.append(imageCarousel);
    }

    //Create listing details
    const textCol = createAppendElement("div", "", row, ["col", "ms-1"]);

    //Title
    createAppendElement("h2", listingName, textCol, ["fs-1", "m-0"]);

    //Category
    createAppendElement("h4", "Electronics, Mobile Phone", textCol, ["fs-6"]);

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
// ======================
window.addEventListener("keydown", (e) => {
    if ((e.code == "ArrowRight" || e.code == "ArrowLeft") && currentListingIndex < createdListings.length - 1) {
        createdListings[currentListingIndex].classList.add("d-none");
        currentListingIndex++;
        createdListings[currentListingIndex].classList.remove("d-none");

        if (e.code == "ArrowRight") {
            console.log("Added to likes.");
        } else if (e.code == "ArrowLeft") {
            console.log("Trashed.");
        }
    }
});

const trashButton = document.querySelector("#trash-listing");
trashButton.addEventListener("click", () => {
    console.log("Trashed.");
});
const likeButton = document.querySelector("#like-listing");
likeButton.addEventListener("click", () => {
    console.log("Added to likes.");

    if (currentListingIndex < createdListings.length - 1) {
        createdListings[currentListingIndex].classList.add("d-none");
        currentListingIndex++;
        createdListings[currentListingIndex].classList.remove("d-none");
    }
});

document.querySelector("#quality-bn").addEventListener("click", (e) => {
    console.log(e.target.value);
});
// #endregion
