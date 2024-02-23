import { CronJob } from 'cron'
import { backup } from './backup'
import { env } from './env'

console.log('NodeJS Version: ' + process.version)

async function tryBackup() {
  try {
    await backup()
  } catch (error) {
    console.error('Error while running backup: ', error)
  }
}

if (env.SCHEDULE !== '') {
  const job = new CronJob(env.SCHEDULE, async () => {
    await tryBackup()
  })

  job.start()
  console.log('Backup cron scheduled...')
}

if (env.RUN_ON_STARTUP) {
  console.log('Running on start backup...')
  tryBackup()
}
