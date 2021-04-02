namespace helloWebSockets { // name space to isolate identifiers from other examples
  const socket: WebSocket = new WebSocket("ws://localhost:8000/");

  const counterNames: string[] = [
    "numClients",
    "topLeft",
    "topCenter",
    "topRight",
    "middleLeft",
    "middleRight",
    "bottomLeft",
    "bottomCenter",
    "bottomRight",
  ];

  for (let counterName of counterNames) {
    const padDiv: HTMLDivElement = document.querySelector(`#${counterName}`);

    if (padDiv.id !== "numClients") {
      padDiv.addEventListener("touchstart", (evt) => {
        const div: HTMLDivElement = <HTMLDivElement>evt.target;
        socket.send(div.dataset.index);

        div.classList.add("active");

        setTimeout(() => div.classList.remove("active"), 100);

        evt.preventDefault();
      });
    }
  }

  // listen to connection open
  // socket.addEventListener("open", (event) => {
  // });

  // listen to message from server
  socket.addEventListener("message", (event) => {
    const counters: number[] = JSON.parse(event.data);

    for (let i: number = 0; i < counters.length; i++) {
      const counterName: string = counterNames[i];
      const counterDiv: HTMLDivElement = document.querySelector(`#${counterName} .counter`);

      counterDiv.innerHTML = counters[i].toString();
    }
  });
}
