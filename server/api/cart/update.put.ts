import { Cart } from '~~/server/models/Cart'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const session = getCookie(event, 'cart_session')
    const userId = event.context.user?._id

    if (!body.productId || !body.quantity) {
      throw createError({
        statusCode: 400,
        message: 'Product ID and quantity are required'
      })
    }

    let query = userId ? { userId } : { sessionId: session }
    const cart = await Cart.findOne(query)

    if (!cart) {
      throw createError({
        statusCode: 404,
        message: 'Cart not found'
      })
    }

    const cartItem = cart.items.find(item => 
      item.productId.toString() === body.productId &&
      item.variant === (body.variant || '')
    )

    if (!cartItem) {
      throw createError({
        statusCode: 404,
        message: 'Item not found in cart'
      })
    }

    cartItem.quantity = body.quantity

    await cart.save()
    return { success: true, cart }

  } catch (error) {
    console.error('Update cart error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update cart item'
    })
  }
})
