// @ts-ignore
require('dotenv-flow').config()

import axios from 'axios'

// import {Farmer} from './achi/Farmer'
import {FullNode} from './achi/FullNode'
import {Harvester} from './achi/Harvester'
import {Wallet} from './achi/Wallet'

(async () => {
  try {
    // const farmer = new Farmer()
    const fullNode = new FullNode()
    const harvester = new Harvester()
    const wallet = new Wallet()

    const data = {

      // farmer: {
      //   poolState: await farmer.getPoolState(),
      // },

      fullNode: {
        blockchainState: await fullNode.getBlockchainState(),
        networkInfo    : await fullNode.getNetworkInfo(),
      },

      harvester: {
        plots: await harvester.getPlots(),
      },

      wallet: {
        heightInfo: await wallet.getHeightInfo(),
        syncStatus: await wallet.getSyncStatus(),
        wallets   : await wallet.getWallets(),
      },
    }

    console.log(JSON.stringify(data, null, '  '))

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
