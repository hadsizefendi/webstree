import { User } from '~~/server/models/User'
import crypto from 'crypto'
import { sendVerificationEmail } from '~~/server/utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    
    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Kullanıcı bulunamadı'
      })
    }

    // Son kod gönderim zamanını kontrol et
    const now = Date.now()
    const lastSentTime = user.lastVerificationCodeSentAt?.getTime() || 0
    const secondsElapsed = Math.floor((now - lastSentTime) / 1000)
    
    if (secondsElapsed < 60) {
      throw createError({
        statusCode: 429,
        message: `Lütfen ${60 - secondsElapsed} saniye bekleyin`
      })
    }

    // Yeni doğrulama kodu oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationCode = verificationToken.substring(0, 6).toUpperCase()
    
    // User'ı güncelle
    user.verificationToken = verificationToken
    user.verificationTokenExpiry = new Date(now + 24 * 60 * 60 * 1000) // 24 saat
    user.lastVerificationCodeSentAt = new Date(now) // Son gönderim zamanını güncelle
    await user.save()

    // Email gönder
    await sendVerificationEmail(user.email, verificationToken)

    return {
      message: 'Doğrulama kodu gönderildi',
      verificationCode
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Kod gönderme işlemi başarısız oldu'
    })
  }
})
