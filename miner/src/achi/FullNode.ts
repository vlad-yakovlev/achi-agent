import {AchiOptions, RpcClient} from './RpcClient'
import {
  AdditionsAndRemovalsResponse,
  BlockchainStateResponse,
  BlockRecordResponse,
  BlockResponse,
  BlocksResponse,
  CoinRecordResponse,
  CoinResponse,
  NetspaceResponse,
  UnfinishedBlockHeadersResponse,
} from '../types/FullNode/RpcResponse'
import {getAchiConfig, getAchiFilePath} from './AchiNodeUtils'
import {Block} from '../types/FullNode/Block'
import {CertPath} from '../types/CertPath'

// @ts-ignore
// import {address_to_puzzle_hash, get_coin_info_mojo, puzzle_hash_to_address} from 'chia-utils'

const achiConfig = getAchiConfig()
const defaultProtocol = 'https'
const defaultHostname = achiConfig?.self_hostname || 'localhost'
const defaultPort = achiConfig?.full_node.rpc_port || 8555
const defaultCaCertPath = achiConfig?.private_ssl_ca.crt
const defaultCertPath = achiConfig?.daemon_ssl.private_crt
const defaultCertKey = achiConfig?.daemon_ssl.private_key

class FullNode extends RpcClient {
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

  public async getBlockchainState(): Promise<BlockchainStateResponse> {
    return this.request<BlockchainStateResponse>('get_blockchain_state', {})
  }

  public async getNetworkSpace(
    newerBlockHeaderHash: string,
    olderBlockHeaderHash: string,
  ): Promise<NetspaceResponse> {
    return this.request<NetspaceResponse>('get_network_space', {
      newer_block_header_hash: newerBlockHeaderHash,
      older_block_header_hash: olderBlockHeaderHash,
    })
  }

  public async getBlocks<B extends boolean>(
    start: number,
    end: number,
    excludeHeaderHash?: B,
  ): Promise<BlocksResponse<Block>> {
    return this.request('get_blocks', {
      end,
      exclude_header_hash: excludeHeaderHash || false,
      start,
    })
  }

  public async getBlock(headerHash: string): Promise<BlockResponse> {
    return this.request<BlockResponse>('get_block', {
      header_hash: headerHash,
    })
  }

  public async getBlockRecordByHeight(
    height: number,
  ): Promise<BlockRecordResponse> {
    return this.request<BlockRecordResponse>('get_block_record_by_height', {
      height,
    })
  }

  public async getBlockRecord(hash: string): Promise<BlockRecordResponse> {
    return this.request<BlockRecordResponse>('get_block_record', {
      header_hash: hash,
    })
  }

  public async getUnfinishedBlockHeaders(
    height: number,
  ): Promise<UnfinishedBlockHeadersResponse> {
    return this.request<UnfinishedBlockHeadersResponse>(
      'get_unfinished_block_headers',
      {
        height,
      },
    )
  }

  public async getUnspentCoins(
    puzzleHash: string,
    startHeight?: number,
    endHeight?: number,
  ): Promise<CoinResponse> {
    return this.request<CoinResponse>('get_coin_records_by_puzzle_hash', {
      end_height         : endHeight,
      include_spent_coins: false,
      puzzle_hash        : puzzleHash,
      start_height       : startHeight,
    })
  }

  public async getCoinRecordByName(name: string): Promise<CoinRecordResponse> {
    return this.request<CoinRecordResponse>('get_coin_record_by_name', {
      name,
    })
  }

  public async getAdditionsAndRemovals(
    hash: string,
  ): Promise<AdditionsAndRemovalsResponse> {
    return this.request<AdditionsAndRemovalsResponse>(
      'get_additions_and_removals',
      {
        header_hash: hash,
      },
    )
  }

  public async getNetworkInfo(): Promise<{}> {
    return this.request<{}>('get_network_info', {})
  }

  /* https://github.com/CMEONE/chia-utils */
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

export {FullNode}
