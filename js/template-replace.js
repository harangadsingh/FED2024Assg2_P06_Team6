fetch("html-templates/main-navbar.html")
    .then((res) => res.text())
    .then((text) => {
        let oldelem = document.querySelector("#replace-with-navbar");
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
    });

fetch("html-templates/checkout-footer.html")
    .then((res) => res.text())
    .then((text) => {
        let oldelem = document.querySelector("#replace-with-checkout");
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
    });
