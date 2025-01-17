import path from 'path'
import fs from 'fs/promises'
import formidable from 'formidable'
import sharp from 'sharp'
import { Category } from '~~/server/models/Category'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const uploadDir = path.join(runtimeConfig.public.FILE_STORAGE_PATH, 'categories')
  const publicUrlBase = 'https://media.webstree.com/public/images/'

  await fs.mkdir(uploadDir, { recursive: true })

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024
  })

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description || ''
    const imageUrl = Array.isArray(fields.imageUrl) ? fields.imageUrl[0] : fields.imageUrl

    if (!title) {
      throw createError({
        statusCode: 400,
        message: 'Başlık gereklidir'
      })
    }

    const existingCategory = await Category.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    })

    if (existingCategory) {
      return { message: 'Bu isimde bir kategori zaten mevcut', category: existingCategory }
    }

    let finalImageUrl = imageUrl || `${publicUrlBase}category.webp`

    if (!imageUrl && files.image?.filepath) {
      const processedImage = await sharp(await fs.readFile(files.image.filepath))
        .resize({ width: 1000, height: 1000, fit: 'inside' })
        .webp({ quality: 50 })
        .toBuffer()

      const filename = `category-${Date.now()}.webp`
      await fs.writeFile(path.join(uploadDir, filename), processedImage)
      await fs.unlink(files.image.filepath)
      finalImageUrl = `${publicUrlBase}categories/${filename}`
    }

    const category = await new Category({
      title,
      description,
      image: finalImageUrl
    }).save()

    return { message: 'Kategori başarıyla oluşturuldu', category }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Kategori oluşturulurken bir hata oluştu'
    })
  }
})
