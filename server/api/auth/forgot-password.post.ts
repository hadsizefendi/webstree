import { User } from '~~/server/models/User'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '../../utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)

    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
      })
    }

    // Reset token oluştur
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 saat geçerli
    await user.save()

    // Email gönder
    await sendPasswordResetEmail(user.email, resetToken)

    return {
      message: 'Şifre sıfırlama talimatları email adresinize gönderildi'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Şifre sıfırlama işlemi başarısız oldu'
    })
  }
})
