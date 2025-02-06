let emailInput = "skywalker23@example.com";
let passwordInput = "Falcon@2023";
loginUserAccount(emailInput, passwordInput);

function loginUserAccount(email, password, settings = "/json/accounts.json") {
    fetch(settings)
        .then((res) => {
            console.log("Successful read.");
            return res.json();
        })
        .then((data) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let account = data[i];
                if (account.email === email && account.password === password) {
                    console.log("Login successful.");
                    localStorage.setItem("userAccount", JSON.stringify(account));
                    localStorage.setItem("loggedIn", true);
                    localStorage.setItem("accountIndex", i);
                    break;
                }
            }
        })
        .catch((e) => {
            console.log(e);
        });
}
