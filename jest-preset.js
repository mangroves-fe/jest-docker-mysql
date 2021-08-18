const path = require('path')

module.exports = {
  globalSetup: path.resolve(__dirname, './lib/global-setup.js'),
  globalTeardown: path.resolve(__dirname, './lib/global-teardown.js'),
  setupFilesAfterEnv: [
    path.resolve(__dirname, './lib/setup-after-env.js'),
  ],
}
