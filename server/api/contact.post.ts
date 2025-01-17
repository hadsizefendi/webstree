import { createTransport } from 'nodemailer'
import { useCompiler } from '#vue-email'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    const transport = createTransport({
      host: 'mail.webstree.com',
      port: 465,
      secure: true,
      auth: {
        user: 'form@webstree.com',
        pass: config.mailPassword
      }
    })

    await transport.sendMail({
      from: 'form@webstree.com',
      to: 'info@webstree.com',
      subject: `İletişim Formu: ${body.name}`,
      text: `
        İsim: ${body.name}
        E-posta: ${body.email}
        
        Mesaj:
        ${body.message}
      `
    })

    return { success: true }
  } catch (error) {
    console.error('Mail gönderme hatası:', error)
    throw createError({
      statusCode: 500,
      message: 'Mail gönderilemedi'
    })
  }
})
