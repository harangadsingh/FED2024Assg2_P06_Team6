const apiKey = "67960fb80acc0626570d3648";
const apiGETsettings = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
    },
};
const apiPOSTsettings = (jsondata) => ({
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
    },
    body: JSON.stringify(jsondata),
});

const apiPATCHsettings = (jsondata) => ({
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
    },
    body: JSON.stringify(jsondata),
});

function fetchAPI(url, purpose, settings = apiGETsettings) {
    return fetch(url, settings)
        .then((res) => {
            console.log(`Fetching data for ${purpose} successful.`);
            return res.json();
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            console.error(`Error fetching data for ${purpose}.`);
            console.error(e);
        });
}
