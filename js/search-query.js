//Some variables that need to initialized first
let searchQuery = "";
let searchCategory = "";
let createdListings = [];
let currentListingIndex = 0;

//API
const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/listing";

//Get search query from searchbar
const urlParams = new URLSearchParams(window.location.search);
searchQuery = urlParams.get("query") ? urlParams.get("query") : "";
searchCategory = urlParams.get("category")
    ? urlParams.get("category")
    : "Category";

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

const listingsContainer = document.querySelector(".listing");

// Fetch Listings
//THIS IS WORKING, BUT IT'S COMMENTED OUT TO PREVENT HITTING THE 500 DAILY CALLS RESTDB HAS.
//LOOK BELOW FOR LOCAL CODE CREATING LISTINGS.
// fetch(listingUrl, {
//     headers: {
//         "x-apikey": apiKey,
//     },
// })
//     .then((res) => {
//         console.log("API call is successful.");
//         return res.json();
//     })
//     .then((data) => {
//         console.log("Retrieved data from API.");
//         console.log(data);
//         const filteredData = [];
//         for (const element of data) {
//             console.log(searchQuery);
//             if (element.name.includes(searchQuery)) {
//                 filteredData.push(element);
//             }
//         }
//         return filteredData;
//     })
//     .then((filteredData) => {
//         console.log(`Filtered data for query: "${searchQuery}"`);
//         console.log(filteredData);
//         for (let i = 0; i < filteredData.length; i++) {
//             listing = filteredData[i];

//             let newListing = createListingElements(listing);
//             createdListings.push(newListing);
//         }

//         createdListings[0].classList.remove("d-none"); //Unhide the first listing created
//     })
//     .catch((e) => {
//         console.log(e);
//     });

//LOCAL LISTINGS CODE
createLocalListings();
function createLocalListings() {
    const listings = [
        {
            name: "Test1",
            itemDesc: "Banana",
            qualityDesc: "Brand New",
            deliveryDesc: "Clementi MRT\nWeekdays: 2pm - 5pm",
        },
        {
            name: "Test2",
            itemDesc: "Apple",
            qualityDesc: "Used - Good Condition",
            deliveryDesc: "Jurong East MRT\nWeekends: 10am - 1pm",
        },
        {
            name: "Test3",
            itemDesc: "Orange",
            qualityDesc: "Brand New",
            deliveryDesc: "Orchard MRT\nWeekdays: 6pm - 8pm",
        },
        {
            name: "Test4",
            itemDesc: "Grapes",
            qualityDesc: "Used - Like New",
            deliveryDesc: "Bishan MRT\nWeekends: 2pm - 5pm",
        },
        {
            name: "Test5",
            itemDesc: "Mango",
            qualityDesc: "Brand New",
            deliveryDesc: "Dhoby Ghaut MRT\nWeekdays: 1pm - 4pm",
        },
    ];

    for (let i = 0; i < listings.length; i++) {
        let listing = listings[i];

        if (listing.name.includes(searchQuery)) {
            let newListing = createListingElements(listing);
            createdListings.push(newListing);
        }
    }
    createdListings[0].classList.remove("d-none"); //Unhide the first listing created
}


function createListingElements(listing) {
    const listingName = listing.name;
    const itemDesc = listing.itemDesc;
    const qualityDesc = listing.qualityDesc;
    const deliveryDesc = listing.deliveryDesc;

    const container = document.createElement("div");
    container.classList.add("d-none");
    listingsContainer.append(container);

    createAppendElement("h2", listingName, container);
    createAppendElement("p", itemDesc, container);
    createAppendElement("hr", "", container);

    createAppendElement("h2", "Quality", container);
    createAppendElement("p", qualityDesc, container);
    createAppendElement("hr", "", container);

    createAppendElement("h2", "Delivery", container);
    createAppendElement("p", deliveryDesc, container);
    createAppendElement("hr", "", container);

    return container;
}

function createAppendElement(elementType, text, parent) {
    const element = document.createElement(elementType);
    element.innerText = text;
    parent.append(element);
}
