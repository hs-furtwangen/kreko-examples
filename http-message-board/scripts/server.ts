import * as http from "http";
import * as Mongo from "mongodb";

const databaseUrl: string = "mongodb://127.0.0.1:27017";
const dbName: string = "http-message-board";
const dbCollectionName: string = "messageList";
let dbCollection: Mongo.Collection = null;

// define count to give out different client ids
let clientIdCounter: number = 0;

// client message interface
interface ClientMessage {
  client: number;
  text: string;
}

// list of received client messages
const messageList: ClientMessage[] = [];

// get port from shell or set default (8000)
const port: number = Number(process.env.PORT) || 8000;

// main function waiting for async functions
(async function main(): Promise<void> {
  await connectToDb();
  await getMessageListFromDb();

  // create and launch server
  let server: http.Server = http.createServer(handleRequest);
  server.listen(port, () => console.log(`Server listening on port ${port}`));
})();

/***********************************************************
 * 
 *  helper functions
 * 
 */
async function connectToDb(): Promise<void> {
  let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
  let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseUrl, options);

  await mongoClient.connect();
  dbCollection = mongoClient.db(dbName).collection(dbCollectionName);

  if (dbCollection !== undefined) {
    console.log("Connnected to db");
  } else {
    console.log("Could not connect to db");
  }
}

async function getMessageListFromDb(): Promise<void> {
  let collectionArray: ClientMessage[] = await dbCollection.find().sort({ "_id": 1 }).toArray();

  // retrieve message list from db
  for (let doc of collectionArray) {
    const clientId: number = doc.client;

    // find highest client id in db to initialize counter
    if (clientId > clientIdCounter)
      clientIdCounter = clientId;

    // add message from db to message list
    const message: ClientMessage = { client: doc.client, text: doc.text };
    messageList.push(message);

    // print message to server console
    console.log(`#${message.client}: "${message.text}"`);
  }
}

function handlePostRequest(url: string, data: string): string {
  switch (url) {
    // append message to board
    case "/message": {
      const message: ClientMessage = <ClientMessage>JSON.parse(data);

      // add message to db collection and message list
      const id: number = messageList.length;
      dbCollection.insertOne({ _id: id, client: message.client, text: message.text });
      messageList.push(message);

      // print message to server console
      console.log(`#${message.client}: "${message.text}"`);
      break;
    }

    // clear message list and db collection
    case "/clear": {
      messageList.length = 0;
      dbCollection.deleteMany({});
      break;
    }

    default:
      console.error(`unknown POST request URL: ${url}`);
      break;
  }

  return "";
}

function handleGetRequest(url: string): string {
  switch (url) {
    // send next id to client
    case "/id": {
      let id: number = ++clientIdCounter;
      return id.toString();
    }

    // send message list as JSON string
    case "/message-list": {
      return JSON.stringify(messageList);
    }

    default:
      console.error(`unknown GET request URL: ${url}`);
      break;
  }

  return "";
}

// handle POST and GET requests (application independent)
function handleRequest(request: http.IncomingMessage, response: http.ServerResponse): void {
  let requestString: string = "";
  let responseString: string = "";

  switch (request.method) {
    case "POST": {
      // concatenate request data from chunks
      request.on("data", chunk => {
        requestString += chunk;
      });

      // handle request with given data
      request.on("end", () => {
        responseString = handlePostRequest(request.url, requestString);
        sendResponse(response, responseString);
      });

      break;
    }

    case "GET": {
      let responseString: string = handleGetRequest(request.url);
      sendResponse(response, responseString);
      break;
    }
  }
}

// send response with given string (application independent)
function sendResponse(response: http.ServerResponse, responseString: string): void {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/plain");
  response.write(responseString);
  response.end();
}
