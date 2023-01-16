const express = require("express");
const path = require("path");

const friendsRouter = require("./routes/friends.router");
const messagesRouter = require("./routes/messages.router");

const app = express();
app.set("view engine", "hbs"); //templating engine
app.set("views", path.join(__dirname, "public"));
//using app.set() we can set a wide varitety of settings to our node server

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/site", express.static(path.join(__dirname, "public")));
/*If we wanted to serve html pages, we can have the website 
code inside public folder and serve them from there

 */
app.use(express.json()); //all incoming request bodies are json
//this func parses the json and converts the request body to Js object

app.use("/friends", friendsRouter);
app.use("/messages", messagesRouter);

app.listen(PORT, () => {
  console.log(`Server listening on PORT : ${PORT}`);
});
