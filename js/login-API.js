const apiKey = "67960fb80acc0626570d3648";
const detailsUrl = "https://mokesellfed-153b.restdb.io/rest/accounts";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loadingMessage.style.display = "block";

    try {
        const response = await fetch(detailsUrl, {
            method: "GET",
            headers: {
                "x-apikey": apiKey,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data!");
        }

        const users = await response.json();

        const user = users.find((user) => {
            return user.email === email && user.password === password;
        });

        if (user) {
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid username/email or password! Try again.");
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("An error occurred. Please try again.");
    } finally {
        loadingMessage.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        login();
    });
});
