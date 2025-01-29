// Fetch Listing
const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/listing";

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
    const cardTitles = document.querySelectorAll(".card-title");

    for (let i = 0; i < cardTitles.length; i++) {
      cardTitles[i].innerText = data[i].name;
    }
  })
  .catch((e) => {
    console.log(e);
  });

//Get search query from searchbar
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("query");
let searchCategory = urlParams.get("category");

const searchbarInput = document.querySelector("#searchbar-input");
const searchbarCategory = document.querySelector("#searchbar-category");
searchbarInput.value = searchQuery;
searchbarCategory.value = searchCategory;

searchCategory = searchCategory[0].toUpperCase() + searchCategory.slice(1);

const searchQuerySpan = document.querySelector("#search-query");
searchQuerySpan.innerText = searchQuery;
const searchCategorySpan = document.querySelector("#search-category");
searchCategorySpan.innerText = searchCategory;
