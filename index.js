const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require('node-telegram-bot-api');

const token = "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8";
const chatId = -1001944095697;

const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const signalData = req.body;
  console.log("Received signal data:", signalData);
  console.log(req.body);
  bot.sendMessage(chatId, JSON.stringify(signalData)).then(() => {
    console.log('Mesaj gönderildi');
  }).catch((error) => {
    console.error('Mesaj gönderilirken hata oluştu:', error);
  });
  // Sinyali işleyin

  res.sendStatus(200);
});

app.listen(80, () => {
  console.log("Server listening on port 80");
});
