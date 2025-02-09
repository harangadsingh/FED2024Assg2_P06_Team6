const apiKey = "67960fb80acc0626570d3648";
const feedbackUrl = "https://mokesellfed-153b.restdb.io/rest/feedback?max=2";

document.getElementById('feedback-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const feedbackForm = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        category: document.getElementById('category').value,
        message: document.getElementById('message').value.trim()
    };

    try {
        const response = await fetch(feedbackUrl, {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey,
            },
            body: JSON.stringify(feedbackForm),
        });

        if (response.ok) {
            document.getElementById("feedback-message").textContent = "Feedback submitted successfully!";
            document.getElementById("feedback-form").reset();
        }

        else {
            document.getElementById("feedback-message").textContent = "Failed to submit feedback!";
        }
    
    } catch (error) {
        console.error("Error: ", error);
        document.getElementById("feedback-message").textContent = "An error occurred. Please try again.";
    }
});


