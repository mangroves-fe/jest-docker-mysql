import execa from 'execa'
import os from 'os'

import config from './helpers/get-config'
import { CONTAINER_HEALTH_STATUS } from './constants/docker'
import { log, logTime, throwError } from './helpers/logger'

const dockerInspectArgs = [
  'inspect',
  '--format',
  '{{.State.Health.Status}}',
  config.containerName,
]

const inspectDockerContainer = async () => {
  log('Inspecting container...')

  const childProcess = await execa('docker', dockerInspectArgs)

  const status = childProcess.stdout.toString()

  if (status !== CONTAINER_HEALTH_STATUS.HEALTHY) throwError('Status not healthy')
}

const startDockerContainer = async () => {
  log('Starting MySQL Docker Container...')

  const dockerArgs = [
    'run',
    '--name',
    config.containerName,
    '-e',
    `MYSQL_USER=${config.db.user}`,
    '-e',
    `MYSQL_PASSWORD=${config.db.pass}`,
    '-e',
    `MYSQL_DATABASE=${config.db.dbName}`,
    '-e',
    'MYSQL_ROOT_PASSWORD=root',
    '-p',
    `${config.db.port}:3306`,
    '--health-cmd',
    'mysqladmin ping -u root -proot --silent',
    '-d',
  ]

  if (['arm', 'arm64'].includes(os.arch())) {
    dockerArgs.push('--platform', 'linux/x86_64')
  }

  dockerArgs.push(`mysql:${config.dbImageTag}`)

  await execa('docker', dockerArgs)
}

const waitForContainerReady = async () => {
  let countdown = config.containerHealthCheckTimeout
  const step = config.containerHealthCheckInterval
  while (countdown) {
    const childProcess = await execa('docker', dockerInspectArgs)

    const status = childProcess.stdout.toString()

    if (status === CONTAINER_HEALTH_STATUS.HEALTHY) break
    if (status === CONTAINER_HEALTH_STATUS.UNHEALTHY) throwError('Container failed to start.')

    countdown -= step

    await new Promise((resolve) => {
      setTimeout(resolve, step)
    })
  }
}

const setupWrapper = async (): Promise<void> => {
  // Check if container is running
  try {
    await inspectDockerContainer()
    log('Container healthy, running test cases...')
  } catch (err) {
    log('Container not running normally, trying to start a new container...')

    // Start MySQL from docker
    await startDockerContainer()
  }

  // Wait until MySQL is ready for connections
  await waitForContainerReady()
}

const globalSetup = async (): Promise<void> => {
  await logTime('MySQL docker container start time cost', setupWrapper)
}

export default globalSetup
