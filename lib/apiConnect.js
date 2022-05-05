require('dotenv').config()
const fetch = require('node-fetch');
const crypto = require('crypto')
const baseurl = "https://public.coindcx.com"
const key = process.env.key
const secret = process.env.secret

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


const getCandles = async (url) => {

  try {
    resp = await fetch(url)
    if (resp.ok) return (await resp.json())
}
  catch (err) {
    console.error(err)

  }
  return false
}

const createOrder = async (ordDetails) => {

  const url = "https://api.coindcx.com/exchange/v1/orders/create"
  const timeStamp = Math.floor(Date.now());
  const body = ordDetails
  body.timeStamp = timeStamp
  const payload = Buffer.from(JSON.stringify(body)).toString();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  const options = {
    url: url,
    headers: {
      'content-type': 'application/json',
      'X-AUTH-APIKEY': key,
      'X-AUTH-SIGNATURE': signature
    },
    body: JSON.stringify(body),
    method: 'POST'
  }

  try {
    resp = await fetch(url, options)
    //console.log(await resp.json())
    if (resp.ok) {
      return await resp.json()
    }
  }
  catch (err) {
    console.log(err)
  }

  return false
}




const getBalance = async (symbol) => {

  const timeStamp = Math.floor(Date.now());
  const url = "https://api.coindcx.com/exchange/v1/users/balances"


  const body = {
    "timestamp": timeStamp
  }

  const payload = Buffer.from(JSON.stringify(body)).toString();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  const options = {

    headers: {
      'X-AUTH-APIKEY': key,
      'X-AUTH-SIGNATURE': signature
    },
    body: JSON.stringify(body),
    method: 'POST'
  }
  try {
    resp = await fetch(url, options)
    if (resp.ok) {
      balArr = await resp.json()
      console.log(typeof balArr)
      balArr.forEach((element) => {

        if (element.currency == symbol) {

          usdtBalance = element.balance
        }
      })
      return usdtBalance
    }
  }
  catch (err) {
    console.log(err)
  }
  return false
}


const pushBulletNoti = async (title, body) => {

  const token = process.env.pushbullet_token
  const msg = { "type": "note", "title": title, "body": body }
  const url = 'https://api.pushbullet.com/v2/pushes'

  const options = {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(msg),
    method: 'POST'
  }

  try {
    notiResp = await fetch(url, options)
    if (notiResp.ok) {
      return await notiResp.json()
    }
  }
  catch (err) {
    console.log(err)
  }

}

const telegramNoti = async (obj) => {
  telegramUser = process.env.telegram_user
  message=''

  for (const key in obj) {
    message += `${key}: ${obj[key]}\n`
  }
  message=encodeURI(message)

  url = `https://api.callmebot.com/text.php?user=${telegramUser}&text=${message}`
  try {
    notiResp = await fetch(url)
    if (notiResp.ok) {
      return  notiResp
    }
  }
  catch (err) {
    console.log(err)
  }
  return false

}



module.exports = {
  createOrder,
  getCandles,
  sleep,
  getBalance,
  pushBulletNoti,
  telegramNoti
}