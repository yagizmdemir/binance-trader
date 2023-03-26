const http = require("http");
const TelegramBot = require("node-telegram-bot-api");
const token = "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8";
const chatId = -1001944095697;
const bot = new TelegramBot(token, { polling: false });

const mt5Hook = (req, res) => {
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
};

module.exports = { mt5Hook };
