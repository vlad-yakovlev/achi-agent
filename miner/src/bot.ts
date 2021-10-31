// @ts-ignore
require('dotenv-flow').config()

import {Farmer} from './achi/Farmer'
import {FullNode} from './achi/FullNode'
import {Harvester} from './achi/Harvester'
import {Telegram} from './Telegram'
import {Wallet} from './achi/Wallet'

(async () => {
  try {
    const farmer = new Farmer()
    const fullNode = new FullNode()
    const harvester = new Harvester()
    const wallet = new Wallet()

    const telegram = new Telegram({
      token: process.env.BOT_TOKEN!,
    })

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

    await telegram.sendDocument(process.env.CHAT_ID!, 'achi.json', Buffer.from(JSON.stringify(data)))
  } catch(error) {
    console.error(error)
  }

  process.exit(0)
})()
