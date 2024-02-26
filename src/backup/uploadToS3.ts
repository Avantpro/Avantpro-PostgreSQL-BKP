import { createReadStream } from 'node:fs'
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { env } from '../env'
import { log } from '../utils/log'

export async function uploadToS3({
  name,
  path,
}: {
  name: string
  path: string
}) {
  log('Uploading backup to S3...')

  const bucket = env.AWS_S3_BUCKET
  const finalName = `${env.AWS_S3_PREFIX}/${name}`

  const clientOptions: S3ClientConfig = {
    region: env.AWS_S3_REGION,
    credentials: {
      accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
    },
  }

  if (env.AWS_S3_ENDPOINT) {
    log(`Using custom endpoint: ${env.AWS_S3_ENDPOINT}`)
    clientOptions['endpoint'] = env.AWS_S3_ENDPOINT
  }

  const client = new S3Client(clientOptions)

  await new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: finalName,
      Body: createReadStream(path),
    },
  }).done()

  log('Backup uploaded to S3...')

  // Check if there are more than 7 objects in the bucket
  const listParams = {
    Bucket: bucket,
  }
  const { Contents } = await client.send(new ListObjectsV2Command(listParams))
  if (Contents && Contents.length > env.BACKUP_KEEP) {
    // Sort objects by LastModified date
    Contents.sort(
      (a, b) =>
        new Date(a.LastModified!).getTime() -
        new Date(b.LastModified!).getTime(),
    )

    const voltas = Contents.length - env.BACKUP_KEEP - 1

    for (let index = 0; index < voltas; index++) {
      const oldestObjectKey = Contents[index].Key

      const deleteParams = {
        Bucket: bucket,
        Key: oldestObjectKey,
      }

      await client.send(new DeleteObjectCommand(deleteParams))

      log(`Deleted oldest backup: ${oldestObjectKey}`)
    }
  }
}
