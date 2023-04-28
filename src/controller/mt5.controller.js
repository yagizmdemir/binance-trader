const TelegramBot = require("node-telegram-bot-api");

const mt5Hook = (req, res) => {
    let body = "",
        indicators = { EURUSD: { CCI: "", MACD: "", DPC: "" }, GBPUSD: { CCI: "", MACD: "", DPC: "" }, AUDUSD: { CCI: "", MACD: "", DPC: "" }, NZDUSD: { CCI: "", MACD: "", DPC: "" }, USDCHF: { CCI: "", MACD: "", DPC: "" }, USDCAD: { CCI: "", MACD: "", DPC: "" }, USDJPY: { CCI: "", MACD: "", DPC: "" }, USDJPY: { CCI: "", MACD: "", DPC: "" } };
    
        const bot = new TelegramBot(token, { polling: false });

    //Indicator="CCI" Symbol="GBPUSD" Trigger="CrossedUp"

    const { token, chatID } = req.hook;

    req.on("data", (chunk) => {

        body += chunk.toString();

    });

    req.on("end", () => {

        if ( body.toLowerCase().startsWith("buy") || body.toLowerCase().startsWith("sell") || body.toLowerCase().startsWith("selllimit") || body.toLowerCase().startsWith("buylimit") || body.toLowerCase().startsWith("fiboselllimit") || body.toLowerCase().startsWith("fibobuylimit") ) {
            
            bot.sendMessage(chatID, body)
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

                bot.sendMessage(chatID, `Buy ${smb} Q=0.04 SL=20 TP=17`)
                    .then(() => { console.log("Mesaj gönderildi") })
                    .catch((error) => { console.error("Mesaj gönderilirken hata oluştu:", error) });
    
                res.end("Received and logged request body");

            }
            
            if (indicators[smb]["CCI"] == "CrossedDown" && indicators[smb]["MACD"] == "CrossedDown" && indicators[smb]["DPC"] == "CrossedDown") {
                
                bot.sendMessage(chatID, `Sell ${smb} Q=0.04 SL=20 TP=17`)
                    .then(() => { console.log("Mesaj gönderildi") })
                    .catch((error) => { console.error("Mesaj gönderilirken hata oluştu:", error) });
    
                res.end("Received and logged request body");

            }

        }

    });
};

module.exports = { mt5Hook };
