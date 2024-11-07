import { filesize } from 'filesize'
import { exec, execSync } from 'node:child_process'
import { statSync } from 'node:fs'
import path from 'node:path'
import { env } from '../env'
import { log } from '../utils/log'

export async function makeBKP(filePath: string) {
  log('Dumping DB to file...')

  await new Promise((resolve, reject) => {
    const bkpCommand = `pg_dump --dbname=${env.BACKUP_DATABASE_URL} --format=c --encoding=UTF-8 --file=${filePath}.backup`

    exec(bkpCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error, stderr: stderr.trimEnd() })
        return
      }

      // Check if the backup file exists and has content by checking its size
      const fileStats = statSync(`${filePath}.backup`)
      if (fileStats.size === 0) {
        reject({
          error: 'Backup file is invalid or empty; check for errors above',
        })
        return
      }

      if (stderr != '') {
        log({ stderr: stderr.trimEnd() })
      }

      log('Backup file is valid')
      log('Backup filesize:', filesize(fileStats.size))

      if (stderr != '') {
        log(
          `Potential warnings detected; Please ensure the backup file "${path.basename(filePath)}" contains all needed data`,
        )
      }

      // Compress the .backup file to .tar.gz
      const tarCommand = `tar -czvf ${filePath}.tar.gz ${filePath}.backup`
      execSync(tarCommand)
      log('Compressed backup to tar.gz')

      // Log final compressed file size
      const compressedFileStats = statSync(`${filePath}.tar.gz`)
      log('Compressed filesize:', filesize(compressedFileStats.size))

      resolve(undefined)
    })
  })

  log('DB dumped and compressed to file...')
}
