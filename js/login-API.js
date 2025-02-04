const apiKey = "67960fb80acc0626570d3648";
const detailsUrl = "https://mokesellfed-153b.restdb.io/rest/accounts?max=2";

const emailOrUsername = document.getElementById("emailOrUsername");
const passwork = document.getElementById("password");

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
        return user.email === email.value && user.password === password.value;
    });

    if (user)
    {
        alert("Login successful!");
        window.location.href = "index.html";
    }
    else 
    {
        alert("Invalid username/email or password! Try again.");
    }
}

catch (error) {
    console.error("Error: ", error);
    alert("An error occurred. Please try again.");
}

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        login();
    });
});
