import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Login isteği:', { username: body.username, passwordLength: body.password?.length })

    // Kullanıcı adı ve şifre kontrolü
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Kullanıcı adı ve şifre gereklidir'
      })
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ username: body.username })
    console.log('Bulunan kullanıcı:', {
      username: user?.username,
      hasPassword: !!user?.password,
      passwordLength: user?.password?.length
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz kullanıcı adı veya şifre'
      })
    }

    // Şifre karşılaştırma detayları
    console.log('Şifre karşılaştırma öncesi:', {
      girilenSifre: body.password,
      hashliSifre: user.password
    })

    // Şifreyi kontrol et
    const isValid = await bcrypt.compare(body.password, user.password)
    console.log('Şifre karşılaştırma sonucu:', isValid)

    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz kullanıcı adı veya şifre'
      })
    }

    // JWT token oluştur
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    // Token'ı cookie olarak ayarla
    setCookie(event, 'auth_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 saat
    })

    return {
      message: 'Giriş başarılı',
      user: {
        username: user.username
      }
    }
  } catch (error: any) {
    console.error('Login hatası:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Giriş yapılırken bir hata oluştu'
    })
  }
})
