import { Slider } from '~~/server/models/Slider'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const slider = await Slider.findByIdAndDelete(id)

    if (!slider) {
      throw createError({
        statusCode: 404,
        message: 'Slider bulunamadı'
      })
    }

    return {
      message: 'Slider başarıyla silindi',
      slider
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Slider silinirken bir hata oluştu'
    })
  }
})
