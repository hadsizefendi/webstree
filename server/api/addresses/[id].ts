import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  try {
    const { user } = event.context.auth || {}
    if (!user?._id) {
      throw createError({
        statusCode: 401,
        message: 'Oturum açmanız gerekiyor'
      })
    }

    const userDoc = await User.findById(user._id)
    if (!userDoc) {
      throw createError({
        statusCode: 404,
        message: 'Kullanıcı bulunamadı'
      })
    }

    // DELETE - Adres silme
    if (event.node.req.method === 'DELETE') {
      userDoc.shippingAddresses = userDoc.shippingAddresses.filter(
        addr => addr._id.toString() !== id
      )
      userDoc.billingAddresses = userDoc.billingAddresses.filter(
        addr => addr._id.toString() !== id
      )

      await userDoc.save()
      return { message: 'Adres başarıyla silindi' }
    }

    // PUT - Adres güncelleme
    if (event.node.req.method === 'PUT') {
      const body = await readBody(event)
      const addressType = body.type || 'shipping'
      delete body.type

      const addresses = addressType === 'shipping' ? userDoc.shippingAddresses : userDoc.billingAddresses
      const index = addresses.findIndex(addr => addr._id.toString() === id)

      if (index === -1) {
        throw createError({
          statusCode: 404,
          message: 'Adres bulunamadı'
        })
      }

      // Adresi güncelle
      addresses[index] = { ...addresses[index], ...body }
      await userDoc.save()

      return {
        message: 'Adres başarıyla güncellendi',
        address: addresses[index]
      }
    }
  } catch (error: any) {
    console.error('Address operation error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'İşlem sırasında bir hata oluştu'
    })
  }
})
