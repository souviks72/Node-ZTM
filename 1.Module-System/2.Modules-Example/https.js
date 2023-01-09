const { read } = require("./response");
const { send } = require("./request");

function request(url, data) {
  send(url, data);
  return read();
}
