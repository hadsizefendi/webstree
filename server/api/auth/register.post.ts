import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Kullanıcı adının dolu olduğunu kontrol et
    if (!body.username) {
      throw createError({
        statusCode: 400,
        message: 'Kullanıcı adı gereklidir'
      })
    }

    // Şifrenin dolu olduğunu kontrol et
    if (!body.password) {
      throw createError({
        statusCode: 400,
        message: 'Şifre gereklidir'
      })
    }

    // Kullanıcı adının benzersiz olduğunu kontrol et
    const existingUser = await User.findOne({ username: body.username })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Bu kullanıcı adı zaten kullanılıyor'
      })
    }

    // Yeni kullanıcıyı oluştur - şifre User modelinde otomatik hashlenecek
    const user = new User({
      username: body.username,
      password: body.password
    })

    // Kullanıcıyı kaydet
    await user.save()

    return {
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        username: user.username
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Bir hata oluştu'
    })
  }
})
