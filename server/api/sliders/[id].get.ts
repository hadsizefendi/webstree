import { Slider } from '~~/server/models/Slider'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const slider = await Slider.findById(id)

    if (!slider) {
      throw createError({
        statusCode: 404,
        message: 'Slider bulunamadı'
      })
    }

    return slider
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Slider yüklenirken bir hata oluştu'
    })
  }
})
