import { unlinkSync } from 'node:fs'
import { log } from '../utils/log'

export const deleteFile = (filePath: string) => {
  log('Starting file deletion process...')

  try {
    log(`Attempting to delete the backup file: ${filePath}.backup`)
    unlinkSync(filePath + '.backup')
    log(`Successfully deleted: ${filePath}.backup`)

    log(`Attempting to delete the compressed file: ${filePath}.tar.gz`)
    unlinkSync(filePath + '.tar.gz')
    log(`Successfully deleted: ${filePath}.tar.gz`)

    log('File deletion process completed successfully.')
  } catch (e) {
    log('Error during file deletion process:', e)
    throw e // Re-throw the error to handle it further up if needed
  }
}
