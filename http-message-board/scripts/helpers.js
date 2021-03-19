"use strict";
var HttpMessageBoard;
(function (HttpMessageBoard) {
    //const serverURL: string = "http://localhost:8000";
    const serverURL = "https://nschnell.uber.space/my-first-server";
    async function sendGetRequest(url) {
        const response = await fetch(serverURL + url, {
            method: "GET",
            headers: { "Content-Type": "text/plain" },
        });
        if (response.status !== 200)
            return Promise.reject(response.statusText);
        return response.text();
    }
    HttpMessageBoard.sendGetRequest = sendGetRequest;
    async function sendPostRequest(url, body) {
        const response = await fetch(serverURL + url, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: body,
        });
        if (response.status !== 200)
            return Promise.reject(response.statusText);
        return response.text();
    }
    HttpMessageBoard.sendPostRequest = sendPostRequest;
})(HttpMessageBoard || (HttpMessageBoard = {}));
//# sourceMappingURL=helpers.js.map