const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log(body);
      res.end("Received and logged request body");
    });
  } else {
    res.end("This server only accepts POST requests");
  }
});

server.listen(80, () => {
  console.log("Server listening on port 80");
});
