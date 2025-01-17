import { Slider } from '~~/server/models/Slider'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!body.title) {
      throw createError({
        statusCode: 400,
        message: 'Slider başlığı zorunludur'
      })
    }

    const slider = await Slider.findByIdAndUpdate(id, {
      title: body.title,
      description: body.description,
      items: body.items,
      updatedBy: body.createdBy
    }, { new: true })

    if (!slider) {
      throw createError({
        statusCode: 404,
        message: 'Slider bulunamadı'
      })
    }

    return {
      message: 'Slider başarıyla güncellendi',
      slider
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Slider güncellenirken bir hata oluştu'
    })
  }
})
