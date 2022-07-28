require('dotenv').config();
const apiConnect = require('./lib/apiConnect');
const debug = true
const mysql = require('mysql2/promise');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});



const checkAndOrder = async (pairObj, con) => {
    const tempPairDataObject = pairObj
    let oneDayInMilliSeconds = 60000 * 60 *24
    let dayCounter=0
    let apiFailureCount = 0
    let barsLow
    let barsHigh
    let levels
    let targetCurrencyPrecision
    let tradingUnit
    let quantity
    let buyOrderStatus
    let sellOrderStatus
    let dt

    while (true) {
        //query for keeping connection alive
        con.ping(async function (err){
            console.log(err)
            await apiConnect.pushBulletNoti('Alert!', 'SQL Connection Failed: Bot Closed');
            process.exit()

        })

       // const bars = await apiConnect.getCandles(`https://public.coindcx.com/market_data/candles?pair=${pairObj.pair}&interval=5m&limit=1`);
        
        const bars = await apiConnect.getCandles(`https://api.binance.com/api/v3/klines?symbol=${pairObj.symbol}&interval=5m&limit=1`);

        if (!bars) {
            await apiConnect.sleep(60000)
            apiFailureCount += 1
            if (debug) console.log("API FAILURES")
            if (apiFailureCount == 30) {
                notiStatus = await apiConnect.pushBulletNoti('Alert!', 'MULTIPLE Binance API FAILURES Bot Closed!');
                await apiConnect.telegramNoti({'Alert!': 'MULTIPLE Binance API FAILURES Bot Closed!' })
                // process.exit()
            }
            continue;
        }

        apiFailureCount = 0
        barsLow= bars[0][3]
        barsHigh=bars[0][2]
        console.log(barsHigh, barsLow);

        levels = pairObj.levels
        tradingUnit = pairObj.tradingUnit
        targetCurrencyPrecision = pairObj.target_currency_precision
        console.log(levels)

        for (let i = 0; i < levels.length; i++) {

            if (levels[i][0] >= barsLow && levels[i][0] <= barsHigh) {
                if (debug) console.log('met condition of candle intersection')

                //check possible buying event
                if (levels[i][1] == 'empty') {
                    if (debug) console.log('entered for buy level condition')

                    //place buying order
                    quantity = (tradingUnit / levels[i][0]).toFixed(targetCurrencyPrecision)
                    if (debug) console.log(quantity)
                    if (debug) console.log({
                        "side": "buy",
                        "order_type": "market_order",
                        "market": pairObj.symbol,
                        "total_quantity": quantity
                    })


                    buyOrderStatus = await apiConnect.createOrder({
                        "side": "buy",
                        "order_type": "market_order",
                        "market": pairObj.symbol,
                        "total_quantity": quantity

                    })

                    //Sample data of buyOrderStatus object
                    // buyOrderStatus = {
                    //     orders: [
                    //         {
                    //             id: '41f74e24-b0fb-11ec-8e2f-1b98e6d5b6d9',
                    //             client_order_id: null,
                    //             order_type: 'market_order',
                    //             side: 'buy',
                    //             status: 'open',
                    //             fee_amount: 0,
                    //             fee: 0.1,
                    //             maker_fee: 0.1,
                    //             taker_fee: 0.1,
                    //             total_quantity: 9,
                    //             remaining_quantity: 9,
                    //             source: null,
                    //             base_currency_name: null,
                    //             target_currency_name: null,
                    //             base_currency_short_name: null,
                    //             target_currency_short_name: null,
                    //             base_currency_precision: null,
                    //             target_currency_precision: null,
                    //             avg_price: 0,
                    //             price_per_unit: 1.671,
                    //             stop_price: 0,
                    //             market: 'MATICUSDT',
                    //             time_in_force: 'good_till_cancel',
                    //             created_at: 1648735373000,
                    //             updated_at: 1648735373000,
                    //             trades: null
                    //         }
                    //     ]
                    // }

                    if (buyOrderStatus) {
                        if (buyOrderStatus.orders[0].id) {

                            //trigger push notifications
                            await apiConnect.pushBulletNoti(`${pairObj.symbol} Buy order placed`, `price:${levels[i][0]}, quantity:${quantity}`);
                            await apiConnect.telegramNoti({
                                'Buy order placed': pairObj.symbol,
                                'Price': levels[i][0],
                                'quantity': quantity
                            })
                            console.log('entered buyOrderStatus')

                            levels[i][1] = 'filled'
                            //update db


                            tempPairDataObject.levels = levels

                            try{
                                dt = await con.execute('update pairs set pairs=? where name=? ', [JSON.stringify(tempPairDataObject), tempPairDataObject.name])
                            console.log(dt)

                            //add buy entry in orders
                            dt = await con.execute('INSERT INTO `orders`( `order_id`, `side`, `fee_amount`, `quantity`, `price`, `symbol`, `timestamp`) VALUES (?, ?, ?, ?, ?,?,?)', [buyOrderStatus.orders[0].id, buyOrderStatus.orders[0].side, buyOrderStatus.orders[0].fee_amount, buyOrderStatus.orders[0].total_quantity, buyOrderStatus.orders[0].price_per_unit, buyOrderStatus.orders[0].market, buyOrderStatus.orders[0].created_at])

                            }
                            catch(err) {
                                console.error(err)
                            }

                            if (debug) console.log(buyOrderStatus)
                        }

                    }

                }
                //check possible selling event
                if (i != (levels.length - 1)) {

                    if (levels[i + 1][1] == 'filled') {
                        if (debug) console.log('entered for sell level condition')

                        quantity = (tradingUnit / levels[i + 1][0]).toFixed(targetCurrencyPrecision)
                        if (debug) console.log(quantity)
                        if (debug) console.log({
                            "side": "sell",
                            "order_type": "market_order",
                            "market": pairObj.symbol,
                            "total_quantity": quantity

                        })

                        sellOrderStatus = await apiConnect.createOrder({
                            "side": "sell",
                            "order_type": "market_order",
                            "market": pairObj.symbol,
                            "total_quantity": quantity

                        })

                        // Sample data of sellOrderStatus object
                        // sellOrderStatus = {
                        //     orders: [
                        //         {
                        //             id: '495e0c16-b0fb-11ec-beef-23856932a931',
                        //             client_order_id: null,
                        //             order_type: 'market_order',
                        //             side: 'sell',
                        //             status: 'open',
                        //             fee_amount: 0,
                        //             fee: 0.1,
                        //             maker_fee: 0.1,
                        //             taker_fee: 0.1,
                        //             total_quantity: 9,
                        //             remaining_quantity: 9,
                        //             source: null,
                        //             base_currency_name: null,
                        //             target_currency_name: null,
                        //             base_currency_short_name: null,
                        //             target_currency_short_name: null,
                        //             base_currency_precision: null,
                        //             target_currency_precision: null,
                        //             avg_price: 0,
                        //             price_per_unit: 0,
                        //             stop_price: 0,
                        //             market: 'MATICUSDT',
                        //             time_in_force: 'good_till_cancel',
                        //             created_at: 1648735385000,
                        //             updated_at: 1648735385000,
                        //             trades: null
                        //         }
                        //     ]
                        // }

                        if (sellOrderStatus) {
                            if (sellOrderStatus.orders[0].id) {
                                
                                await apiConnect.pushBulletNoti(`${pairObj.symbol} Sell order placed`, `price:${levels[i + 1][0]}, quantity:${quantity}`);
                                await apiConnect.telegramNoti({
                                    'Sell order placed': pairObj.symbol,
                                    'Price': levels[i][0],
                                    'quantity': quantity
                                })

                                levels[i + 1][1] = 'empty'

                                //update levels in pairs table
                                tempPairDataObject.levels = levels
                               try{
                                dt = await con.execute('update pairs set pairs=? where name=? ', [JSON.stringify(tempPairDataObject), tempPairDataObject.name])
                                console.log(dt)

                                //add sell entry in orders
                                dt = await con.execute('INSERT INTO `orders`( `order_id`, `side`, `fee_amount`, `quantity`, `price`, `symbol`, `timestamp`) VALUES (?, ?, ?, ?, ?,?,?)', [sellOrderStatus.orders[0].id, sellOrderStatus.orders[0].side, sellOrderStatus.orders[0].fee_amount, sellOrderStatus.orders[0].total_quantity, sellOrderStatus.orders[0].price_per_unit, sellOrderStatus.orders[0].market, sellOrderStatus.orders[0].created_at])

                               }
                               catch(err) {
                                   console.error(err)
                               }
                                if (debug) console.log(sellOrderStatus)
                            }

                        }
                    }
                }

                break
            }
        }


        await apiConnect.sleep(10000)
        dayCounter+=10000

        if (dayCounter>oneDayInMilliSeconds) 
        {
            dayCounter=0
            console.log(('code is running successfully!'))
            await apiConnect.pushBulletNoti('code is running succesfully!')

        }
    }
}


const master = async () => {
    var con = await mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

    var queryDt = await con.execute('SELECT * FROM pairs')
    if (debug) console.log(queryDt[0])

    for (elem of queryDt[0]) {
        checkAndOrder(JSON.parse(elem.pairs), con);
    }

}

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
});


master()





