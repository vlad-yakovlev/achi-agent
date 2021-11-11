import { AchiOptions, RpcClient } from './RpcClient';
import { getAchiConfig, getAchiFilePath } from './AchiNodeUtils';
import {
  RewardTargetResponse,
  SignagePointResponse,
  SignagePointsResponse,
} from '../types/Farmer/RpcResponse';
import { CertPath } from '../types/CertPath';
import { RpcResponse } from '../types/RpcResponse';

const achiConfig = getAchiConfig();
const defaultProtocol = 'https';
const defaultHostname = achiConfig?.self_hostname || 'localhost';
const defaultPort = achiConfig?.farmer.rpc_port || 9970;
const defaultCaCertPath = achiConfig?.private_ssl_ca.crt;
const defaultCertPath = achiConfig?.daemon_ssl.private_crt;
const defaultCertKey = achiConfig?.daemon_ssl.private_key;

export class Farmer extends RpcClient {
  public constructor(options?: Partial<AchiOptions> & CertPath) {
    super({
      caCertPath: options?.caCertPath || getAchiFilePath(defaultCaCertPath),
      certPath: options?.certPath || getAchiFilePath(defaultCertPath),
      hostname: options?.hostname || defaultHostname,
      keyPath: options?.keyPath || getAchiFilePath(defaultCertKey),
      port: options?.port || defaultPort,
      protocol: options?.protocol || defaultProtocol,
    });
  }

  public async getSignagePoint(
    signagePointHash: string,
  ): Promise<SignagePointResponse> {
    return this.request<SignagePointResponse>('get_signage_point', {
      sp_hash: signagePointHash,
    });
  }

  public async getSignagePoints(): Promise<SignagePointsResponse> {
    return this.request<SignagePointsResponse>('get_signage_points', {});
  }

  public async getRewardTarget(
    searchForPrivateKey: boolean,
  ): Promise<RewardTargetResponse> {
    return this.request<RewardTargetResponse>('get_reward_targets', {
      search_for_private_key: searchForPrivateKey,
    });
  }

  public async setRewardTarget(
    farmerTarget?: string,
    poolTarget?: string,
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>('set_reward_targets', {
      farmer_target: farmerTarget,
      pool_target: poolTarget,
    });
  }
}
