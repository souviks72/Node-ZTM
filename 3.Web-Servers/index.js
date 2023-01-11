const http = require("http");

const PORT = 3000;

const friends = [
  {
    id: 0,
    name: "Eren Jaeger",
  },
  {
    id: 1,
    name: "Naruto",
  },
  {
    id: 2,
    name: "Sasuke",
  },
];

//req is a readable stream
//res is a writeable stream
//So we can connect the 2 streams via pipe
const server = http.createServer((req, res) => {
  //if(req.method === "GET") {}
  const items = req.url.split("/");
  /*
    URL Parameters::
    /friends/1  --> ['', friends, 1]
    */
  if (items.length < 2) {
    res.statusCode = 400;
    res.end();
  }
  if (req.method === "POST" && items[1] === "friends") {
    //request body is a stream, so data is in bytes
    req.on("data", (data) => {
      const friend = data.toString();
      console.log("Request: ", friend);
      let friendObj = JSON.parse(friend);
      friendObj = { ...friendObj, id: friends.length };
      friends.push(friendObj);
      console.log(friends);
      req.pipe(res);
    });
  } else if ((req.method === "GET" && items[1]) === "friends") {
    res.writeHead(200, { "Content-Type": "application/json" });
    if (items.length == 2) res.end(JSON.stringify(friends));
    else res.end(JSON.stringify(friends[parseInt(items[2])]));
  } else if (items[1] === "messages") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<body>");
    res.write("<h2>Tatakaye</h2>");
    res.write("</body>");
    res.write("</html>");
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
