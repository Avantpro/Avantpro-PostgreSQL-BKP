import { unlinkSync } from 'node:fs'
import { log } from '../utils/log'

export const deleteFile = async (path: string) => {
  log('Deleting Local file...')
  await new Promise((resolve, reject) => {
    try {
      unlinkSync(path + '.sql')
      unlinkSync(path + '.tar.gz')
    } catch (e) {
      reject(e)
    }
    resolve(undefined)
  })
}
