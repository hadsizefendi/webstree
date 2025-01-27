import { Cart } from '~~/server/models/Cart'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const session = getCookie(event, 'cart_session')
    const userId = event.context.user?._id

    if (!query.productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }

    let cartQuery = userId ? { userId } : { sessionId: session }
    const cart = await Cart.findOne(cartQuery)

    if (!cart) {
      throw createError({
        statusCode: 404,
        message: 'Cart not found'
      })
    }

    cart.items = cart.items.filter(item => 
      !(item.productId.toString() === query.productId &&
        item.variant === (query.variant || ''))
    )

    await cart.save()
    return { success: true, cart }

  } catch (error) {
    console.error('Remove from cart error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to remove item from cart'
    })
  }
})
