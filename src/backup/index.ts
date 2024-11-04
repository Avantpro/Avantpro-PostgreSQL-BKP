import os from 'node:os'
import path from 'node:path'
import { log } from '../utils/log'
import { deleteFile } from './deleteFile'
import { makeBKP } from './makeBKP'
import { uploadToS3 } from './uploadToS3'

export const backup = async () => {
  log('Initiating DB backup...')

  //Make File Path
  const date = new Date().toISOString()
  const timestamp = date.replace(/[:.]+/g, '-')
  const filename = `backup-${timestamp}.tar`
  const filepath = path.join(os.tmpdir(), filename)
  log('path: ', filepath)

  //Create BKP
  await makeBKP(filepath)
  //Upload S3
  await uploadToS3({ name: filename, path: filepath })
  //DeleteFile
  await deleteFile(filepath)
}
