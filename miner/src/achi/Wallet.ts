import {AchiOptions, RpcClient} from './RpcClient'
import {
  AddKeyResponse,
  GenerateMnemonicResponse,
  HeightResponse,
  LoginResponse,
  NextAddressResponse,
  PrivateKeyResponse,
  PublicKeysResponse,
  SyncStatusResponse,
  TransactionResponse,
  TransactionsResponse,
  WalletBalanceResponse,
  WalletsResponse,
} from '../types/Wallet/RpcResponse'
import {getAchiConfig, getAchiFilePath} from './AchiNodeUtils'
import {CertPath} from '../types/CertPath'

const achiConfig = getAchiConfig()
const defaultProtocol = 'https'
const defaultHostname = achiConfig?.self_hostname || 'localhost'
const defaultPort = achiConfig?.wallet.rpc_port || 9985
const host = 'https://backup.achi.net' // TODO: replace with correct one

const defaultCaCertPath = achiConfig?.private_ssl_ca.crt
const defaultCertPath = achiConfig?.daemon_ssl.private_crt
const defaultCertKey = achiConfig?.daemon_ssl.private_key

class Wallet extends RpcClient {
  public constructor(options?: Partial<AchiOptions> & CertPath) {
    super({
      caCertPath: options?.caCertPath || getAchiFilePath(defaultCaCertPath),
      certPath  : options?.certPath || getAchiFilePath(defaultCertPath),
      hostname  : options?.hostname || defaultHostname,
      keyPath   : options?.keyPath || getAchiFilePath(defaultCertKey),
      port      : options?.port || defaultPort,
      protocol  : options?.protocol || defaultProtocol,
    })
  }

  public async logIn(
    fingerprint: number,
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>('log_in', {
      fingerprint,
      host,
      type: 'start',
    })
  }

  public async logInAndRestore(
    fingerprint: number,
    filePath: string,
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>('log_in', {
      file_path: filePath,
      fingerprint,
      host,
      type     : 'restore_backup',
    })
  }

  public async logInAndSkip(
    fingerprint: number,
  ): Promise<LoginResponse> {
    return this.request<LoginResponse>('log_in', {
      fingerprint,
      host,
      type: 'skip',
    })
  }

  public async getPublicKeys(): Promise<PublicKeysResponse> {
    return this.request<PublicKeysResponse>(
      'get_public_keys',
      {},
    )
  }

  public async getPrivateKey(
    fingerprint: number,
  ): Promise<PrivateKeyResponse> {
    return this.request<PrivateKeyResponse>(
      'get_private_key',
      {fingerprint},
    )
  }

  public async generateMnemonic(): Promise<GenerateMnemonicResponse> {
    return await this.request<GenerateMnemonicResponse>(
      'generate_mnemonic',
      {},
    )
  }

  public async addKey(
    mnemonic: string[],
    type: string = 'new_wallet',
  ): Promise<AddKeyResponse> {
    return this.request<AddKeyResponse>('add_key', {
      mnemonic,
      type,
    })
  }

  public async deleteKey(
    fingerprint: number,
  ): Promise<{}> {
    return this.request<{}>('delete_key', {fingerprint})
  }

  public async deleteAllKeys(): Promise<{}> {
    return this.request<{}>('delete_all_keys', {})
  }

  public async getSyncStatus(): Promise<SyncStatusResponse> {
    return this.request<SyncStatusResponse>('get_sync_status', {})
  }

  public async getHeightInfo(): Promise<HeightResponse> {
    return this.request<HeightResponse>('get_height_info', {})
  }

  public async farmBlock(
    address: string,
  ): Promise<{}> {
    return this.request<{}>('farm_block', {address})
  }

  public async getWallets(): Promise<WalletsResponse> {
    return this.request<WalletsResponse>('get_wallets', {})
  }

  // TODO: create_new_wallet

  public async getWalletBalance(
    walletId: string,
  ): Promise<WalletBalanceResponse> {
    return this.request<WalletBalanceResponse>('get_wallet_balance', {wallet_id: walletId})
  }

  public async getTransaction(
    walletId: string,
    transactionId: string,
  ): Promise<TransactionResponse> {
    return this.request<TransactionResponse>(
      'get_transaction',
      {
        transaction_id: transactionId,
        wallet_id     : walletId,
      },
    )
  }

  public async getTransactions(
    walletId: string,
    limit: number,
  ): Promise<TransactionsResponse> {
    return this.request<TransactionsResponse>(
      'get_transactions',
      {
        end      : limit,
        wallet_id: walletId,
      },
    )
  }

  public async getAddress(
    walletId: string,
  ): Promise<NextAddressResponse> {
    return this.request<NextAddressResponse>(
      'get_next_address',
      {
        new_address: false,
        wallet_id  : walletId,
      },
    )
  }

  public async getNextAddress(
    walletId: string,
  ): Promise<NextAddressResponse> {
    return this.request<NextAddressResponse>(
      'get_next_address',
      {
        new_address: true,
        wallet_id  : walletId,
      },
    )
  }

  public async sendTransaction(
    walletId: string,
    amount: number,
    address: string,
    fee: number,
  ): Promise<TransactionResponse> {
    return this.request<TransactionResponse>(
      'send_transaction',
      {
        address,
        amount,
        fee,
        wallet_id: walletId,
      },
    )
  }

  public async sendTransactionAndGetId(
    walletId: string,
    amount: number,
    address: string,
    fee: number,
  ): Promise<TransactionResponse> {
    return this.request<TransactionResponse>(
      'send_transaction',
      {
        address,
        amount,
        fee,
        wallet_id: walletId,
      },
    )
  }

  public async sendTransactionRaw(
    walletId: string,
    amount: number,
    address: string,
    fee: number,
  ): Promise<TransactionResponse> {
    return this.request<TransactionResponse>(
      'send_transaction',
      {
        address,
        amount,
        fee,
        wallet_id: walletId,
      },
    )
  }

  public async createBackup(filePath: string): Promise<{}> {
    return this.request<{}>('create_backup', {file_path: filePath})
  }

  // TODO: get_transaction_count
  // TODO: get_farmed_amount
  // TODO: create_signed_transaction

  // TODO: cc_set_name
  // TODO: cc_get_name
  // TODO: cc_spend
  // TODO: cc_get_colour
  // TODO: create_offer_for_ids
  // TODO: get_discrepancies_for_offer
  // TODO: respond_to_offer
  // TODO: get_trade
  // TODO: get_all_trades
  // TODO: cancel_trade

  // TODO: did_update_recovery_ids
  // TODO: did_spend
  // TODO: did_get_pubkey
  // TODO: did_get_did
  // TODO: did_recovery_spend
  // TODO: did_get_recovery_list
  // TODO: did_create_attest
  // TODO: did_get_information_needed_for_recovery
  // TODO: did_create_backup_file

  // TODO: rl_set_user_info
  // TODO: send_clawback_transaction:
  // TODO: add_rate_limited_funds:
}

export {Wallet}
