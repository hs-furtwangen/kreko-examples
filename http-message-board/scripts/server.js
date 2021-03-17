"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var http = require("http");
var Mongo = require("mongodb");
var databaseUrl = "mongodb://127.0.0.1:27017";
var dbName = "http-message-board";
var dbCollectionName = "messageList";
var dbCollection = null;
// define count to give out different client ids
var clientIdCounter = 0;
// list of received client messages
var messageList = [];
// get port from shell or set default (8000)
var port = Number(process.env.PORT) || 8000;
// main function waiting for async functions
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectToDb()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getMessageListFromDb()];
                case 2:
                    _a.sent();
                    server = http.createServer(handleRequest);
                    server.listen(port, function () { return console.log("Server listening on port " + port); });
                    return [2 /*return*/];
            }
        });
    });
})();
/***********************************************************
 *
 *  helper functions
 *
 */
function connectToDb() {
    return __awaiter(this, void 0, void 0, function () {
        var options, mongoClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = { useNewUrlParser: true, useUnifiedTopology: true };
                    mongoClient = new Mongo.MongoClient(databaseUrl, options);
                    return [4 /*yield*/, mongoClient.connect()];
                case 1:
                    _a.sent();
                    dbCollection = mongoClient.db(dbName).collection(dbCollectionName);
                    if (dbCollection !== undefined) {
                        console.log("Connnected to db");
                    }
                    else {
                        console.log("Could not connect to db");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getMessageListFromDb() {
    return __awaiter(this, void 0, void 0, function () {
        var collectionArray, _i, collectionArray_1, doc, clientId, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbCollection.find().sort({ "_id": 1 }).toArray()];
                case 1:
                    collectionArray = _a.sent();
                    // retrieve message list from db
                    for (_i = 0, collectionArray_1 = collectionArray; _i < collectionArray_1.length; _i++) {
                        doc = collectionArray_1[_i];
                        clientId = doc.client;
                        // find highest client id in db to initialize counter
                        if (clientId > clientIdCounter)
                            clientIdCounter = clientId;
                        message = { client: doc.client, text: doc.text };
                        messageList.push(message);
                        // print message to server console
                        console.log("#" + message.client + ": \"" + message.text + "\"");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handlePostRequest(url, data) {
    switch (url) {
        // append message to board
        case "/message": {
            var message = JSON.parse(data);
            // add message to db collection and message list
            var id = messageList.length;
            dbCollection.insertOne({ _id: id, client: message.client, text: message.text });
            messageList.push(message);
            // print message to server console
            console.log("#" + message.client + ": \"" + message.text + "\"");
            break;
        }
        // clear message list and db collection
        case "/clear": {
            messageList.length = 0;
            dbCollection.deleteMany({});
            break;
        }
        default:
            console.error("unknown POST request URL: " + url);
            break;
    }
    return "";
}
function handleGetRequest(url) {
    switch (url) {
        // send next id to client
        case "/id": {
            var id = ++clientIdCounter;
            return id.toString();
        }
        // send message list as JSON string
        case "/message-list": {
            return JSON.stringify(messageList);
        }
        default:
            console.error("unknown GET request URL: " + url);
            break;
    }
    return "";
}
// handle POST and GET requests (application independent)
function handleRequest(request, response) {
    var requestString = "";
    var responseString = "";
    switch (request.method) {
        case "POST": {
            // concatenate request data from chunks
            request.on("data", function (chunk) {
                requestString += chunk;
            });
            // handle request with given data
            request.on("end", function () {
                responseString = handlePostRequest(request.url, requestString);
                sendResponse(response, responseString);
            });
            break;
        }
        case "GET": {
            var responseString_1 = handleGetRequest(request.url);
            sendResponse(response, responseString_1);
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
