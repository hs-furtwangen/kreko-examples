"use strict";
var helloWebSockets;
(function (helloWebSockets) {
    const socket = new WebSocket("ws://localhost:8000/");
    const counterNames = [
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
        const padDiv = document.querySelector(`#${counterName}`);
        if (padDiv.id !== "numClients") {
            padDiv.addEventListener("touchstart", (evt) => {
                const div = evt.target;
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
        const counters = JSON.parse(event.data);
        for (let i = 0; i < counters.length; i++) {
            const counterName = counterNames[i];
            const counterDiv = document.querySelector(`#${counterName} .counter`);
            counterDiv.innerHTML = counters[i].toString();
        }
    });
})(helloWebSockets || (helloWebSockets = {}));
//# sourceMappingURL=client.js.map