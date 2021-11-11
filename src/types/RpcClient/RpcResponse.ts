import { Connection } from './Connection';
import { RpcResponse } from '../RpcResponse';

export interface ConnectionResponse extends RpcResponse {
  connections: Array<Connection>
}
