import path from 'path'
import fs from 'fs/promises'
import formidable from 'formidable'
import sharp from 'sharp'
import { Category } from '~~/server/models/Category'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  // GET - Kategori detayı
  if (event.node.req.method === 'GET') {
    try {
      const category = await Category.findById(id)
      if (!category) {
        throw createError({
          statusCode: 404,
          message: 'Kategori bulunamadı'
        })
      }
      return category
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Kategori getirilirken bir hata oluştu'
      })
    }
  }

  // PUT - Kategori güncelleme
  if (event.node.req.method === 'PUT') {
    const runtimeConfig = useRuntimeConfig()
    const uploadDir = path.join(runtimeConfig.public.FILE_STORAGE_PATH, 'categories')
    const publicUrlBase = 'https://media.webstree.com/public/images/categories/'

    await fs.mkdir(uploadDir, { recursive: true })

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: function ({ mimetype }) {
        return mimetype && mimetype.includes('image')
      }
    })

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err)
          resolve({ fields, files })
        })
      })

      const updateData: any = {}

      if (fields.title?.[0]) {
        updateData.title = fields.title[0]
      }

      if (fields.description?.[0]) {
        updateData.description = fields.description[0]
      }

      if (files.image) {
        const image = Array.isArray(files.image) ? files.image[0] : files.image

        if (image.filepath) {
          try {
            const buffer = await fs.readFile(image.filepath)

            // Görsel optimizasyonu
            const processedImage = await sharp(buffer)
              .resize({ width: 1000, height: 1000, fit: 'inside' })
              .webp({ quality: 50 })
              .toBuffer()

            const filename = `category-${Date.now()}.webp`
            const filePath = path.join(uploadDir, filename)
            await fs.writeFile(filePath, processedImage)

            // Geçici dosyayı sil
            await fs.unlink(image.filepath).catch(console.error)

            updateData.image = `${publicUrlBase}${filename}`

            // Eski görseli sil (opsiyonel)
            const category = await Category.findById(id)
            if (category && category.image) {
              const oldImagePath = category.image.replace(publicUrlBase, '')
              const oldFilePath = path.join(uploadDir, oldImagePath)
              await fs.unlink(oldFilePath).catch(console.error)
            }
          } catch (error) {
            console.error('Görsel işleme hatası:', error)
            throw createError({
              statusCode: 500,
              message: 'Görsel işlenirken bir hata oluştu'
            })
          }
        }
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )

      if (!category) {
        throw createError({
          statusCode: 404,
          message: 'Kategori bulunamadı'
        })
      }

      return {
        message: 'Kategori başarıyla güncellendi',
        category
      }
    } catch (error: any) {
      console.error('Kategori güncelleme hatası:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Kategori güncellenirken bir hata oluştu'
      })
    }
  }

  // DELETE - Kategori silme
  if (event.node.req.method === 'DELETE') {
    try {
      const category = await Category.findById(id)
      if (!category) {
        throw createError({
          statusCode: 404,
          message: 'Kategori bulunamadı'
        })
      }

      // Kategori görselini sil
      if (category.image) {
        const runtimeConfig = useRuntimeConfig()
        const uploadDir = path.join(runtimeConfig.public.FILE_STORAGE_PATH, 'categories')
        const publicUrlBase = 'https://media.webstree.com/public/images/categories/'

        const imagePath = category.image.replace(publicUrlBase, '')
        const filePath = path.join(uploadDir, imagePath)
        await fs.unlink(filePath).catch(console.error)
      }

      await Category.findByIdAndDelete(id)

      return {
        message: 'Kategori başarıyla silindi'
      }
    } catch (error: any) {
      console.error('Kategori silme hatası:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Kategori silinirken bir hata oluştu'
      })
    }
  }
})
