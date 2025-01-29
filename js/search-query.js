//Some variables that need to initialized first
let searchQuery = "";
let searchCategory = "";
let currentListingIndex = 0; //To be used the access the elements of 'listings'

//API
const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/listing";

//Get search query from searchbar
const urlParams = new URLSearchParams(window.location.search);
searchQuery = urlParams.get("query");
searchCategory = urlParams.get("category");

const searchbarInput = document.querySelector("#searchbar-input");
const searchbarCategory = document.querySelector("#searchbar-category");
searchbarInput.value = searchQuery;
searchbarCategory.value = searchCategory;

searchCategory = searchCategory[0].toUpperCase() + searchCategory.slice(1); //Capitalize first letter to be shown in span

const searchQuerySpan = document.querySelector("#search-query");
searchQuerySpan.innerText = searchQuery;
const searchCategorySpan = document.querySelector("#search-category");
searchCategorySpan.innerText = searchCategory;

// Fetch Listings
fetch(listingUrl, {
    headers: {
        "x-apikey": apiKey,
    },
})
    .then((res) => {
        console.log("API call is successful.");
        return res.json();
    })
    .then((data) => {
        console.log("Retrieved data from API.");
        console.log(data);
        const filteredData = [];
        for (const element of data) {
            console.log(searchQuery);
            if (element.name.includes(searchQuery)) {
                filteredData.push(element);
            }
        }
        return filteredData;
    })
    .then((filteredData) => {
        console.log(`Filtered data for query: "${searchQuery}"`);
        console.log(filteredData);

        for (let i = 0; i <= filteredData.length; i++) {
            showListing(filteredData[i].name);
        }
    })
    .catch((e) => {
        console.log(e);
    });

const listingsContainer = document.querySelector(".listing");

function showListing(listingName) {
    const newListingTitle = document.createElement("h2");
    newListingTitle.innerText = listingName;
    listingsContainer.append(newListingTitle);
}
