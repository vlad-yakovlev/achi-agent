export interface WalletBalance {
    confirmed_wallet_balance: number
    max_send_amount: string
    pending_change: number
    pending_coin_removal_count: number
    spendable_balance: number
    unconfirmed_wallet_balance: number
    unspent_coin_count: number
    wallet_id: number
}
