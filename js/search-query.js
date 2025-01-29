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
