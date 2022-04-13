import { Farmer } from '../achi/Farmer';
import { FullNode } from '../achi/FullNode';
import { getMinerConfig } from '../config';
import { Harvester } from '../achi/Harvester';
import { MicroTelegram } from '../telegram/MicroTelegram';
import { MinerStats } from '../types/MinerStats';
import { Wallet } from '../achi/Wallet';

(async () => {
  try {
    const minerConfig = getMinerConfig();
    const microTelegram = new MicroTelegram(minerConfig.telegram.botToken);

    const minerStats: MinerStats = {};

    if (minerConfig.sendStats.farmer) {
      const farmer = new Farmer();

      minerStats.farmer = {
        connections: await farmer.getConnections(),
        signagePoints: await farmer.getSignagePoints(),
      };
    }

    if (minerConfig.sendStats.fullNode) {
      const fullNode = new FullNode();

      minerStats.fullNode = {
        blockchainState: await fullNode.getBlockchainState(),
        connections: await fullNode.getConnections(),
      };
    }

    if (minerConfig.sendStats.harvester) {
      const harvester = new Harvester();

      minerStats.harvester = {
        connections: await harvester.getConnections(),
        plotDirectories: await harvester.getPlotDirectories(),
        plots: await harvester.getPlots(),
      };
    }

    if (minerConfig.sendStats.wallet) {
      const wallet = new Wallet();

      minerStats.wallet = {
        connections: await wallet.getConnections(),
        farmedAmount: await wallet.getFarmedAmount(),
        heightInfo: await wallet.getHeightInfo(),
        syncStatus: await wallet.getSyncStatus(),

        wallets: await Promise.all((await wallet.getWallets()).wallets.map(async (walletItem) => ({
          ...walletItem,
          address: await wallet.getAddress(walletItem.id),
          balance: await wallet.getWalletBalance(walletItem.id),
          transactionCount: await wallet.getTransactionCount(walletItem.id),
        }))),
      };
    }

    await microTelegram.sendDocument(
      minerConfig.telegram.minerBotsChatId,
      'achi.json',
      Buffer.from(JSON.stringify(minerStats)),
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
