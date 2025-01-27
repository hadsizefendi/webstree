import { Order } from '~~/server/models/Order'

export default defineEventHandler(async (event) => {
  try {
    const order = await Order.findById(event.context.params?.id)
      .populate('items.productId')
    
    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Sipariş bulunamadı'
      })
    }

    return order
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Sipariş getirilirken bir hata oluştu'
    })
  }
})
