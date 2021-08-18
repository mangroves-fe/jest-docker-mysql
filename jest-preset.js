const path = require('path')

module.exports = {
  globalSetup: path.resolve(__dirname, './lib/setup.js'),
  globalTeardown: path.resolve(__dirname, './lib/teardown.js'),
  setupFilesAfterEnv: [
    path.resolve(__dirname, './lib/setup-after-env.js'),
  ],
}
