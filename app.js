const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const app = express();
const port = 80;

const webhooks = [
  {
    webhook: "lXsibvtpZJ",
    binance: {
      chatID: -1001944095697,
      botToken: "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8",
    },
    mt5: {
      chatID: -1001944095697,
      botToken: "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8",
    },
  },
  {
    webhook: "IAOuVsVRmR",
    binance: {
      chatID: -1001944095697,
      botToken: "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8",
    },
    mt5: {
      chatID: -1001944095697,
      botToken: "6209030208:AAEV1yx4r1F03svexoQ73MEg1aP-fRD6rn8",
    },
  },
];

webhooks.map((hook, i) => {
  app.post(`/binance/${hook.webhook}`, (req, res) => {
    const bot = new TelegramBot(hook.binance.botToken, { polling: false });

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log(new Date());
      const seperated = body.split(" ");
      console.log(seperated);

      bot
        .sendMessage(hook.binance.chatID, body)
        .then(() => {
          console.log("Mesaj gönderildi");
        })
        .catch((error) => {
          console.error("Mesaj gönderilirken hata oluştu:", error);
        });

      res.end("Received and logged request body");
    });
  });

  app.post(`/mt5/${hook.webhook}`, (req, res) => {
    const bot = new TelegramBot(hook.mt5.botToken, { polling: false });

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      bot
        .sendMessage(hook.mt5.chatID, body)
        .then(() => {
          console.log("Mesaj gönderildi");
        })
        .catch((error) => {
          console.error("Mesaj gönderilirken hata oluştu:", error);
        });

      res.end("Received and logged request body");
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
