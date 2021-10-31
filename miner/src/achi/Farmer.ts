import {AchiOptions, RpcClient} from './RpcClient'
import {getAchiConfig, getAchiFilePath} from './AchiNodeUtils'
import {
  LoginLinkResponse,
  PoolStateResponse,
  RewardTargetResponse,
  SignagePointResponse,
  SignagePointsResponse,
} from '../types/Farmer/RpcResponse'
import {CertPath} from '../types/CertPath'
import {RpcResponse} from '../types/RpcResponse'

const achiConfig = getAchiConfig()
const defaultProtocol = 'https'
const defaultHostname = achiConfig?.self_hostname || 'localhost'
const defaultPort = achiConfig?.farmer.rpc_port || 8559
const defaultCaCertPath = achiConfig?.private_ssl_ca.crt
const defaultCertPath = achiConfig?.daemon_ssl.private_crt
const defaultCertKey = achiConfig?.daemon_ssl.private_key

class Farmer extends RpcClient {
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

  public async getSignagePoint(
    signagePointHash: string,
  ): Promise<SignagePointResponse> {
    return this.request<SignagePointResponse>('get_signage_point', {
      sp_hash: signagePointHash,
    })
  }

  public async getSignagePoints(): Promise<SignagePointsResponse> {
    return this.request<SignagePointsResponse>('get_signage_points', {})
  }

  public async getRewardTarget(
    searchForPrivateKey: boolean,
  ): Promise<RewardTargetResponse> {
    return this.request<RewardTargetResponse>('get_reward_targets', {
      search_for_private_key: searchForPrivateKey,
    })
  }

  public async setRewardTarget(
    farmerTarget?: string,
    poolTarget?: string,
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>('set_reward_targets', {
      farmer_target: farmerTarget,
      pool_target  : poolTarget,
    })
  }

  public async getPoolState(): Promise<PoolStateResponse> {
    return this.request<PoolStateResponse>('get_pool_state', {})
  }

  public async setPayoutInstructions(
    launcher_id: string,
    payout_instructions: string,
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>('set_payout_instructions', {
      launcher_id        : launcher_id,
      payout_instructions: payout_instructions,
    })
  }

  public async getPoolLoginLink(
    launcher_id: string,
  ): Promise<LoginLinkResponse> {
    return this.request<LoginLinkResponse>('get_pool_login_link', {
      launcher_id: launcher_id,
    })
  }
}

export {Farmer}
