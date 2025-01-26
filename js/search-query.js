for (let image of document.querySelectorAll(".card img")) {
  image.src =
    "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhdHxlbnwwfHwwfHx8MA%3D%3D";
}

let newNames = ["Bicycle", " G Shock", "Crochet Princess", "Tennis Racket"];

const cardTitles = document.querySelectorAll(".card-title");
for (let i = 0; i < cardTitles.length; i++) {
  cardTitles[i].innerText = newNames[i];
}
