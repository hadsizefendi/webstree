import { Setting } from '~~/server/models/Setting'

export default defineEventHandler(async (event) => {
  try {
    const settings = await Setting.find()
    return settings
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Ayarlar alınırken bir hata oluştu'
    })
  }
})
