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

const server = http.createServer((req, res) => {
  //if(req.method === "GET") {}
  const items = req.url.split("/");
  /*
    /friends/1  --> ['', friends, 1]
    */
  if (items[1] === "friends") {
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
