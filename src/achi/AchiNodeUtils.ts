import {AchiConfig} from '../types/AchiConfig'
import {homedir} from 'os'
import {parse} from 'yaml'
import {readFileSync} from 'fs'
import {resolve} from 'path'

let achiRootPath: string = ''

export const getAchiRootPath = (): string => {
  if(achiRootPath){return achiRootPath}

  achiRootPath = resolve(
    homedir(),
    process.env['ACHI_ROOT'] || '.achi/mainnet',
  )

  return achiRootPath
}

export const getAchiConfig = (): AchiConfig => {
  const configFilePath = resolve(getAchiRootPath(), 'config', 'config.yaml')
  return parse(readFileSync(configFilePath, 'utf8')) as AchiConfig
}

export const getAchiFilePath = (relativePath: string): string => {
  return resolve(getAchiRootPath(), relativePath)
}
