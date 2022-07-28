require('dotenv').config();
const apiConnect = require('./lib/apiConnect');
const mysql = require('mysql2/promise');
const debug = true


const timeInterval = '15m'
const timeIntervalInMilliSeconds = 15 * 60 * 1000

const symbols = [
    {
        symbol: 'BTCUSDT',
        lastPrice: 0,
        percentageDiff: 5
    },
    {
        symbol: 'ETHUSDT',
        lastPrice: 0,
        percentageDiff: 6.5
    },
    {
        symbol: 'LINKUSDT',
        lastPrice: 0,
        percentageDiff: 6.5
    },
    {
        symbol: 'MATICUSDT',
        lastPrice: 0,
        percentageDiff: 6.5
    },
    {
        symbol: 'LUNAUSDT',
        lastPrice: 0,
        percentageDiff: 80
    }

];

// const symbols = [
//     {
//         symbol: 'BTCUSDT',
//         lastPrice: '60000',
//         percentageDiff: 10
//     }
// ]

const alert = async (pairObj) => {

    let lastPrice, apiFailureCount, growthPercentage, barsHigh

    while (true) {
        const bars = await apiConnect.getCandles(`https://api.binance.com/api/v3/klines?symbol=${pairObj.symbol}&interval=${timeInterval}&limit=1`);

        console.log(bars)
        if (!bars) {
            await apiConnect.sleep(10000)
            apiFailureCount += 1
            if (debug) console.log("API FAILURES")
            if (apiFailureCount == 30) {
                notiStatus = await apiConnect.telegramNoti({ 'Alert!': 'MULTIPLE Binance API FAILURES' });
            }
            continue;
        }

        apiFailureCount = 0
        barsHigh = bars[0][2]

        if (pairObj.lastPrice == 0) {
            pairObj.lastPrice = barsHigh
            continue

        }

        lastPrice = pairObj.lastPrice


        growthPercentage = ((barsHigh - lastPrice) / lastPrice) * 100
        console.log(lastPrice, barsHigh, growthPercentage,bars)

        if (Math.abs(growthPercentage) > pairObj.percentageDiff) {


            notiStatus = await apiConnect.telegramNoti({
                'Alert!': growthPercentage > 0 ? `Hurrah! ${pairObj.symbol} is pumping` : `Alas! ${pairObj.symbol} is dumping `,
                'Change': ` ${growthPercentage.toFixed(2)}%`,
                'Current Price': `${parseFloat(barsHigh).toFixed(2)} `
            })

            if (notiStatus) {
                pairObj.lastPrice = barsHigh

            }
        }


        console.log(pairObj)

        await apiConnect.sleep(timeIntervalInMilliSeconds)
    }



}

for (symbol of symbols) {
    alert(symbol);
}