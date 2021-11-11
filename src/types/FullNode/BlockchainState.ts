import { BlockRecord } from './BlockRecord';

export interface BlockchainState {
  difficulty: number
  genesis_challenge_initialized: boolean
  mempool_size: number
  peak: BlockRecord
  space: number
  sub_slot_iters: number
  sync: {
    sync_mode: boolean
    sync_progress_height: number
    sync_tip_height: number
    synced: boolean
  }
}
