import { Cart } from '~~/server/models/Cart'
import { getCartSession } from '~~/server/utils/sessionHelper'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user?._id
    const sessionId = userId ? null : getCartSession(event)

    let query = userId ? { userId } : { sessionId }
    
    const cart = await Cart.findOne(query)
      .populate('items.productId', 'name price imageUrl')

    return { 
      success: true, 
      cart: cart || { items: [] } 
    }

  } catch (error) {
    console.error('Get cart error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get cart'
    })
  }
})
