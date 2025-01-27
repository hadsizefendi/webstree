import { Cart } from '~~/server/models/Cart'
import { getCartSession } from '~~/server/utils/sessionHelper'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userId = event.context.user?._id
    const sessionId = userId ? null : getCartSession(event)

    if (!body.productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }

    let query = userId ? { userId } : { sessionId }
    let cart = await Cart.findOne(query)

    if (!cart) {
      cart = new Cart({
        ...(userId ? { userId } : { sessionId }),
        items: [{
          productId: body.productId,
          quantity: body.quantity || 1,
          variant: body.variant || ''
        }]
      })
    } else {
      const existingItem = cart.items.find(item => 
        item.productId.toString() === body.productId && 
        item.variant === (body.variant || '')
      )

      if (existingItem) {
        existingItem.quantity += (body.quantity || 1)
      } else {
        cart.items.push({
          productId: body.productId,
          quantity: body.quantity || 1,
          variant: body.variant || ''
        })
      }
    }

    await cart.save()
    return { success: true, cart }

  } catch (error) {
    console.error('Add to cart error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to add item to cart'
    })
  }
})
