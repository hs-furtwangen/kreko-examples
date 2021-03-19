"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Mongo = require("mongodb");
const databaseUrl = "mongodb://127.0.0.1:27017";
const dbName = "http-message-board";
const dbCollectionName = "messageList";
let dbCollection = null;
// define count to give out different client ids
let clientIdCounter = 0;
// list of received client messages
const messageList = [];
// get port from shell or set default (8000)
const port = Number(process.env.PORT) || 8000;
// main function waiting for async functions
(async function main() {
    await connectToDb();
    await getMessageListFromDb();
    // create and launch server
    let server = http.createServer(handleRequest);
    server.listen(port, () => console.log(`Server listening on port ${port}`));
})();
/***********************************************************
 *
 *  helper functions
 *
 */
async function connectToDb() {
    let options = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    dbCollection = mongoClient.db(dbName).collection(dbCollectionName);
    if (dbCollection !== undefined) {
        console.log("Connnected to db");
    }
    else {
        console.log("Could not connect to db");
    }
}
async function getMessageListFromDb() {
    let collectionArray = await dbCollection.find().sort({ "_id": 1 }).toArray();
    // retrieve message list from db
    for (let doc of collectionArray) {
        const clientId = doc.client;
        // find highest client id in db to initialize counter
        if (clientId > clientIdCounter)
            clientIdCounter = clientId;
        // add message from db to message list
        const message = { client: doc.client, text: doc.text };
        messageList.push(message);
        // print message to server console
        console.log(`#${message.client}: "${message.text}"`);
    }
}
function handlePostRequest(url, data) {
    switch (url) {
        // append message to board
        case "/message": {
            const message = JSON.parse(data);
            // add message to db collection and message list
            const id = messageList.length;
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
function handleGetRequest(url) {
    switch (url) {
        // send next id to client
        case "/id": {
            let id = ++clientIdCounter;
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
function handleRequest(request, response) {
    let requestString = "";
    let responseString = "";
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
            let responseString = handleGetRequest(request.url);
            sendResponse(response, responseString);
            break;
        }
    }
}
// send response with given string (application independent)
function sendResponse(response, responseString) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "text/plain");
    response.write(responseString);
    response.end();
}
//# sourceMappingURL=server.js.map