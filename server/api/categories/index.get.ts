import { Category } from '~~/server/models/Category'

export default defineEventHandler(async () => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    return categories
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Kategoriler getirilirken bir hata oluştu'
    })
  }
})
