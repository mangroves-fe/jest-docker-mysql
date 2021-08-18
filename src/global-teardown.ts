import execa from 'execa'

import config from './helpers/get-config'
import { IS_LOCAL } from './constants/env'
import { log } from './helpers/logger'

const stopAndRemoveContainer = async () => {
  await execa('docker', ['stop', config.containerName])
  await execa('docker', ['rm', '-v', config.containerName])
}

const globalTeardown = async (): Promise<void> => {
  if (!IS_LOCAL) {
    log('Stopping and removing container...')
  
    // Stop and remove docker container
    await stopAndRemoveContainer()
  }
}

export default globalTeardown
