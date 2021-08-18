import { IUserDefinedConfig } from '../interfaces/user-defined-config'

const defineConfig = (config: Partial<IUserDefinedConfig>): Partial<IUserDefinedConfig> => config

export default defineConfig
