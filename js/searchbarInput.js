const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("query") ? urlParams.get("query") : "";
const searchCategory = urlParams.get("category") ? urlParams.get("category") : "Category";

if (searchQuery == "") {
    document.querySelector(".search-query-header").classList.add("invisible");
} else if (searchQuery != "") {
    document.querySelector("#search-query").innerText = searchQuery;
} else if (searchCategory == "Category") {
    document.querySelector(".search-category-span").classList.add("invisible");
} else {
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
    console.log("Element found!", element);
    element.value = searchQuery;
});

waitForElement("#searchbar-category", (element) => {
    console.log("Element found!", element);
    element.value = searchCategory;
});
