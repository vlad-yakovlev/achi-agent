import {AchiOptions, RpcClient} from './RpcClient'
import {getAchiConfig, getAchiFilePath} from './AchiNodeUtils'
import {
  PlotDirectoriesResponse,
  PlotsResponse,
} from '../types/Harvester/RpcResponse'
import {CertPath} from '../types/CertPath'
import {RpcResponse} from '../types/RpcResponse'

const achiConfig = getAchiConfig()
const defaultProtocol = 'https'
const defaultHostname = achiConfig?.self_hostname || 'localhost'
const defaultPort = achiConfig?.harvester.rpc_port || 9980
const defaultCaCertPath = achiConfig?.private_ssl_ca.crt
const defaultCertPath = achiConfig?.daemon_ssl.private_crt
const defaultCertKey = achiConfig?.daemon_ssl.private_key

class Harvester extends RpcClient {
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

  public async getPlots(): Promise<PlotsResponse> {
    return this.request<PlotsResponse>('get_plots', {})
  }

  public async refreshPlots(): Promise<RpcResponse> {
    return this.request<RpcResponse>('refresh_plots', {})
  }

  public async deletePlot(
    fileName: string,
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>('delete_plot', {
      filename: fileName,
    })
  }

  public async addPlotDirectory(
    dirName: string,
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>('add_plot_directory', {
      dirname: dirName,
    })
  }

  public async getPlotDirectories(): Promise<PlotDirectoriesResponse> {
    return this.request<PlotDirectoriesResponse>('get_plot_directories', {})
  }

  public async removePlotDirectory(
    dirName: string,
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>('remove_plot_directory', {
      dirname: dirName,
    })
  }
}

export {Harvester}
