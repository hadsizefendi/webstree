import { Order } from '~~/server/models/Order'
import { Product } from '~~/server/models/Product'
import { getCartSession } from '~~/server/utils/sessionHelper'

export default defineEventHandler(async (event) => {
  try {
    const { user } = event.context.auth || {}
    const sessionId = getCartSession(event)

    if (!user?._id && !sessionId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const searchQuery = user?._id 
      ? { userId: user._id }
      : { sessionId }

    const orders = await Order.find(searchQuery)
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name imageUrl price'
      })
      .sort({ createdAt: -1 })
      .lean()

    if (!orders.length) return []

    const processedOrders = orders.map(order => ({
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        ...item,
        productId: {
          _id: item.productId?._id,
          name: item.productId?.name || 'Ürün bulunamadı',
          imageUrl: item.productId?.imageUrl,
          price: item.price
        },
        total: item.price * item.quantity
      })),
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      totalAmount: order.totalAmount
    }))

    return processedOrders

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Siparişler getirilirken bir hata oluştu'
    })
  }
})
