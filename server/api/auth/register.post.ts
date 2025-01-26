import { User } from '~~/server/models/User'
import crypto from 'crypto'
import { sendVerificationEmail } from '../../utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email ve şifre zorunludur'
      })
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        message: 'Geçerli bir email adresi giriniz'
      })
    }

    // Email kontrolü
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Bu email adresi zaten kullanılıyor'
      })
    }

    // Doğrulama tokeni oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationCode = verificationToken.substring(0, 6).toUpperCase()
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat

    // Yeni kullanıcı oluştur
    const user = new User({
      email: body.email,
      password: body.password,
      verificationToken,
      verificationTokenExpiry
    })

    await user.save()

    // Theme ayarlarını al
    const settings = await $fetch('/api/settings/theme')
    
    // Email göndermeyi arka planda yap
    sendVerificationEmail(user.email, verificationToken, {
      primary: settings.primary || 'sky',
      gray: settings.gray || 'slate'
    }).catch(error => {
      console.error('Verification email sending failed:', error)
    })

    return {
      message: 'Kayıt başarılı. Lütfen email adresinizi doğrulayın.',
      email: user.email,
      verificationCode // 6 haneli kodu response'da dön
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Bir hata oluştu'
    })
  }
})
