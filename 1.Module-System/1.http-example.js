/*
The module system is not native to Js
Files are executed and the output is returned
*/
const http = require("http");
//Node also has an "https" module. Only that can interact with https sites
const req = http.request("http://www.google.com", (res) => {
  res.on("data", (chunk) => {
    //this is a chunk of data, if res is lage,it will be split into multiple chunks
    console.log(`Data chunk: ${chunk}`);
  });
  res.on("end", () => {
    console.log("No more data");
  });
});

req.end(); //without req.end() call the above code won't run
// we also have http.get() that has the exact same syntax, but doesnt need end() to get triggered
