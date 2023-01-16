const path = require("path");

function getMessages(req, res) {
  return res.sendFile(
    path.join(__dirname, "..", "public", "images", "ducati.jpg")
  );
}

function postMessages(req, res) {
  console.log("Messages Route");
}

module.exports = {
  getMessages: getMessages,
  postMessages: postMessages,
};
