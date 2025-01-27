import { Cart } from '~~/server/models/Cart'

export default defineEventHandler(async (event) => {
  try {
    const session = getCookie(event, 'cart_session')
    const userId = event.context.user?._id

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Session cart'ını bul
    const sessionCart = await Cart.findOne({ sessionId: session })
    
    if (!sessionCart) {
      return { success: true, message: 'No session cart to merge' }
    }

    // User cart'ını bul veya oluştur
    let userCart = await Cart.findOne({ userId })
    
    if (!userCart) {
      userCart = new Cart({ userId, items: [] })
    }

    // Session cart'ındaki ürünleri user cart'ına ekle
    sessionCart.items.forEach(sessionItem => {
      const existingItem = userCart.items.find(item => 
        item.productId.toString() === sessionItem.productId.toString() &&
        item.variant === sessionItem.variant
      )

      if (existingItem) {
        existingItem.quantity += sessionItem.quantity
      } else {
        userCart.items.push(sessionItem)
      }
    })

    await userCart.save()
    await Cart.findByIdAndDelete(sessionCart._id)
    
    // Session cookie'sini temizle
    deleteCookie(event, 'cart_session')

    return { success: true, cart: userCart }

  } catch (error) {
    console.error('Merge cart error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to merge carts'
    })
  }
})
