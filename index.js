const http = require("http");
const TelegramBot = require("node-telegram-bot-api");
const token = "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8";
const chatId = -1001944095697;
const bot = new TelegramBot(token, { polling: false });

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log(new Date());
      const seperated = body.split(" ");
      console.log(seperated);

      bot
        .sendMessage(chatId, body)
        .then(() => {
          console.log("Mesaj gönderildi");
        })
        .catch((error) => {
          console.error("Mesaj gönderilirken hata oluştu:", error);
        });

      res.end("Received and logged request body");
    });
  } else {
    res.end("This server only accepts POST requests");
  }
});

server.listen(80, () => {
  console.log("Server listening on port 80");
});
