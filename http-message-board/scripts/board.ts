namespace HttpMessageBoard {
  // get message list and clear button elements
  const messageListDiv: HTMLDivElement = <HTMLInputElement>document.getElementById("message-list");
  const clearButton: HTMLInputElement = <HTMLInputElement>document.getElementById("clear-button");

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
  async function getMessageListfromServer(): Promise<void> {
    try {
      // send request and receive message list as response
      const messageListStr: string = await sendGetRequest("/message-list");
      const messageList: Array<ClientMessage> = JSON.parse(messageListStr);
      let htmlStr: string = "<table>";

      // compose list of text paragraphs from message list
      for (let message of messageList) {
        htmlStr += `<tr><td class="col-0">#${message.client}:</td><td>${message.text}</td></tr>`;
      }

      htmlStr += "</table>";
      // display message list in div in HTML
      messageListDiv.innerHTML = htmlStr;
    } catch (err) {
      console.error("fetch error: ", err);
    }
  }

  function sendClearCommandToServer(): void {
    sendPostRequest("/clear", "");
  }
}
