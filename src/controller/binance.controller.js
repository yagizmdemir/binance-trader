const TelegramBot = require("node-telegram-bot-api");

const binanceHook = (req, res) => {
  const bot = new TelegramBot(token, { polling: false });

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

module.exports = { binanceHook };
