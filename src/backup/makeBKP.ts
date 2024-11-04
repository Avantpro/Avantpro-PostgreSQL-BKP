import { filesize } from 'filesize'
import { exec, execSync } from 'node:child_process'
import { statSync } from 'node:fs'
import path from 'node:path'
import { env } from '../env'
import { log } from '../utils/log'

export async function makeBKP(filePath: string) {
  log('Dumping DB to file...')

  await new Promise((resolve, reject) => {
    const bkpComand = `pg_dump --dbname=${env.BACKUP_DATABASE_URL} --format=tar | gzip > ${filePath}`

    console.log(bkpComand)

    exec(bkpComand, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error, stderr: stderr.trimEnd() })
        return
      }

      // check if archive is valid and contains data
      const fileSize = execSync(`gzip -cd ${filePath} | head -c1`).length;
      console.log('fileSize',fileSize)
      const isValidArchive = fileSize == 1 ? true : false
      if (isValidArchive == false) {
        reject({
          error:
            'Backup archive file is invalid or empty; check for errors above',
        })
        return
      }

      // not all text in stderr will be a critical error, print the error / warning
      if (stderr != '') {
        log({ stderr: stderr.trimEnd() })
      }

      log('Backup archive file is valid')
      log('Backup filesize:', filesize(statSync(filePath).size))

      if (stderr != '') {
        log(
          `Potential warnings detected; Please ensure the backup file "${path.basename(filePath)}" contains all needed data`,
        )
      }

      resolve(undefined)
    })
  })

  log('DB dumped to file...')
}
