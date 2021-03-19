"use strict";
var HttpMessageBoard;
(function (HttpMessageBoard) {
    // client id retrieved from server
    let id = null;
    // get div element to display client id
    const idDiv = document.getElementById("id");
    // get message text field and send button elements
    const messageField = document.getElementById("message-text");
    // send message on enter key
    messageField.addEventListener("keyup", function (evt) {
        if (evt.key === "Enter") {
            sendMessageToServer(messageField.value);
            messageField.value = ""; // clear message text field
        }
    });
    // get id from server
    getIdfromServer();
    /***********************************************************
     *
     *  functions
     *
     */
    async function getIdfromServer() {
        try {
            const idStr = await HttpMessageBoard.sendGetRequest("/id"); // assign id to gloab variable (see above)
            idDiv.innerHTML = "#" + idStr; // display id on HTML page
            id = parseInt(idStr);
        }
        catch (err) {
            console.error("fetch error: ", err);
        }
    }
    function sendMessageToServer(text) {
        if (text !== null && text.length > 0) {
            const data = {
                client: id,
                text: text,
            };
            HttpMessageBoard.sendPostRequest("/message", JSON.stringify(data));
        }
    }
})(HttpMessageBoard || (HttpMessageBoard = {}));
//# sourceMappingURL=client.js.map