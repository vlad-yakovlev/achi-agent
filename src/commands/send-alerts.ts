import * as R from 'remeda';
import { differenceInMinutes } from 'date-fns';
import { ContextWithSession, LastStats } from '../types/Storage';
import { ConnectionType } from '../types/RpcClient/Connection';
import { getConfig } from '../config';
import { getSessionMiddleware } from '../middleware/session';
import { MicroTelegram } from '../telegram/MicroTelegram';

const validateLastStats = (lastStats: LastStats) => {
  const config = getConfig();
  const errors = [] as string[];

  const updateDiff = differenceInMinutes(Date.now(), lastStats.date * 1000);

  if (updateDiff > config.thresholds.lastUpdateDiffInMinutes) {
    errors.push(`не отправлял статистику последние ${updateDiff} минут`);
  }

  if (lastStats.stats.harvester) {
    if (lastStats.stats.harvester.plots.plots.length < config.thresholds.plotCount) {
      errors.push(`${lastStats.stats.harvester.plots.plots.length} плотов`);
    }
  }

  if (lastStats.stats.fullNode) {
    const fullNodeConnectionsCount = lastStats.stats.fullNode.connections.connections
      .filter((connection) => connection.type === ConnectionType.FULL_NODE)
      .length;

    if (fullNodeConnectionsCount < config.thresholds.fullNodeConnectionsCount) {
      errors.push(`у узла ${fullNodeConnectionsCount} подключений`);
    }

    if (!lastStats.stats.fullNode.blockchainState.blockchain_state.sync.synced) {
      errors.push('узел не синхронизирован');
    }
  }

  if (lastStats.stats.wallet) {
    if (!lastStats.stats.wallet.syncStatus.synced) {
      errors.push('кошелек не синхронизирован');
    }
  }

  return errors;
};

(async () => {
  try {
    const config = getConfig();
    const microTelegram = new MicroTelegram(config.telegram.botToken);

    const session = await (async () => {
      const fakeContext = {} as ContextWithSession;
      // eslint-disable-next-line no-promise-executor-return, max-len
      await new Promise((resolve) => getSessionMiddleware()(fakeContext, async () => resolve(undefined)));
      return fakeContext.session;
    })();

    const errors = R.pipe(
      session.lastStats,

      R.keys,

      R.sort((left, right) => left.localeCompare(right)),

      R.map((minerName) => validateLastStats(session.lastStats[minerName])
        .map((error) => `🚨 *${minerName}* ${error}`)),

      R.flatten(),
    );

    if (errors.length) {
      await microTelegram.sendSticker(
        config.telegram.controlChatId,
        'CAACAgIAAx0CZEClpAADe2GAYtBcW7WfF2-9ZdvNsBmYbetEAAI-AwACWuOKF0G2pX4B9gMsIQQ',
      );

      await microTelegram.sendMessage(
        config.telegram.controlChatId,
        errors.join('\n'),
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
