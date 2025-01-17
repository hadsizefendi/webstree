import { Setting } from '~~/server/models/Setting'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.key || !body.value || !body.type || !body.group) {
      throw createError({
        statusCode: 400,
        message: 'Eksik bilgi'
      })
    }

    const setting = await Setting.findOneAndUpdate(
      { key: body.key },
      {
        ...body,
        updatedBy: body.createdBy
      },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    )

    return setting
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ayar güncellenirken bir hata oluştu'
    })
  }
})
