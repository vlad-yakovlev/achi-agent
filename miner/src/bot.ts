// @ts-ignore
require('dotenv-flow').config()

import axios from 'axios'
import {Farmer} from './achi/Farmer'
import FormData from 'form-data'
import {FullNode} from './achi/FullNode'
import {Harvester} from './achi/Harvester'
import {Wallet} from './achi/Wallet'

(async () => {
  try {
    const farmer = new Farmer()
    const fullNode = new FullNode()
    const harvester = new Harvester()
    const wallet = new Wallet()

    const data = {
      farmer: {
        signagePoints: await farmer.getSignagePoints(),
      },

      fullNode: {
        blockchainState: await fullNode.getBlockchainState(),
      },

      harvester: {
        plotDirectories: await harvester.getPlotDirectories(),
        plots          : await harvester.getPlots(),
      },

      wallet: {
        heightInfo: await wallet.getHeightInfo(),
        syncStatus: await wallet.getSyncStatus(),
        wallets   : await wallet.getWallets(),
      },
    }

    // const document = Buffer.from(JSON.stringify(data))
    const document = Buffer.from(JSON.stringify(data, null, '  '))

    const formData = new FormData()

    formData.append('document', document, {
      filename: 'achi.json',
    })

    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, formData, {
      params: {
        chat_id: process.env.CHAT_ID,
      },
    })
  } catch(error) {
    console.error(error)
  }

  process.exit(0)
})()
