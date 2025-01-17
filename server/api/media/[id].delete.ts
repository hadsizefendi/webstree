import fs from 'fs/promises'
import path from 'path'
import { Media } from '~~/server/models/Media'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  try {
    const media = await Media.findById(id)
    if (!media) {
      throw createError({
        statusCode: 404,
        message: 'Medya bulunamadı'
      })
    }

    // Dosyayı sil
    const runtimeConfig = useRuntimeConfig()
    const uploadDir = path.join(runtimeConfig.public.FILE_STORAGE_PATH, 'media')
    const filename = media.url.split('/').pop()
    if (filename) {
      const filePath = path.join(uploadDir, filename)
      await fs.unlink(filePath).catch(console.error)
    }

    // Medya kaydını sil
    await Media.findByIdAndDelete(id)

    return {
      message: 'Medya başarıyla silindi'
    }
  } catch (error: any) {
    console.error('Medya silme hatası:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Medya silinirken bir hata oluştu'
    })
  }
})
