import {Plot} from './Plot'
import {RpcResponse} from '../RpcResponse'

export interface PlotsResponse extends RpcResponse {
    failed_to_open_filenames: string[]
    not_found_filenames: string[]
    plots: Plot[]
}

export interface PlotDirectoriesResponse extends RpcResponse {
    directories: string[]
}
