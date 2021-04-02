import * as WebSocket from "ws";

// // create WebSocket server with given port
const port: number = Number(process.env.PORT) || 8000;
const server: WebSocket.Server = new WebSocket.Server({ port: port });

// set of connected sockets
const clientSockets: Set<WebSocket> = new Set();

enum Counters {
  numClients = 0,
  topLeft = 1,
  topCenter,
  topRight,
  middleLeft,
  middleRight,
  bottomLeft,
  bottomCenter,
  bottomRight,
}

const counters: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

server.on("connection", (socket) => {
  clientSockets.add(socket);
  counters[Counters.numClients]++;

  broadcastCounters();

  socket.on("message", (message) => {
    const counterIndex: number = parseInt(<string>message);
    counters[counterIndex]++;
    broadcastCounters();
  });

  socket.on("close", () => {
    clientSockets.delete(socket);
    counters[Counters.numClients]--;

    broadcastCounters();
  });

  function broadcastCounters(): void {
    for (let socket of clientSockets) {
      socket.send(JSON.stringify(counters));
    }
  }
});
