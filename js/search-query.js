// Fetch Listing
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
    console.log("Success!");
    return res.json();
  })
  .then((data) => {
    console.log(data);
    const filteredData = [];
    for (const element of data) {
      console.log(searchQuery);
      if (element.name.includes(searchQuery)) {
        filteredData.push(searchQuery);
      }
    }
    return filteredData;
  })
  .then((filteredData) => {
    console.log(filteredData);
    const listingTitle = document.querySelector(".listing-title");
    listingTitle.innerText = filteredData[currentListingIndex];
  })
  .catch((e) => {
    console.log(e);
  });
