import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const { token, password } = await readBody(event)

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz veya süresi dolmuş token'
      })
    }

    // Şifreyi güncelle
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()

    return {
      message: 'Şifreniz başarıyla güncellendi'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Şifre sıfırlama başarısız oldu'
    })
  }
})
