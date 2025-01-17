import fs from 'fs/promises'
import path from 'path'
import formidable from 'formidable'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { Media } from '~~/server/models/Media'

// Video işleme fonksiyonu
async function processVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setDuration(20) // Maksimum 20 saniye
      .size('1000x?') // Genişlik maksimum 1000px, yükseklik orantılı
      .videoCodec('libx264')
      .videoBitrate('1000k') // 1Mbps video bit hızı
      .outputOptions([
        '-preset medium', // Orta seviye sıkıştırma
        '-movflags +faststart', // Hızlı başlatma için
        '-pix_fmt yuv420p', // Daha iyi uyumluluk
        '-profile:v main', // Ana profil
        '-crf 28' // Kalite seviyesi (0-51, düşük=daha iyi kalite)
      ])
      .on('end', () => {
        resolve()
      })
      .on('error', (err) => {
        console.error('Video işleme hatası:', err)
        reject(err)
      })
      .save(outputPath)
  })
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const uploadDir = path.join(runtimeConfig.public.FILE_STORAGE_PATH, 'media')
  const publicUrlBase = 'https://media.webstree.com/public/images/media/'

  await fs.mkdir(uploadDir, { recursive: true })

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB (video dosyaları için daha büyük)
    filter: function ({ mimetype }) {
      return mimetype && (mimetype.includes('image') || mimetype.includes('video'))
    }
  })

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })

    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files]
    const results = []

    for (const file of uploadedFiles) {
      if (!file) continue

      try {
        const isVideo = file.mimetype?.includes('video')
        const filename = `media-${Date.now()}-${Math.random().toString(36).substring(7)}${isVideo ? '.mp4' : '.webp'}`
        const filePath = path.join(uploadDir, filename)

        if (isVideo) {
          // Video işleme
          await processVideo(file.filepath, filePath)
          const stats = await fs.stat(filePath)

          const media = new Media({
            title: file.originalFilename || filename,
            url: `${publicUrlBase}${filename}`,
            type: 'video',
            size: stats.size,
            mimeType: 'video/mp4'
          })

          await media.save()
          results.push(media)
        } else {
          // Görsel işleme
          const buffer = await fs.readFile(file.filepath)
          const processedImage = await sharp(buffer)
            .resize(1000, 1000, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: 50 })
            .toBuffer()

          await fs.writeFile(filePath, processedImage)

          const media = new Media({
            title: file.originalFilename || filename,
            url: `${publicUrlBase}${filename}`,
            type: 'image',
            size: processedImage.length,
            mimeType: 'image/webp'
          })

          await media.save()
          results.push(media)
        }

        // Geçici dosyayı sil
        await fs.unlink(file.filepath).catch(console.error)
      } catch (error) {
        console.error('Dosya işleme hatası:', error)
        throw createError({
          statusCode: 500,
          message: 'Dosya işlenirken bir hata oluştu'
        })
      }
    }

    return {
      message: 'Dosyalar başarıyla yüklendi',
      files: results
    }
  } catch (error: any) {
    console.error('Dosya yükleme hatası:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Dosya yüklenirken bir hata oluştu'
    })
  }
})
