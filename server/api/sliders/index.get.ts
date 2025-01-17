import { Slider } from '~~/server/models/Slider'

export default defineEventHandler(async (event) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 })
    return sliders
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Sliderlar yüklenirken bir hata oluştu'
    })
  }
})
