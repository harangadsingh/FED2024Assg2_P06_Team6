const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/accounts";

function signUpFunction() {
    const signUpForm = document.querySelector(".signup-form");
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(signUpForm);
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const data = {
            username,
            email,
            password,
        };

        fetch(listingUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey,
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to create account");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                alert("Account created successfully!");
                window.location.href = "index.html";
            })
            .catch((e) => {
                console.error(e);
                alert("An error occurred. Please try again.");
            });
    });
}

document.addEventListener("DOMContentLoaded", signUpFunction);
