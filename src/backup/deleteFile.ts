import { unlink } from 'node:fs'
import { log } from '../utils/log'

export const deleteFile = async (path: string) => {
  log('Deleting Local file...')
  await new Promise((resolve, reject) => {
    unlink(path, (err) => {
      reject({ error: err })
      return
    })
    resolve(undefined)
  })
}
