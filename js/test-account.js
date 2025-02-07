const apiKey = "67960fb80acc0626570d3648";
const onlineSettings = { headers: { "x-apikey": apiKey } };

let emailInput = "skywalker23@example.com";
let passwordInput = "Falcon@2023";
// loginUserAccount(emailInput, passwordInput);

function loginUserAccount(email, password) {
    localStorage.clear();
    const onlineAccountsUrl = `https://mokesellfed-153b.restdb.io/rest/accounts?q={"email":"${email}", "password":"${password}"}`;
    fetch(onlineAccountsUrl, onlineSettings)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.length == 0) {
                alert("Account not found. Please try again.");
                return;
            }

            alert("Logged in successfully.");
            localStorage.setItem("userAccount", JSON.stringify(data[0]));

            document.querySelectorAll(".require-account").forEach((element) => {
                element.classList.remove("d-none");
            });
        })
        .catch((e) => {
            console.log(e);
        });
}
