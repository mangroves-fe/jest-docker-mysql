export interface IUserDefinedConfig {
  /** MySQL database related */
  db: {
    /**
     * DB host
     * @defaultValue 127.0.0.1
     */
    host: string

    /** 
     * DB port, change this if you meet any conflicts
     * @defaultValue 6603
     */
    port: number

    user: string

    pass: string

    dbName: string
  }

  /**
   * MySQL docker image tag
   * @defaultValue 5.7
   */
  dbImageTag: string

  /** MySQL docker container name */
  containerName: string

  /**
   * Timeout (ms) waiting for container to be available
   * @defaultValue 60000
   */
  containerHealthCheckTimeout: number

  /**
   * (ms)
   * @defaultValue 500
   */
  containerHealthCheckInterval: number

  /**
   * Timeout (ms) for `before` and `after` hooks in `setupFilesAfterEnv`
   * @defaultValue 120000
   */
  jestHookTimeout: number

  /**
   * Regular expression to find out filename of the SQL scripts for each test case
   * @defaultValue /\[sql:\s*([a-z0-9_]+)\s*\]/
   */
  sqlFileIndicatorRegex: RegExp

  /**
   * Whether to execute SQL scripts for each test file
   * @defaultValue true
   */
  executeSqlForEachTestSuite: boolean

  /**
   * Directory path of SQL scripts for each test suite
   * @defaultValue db/migrate
   */
  sqlDirForTestSuite: string

  /**
   * Whether to execute SQL scripts for each test case
   * @defaultValue true
   */
  executeSqlForEachTestCase: boolean

  /**
   * Directory path relative to current test file
   * @defaultValue ./__sql__
   */
  sqlRelativeDirForTestCase: string

  /**
   * Regular expression to match init SQL script file name
   * @defaultValue /^.+\.up\.sql$/
   */
  upSqlFileRegex: RegExp

  /**
   * Regular expression to match clean-up SQL script file name
   * @defaultValue /^.+\.down\.sql$/
   */
  downSqlFileRegex: RegExp
}
