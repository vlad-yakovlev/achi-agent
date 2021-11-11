import * as R from 'ramda';
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
    errors.push(`hasn't send the stats for the last ${updateDiff} minutes`);
  }

  if (!lastStats.stats.fullNode.blockchainState.blockchain_state.sync.synced) {
    errors.push('full-node not synced');
  }

  const fullNodeConnectionsCount = lastStats.stats.fullNode.connections.connections
    .filter((connection) => connection.type === ConnectionType.FULL_NODE)
    .length;

  if (fullNodeConnectionsCount < config.thresholds.fullNodeConnectionsCount) {
    errors.push(`full-node has only ${fullNodeConnectionsCount} connections`);
  }

  if (lastStats.stats.harvester.plots.plots.length < config.thresholds.plotCount) {
    errors.push(`harvester has only ${lastStats.stats.harvester.plots.plots.length} plots`);
  }

  if (!lastStats.stats.wallet.syncStatus.synced) {
    errors.push('wallet not synced');
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

    const errors = R.compose<
    Record<string, LastStats>,
    string[],
    string[],
    string[][],
    string[]
    >(
      R.flatten,

      R.map((minerName) => validateLastStats(session.lastStats[minerName])
        .map((error) => `🚨 *${minerName}* ${error}`)),

      R.sort((left, right) => left.localeCompare(right)),
      R.keys,
    )(session.lastStats);

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
