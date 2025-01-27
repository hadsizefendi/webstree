import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { User } from '~~/server/models/User'
import { sendVerificationEmail } from '~~/server/utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email ve şifre gereklidir'
      })
    }

    const user = await User.findOne({ email: body.email })
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz email veya şifre'
      })
    }

    // Şifre kontrolü
    const isValid = await bcrypt.compare(body.password, user.password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz email veya şifre'
      })
    }

    // Email doğrulanmamışsa
    if (!user.isEmailVerified) {
      return {
        requireVerification: true,
        message: 'Email doğrulaması gerekli'
      }
    }

    // Email doğrulanmışsa normal login işlemine devam et
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '180d' }
    )

    setCookie(event, 'auth_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 180
    })

    return {
      requireVerification: false,
      message: 'Giriş başarılı',
      user: {
        email: user.email,
        role: user.role
      }
    }
  } catch (error: any) {
    console.error('Login hatası:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Giriş yapılırken bir hata oluştu',
      data: error.data // Hata data'sını UI'a geçir
    })
  }
})
