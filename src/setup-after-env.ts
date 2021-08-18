import fs from 'fs/promises'
import path from 'path'
import { createConnection } from 'mysql2/promise'

import config from './helpers/get-config'
import { throwError } from './helpers/logger'

const connectDB = async () => {
  const {
    host,
    port,
    user,
    pass,
    dbName,
  } = config.db

  const connection = await createConnection({
    host,
    port,
    user,
    password: pass,
    database: dbName,
    multipleStatements: true,
  })

  if (!connection) {
    throwError('Failed to connect to database, please check if the DB container is running.')
  }

  return connection
}

const querySQL = async (filePathList: string[]) => {
  if (!__JEST_DOCKER_MYSQL_CONNECTION__) {
    throwError('Connection not found!')
  }

  const length = filePathList.length
  for (let i = 0; i < length; i++) {
    const sqlString = (await fs.readFile(filePathList[i])).toString()
    if (sqlString) {
      await __JEST_DOCKER_MYSQL_CONNECTION__.query(sqlString)
    }
  }
}

const executeDDL = async (dirPath: string, filterFn: (fileName: string) => boolean, isReverse: boolean) => {
  const compareFn: (a: string, b: string) => number = isReverse ? (a, b) => b.localeCompare(a) : (a, b) => a.localeCompare(b)

  const filePathList = (await fs.readdir(dirPath))
    .filter(filterFn)
    .sort(compareFn)
    .map((fileName) => path.resolve(dirPath, fileName))
  await querySQL(filePathList)
}

beforeAll(async () => {
  // Init connection
  __JEST_DOCKER_MYSQL_CONNECTION__ = await connectDB()

  // DDL
  if (config.executeSqlForEachTestSuite) {
    const filterFn = (fileName: string) => config.upSqlFileRegex.test(fileName)
    await executeDDL(config.sqlDirForTestSuite, filterFn, false)
  }
}, config.jestHookTimeout)

afterAll(async () => {
  // Reverse DDL
  if (config.executeSqlForEachTestSuite) {
    const filterFn = (fileName: string) => config.downSqlFileRegex.test(fileName)
    await executeDDL(config.sqlDirForTestSuite, filterFn, true)
  }

  // Close connection
  __JEST_DOCKER_MYSQL_CONNECTION__?.destroy()
}, config.jestHookTimeout)

beforeEach(async () => {
  if (!config.executeSqlForEachTestCase) return

  const expectState = expect.getState()
  const currentTestName = expectState.currentTestName
  const testPath = expectState.testPath

  const sqlFilePrefix = currentTestName.match(config.sqlFileIndicatorRegex)?.[1]

  if (sqlFilePrefix) {
    const dirPath = path.resolve(testPath, '..', config.sqlRelativeDirForTestCase)
    const filterFn = (fileName: string) => config.upSqlFileRegex.test(fileName) && fileName.indexOf(sqlFilePrefix) === 0

    await executeDDL(dirPath, filterFn, false)
  }
}, config.jestHookTimeout)

afterEach(async () => {
  if (!config.executeSqlForEachTestCase) return

  const expectState = expect.getState()
  const currentTestName = expectState.currentTestName
  const testPath = expectState.testPath

  const sqlFilePrefix = currentTestName.match(config.sqlFileIndicatorRegex)?.[1]

  if (sqlFilePrefix) {
    const dirPath = path.resolve(testPath, '..', config.sqlRelativeDirForTestCase)
    const filterFn = (fileName: string) => config.downSqlFileRegex.test(fileName) && fileName.indexOf(sqlFilePrefix) === 0

    await executeDDL(dirPath, filterFn, true)
  }
}, config.jestHookTimeout)
