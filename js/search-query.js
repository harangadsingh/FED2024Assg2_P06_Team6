// for (let image of document.querySelectorAll(".card img")) {
//   image.src =
//     "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhdHxlbnwwfHwwfHx8MA%3D%3D";
// }

// let newNames = ["Bicycle", " G Shock", "Crochet Princess", "Tennis Racket"];

// const cardTitles = document.querySelectorAll(".card-title");
// for (let i = 0; i < cardTitles.length; i++) {
//   cardTitles[i].innerText = newNames[i];
// }

// let newImages = [
//   "https://media.karousell.com/media/photos/products/2025/1/26/bicycle_1737871842_67c6bfc1_progressive_thumbnail.jpg",
//   "https://media.karousell.com/media/photos/products/2025/1/18/g_shock_1737166943_66b440f1_progressive_thumbnail.jpg",
//   "https://media.karousell.com/media/photos/products/2025/1/24/crochet_princess_amigurumi__sn_1737710878_3bef6520_progressive_thumbnail.jpg",
//   "https://media.karousell.com/media/photos/products/2025/1/24/wilson_tennis_racket_1737692765_1a313aca_progressive_thumbnail.jpg",
// ];

// const cardImages = document.querySelectorAll(".card img");
// for (let i = 0; i < cardImages.length; i++) {
//   cardImages[i].setAttribute("src", newImages[i]);
// }

// const cardTitles = document.querySelectorAll(".card-title");

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
