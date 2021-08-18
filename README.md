# jest-docker-mysql

Jest preset to run MySQL in docker

# Features

- Run a MySQL docker container before test and remove it after test finished
- Run SQL scripts before each test suite (test file) and run clean-up SQL scripts after each test suite
- Run SQL scripts before and after each test case according to the file name specified in test case name string

**Caveat: Do note that the test cases must not run concurrently as they use the same MySQL database. Thus the `--runInBand` option must be added to the jest command**

```bash
jest --runInBand
```

# Install

```bash
yarn add @mangroves/jest-docker-mysql --dev
```

You can use `npm` or other tools as an alternative.

# Usage

There are 3 alternatives to use this package.

## Use as a preset

In your `jest.config.js` (Or `jest` field in `package.json`):

```javascript
module.exports = {
  preset: '@mangroves/jest-docker-mysql',
}
```

## Specify scripts

If you've already set another package as the preset, you can set `setupFilesAfterEnv`, `globalSetup` and `globalTeardown` manually.

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '@mangroves/jest-docker-mysql/lib/setup-after-env.js',
    // ...other files
  ],
  globalSetup: '@mangroves/jest-docker-mysql/lib/global-setup.js',
  globalTeardown: '@mangroves/jest-docker-mysql/lib/global-teardown.js',
}
```

## Import Setup and Teardown Scripts

Maybe even `globalSetup` and `globalTeardown` are taken by your own script, but don't worry, you can still use this package.

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '@mangroves/jest-docker-mysql/lib/setup-after-env.js',
    // ...other files
  ],
  globalSetup: 'path/to/your/script-setup.js',
  globalTeardown: 'path/to/your/script-teardown.js',
}
```

In your setup script:

```javascript
// path/to/your/script-setup.js
import { globalSetup } from '@mangroves/jest-docker-mysql'

const yourSetup = async () => {
  await globalSetup()
}

export default yourSetup
```

The same for the teardown script.

# Connect to MySQL Container

After you execute the `jest` command and the test cases are running, you can connect to the MySQL container and use it.

Example:

```javascript
// xxx.spec.js
import { config } from '@mangroves/jest-docker-mysql'

describe('Your test case', () => {
  let connection
  beforeAll(async () => {
    // Use your mysql library to connect the database
    connection = await createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      pass: config.db.pass,
    })
  })

  afterAll(async () => {
    // Don't forget to close connection after test run
    connection.close()
  })
})
```

# Environment Variables

Sometimes you don't want to stop and remove the MySQL container, or you don't want to start a container every time you run the test.

You can set an environment variable whose key is `JEST_DOCKER_MYSQL_ENV` to `local`.

And you may need this lib: [cross-env](https://github.com/kentcdodds/cross-env)

It's practical especially in jest watch mode:

```bash
cross-env JEST_DOCKER_MYSQL_ENV=local jest --watch --runInBand
```

Don't forget to remove the container manually if you don't need it any more.

# Config File

Create a file named `jest-docker-mysql-config.js` and put it under the root directory as the config file.

Use `defineConfig` exported by this package to get better type intellisense.

```javascript
// jest-docker-mysql-config.js
const { defineConfig } = require('@mangroves/jest-docker-mysql')

module.exports = defineConfig({
  db: {
    port: 6666,
  },
})
```
