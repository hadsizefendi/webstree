import { Blog } from '~~/server/models/Blog'

export default defineEventHandler(async () => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }) // En yeni bloglar önce
    return blogs
  } catch (error) {
    console.error('Bloglar alınırken hata:', error)
    throw createError({
      statusCode: 500,
      message: 'Bloglar alınamadı'
    })
  }
})
