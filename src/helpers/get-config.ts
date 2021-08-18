import path from 'path'
import merge from 'lodash.merge'
import { DEFAULT_CONFIG } from '../constants/default-config'
import { IUserDefinedConfig } from '../interfaces/user-defined-config'

const CONFIG_FILE_NAME = 'jest-docker-mysql-config.js'

let userDefinedConfig = {}

try {
  userDefinedConfig = require(path.resolve(process.cwd(), CONFIG_FILE_NAME))
} catch (err) {
  // No-op
}

const finalConfig: IUserDefinedConfig = merge({}, DEFAULT_CONFIG, userDefinedConfig)

export default finalConfig
