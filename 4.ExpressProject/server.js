const express = require("express");

const friendsController = require("./controllers/friends.controller");
const messagesController = require("./controllers/messages.controller");

const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json()); //all incoming request bodies are json
//this func parses the json and converts the request body to Js object

app.get("/friends", friendsController.getFriends);
app.post("/friends", friendsController.postFriends);
app.get("/friends/:id", friendsController.getFriend);

app.get("/messages", messagesController.getMessages);
app.post("/messages", messagesController.postMessages);

app.listen(PORT, () => {
  console.log(`Server listening on PORT : ${PORT}`);
});
