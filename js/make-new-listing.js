let listingSubCategories = [];
let listingQualities = [];

asdf();
async function asdf() {
    listingCategories = await fetchSubCategories();
    listingQualities = await fetchQualies();

    const qualityOrder = ["Brand new", "Like new", "Used", "Well used", "Broken"];
    listingQualities.sort((a, b) => qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality));

    const categorySelect = document.querySelector("select[name='listing-category']");
    listingCategories.forEach((category) => {
        const newSelect = createAppendElement("option", category["sub-category"], categorySelect);
        newSelect.value = JSON.stringify(category);
    });

    const qualitySelect = document.querySelector("select[name='listing-quality']");

    listingQualities.forEach((quality) => {
        const newSelect = createAppendElement("option", quality["quality"], qualitySelect);
        newSelect.value = JSON.stringify(quality);
    });

    listingQualities;
}

function fetchSubCategories() {
    const onlineSubCategoriesUrl = "https://mokesellfed-153b.restdb.io/rest/listing-sub-category";
    return fetchAPI(onlineSubCategoriesUrl, "listing categories");
}

function fetchQualies() {
    const onlineQualitiesUrl = "https://mokesellfed-153b.restdb.io/rest/listing-quality";
    return fetchAPI(onlineQualitiesUrl, "listing qualities");
}

const form = document.querySelector("#make-new-listing-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const listingName = document.querySelector("#listing-name").value;
    const listingPrice = parseFloat(document.querySelector("#listing-price").value).toFixed(2);
    const listingDescription = document.querySelector("#listing-description").value;
    const listingCategory = document.querySelector("#listing-category").value;
    const listingQuality = document.querySelector("#listing-quality").value;
    const listingDelivery = document.querySelector("#listing-delivery").value;
    const listingImage = document.querySelector("#listing-images").value;

    let listingData = {
        name: listingName,
        price: listingPrice,
        category: JSON.parse(listingCategory),
        quality: JSON.parse(listingQuality),
        description: listingDescription,
        delivery: listingDelivery,
        images: listingImage,
    };

    const onlineListingsUrl = "https://mokesellfed-153b.restdb.io/rest/listing";
    let createdListingData = await fetchAPI(onlineListingsUrl, "listing", apiPOSTsettings(listingData));

    const userAccountID = localStorage.getItem("userAccountID");

    listingToSellerdata = {
        listing: {
            _id: createdListingData._id,
        },
        seller: {
            _id: userAccountID,
        },
    };

    const onlineListingToSellerUrl = "https://mokesellfed-153b.restdb.io/rest/listing-to-seller";
    await fetchAPI(onlineListingToSellerUrl, "listing to seller", apiPOSTsettings(listingToSellerdata));

    alert("Listing created successfully!");
    window.location.href = "/make-new-listing-page.html";
});
