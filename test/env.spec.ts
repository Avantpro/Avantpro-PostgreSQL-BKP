import { beforeEach, describe, afterAll } from '@jest/globals'
import { envClass } from '../src/env'

describe('env class', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('Create env [Clean]', () => {
    process.env = {
      ...process.env,
    }

    const env = new envClass()

    expect(JSON.parse(JSON.stringify(env))).toEqual({
      SCHEDULE: '',
      BACKUP_KEEP: 9,
      AWS_S3_REGION: '',
      AWS_S3_ACCESS_KEY_ID: '',
      AWS_S3_SECRET_ACCESS_KEY: '',
      AWS_S3_BUCKET: '',
      AWS_S3_PREFIX: '',
      POSTGRES_HOST: '',
      POSTGRES_DATABASE: '',
      POSTGRES_USER: '',
      POSTGRES_PASSWORD: '',
      BACKUP_DATABASE_URL: 'postgres://:@/',
      RUN_ON_STARTUP: false,
    })
  })

  test('Create env [Basic]', () => {
    process.env = {
      ...process.env,
      SCHEDULE: '0 */1 * * *',
      BACKUP_KEEP: '40',
      AWS_S3_REGION: '123',
      AWS_S3_ACCESS_KEY_ID: '456',
      AWS_S3_SECRET_ACCESS_KEY: '789',
      AWS_S3_BUCKET: '123',
      AWS_S3_PREFIX: '456',
      POSTGRES_HOST: 'host',
      POSTGRES_DATABASE: 'database',
      POSTGRES_USER: 'user',
      POSTGRES_PASSWORD: 'password',
      RUN_ON_STARTUP: 'true',
    }

    const env = new envClass()

    expect(JSON.parse(JSON.stringify(env))).toEqual({
      SCHEDULE: '0 */1 * * *',
      BACKUP_KEEP: 39,
      AWS_S3_REGION: '123',
      AWS_S3_ACCESS_KEY_ID: '456',
      AWS_S3_SECRET_ACCESS_KEY: '789',
      AWS_S3_BUCKET: '123',
      AWS_S3_PREFIX: '456',
      POSTGRES_HOST: 'host',
      POSTGRES_DATABASE: 'database',
      POSTGRES_USER: 'user',
      POSTGRES_PASSWORD: 'password',
      BACKUP_DATABASE_URL: 'postgres://user:password@host/database',
      RUN_ON_STARTUP: true,
    })
  })
})
