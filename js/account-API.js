const apiKey = "67960fb80acc0626570d3648";
const accountDetails = "https://mokesellfed-153b.restdb.io/rest/accounts?max=2"

async function fetchAccountDetails() {
    try{
        const response = await fetch(accountDetails, {
            method: "GET",
            headers: {
                "x-apikey": apiKey,
            },
        })

    if (!response.ok) {
        throw new Error("Failed to fetch account details!");
    }

    const accounts = await response.json();
    const account = accounts[0];

    document.getElementById("username").value = account.username;
    document.getElementById("email").value = account.email;
    document.getElementById("password").value = account.password;   
    } catch (error) {
        console.error("Error: ", error);
        alert("An error occurred. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", fetchAccountDetails);