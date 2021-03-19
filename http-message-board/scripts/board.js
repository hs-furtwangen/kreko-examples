"use strict";
var HttpMessageBoard;
(function (HttpMessageBoard) {
    // get message list and clear button elements
    const messageListDiv = document.getElementById("message-list");
    const clearButton = document.getElementById("clear-button");
    // register click listener on clear button
    clearButton.addEventListener("click", () => {
        sendClearCommandToServer();
    });
    // periodically poll list of messages from server
    setInterval(getMessageListfromServer, 1000);
    /***********************************************************
     *
     *  functions
     *
     */
    async function getMessageListfromServer() {
        try {
            // send request and receive message list as response
            const messageListStr = await HttpMessageBoard.sendGetRequest("/message-list");
            const messageList = JSON.parse(messageListStr);
            let htmlStr = "<table>";
            // compose list of text paragraphs from message list
            for (let message of messageList) {
                htmlStr += `<tr><td class="col-0">#${message.client}:</td><td>${message.text}</td></tr>`;
            }
            htmlStr += "</table>";
            // display message list in div in HTML
            messageListDiv.innerHTML = htmlStr;
        }
        catch (err) {
            console.error("fetch error: ", err);
        }
    }
    function sendClearCommandToServer() {
        HttpMessageBoard.sendPostRequest("/clear", "");
    }
})(HttpMessageBoard || (HttpMessageBoard = {}));
//# sourceMappingURL=board.js.map