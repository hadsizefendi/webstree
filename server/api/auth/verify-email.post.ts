import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)

    const user = await User.findOne({
      $or: [
        { verificationToken: code },
        { verificationToken: { $regex: new RegExp(code, 'i') } }
      ],
      verificationTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz veya süresi dolmuş doğrulama kodu'
      })
    }

    // Kullanıcıyı doğrula
    user.isEmailVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined
    await user.save()

    return {
      message: 'Email adresi başarıyla doğrulandı'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Doğrulama işlemi başarısız oldu'
    })
  }
})
