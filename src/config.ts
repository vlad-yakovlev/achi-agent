require('dotenv-flow').config();

export const getMinerConfig = () => {
  if (!process.env.BOT_TOKEN) {
    console.error('BOT_TOKEN is required');
    process.exit(0);
  }

  if (!process.env.MINER_BOTS_CHAT_ID) {
    console.error('MINER_BOTS_CHAT_ID is required');
    process.exit(0);
  }

  return {
    telegram: {
      botToken: process.env.BOT_TOKEN,
      minerBotsChatId: Number(process.env.MINER_BOTS_CHAT_ID),
    },

    sendStats: {
      farmer: process.env.SEND_STATS_FARMER === 'true',
      fullNode: process.env.SEND_STATS_FULL_NODE === 'true',
      harvester: process.env.SEND_STATS_HARVESTER === 'true',
      wallet: process.env.SEND_STATS_WALLET === 'true',
    },
  };
};

export const getConfig = () => {
  if (!process.env.BOT_TOKEN) {
    console.error('BOT_TOKEN is required');
    process.exit(0);
  }

  if (!process.env.MINER_BOTS_CHAT_ID) {
    console.error('MINER_BOTS_CHAT_ID is required');
    process.exit(0);
  }

  if (!process.env.CONTROL_CHAT_ID) {
    console.error('CONTROL_CHAT_ID is required');
    process.exit(0);
  }

  return {
    telegram: {
      botToken: process.env.BOT_TOKEN,
      controlChatId: Number(process.env.CONTROL_CHAT_ID),
      minerBotsChatId: Number(process.env.MINER_BOTS_CHAT_ID),
    },

    thresholds: {
      fullNodeConnectionsCount: Number(process.env.FULL_NODE_CONNECTIONS_COUNT_THRESHOLD) || 50,
      lastUpdateDiffInMinutes: Number(process.env.LAST_UPDATE_DIFF_IN_MINUTES_THRESHOLD) || 10,
      plotCount: Number(process.env.PLOT_COUNT_THRESHOLD) || 100,
    },
  };
};
