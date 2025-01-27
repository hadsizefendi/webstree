import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    // Giriş yapmış kullanıcı varsa onun adreslerini getir
    const { user } = event.context.auth || {}
    if (user?._id) {
      const userDoc = await User.findById(user._id)
      return {
        shippingAddresses: userDoc?.shippingAddresses || [],
        billingAddresses: userDoc?.billingAddresses || []
      }
    }

    // Misafir kullanıcı için localStorage'dan adresleri al
    return {
      shippingAddresses: [],
      billingAddresses: []
    }
  } catch (error: any) {
    console.error('Get addresses error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Adresler getirilirken bir hata oluştu'
    })
  }
})
