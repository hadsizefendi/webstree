import { User } from '~~/server/models/User'
import { v4 as uuidv4 } from 'uuid' // UUID kullanarak benzersiz ID oluşturalım

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Zorunlu alanları kontrol et
    const requiredFields = ['title', 'firstName', 'lastName', 'email', 'phone', 'city', 'district', 'neighborhood', 'address']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          message: `${field} alanı zorunludur`
        })
      }
    }

    // Yeni adres objesi
    const newAddress = {
      _id: uuidv4(), // Benzersiz ID oluştur
      title: body.title,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      city: body.city,
      district: body.district,
      neighborhood: body.neighborhood,
      address: body.address,
      isDefault: body.isDefault || false,
      createdAt: new Date()
    }

    // Giriş yapmış kullanıcı varsa adresini kaydet
    const { user } = event.context.auth || {}
    if (user?._id) {
      const userDoc = await User.findById(user._id)
      if (userDoc) {
        if (body.type === 'billing') {
          userDoc.billingAddresses.push(newAddress)
        } else {
          userDoc.shippingAddresses.push(newAddress)
        }
        await userDoc.save()
      }
    }

    return {
      message: 'Adres başarıyla eklendi',
      address: newAddress
    }
  } catch (error: any) {
    console.error('Add address error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Adres eklenirken bir hata oluştu'
    })
  }
})
