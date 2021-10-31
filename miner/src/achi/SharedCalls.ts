import {AchiOptions, RpcClient} from './RpcClient'
import {getAchiConfig, getAchiFilePath} from './AchiNodeUtils'
import {CertPath} from '../types/CertPath'
import {ConnectionResponse} from '../types/FullNode/RpcResponse'
import {RpcResponse} from '../types/RpcResponse'

const achiConfig = getAchiConfig()
const defaultProtocol = 'https'
const defaultHostname = achiConfig?.self_hostname || 'localhost'
const defaultPort = achiConfig?.full_node.rpc_port || 8555
const defaultCaCertPath = achiConfig?.private_ssl_ca.crt
const defaultCertPath = achiConfig?.daemon_ssl.private_crt
const defaultCertKey = achiConfig?.daemon_ssl.private_key


class SharedCalls extends RpcClient {
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

  public async getConnections(): Promise<ConnectionResponse> {
    return this.request<ConnectionResponse>('get_connections', {})
  }

  public async openConnection(host: string, port: number): Promise<RpcResponse> {
    return this.request<RpcResponse>(
      'open_connection', {
        host: host,
        port: port,
      })
  }

  public async closeConnection(nodeId: string): Promise<RpcResponse> {
    return this.request<RpcResponse>(
      'close_connection', {
        node_id: nodeId,
      })
  }

  public async stopNode(): Promise<RpcResponse>{
    return this.request<RpcResponse>('stop_node', {})
  }
}

export {SharedCalls}
