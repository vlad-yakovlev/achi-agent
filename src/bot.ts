import { differenceInMinutes, format } from 'date-fns';
import { Bot } from 'grammy';
import { isControlChat, isMinerBotsChannel } from './middleware/chat';
import { ConnectionType } from './types/RpcClient/Connection';
import { ContextWithSession } from './types/Storage';
import { getConfig } from './config';
import { getSessionMiddleware } from './middleware/session';
import { MicroTelegram } from './telegram/MicroTelegram';

(async () => {
  const config = getConfig();
  const bot = new Bot<ContextWithSession>(config.telegram.botToken);
  const microTelegram = new MicroTelegram(config.telegram.botToken);

  bot.use(getSessionMiddleware());

  bot.on('channel_post:document', isMinerBotsChannel, async (ctx) => {
    const author = ctx.update.channel_post.author_signature!;
    const filePath = (await ctx.getFile()).file_path!;

    ctx.session.lastStats[author] = {
      date: ctx.channelPost.date,
      stats: await microTelegram.downloadFile(filePath),
    };
  });

  bot.command('stats', isControlChat, async (ctx) => {
    await ctx.reply(
      Object.keys(ctx.session.lastStats)
        .sort()
        .map((minerName) => {
          const lastStats = ctx.session.lastStats[minerName];

          const updatedAt = (() => {
            const formattedDate = format(lastStats.date * 1000, 'dd.MM.yyyy HH:mm:ss OOOO');
            const updateDiff = differenceInMinutes(Date.now(), lastStats.date * 1000);

            if (updateDiff > config.thresholds.lastUpdateDiffInMinutes) {
              return `${formattedDate} ❌`;
            }

            return `${formattedDate} ✅`;
          })();

          const fullNodeSyncStatus = (() => {
            if (!lastStats.stats.fullNode) {
              return '';
            }

            if (lastStats.stats.fullNode.blockchainState.blockchain_state.sync.synced) {
              return '✅';
            }

            if (lastStats.stats.fullNode.blockchainState.blockchain_state.sync.sync_mode) {
              return '⏳';
            }

            return '❌';
          })();

          const fullNodeConnectionsCount = (() => {
            if (!lastStats.stats.fullNode) {
              return '';
            }

            const count = lastStats.stats.fullNode.connections.connections
              .filter((connection) => connection.type === ConnectionType.FULL_NODE)
              .length;

            if (count < config.thresholds.fullNodeConnectionsCount) {
              return `${count} ❌`;
            }

            return `${count} ✅`;
          })();

          const plotsCount = (() => {
            if (!lastStats.stats.harvester) {
              return '';
            }

            const count = lastStats.stats.harvester.plots.plots.length;

            if (count < config.thresholds.plotCount) {
              return `${count} ❌`;
            }

            return `${count} ✅`;
          })();

          const walletSyncStatus = (() => {
            if (!lastStats.stats.wallet) {
              return '';
            }

            if (lastStats.stats.wallet.syncStatus.synced) {
              return '✅';
            }

            if (lastStats.stats.wallet.syncStatus.syncing) {
              return '⏳';
            }

            return '❌';
          })();

          const totalBalance = (() => {
            if (!lastStats.stats.wallet) {
              return '';
            }

            const balance = lastStats.stats.wallet.wallets
              // eslint-disable-next-line max-len
              .reduce((sum, wallet) => sum + wallet.balance.wallet_balance.confirmed_wallet_balance, 0);

            return `*ACH* ${String(balance).slice(0, -9)}.${String(balance).slice(-9)}`;
          })();

          return [
            `*${minerName}*`,
            `Последнее обновление: ${updatedAt}`,
            plotsCount && `Количество плотов: ${plotsCount}`,
            fullNodeConnectionsCount && `Кол-во подкл. узла: ${fullNodeConnectionsCount}`,
            fullNodeSyncStatus && `Статус синхр. узла: ${fullNodeSyncStatus}`,
            walletSyncStatus && `Статус синхр. кошелька: ${walletSyncStatus}`,
            totalBalance && `Общий баланс: ${totalBalance}`,
          ].filter(Boolean).join('\n');
        })
        .join('\n\n'),
      { parse_mode: 'Markdown' },
    );
  });

  bot.start();
})();
