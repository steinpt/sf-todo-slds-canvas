/*
  sf-todo-slds-canvas - app.js
  Stein Tronstad
    
*/

/*
  DATA MODEL
*/
const todoRecords = [
  "Buy groceries",
  "Fix broken vase",
  "Book holiday",
  "Visit parents",
  "Showel snow",
  "Call grandmother",
  "Read a book",
  "Watch Game of Thrones",
  "Play game with kids",
  "Take a hike",
];
const noOfItems = 4;

/*
  HTTP SERVER
*/
const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  decode = require("salesforce-signed-request");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ entended: true }));

// CONSUMER/CLIENT SECRET
const consumerSecret = process.env.CANVAS_CONSUMER_SECRET;

app.get("/", function (req, res) {
  res.render("welcome");
});

/*
 SF call POST us on this URI with signed request
*/
app.post("/signedrequest", function (req, res) {
  const signedRequest = decode(req.body.signed_request, consumerSecret),
    context = signedRequest.context,
    oauthToken = signedRequest.client.oauthToken,
    instanceUrl = signedRequest.client.instanceUrl;
  
  /* 
  const query = "SELECT Id, FirstName, LastName, Phone, Email FROM Contact";

  contactRequest = {
    url: instanceUrl + "/services/data/v45.0/query?q=" + query,
    headers: {
      Authorization: "OAuth " + oauthToken
    }
  };
  */
 
  // Get and Serve ToDos
  let todoRecordsRnd = [];
  for (let i = 0; i < noOfItems; i++) {
    let rndNo = Math.floor(Math.random() * 10);
    todoRecordsRnd.push(todoRecords[rndNo]);
  }
  res.render("todos", {
    firstName: context.environment.record.FirstName,
    lastName: context.environment.record.LastName,
    mail: context.environment.record.Email,
    todos: todoRecordsRnd,
  });
});

console.log("Listening on port " + port);
app.listen(port);