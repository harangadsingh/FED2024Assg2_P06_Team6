const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("query") ? urlParams.get("query") : "";
const searchCategory = urlParams.get("category") ? urlParams.get("category") : "Category";

if (searchQuery == "") {
    //Hide the "Results for..." if there was nothing searched
    document.querySelector(".search-query-header").classList.add("invisible");
} else if (searchQuery != "") {
    //If there was something searched, put it in the Results for...header
    document.querySelector("#search-query").innerText = searchQuery;
} else if (searchCategory == "Category") {
    //If no category was selected hide the Results... IN...
    document.querySelector(".search-category-span").classList.add("invisible");
} else {
    //If a category was selected, put it in the Results... IN... span
    document.querySelector("#search-category").innerText = searchCategory;
}

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval); // Stop polling
            callback(element); // Execute the callback with the found element
        }
    }, 100); // Check every 100ms
}

waitForElement("#searchbar-input", (element) => {
    //Wait for the searchbar to load, then set its value to what was searched
    console.log("Element found!", element);
    element.value = searchQuery;
});

waitForElement("#searchbar-category", (element) => {
    //Wait for the searchbar to load, then set its value to what was set as the category to search for
    console.log("Element found!", element);
    element.value = searchCategory;
});
