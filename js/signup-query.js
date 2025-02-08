const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/accounts";

function signUpFunction() {
    const signUpForm = document.querySelector("#signupForm");
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
                localStorage.setItem("userAccount", JSON.stringify(data)); //This is legacy code, because I didn't know of RestDB's look up feature. It's still being used in some places until it's replaced.
                localStorage.setItem("userAccountID", user._id);
                window.location.href = "/index.html";
            })
            .catch((e) => {
                console.error(e);
                alert("An error occurred. Please try again.");
            });
    });
}

document.addEventListener("DOMContentLoaded", signUpFunction);
