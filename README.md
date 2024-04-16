# Introduction

This project provides Docker images to periodically back up a PostgreSQL database to AWS S3

### [Change Log](https://github.com/Avantpro/Avantpro-PostgreSQL-BKP/blob/main/CHANGELOG.md)

# Usage

## Backup

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'password'

  backup:
    image: carloslauriano/postgres-backu-s3
    environment:
      SCHEDULE: '0 0 * * 5'     # At 12:00 AM, only on Friday
      BACKUP_KEEP: 7     # optional
      RUN_ON_STARTUP: 'true' # optional
      AWS_S3_REGION: 'region'
      AWS_S3_ACCESS_KEY_ID: 'key'
      AWS_S3_SECRET_ACCESS_KEY: 'secret'
      AWS_S3_BUCKET: 'my-bucket'
      AWS_S3_PREFIX: 'backup'
      POSTGRES_HOST: 'postgres'
      POSTGRES_DATABASE: 'dbname'
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'password'
```

Link Docker Hub: <https://hub.docker.com/r/carloslauriano/postgres-backu-s3>
