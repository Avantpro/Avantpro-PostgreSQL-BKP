import { filesize } from 'filesize'
import { exec, execSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { env } from '../env'
import { log } from '../utils/log'

export async function makeBKP(filePath: string) {
  log('Dumping DB to file...')

  await new Promise((resolve, reject) => {
    // Step 1: Dump the database in custom format and pipe it into tar
    const dumpCommand = `pg_dump --dbname=${env.BACKUP_DATABASE_URL} --format=custom | tar -czf ${filePath} --transform='s,^,backup/,' -T -`

    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error, stderr: stderr.trimEnd() })
        return
      }

      // Check if the tar.gz file is valid
      const isValidArchive =
        execSync(`tar -tzf ${filePath}`).toString().trim() !== ''

      if (!isValidArchive) {
        reject({
          error:
            'Backup archive file is invalid or empty; check for errors above',
        })
        return
      }

      log('Backup archive file is valid')
      log('Backup filesize:', filesize(statSync(filePath).size))

      resolve(undefined)
    })
  })

  log('DB dumped to file...')
}
