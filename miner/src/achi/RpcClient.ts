import {Agent} from 'https'
import axios from 'axios'
import {ConnectionResponse} from '../types/RpcClient/RpcResponse'
import {readFileSync} from 'fs'

type Protocol = 'https' | 'http';

interface AchiOptions {
  protocol: Protocol
  hostname: string
  port: number
  caCertPath: string | boolean
  certPath: string
  keyPath: string
}

class RpcClient {
  private readonly protocol: Protocol;
  private readonly hostname: string;
  private readonly port: number;
  private readonly agent: Agent;

  public constructor(options: AchiOptions) {
    this.protocol = options.protocol
    this.hostname = options.hostname
    this.port = options.port

    this.agent = new Agent({
      ...typeof options.caCertPath !== 'boolean' ? {ca: readFileSync(options.caCertPath)} : {},
      cert              : readFileSync(options.certPath),
      key               : readFileSync(options.keyPath),
      rejectUnauthorized: options.hostname !== 'localhost',
    })
  }

  private baseUri(): string {
    return `${this.protocol}://${this.hostname}:${this.port}`
  }

  protected async request<T>(
    route: string,
    body: Record<string, string | number | boolean | string[] | undefined>,
  ): Promise<T> {
    const {data} = await axios.post<T>(`${this.baseUri()}/${route}`, body, {
      httpsAgent: this.agent,
    })

    return data
  }

  public async getConnections(): Promise<ConnectionResponse> {
    return this.request<ConnectionResponse>('get_connections', {})
  }

  // TODO: add response type
  public async openConnection(
    host: string,
    port: string,
  ): Promise<{}> {
    return this.request<{}>('open_connection', {
      host,
      port,
    })
  }

  // TODO: close_connection
  // TODO: stop_node
}

export {AchiOptions, RpcClient}
