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
            images: [
                "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww",
                "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww",
            ],
        },
        {
            name: "Test2",
            itemDesc: "Apple",
            qualityDesc: "Used - Good Condition",
            deliveryDesc: "Jurong East MRT\nWeekends: 10am - 1pm",
            images: [
                "https://plus.unsplash.com/premium_photo-1690440686714-c06a56a1511c?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D",
                "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D",
            ],
        },
        {
            name: "Test3",
            itemDesc: "Orange",
            qualityDesc: "Brand New",
            deliveryDesc: "Orchard MRT\nWeekdays: 6pm - 8pm",
            images: [
                "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww",
                "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww",
            ],
        },
        {
            name: "Test4",
            itemDesc: "Grapes",
            qualityDesc: "Used - Like New",
            deliveryDesc: "Bishan MRT\nWeekends: 2pm - 5pm",
            images: [
                "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww",
                "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww",
            ],
        },
        {
            name: "Test5",
            itemDesc: "Mango",
            qualityDesc: "Brand New",
            deliveryDesc: "Dhoby Ghaut MRT\nWeekdays: 1pm - 4pm",
            images: [
                "https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww",
                "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0fGVufDB8fDB8fHww",
            ],
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

function createAppendElement(elementType, text, parent = "", classes = "") {
    const element = document.createElement(elementType);
    element.innerText = text;
    classes != "" && element.classList.add(...classes); //If there is a class, add it
    parent != "" && parent.append(element); //If there is a parent, append the element to it
}
