# coindcx-trading-bot
It's a nodejs trading bot that uses infinite grid trading strategy 

![Webserver UI](https://miro.medium.com/max/971/1*TNhagbbZ4OZAympHaWDH5g.png 'Webserver UI')

If you want to backtest this strategy for different cryptos checkout: 
https://github.com/adarsh-chouhan-au8/Effective-DCA-Strategy-Crypto

## Disclaimer

This bot is for educational purposes only. Do not risk money which
you are afraid to lose. USE IT AT YOUR OWN RISK. THE AUTHORS
AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR TRADING RESULTS.

Always start by running a trading bot in Dry-run and do not engage money
before you understand how it works and what profit/loss you should
expect.

I strongly recommend you to have coding and Nodejs knowledge. Do not
hesitate to read the source code and understand the mechanism of this bot.
## How to use
### Install packages
cd to your project root and run npm install. It will install all required node modules
```
npm install
```

### Configuration
Sample .env file
```
key = your key
secret = your secret
pushbullet_token = your pushbullet_token
host = localhost
user = root
password = 
database = trading_bot
```
Get your Coindcx Api key and secret from your profile and fill it in .env.
If you wish to receive push notifications for every buy and sell orders fill the push bullet token, else leave it empty

Get one frome here:
https://www.pushbullet.com/#settings

Create a mysql database and install trading_bot.sql and add credentials to your .env

In "pairs" table each row represents a Cryptocurrency data object formatted in a JSON string.

Sample data object

```
{
    'name': 'chainlink',
    'pair': 'B-LINK_USDT',
    'symbol': 'LINKUSDT',
    "target_currency_precision": 2,
    'tradingUnit': 15,
    'levels': [[17.98, 'empty'], [17.61, 'empty'], [17.30, 'empty'], [16.93, 'empty']]
}
```
Here object.levels contains grid data in a 2d array. The bot will buy on every grid and will sell on the next higher grid.

Add as many levels and crypto pairs you require. The bot is designed to work simultaneously with multiple pairs.

### Let's run it!

for debugging  you can run:
```
node app.js
```
Now in order to run node script as a process you need to use a process monitor . There bunch of free options available like forever, monit, PM2, nohup etc

You are free to use any of these. I have included forever in the npm modules so it's already available

So you can start the bot like this:
```
forever start app.js 
```
Check status of bot:
```
forever list
```
Stop the bot:
```
forever stop app.js
```
### learn more about forever
https://github.com/foreversd/forever

