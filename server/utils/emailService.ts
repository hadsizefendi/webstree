import nodemailer from 'nodemailer'

async function generateEmailWithLogo(): Promise<{html: string, attachments: any[]}> {
  const logoUrl = 'https://webstree.com/logo.png'
  return {
    attachments: [],
    html: `<img src="${logoUrl}" alt="WebsTree Logo" style="width:auto;height:40px;display:block;margin:0 auto;">`
  }
}

async function getEmailTemplate(content: { title: string, message: string, buttonText: string, buttonUrl: string, code?: string }) {
  const { html: logoHtml, attachments } = await generateEmailWithLogo()
  
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * {
            text-align: center;
          }
          body { 
            background-color: #111827;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #1f2937;
            border-radius: 16px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }
          .logo {
            margin-bottom: 40px;
            text-align: center;
            height: 40px;
          }
          .logo img {
            height: 40px;
            width: auto;
            max-width: none;
            margin: 0 auto;
            display: block;
            object-fit: contain;
          }
          .button-wrapper {
            text-align: center;
            margin: 24px 0;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            background-color: #3b82f6;
            background-image: linear-gradient(to right, #3b82f6, #2563eb);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: transform 0.2s;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .code-container {
            background-color: #374151;
            border-radius: 12px;
            padding: 24px;
            margin: 30px auto;
            border: 1px solid #4b5563;
            max-width: 400px;
            text-align: center;
          }
          .code {
            font-family: 'Courier New', monospace;
            font-size: 36px;
            letter-spacing: 12px;
            color: #60a5fa;
            font-weight: bold;
            margin: 12px 0;
            text-align: center;
          }
          .divider {
            text-align: center;
            margin: 36px auto;
            color: #9ca3af;
            position: relative;
            max-width: 400px;
          }
          .divider::before,
          .divider::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 42%;
            height: 1px;
            background-color: #4b5563;
          }
          .divider::before { left: 0; }
          .divider::after { right: 0; }
          .footer {
            text-align: center;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #374151;
            color: #9ca3af;
            font-size: 14px;
          }
          .heading {
            color: #60a5fa;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 24px 0;
            letter-spacing: -0.5px;
            text-align: center;
          }
          .text {
            color: #e5e7eb;
            margin: 16px auto;
            font-size: 16px;
            line-height: 1.8;
            text-align: center;
          }
          p {
            text-align: center !important;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            ${logoHtml}
          </div>
          
          <h1 class="heading">${content.title}</h1>
          
          <p class="text">Merhaba,</p>
          <p class="text">${content.message}</p>
          
          <div class="button-wrapper">
            <a href="${content.buttonUrl}" class="button">${content.buttonText}</a>
          </div>

          ${content.code ? `
            <div class="divider">veya</div>
            
            <div class="code-container">
              <p class="text">
                Doğrulama kodunuz:
              </p>
              <div class="code">${content.code}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Bu email WebsTree tarafından gönderilmiştir.</p>
            <p style="margin: 8px 0; font-size: 12px; color: #6b7280;">
              Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return { html: template, attachments }
}

const transporter = nodemailer.createTransport({
  host: 'mail.webstree.com',
  port: 465,
  secure: true,
  auth: {
    user: 'welcome@webstree.com',
    pass: 'Welcome25'
  }
})

export const sendEmail = async (to: string, subject: string, htmlContent: {html: string, attachments: any[]}) => {
  try {
    await transporter.sendMail({
      from: '"WebsTree" <welcome@webstree.com>',
      to,
      subject,
      html: htmlContent.html,
      attachments: htmlContent.attachments
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `https://webstree.com/panel/login?verifyToken=${token}`
  const verificationCode = token.substring(0, 6).toUpperCase()
  
  const htmlContent = await getEmailTemplate({
    title: 'Email Adresinizi Doğrulayın',
    message: 'WebsTree\'ye hoş geldiniz! Email adresinizi doğrulamak için aşağıdaki butona tıklayabilir veya doğrulama kodunu kullanabilirsiniz.',
    buttonText: 'Email Adresimi Doğrula',
    buttonUrl: verifyUrl,
    code: verificationCode
  })
  
  await sendEmail(email, 'WebsTree Email Doğrulama', htmlContent)
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `https://webstree.com/panel/login?token=${token}`
  
  const htmlContent = await getEmailTemplate({
    title: 'Şifre Sıfırlama',
    message: 'Şifrenizi sıfırlamak için aşağıdaki butona tıklayabilirsiniz. Bu link 1 saat boyunca geçerli olacaktır.',
    buttonText: 'Şifremi Sıfırla',
    buttonUrl: resetUrl
  })
  
  await sendEmail(email, 'Şifre Sıfırlama', htmlContent)
}

interface OrderEmailContent {
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  totalAmount: number
  shippingAddress: any
  billingAddress?: any
}

export const sendOrderConfirmationEmail = async (email: string, orderDetails: OrderEmailContent) => {
  const htmlContent = await getEmailTemplate({
    title: 'Siparişiniz Alındı!',
    message: `${orderDetails.orderNumber} numaralı siparişiniz başarıyla oluşturuldu. Siparişinizin detayları aşağıdadır:
      <div style="margin: 20px 0; padding: 20px; background: #374151; border-radius: 12px;">
        ${orderDetails.items.map(item => `
          <div style="display: flex; justify-content: space-between; margin: 10px 0; color: #ffffff;">
            <span>${item.name} (x${item.quantity})</span>
            <span>${item.total} ₺</span>
          </div>
        `).join('')}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #4b5563;">
          <div style="display: flex; justify-content: space-between; color: #ffffff;">
            <strong>Toplam:</strong>
            <strong>${orderDetails.totalAmount} ₺</strong>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; color: #ffffff;">
        <strong>Teslimat Adresi:</strong><br>
        ${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}<br>
        ${orderDetails.shippingAddress.address}<br>
        ${orderDetails.shippingAddress.neighborhood}, ${orderDetails.shippingAddress.district}/${orderDetails.shippingAddress.city}
      </div>`,
    buttonText: 'Siparişimi Görüntüle',
    buttonUrl: `https://webstree.com/panel/orders/${orderDetails.orderNumber}`
  })
  
  await sendEmail(email, 'Siparişiniz Alındı!', htmlContent)
}
