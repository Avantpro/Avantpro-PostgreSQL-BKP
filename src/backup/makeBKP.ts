import { filesize } from 'filesize'
import { exec, execSync } from 'node:child_process'
import { statSync } from 'node:fs'
import path from 'node:path'
import { env } from '../env'
import { log } from '../utils/log'

export async function makeBKP(filePath: string) {
  log('Dumping DB to file...')

  await new Promise((resolve, reject) => {
    const bkpCommand = `pg_dump --dbname=${env.BACKUP_DATABASE_URL} --format=p --encoding=UTF-8 --file=${filePath}.sql`

    exec(bkpCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error, stderr: stderr.trimEnd() })
        return
      }

      // Check if the SQL file contains data by reading the first line
      const hasContent =
        execSync(`head -c1 ${filePath}.sql`).length == 1 ? true : false

      if (!hasContent) {
        reject({
          error: 'Backup SQL file is invalid or empty; check for errors above',
        })
        return
      }

      if (stderr != '') {
        log({ stderr: stderr.trimEnd() })
      }

      log('Backup SQL file is valid')
      log('Backup filesize:', filesize(statSync(`${filePath}.sql`).size))

      if (stderr != '') {
        log(
          `Potential warnings detected; Please ensure the backup file "${path.basename(filePath)}" contains all needed data`,
        )
      }

      // Compress the .sql file to .tar.gz
      const tarCommand = `tar -czvf ${filePath}.tar.gz ${filePath}.sql`
      execSync(tarCommand)
      log('Compressed SQL dump to tar.gz')

      // Log final compressed file size
      log('Compressed filesize:', filesize(statSync(`${filePath}.tar.gz`).size))

      resolve(undefined)
    })
  })

  log('DB dumped and compressed to file...')
}
