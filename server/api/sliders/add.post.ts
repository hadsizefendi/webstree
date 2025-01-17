import { Slider } from '~~/server/models/Slider'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Debug için gelen veriyi logla
    console.log('Server received body:', body)

    // Title kontrolü
    if (!body?.title) {
      throw createError({
        statusCode: 400,
        message: 'Slider başlığı zorunludur'
      })
    }

    // Items kontrolü
    if (!Array.isArray(body?.items) || body.items.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'En az bir medya eklemelisiniz'
      })
    }

    // CreatedBy kontrolü
    if (!body?.createdBy) {
      throw createError({
        statusCode: 400,
        message: 'Kullanıcı bilgisi gereklidir'
      })
    }

    // Sanitize and create slider
    const sliderData = {
      title: body.title.trim(),
      description: body.description?.trim() || '',
      items: body.items.map((item: any, index: number) => ({
        type: item.type || 'image',
        url: item.url,
        title: item.title?.trim() || '',
        subtitle: item.subtitle?.trim() || '',
        description: item.description?.trim() || '',
        order: index
      })),
      createdBy: body.createdBy
    }

    // Debug için oluşturulan veriyi logla
    console.log('Creating slider with data:', sliderData)

    const slider = await Slider.create(sliderData)

    return {
      message: 'Slider başarıyla eklendi',
      slider
    }
  } catch (error: any) {
    console.error('Server error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Slider eklenirken bir hata oluştu'
    })
  }
})
