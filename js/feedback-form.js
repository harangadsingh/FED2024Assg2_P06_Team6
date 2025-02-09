const apiKey = "67960fb80acc0626570d3648";
const listingUrl = "https://mokesellfed-153b.restdb.io/rest/feedback?max=2";

function feedbackFunction() {
    const feedbackForm = document.querySelector("#feedbackForm");
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(feedbackForm);
        const username = formData.get("username");
        const email = formData.get("email");
        const category = formData.get("category");
        const message = formData.get("message");
        const data = {
            username,
            email,
            password,
            category,
            message,
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
                    throw new Error("Failed to submit feedback");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                alert("Feedback submitted successfully!");
                window.location.href = "/index.html";
            })
            .catch((e) => {
                console.error(e);
                alert("An error occurred. Please try again.");
            });
    });
}

document.addEventListener("DOMContentLoaded", feedbackFunction);