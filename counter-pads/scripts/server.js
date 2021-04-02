"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
// // create WebSocket server with given port
const port = Number(process.env.PORT) || 8000;
const server = new WebSocket.Server({ port: port });
// set of connected sockets
const clientSockets = new Set();
var Counters;
(function (Counters) {
    Counters[Counters["numClients"] = 0] = "numClients";
    Counters[Counters["topLeft"] = 1] = "topLeft";
    Counters[Counters["topCenter"] = 2] = "topCenter";
    Counters[Counters["topRight"] = 3] = "topRight";
    Counters[Counters["middleLeft"] = 4] = "middleLeft";
    Counters[Counters["middleRight"] = 5] = "middleRight";
    Counters[Counters["bottomLeft"] = 6] = "bottomLeft";
    Counters[Counters["bottomCenter"] = 7] = "bottomCenter";
    Counters[Counters["bottomRight"] = 8] = "bottomRight";
})(Counters || (Counters = {}));
const counters = [0, 0, 0, 0, 0, 0, 0, 0, 0];
server.on("connection", (socket) => {
    clientSockets.add(socket);
    counters[Counters.numClients]++;
    broadcastCounters();
    socket.on("message", (message) => {
        const counterIndex = parseInt(message);
        counters[counterIndex]++;
        broadcastCounters();
    });
    socket.on("close", () => {
        clientSockets.delete(socket);
        counters[Counters.numClients]--;
        broadcastCounters();
    });
    function broadcastCounters() {
        for (let socket of clientSockets) {
            socket.send(JSON.stringify(counters));
        }
    }
});
//# sourceMappingURL=server.js.map