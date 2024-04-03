import { CronJob } from 'cron'
import { backup } from './backup'
import { env } from './env'
import { log } from './utils/log'

log('NodeJS Version:', process.version)

async function tryBackup() {
  try {
    await backup()
  } catch (error) {
    log('Error while running backup: ', error)
  }
}

if (env.SCHEDULE !== '') {
  const job = new CronJob(env.SCHEDULE, async () => {
    await tryBackup()
  })

  job.start()
  log('Backup cron scheduled...')
}

if (env.RUN_ON_STARTUP) {
  log('Running on start backup...')
  tryBackup()
}
