// @ts-ignore
require('dotenv-flow').config()

import {Farmer} from '../achi/Farmer'
import {FullNode} from '../achi/FullNode'
import {Harvester} from '../achi/Harvester'
import {MicroTelegram} from '../telegram/MicroTelegram'
import {Wallet} from '../achi/Wallet'

(async () => {
  try {
    const farmer = new Farmer()
    const fullNode = new FullNode()
    const harvester = new Harvester()
    const wallet = new Wallet()

    const microTelegram = new MicroTelegram({
      token: process.env.BOT_TOKEN!,
    })

    const data = {
      farmer: {
        connections  : await farmer.getConnections(),
        signagePoints: await farmer.getSignagePoints(),
      },

      fullNode: {
        blockchainState: await fullNode.getBlockchainState(),
        connections    : await fullNode.getConnections(),
      },

      harvester: {
        connections    : await harvester.getConnections(),
        plotDirectories: await harvester.getPlotDirectories(),
        plots          : await harvester.getPlots(),
      },

      wallet: {
        connections : await wallet.getConnections(),
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

    await microTelegram.sendDocument(process.env.MINER_BOTS_CHAT_ID!, 'achi.json', Buffer.from(JSON.stringify(data)))
  } catch(error) {
    console.error(error)
  }

  process.exit(0)
})()
