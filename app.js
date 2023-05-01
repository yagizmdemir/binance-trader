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
    //Kısa bot
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
    //Uzun bot
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
            chatID: -1001958402970,
            botToken: "5549479470:AAE1wbhhKt9kksNm7HfAfBjyBfCXs1K_zis",
        },
        mt5: {
            chatID: -1001958402970,
            botToken: "5549479470:AAE1wbhhKt9kksNm7HfAfBjyBfCXs1K_zis",
        },
    },
];

let indicators = { EURUSD: { CCI: "", MACD: "", DPC: "" }, GBPUSD: { CCI: "", MACD: "", DPC: "" }, AUDUSD: { CCI: "", MACD: "", DPC: "" }, NZDUSD: { CCI: "", MACD: "", DPC: "" }, USDCHF: { CCI: "", MACD: "", DPC: "" }, USDCAD: { CCI: "", MACD: "", DPC: "" }, USDJPY: { CCI: "", MACD: "", DPC: "" }, USDJPY: { CCI: "", MACD: "", DPC: "" } };

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
                    quantity: seperated[2].replace("Q=", ""),
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

            bot.sendMessage(hook.binance.chatID, body)
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
            if ( body.toLowerCase().startsWith("buy") || body.toLowerCase().startsWith("sell") || body.toLowerCase().startsWith("selllimit") || body.toLowerCase().startsWith("buylimit") || body.toLowerCase().startsWith("fiboselllimit") || body.toLowerCase().startsWith("fibobuylimit") ) {
                bot.sendMessage(hook.mt5.chatID, body)
                    .then(() => {
                        console.log("Mesaj gönderildi");
                    })
                    .catch((error) => {
                        console.error("Mesaj gönderilirken hata oluştu:", error);
                    });
                res.end("Received and logged request body");
            } else if (body.toLowerCase().startsWith("indicator")) {
                let signal = body.split(/\s/);
                const indis = signal[0].slice(11, signal[0].length - 1);
                const smb = signal[1].slice(8, signal[1].length - 1);
                const trigger = signal[2].slice(9, signal[2].length - 1);
                indicators[smb][indis] = trigger;
                if (indicators[smb]["CCI"] == "CrossedUp" && indicators[smb]["MACD"] == "CrossedUp" && indicators[smb]["DPC"] == "CrossedUp") {
                    indicators[smb]["CCI"] == "";
                    bot.sendMessage(hook.mt5.chatID, `Buy ${smb} Q=0.04 SL=30 TP=25`)
                    .then(() => { console.log("Mesaj gönderildi") })
                    .catch((error) => { console.error("Mesaj gönderilirken hata oluştu:", error) });
                    
                    res.end("Position sent to MT5");
                } else if ( indicators[smb]["CCI"] == "CrossedDown" && indicators[smb]["MACD"] == "CrossedDown" && indicators[smb]["DPC"] == "CrossedDown" ) {
                    indicators[smb]["CCI"] == "";
                    bot.sendMessage(hook.mt5.chatID, `Sell ${smb} Q=0.04 SL=30 TP=25`)
                        .then(() => { console.log("Mesaj gönderildi") })
                        .catch((error) => { console.error("Mesaj gönderilirken hata oluştu:", error) });
        
                    res.end("Position sent to MT5");
                } else {
                    res.end("Received and logged request body");
                }
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
