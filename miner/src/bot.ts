// @ts-ignore
require('dotenv-flow').config()

import {Farmer} from './achi/Farmer'
import {FullNode} from './achi/FullNode'
import {Harvester} from './achi/Harvester'
import {Telegram} from './telegram/Telegram'
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
        allMempoolItems: await fullNode.getAllMempoolItems(),
        allMempoolTxIds: await fullNode.getAllMempoolTxIds(),
        blockchainState: await fullNode.getBlockchainState(),
      },

      harvester: {
        plotDirectories: await harvester.getPlotDirectories(),
        plots          : await harvester.getPlots(),
      },

      wallet: {
        farmedAmount: await wallet.getFarmedAmount(),
        heightInfo  : await wallet.getHeightInfo(),
        syncStatus  : await wallet.getSyncStatus(),

        wallets: await Promise.all((await wallet.getWallets()).wallets.map(async walletItem => ({
          ...walletItem,
          address         : await wallet.getAddress(walletItem.id),
          balance         : await wallet.getWalletBalance(walletItem.id),
          transactionCount: await wallet.getTransactionCount(walletItem.id),
        }))),
      },
    }

    await telegram.sendDocument(process.env.CHAT_ID!, 'achi.json', Buffer.from(JSON.stringify(data)))
  } catch(error) {
    console.error(error)
  }

  process.exit(0)
})()
