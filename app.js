const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const Binance = require("binance-api-node").default;
require("dotenv").config;

const app = express();
const port = 80;

//IP: 138.197.178.218

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_KEY_SECRET,
});

const webhooks = [
  //Uzun bot
  {
    webhook: "QsdacW2kisaq",
    binance: {
      chatID: -1001810011433,
      botToken: "6176319988:AAFe3rbKbqe459bS1uO8CEamO1vOjSxB2io",
    },
    mt5: {
      chatID: -1001810011433,
      botToken: "6176319988:AAFe3rbKbqe459bS1uO8CEamO1vOjSxB2io",
    },
  },
  //Kısa bot
  {
    webhook: "QsdacW24qea",
    binance: {
      chatID: -1001815709655,
      botToken: "6068843776:AAEktKz3IyEw5URQJyOlZkPtPrAVraKAe-o",
    },
    mt5: {
      chatID: -1001815709655,
      botToken: "6068843776:AAEktKz3IyEw5URQJyOlZkPtPrAVraKAe-o",
    },
  },
  //Hikmet Ilgaz
  {
    webhook: "lXsibvtpZJ",
    binance: {
      chatID: -1001815709655,
      botToken: "6068843776:AAEktKz3IyEw5URQJyOlZkPtPrAVraKAe-o",
    },
    mt5: {
      chatID: -1001815709655,
      botToken: "6068843776:AAEktKz3IyEw5URQJyOlZkPtPrAVraKAe-o",
    },
  },
  //Sinem Ilgaz
  {
    webhook: "46cR5YwipH",
    binance: {
      chatID: -1001715159428,
      botToken: "6196276189:AAHsnUfNzBri6YKNYC6xgnUM6NK38Qc7Tlc",
    },
    mt5: {
      chatID: -1001715159428,
      botToken: "6196276189:AAHsnUfNzBri6YKNYC6xgnUM6NK38Qc7Tlc",
    },
  },
  //Yağız Mehmet Demir
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

    //Buy BTCUSD Q=0.01 SL=200 TP=15
    //Emir tipi [0]
    //Enstruman [1]
    //Lot [2].replace('Q=', '')
    //Stop Loss [3].replace('SL=', '')
    //Take Profit [4].replace('TP=', '')

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log(new Date());
      const seperated = body.split(" ");
      console.log(seperated);

      client
        .order({
          symbol: seperated[1].toUpperCase(),
          side: seperated[0].toUpperCase(),
          type: "LIMIT",
          timeInForce: "GTC",
          quantity: seperated[2].replace('Q=', ''),
          price: 55000,
          stopPrice: 54000, // Stop Loss seviyesi
          icebergQty: 0.001,
          newOrderRespType: "FULL",
          stopLimitPrice: 56000, // Take Profit seviyesi
          type: "STOP_LOSS_LIMIT",
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });

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
