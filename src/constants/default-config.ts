import path from 'path'

import { IUserDefinedConfig } from '../interfaces/user-defined-config'

export const DEFAULT_CONFIG: IUserDefinedConfig = {
  db: {
    host: '127.0.0.1',
    port: 6603,
    user: 'jest-docker-mysql',
    pass: 'jest-docker-mysql',
    dbName: 'jest-docker-mysql',
  },
  dbImageTag: '5.7',
  containerName: 'jest-docker-mysql',
  containerHealthCheckTimeout: 60000,
  containerHealthCheckInterval: 500,
  jestHookTimeout: 120000,
  sqlFileIndicatorRegex: /\[sql:\s*([a-z0-9_]+)\s*\]/,
  executeSqlForEachTestSuite: true,
  sqlDirForTestSuite: path.resolve(process.cwd(), 'db/migrate'),
  executeSqlForEachTestCase: true,
  sqlRelativeDirForTestCase: './__sql__',
  upSqlFileRegex: /^.+\.up\.sql$/,
  downSqlFileRegex: /^.+\.down\.sql$/,
}
