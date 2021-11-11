import {
  FarmedAmountResponse,
  HeightResponse,
  NextAddressResponse,
  SyncStatusResponse,
  TransactionCountResponse,
  WalletBalanceResponse,
} from './Wallet/RpcResponse';
import {
  PlotDirectoriesResponse,
  PlotsResponse,
} from './Harvester/RpcResponse';
import { BlockchainStateResponse } from './FullNode/RpcResponse';
import { ConnectionResponse } from './RpcClient/RpcResponse';
import { SignagePointsResponse } from './Farmer/RpcResponse';
import { WalletInfo } from './Wallet/WalletInfo';

export interface MinerStats {
  farmer: {
    connections: ConnectionResponse
    signagePoints: SignagePointsResponse
  }

  fullNode: {
    blockchainState: BlockchainStateResponse
    connections: ConnectionResponse
  }

  harvester: {
    connections: ConnectionResponse
    plotDirectories: PlotDirectoriesResponse
    plots: PlotsResponse
  }

  wallet: {
    connections: ConnectionResponse
    farmedAmount: FarmedAmountResponse
    heightInfo: HeightResponse
    syncStatus: SyncStatusResponse

    wallets: Array<WalletInfo & {
      address: NextAddressResponse
      balance: WalletBalanceResponse
      transactionCount: TransactionCountResponse
    }>
  }
}
