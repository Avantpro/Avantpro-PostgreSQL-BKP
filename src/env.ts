class envClass {
  SCHEDULE: string = ''
  BACKUP_KEEP: number = 10

  AWS_S3_REGION: string = ''
  AWS_S3_ACCESS_KEY_ID: string = ''
  AWS_S3_SECRET_ACCESS_KEY: string = ''
  AWS_S3_BUCKET: string = ''
  AWS_S3_PREFIX: string = ''
  AWS_S3_ENDPOINT: string | undefined = undefined

  POSTGRES_HOST: string = ''
  POSTGRES_DATABASE: string = ''
  POSTGRES_USER: string = ''
  POSTGRES_PASSWORD: string = ''
  BACKUP_DATABASE_URL: string = ''

  RUN_ON_STARTUP: boolean = false

  constructor() {
    this.SCHEDULE = process.env.SCHEDULE || ''
    this.BACKUP_KEEP = Number(process.env.BACKUP_KEEP || 10) - 1

    this.RUN_ON_STARTUP = Boolean(process.env.RUN_ON_STARTUP) || false

    this.AWS_S3_REGION = process.env.AWS_S3_REGION || ''
    this.AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID || ''
    this.AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY || ''
    this.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || ''
    this.AWS_S3_PREFIX = process.env.AWS_S3_PREFIX || ''

    this.POSTGRES_HOST = process.env.POSTGRES_HOST || ''
    this.POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || ''
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || ''
    this.POSTGRES_USER = process.env.POSTGRES_USER || ''

    this.BACKUP_DATABASE_URL = `postgres://${this.POSTGRES_USER}:${this.POSTGRES_PASSWORD}@${this.POSTGRES_HOST}/${this.POSTGRES_DATABASE}`
  }
}

export const env = new envClass()

export { envClass }
