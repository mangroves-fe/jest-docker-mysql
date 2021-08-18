import path from 'path'
import merge from 'lodash.merge'
import { DEFAULT_CONFIG } from '../constants/default-config'
import { IUserDefinedConfig } from '../interfaces/user-defined-config'

const CONFIG_FILE_NAME = 'jest-docker-mysql-config.js'

const userDefinedConfig = require(path.resolve(process.cwd(), CONFIG_FILE_NAME))
const finalConfig: IUserDefinedConfig = merge({}, userDefinedConfig, DEFAULT_CONFIG)

export default finalConfig
