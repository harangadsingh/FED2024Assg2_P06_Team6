const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/accounts";

function signUpFunction() {
  const signUpForm = document.querySelector(".signup-form");
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(signUpForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    // const confirmPassword = formData.get("confirm-password");
    const data = {
      name,
      email,
      password,
    };
    
    /*
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    */

    fetch(listingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        alert("Account created successfully!");
        window.location.href = "signup-page.html";
      })
      .catch((e) => {
        console.log(e);
      });
  });
}