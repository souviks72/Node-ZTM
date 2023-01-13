function getMessages(req, res) {
  return res.send("<ul><li>Hello Mike</li></ul>");
}

function postMessages(req, res) {
  console.log("Messages Route");
}

module.exports = {
  getMessages: getMessages,
  postMessages: postMessages,
};
