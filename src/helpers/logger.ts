const LOG_IDENTIFIER = '[Jest Docker MySQL]'

export const log = (msg: string): void => {
  console.log(`${LOG_IDENTIFIER} ${msg}`)
}

export const logTime = async (msg: string, fn: () => Promise<any>): Promise<void> => {
  console.time(msg)
  await fn()
  console.timeEnd(msg)
}

export const throwError = (msg: string): never => {
  throw new Error(`${LOG_IDENTIFIER} ${msg}`)
}
