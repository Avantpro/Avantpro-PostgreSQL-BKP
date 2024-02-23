import { unlink } from 'node:fs'

export const deleteFile = async (path: string) => {
  console.log('Deleting file...')
  await new Promise((resolve, reject) => {
    unlink(path, (err) => {
      reject({ error: err })
      return
    })
    resolve(undefined)
  })
}
