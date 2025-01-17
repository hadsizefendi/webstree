import { Media } from '~~/server/models/Media'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = 24

    const [media, total] = await Promise.all([
      Media.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Media.countDocuments()
    ])

    return {
      media,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Medya listesi alınırken hata:', error)
    throw createError({
      statusCode: 500,
      message: 'Medya listesi alınırken bir hata oluştu'
    })
  }
})
