export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    const requiredFields = ['title', 'firstName', 'lastName', 'email', 'phone', 'city', 'district', 'neighborhood', 'address']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      throw createError({
        statusCode: 400,
        message: `Eksik alanlar: ${missingFields.join(', ')}`
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz email formatı'
      })
    }

    // Validate phone format (basic)
    const phoneRegex = /^[0-9+\-\s()]{10,}$/
    if (!phoneRegex.test(body.phone)) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz telefon numarası formatı'
      })
    }

    // Generate unique ID for the address
    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create address object
    const address = {
      _id: addressId,
      title: body.title,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      city: body.city,
      district: body.district,
      neighborhood: body.neighborhood,
      address: body.address,
      type: body.type || 'shipping',
      isDefault: body.isDefault || false,
      createdAt: new Date()
    }

    return {
      success: true,
      message: 'Adres başarıyla oluşturuldu',
      address
    }
  } catch (error: any) {
    console.error('Guest address error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Adres oluşturulurken bir hata oluştu'
    })
  }
})
