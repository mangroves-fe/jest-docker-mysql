export const IS_CI = process.env.JEST_DOCKER_MYSQL_ENV === 'ci'
export const IS_LOCAL = process.env.JEST_DOCKER_MYSQL_ENV === 'local'
