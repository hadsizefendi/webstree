import { Order } from '~~/server/models/Order'
import { Product } from '~~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    const orderNumber = event.context.params?.orderNumber

    const order = await Order.findOne({ orderNumber }).lean()

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Sipariş bulunamadı'
      })
    }

    // Ürün detaylarını al
    const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
      const product = await Product.findById(item.productId).lean()
      return {
        ...item,
        productId: product || { name: 'Ürün bulunamadı' },
        price: item.price,
        total: item.price * item.quantity
      }
    }))

    // İşlenmiş siparişi döndür
    return {
      ...order,
      items: itemsWithDetails,
      subtotal: order.subtotal || itemsWithDetails.reduce((sum, item) => sum + item.total, 0),
      totalAmount: order.totalAmount || order.subtotal || itemsWithDetails.reduce((sum, item) => sum + item.total, 0)
    }

  } catch (error: any) {
    console.error('Get order error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Sipariş getirilirken bir hata oluştu'
    })
  }
})
