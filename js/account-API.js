const onlineAccountUrl = "https://mokesellfed-153b.restdb.io/rest/accounts";
const userAccountID = localStorage.getItem("userAccountID");
const onlineAccountQuery = `?q={"_id":"${userAccountID}"}`;

let accountData = [];

accountDetails();
async function accountDetails() {
    if (userAccountID === null) {
        window.location.href = "/login-page.html";
    }

    accountData = await fetchAPI(onlineAccountUrl + onlineAccountQuery, "account details");
    document.querySelector("#profile-picture").src = accountData[0]["profile-picture"];
    document.querySelector(".username").innerText = accountData[0].username;
    document.querySelector("#username").value = accountData[0].username;
    document.querySelector("#email").value = accountData[0].email;

    const passwordInput = document.querySelector("#password");
    const passwordConfirmInput = document.querySelector("#password-confirm");
    const passwordWarning = document.querySelector("#password-warning");

    document.querySelector("#account-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (passwordInput.value !== passwordConfirmInput.value) {
            passwordWarning.classList.remove("d-none");
            return;
        }

        passwordWarning.classList.add("d-none");
        try {
            updateAccountPassword(passwordInput.value);
            alert("Password updated successfully! You will have to log in again.");
            localStorage.clear();
            window.location.href = "/index.html";
        } catch (error) {
            console.error("Error: ", error);
            alert("An error occurred. Please try again.");
        }
    });

    function updateAccountPassword(newPassword) {
        fetchAPI(onlineAccountUrl + "/" + userAccountID, "account password update", apiPATCHsettings({ password: newPassword }));
    }
}
