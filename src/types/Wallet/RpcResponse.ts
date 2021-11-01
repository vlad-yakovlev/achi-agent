import {BackupInfo} from './BackupInfo'
import {RpcResponse} from '../RpcResponse'
import {Transaction} from './Transaction'
import {WalletBalance} from './WalletBalance'
import {WalletInfo} from './WalletInfo'

export interface LoginResponse extends RpcResponse {
    backup_info?: BackupInfo
    backup_path?: string
}

// Looks like a bug in Achi RPC server where it doesn't provide the standard response with success flag
export interface PublicKeysResponse {
    public_key_fingerprints: string[]
}

export interface PrivateKeyResponse extends RpcResponse {
    private_key: string[]
}

export interface GenerateMnemonicResponse extends RpcResponse {
    mnemonic: string[]
}

export interface AddKeyResponse extends RpcResponse {
    word?: string
}

export interface SyncStatusResponse extends RpcResponse {
    synced: boolean
    syncing: boolean
}

export interface HeightResponse extends RpcResponse {
    height: number
}

export interface WalletsResponse extends RpcResponse {
    wallets: WalletInfo[]
}

export interface WalletBalanceResponse extends RpcResponse {
    wallet_balance: WalletBalance
}

export interface TransactionResponse extends RpcResponse {
    transaction: Transaction
    transaction_id: string
}

export interface TransactionsResponse extends RpcResponse {
    transactions: Transaction[]
    wallet_id: number
}

export interface NextAddressResponse extends RpcResponse {
    wallet_id: number
    address: string
}

export interface TransactionCountResponse extends RpcResponse {
    wallet_id: number
    count: number
}

export interface FarmedAmountResponse extends RpcResponse {
    'farmed_amount': number
    'farmer_reward_amount': number
    'fee_amount': number
    'last_height_farmed': number
    'pool_reward_amount': number
    'timelord_reward_amount': number
}
