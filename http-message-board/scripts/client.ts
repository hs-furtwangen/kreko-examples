namespace HttpMessageBoard { // name space to isolate identifiers from other examples
  // client id retrieved from server
  let id: number = null;

  // get div element to display client id
  const idDiv: HTMLElement = document.getElementById("id");

  // get message text field and send button elements
  const messageField: HTMLInputElement = <HTMLInputElement>document.getElementById("message-text");

  // send message on enter key
  messageField.addEventListener("keyup", function (evt: KeyboardEvent): void {
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
  async function getIdfromServer(): Promise<void> {
    try {
      const idStr: string = await sendGetRequest("/id"); // assign id to gloab variable (see above)
      idDiv.innerHTML = "#" + idStr; // display id on HTML page
      id = parseInt(idStr);
    } catch (err) {
      console.error("fetch error: ", err);
    }
  }

  function sendMessageToServer(text: string): void {
    if (text !== null && text.length > 0) {
      const data: ClientMessage = {
        client: id,
        text: text,
      };

      sendPostRequest("/message", JSON.stringify(data));
    }
  }
}
