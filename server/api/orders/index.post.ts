import { Order } from '~~/server/models/Order'
import { Cart } from '~~/server/models/Cart'
import { User } from '~~/server/models/User'
import { getCartSession } from '~~/server/utils/sessionHelper'
import { sendOrderConfirmationEmail } from '~~/server/utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { shippingAddress, billingAddress, paymentMethod, items } = body
    const { user } = event.context.auth || {}
    const sessionId = getCartSession(event)

    const orderNumber = await Order.generateOrderNumber()

    const orderItems = items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      variant: item.variant,
      total: item.productId.price * item.quantity
    }))

    const subtotal = orderItems.reduce((total, item) => total + item.total, 0)
    
    const order = new Order({
      orderNumber,
      userId: user?._id || null,
      sessionId: !user?._id ? sessionId : null,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || null,
      paymentMethod,
      subtotal,
      totalAmount: subtotal
    })

    await order.save()

    // Email gönderme işlemini arka planda başlat
    const orderEmailContent = {
      orderNumber: orderNumber,
      items: items.map(item => ({
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        total: item.productId.price * item.quantity
      })),
      subtotal,
      totalAmount: subtotal,
      shippingAddress,
      billingAddress
    }

    // Email gönderme işlemini Promise.all ile arka planda başlat
    Promise.all([
      sendOrderConfirmationEmail(shippingAddress.email, orderEmailContent),
      billingAddress?.email && billingAddress.email !== shippingAddress.email 
        ? sendOrderConfirmationEmail(billingAddress.email, orderEmailContent)
        : Promise.resolve()
    ]).catch(error => {
      // Email gönderme hatalarını loglayalım ama kullanıcıya yansıtmayalım
      console.error('Order confirmation email error:', error)
    })

    // Sipariş edilen ürünleri sepetten çıkar
    const orderedProductIds = items.map(item => item.productId._id)

    // Sepeti güncelle ve yeni sepet verilerini döndür
    const updatedCart = await Cart.findOneAndUpdate(
      user?._id ? { userId: user._id } : { sessionId },
      { 
        $pull: { 
          items: { 
            productId: { $in: orderedProductIds } 
          } 
        } 
      },
      { new: true } // Güncellenmiş veriyi döndür
    ).populate('items.productId')

    return {
      message: 'Sipariş başarıyla oluşturuldu',
      order,
      cart: updatedCart // Güncellenmiş sepet verisi
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Sipariş oluşturulurken bir hata oluştu'
    })
  }
})
