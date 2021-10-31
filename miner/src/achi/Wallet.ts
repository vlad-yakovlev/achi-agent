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
import {Transaction} from '../types/Wallet/Transaction'
import {WalletBalance} from '../types/Wallet/WalletBalance'
import {WalletInfo} from '../types/Wallet/WalletInfo'

// @ts-ignore
// import {address_to_puzzle_hash, get_coin_info_mojo, puzzle_hash_to_address} from 'chia-utils'

const achiConfig = getAchiConfig()
const defaultProtocol = 'https'
const defaultHostname = achiConfig?.self_hostname || 'localhost'
const defaultPort = achiConfig?.wallet.rpc_port || 9256
const host = 'https://backup.achi.net'

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

  public async logIn(fingerprint: number): Promise<LoginResponse> {
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

  public async logInAndSkip(fingerprint: number): Promise<LoginResponse> {
    return this.request<LoginResponse>('log_in', {
      fingerprint,
      host,
      type: 'skip',
    })
  }

  public async getPublicKeys(): Promise<string[]> {
    const {public_key_fingerprints} = await this.request<PublicKeysResponse>(
      'get_public_keys',
      {},
    )

    return public_key_fingerprints
  }

  public async getPrivateKey(fingerprint: number): Promise<string[]> {
    const {private_key} = await this.request<PrivateKeyResponse>(
      'get_private_key',
      {fingerprint},
    )

    return private_key
  }

  public async generateMnemonic(): Promise<string[]> {
    const {mnemonic} = await this.request<GenerateMnemonicResponse>(
      'generate_mnemonic',
      {},
    )

    return mnemonic
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

  public async deleteKey(fingerprint: number): Promise<{}> {
    return this.request<{}>('delete_key', {fingerprint})
  }

  public async deleteAllKeys(): Promise<{}> {
    return this.request<{}>('delete_all_keys', {})
  }

  public async getSyncStatus(): Promise<boolean> {
    const {syncing} = await this.request<SyncStatusResponse>(
      'get_sync_status',
      {},
    )

    return syncing
  }

  public async getHeightInfo(): Promise<number> {
    const {height} = await this.request<HeightResponse>(
      'get_height_info',
      {},
    )

    return height
  }

  public async farmBlock(address: string): Promise<{}> {
    return this.request<{}>('farm_block', {address})
  }

  public async getWallets(): Promise<WalletInfo[]> {
    const {wallets} = await this.request<WalletsResponse>('get_wallets', {})

    return wallets
  }

  public async getWalletBalance(walletId: string): Promise<WalletBalance> {
    const {wallet_balance} = await this.request<WalletBalanceResponse>(
      'get_wallet_balance',
      {wallet_id: walletId},
    )

    return wallet_balance
  }

  public async getTransaction(
    walletId: string,
    transactionId: string,
  ): Promise<Transaction> {
    const {transaction} = await this.request<TransactionResponse>(
      'get_transaction',
      {
        transaction_id: transactionId,
        wallet_id     : walletId,
      },
    )

    return transaction
  }

  public async getTransactions(walletId: string, limit: number): Promise<Transaction[]> {
    const {transactions} = await this.request<TransactionsResponse>(
      'get_transactions',
      {
        end      : limit,
        wallet_id: walletId,
      },
    )

    return transactions
  }

  public async getAddress(walletId: string): Promise<string> {
    const {address} = await this.request<NextAddressResponse>(
      'get_next_address',
      {
        new_address: false,
        wallet_id  : walletId,
      },
    )

    return address
  }

  public async getNextAddress(walletId: string): Promise<string> {
    const {address} = await this.request<NextAddressResponse>(
      'get_next_address',
      {
        new_address: true,
        wallet_id  : walletId,
      },
    )

    return address
  }

  public async sendTransaction(
    walletId: string,
    amount: number,
    address: string,
    fee: number,
  ): Promise<Transaction> {
    const {transaction} = await this.request<TransactionResponse>(
      'send_transaction',
      {
        address,
        amount,
        fee,
        wallet_id: walletId,
      },
    )

    return transaction
  }

  public async sendTransactionAndGetId(
    walletId: string,
    amount: number,
    address: string,
    fee: number,
  ): Promise<{}> {
    const {transaction, transaction_id} = await this.request<TransactionResponse>(
      'send_transaction',
      {
        address,
        amount,
        fee,
        wallet_id: walletId,
      },
    )

    return {transaction, transactionId: transaction_id}
  }

  public async sendTransactionRaw(
    walletId: string,
    amount: number,
    address: string,
    fee: number,
  ): Promise<{}> {
    const transaction = await this.request<TransactionResponse>(
      'send_transaction',
      {
        address,
        amount,
        fee,
        wallet_id: walletId,
      },
    )

    return transaction
  }

  public async createBackup(filePath: string): Promise<{}> {
    return this.request<{}>('create_backup', {file_path: filePath})
  }

  /* https://github.com/CMEONE/achi-utils */
  // public addressToPuzzleHash(address: string): string {
  //   return address_to_puzzle_hash(address)
  // }

  // public puzzleHashToAddress(puzzleHash: string): string {
  //   return puzzle_hash_to_address(puzzleHash)
  // }

  // public getCoinInfo(parentCoinInfo: string, puzzleHash: string, amount: number): string {
  //   return get_coin_info_mojo(parentCoinInfo, puzzleHash, amount)
  // }
}

export {Wallet}
