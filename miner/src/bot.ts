// @ts-ignore
require('dotenv-flow').config()

import axios from 'axios'
import {Wallet} from './achi/Wallet'

(async () => {
  try {
    const wallet = new Wallet({
      port: 9985,
    })

    console.log(await wallet.getHeightInfo())

    await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: process.env.CHAT_ID,
        text   : 'Hello, Telegram!',
      },
    })
  } catch(error) {
    console.error(error)
  }

  process.exit(0)
})()
