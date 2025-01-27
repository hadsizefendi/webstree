import crypto from 'crypto'

export function generateSessionId(): string {
  // Benzersiz session ID oluştur
  const timestamp = Date.now().toString()
  const random = Math.random().toString()
  const raw = `${timestamp}-${random}-${crypto.randomBytes(16).toString('hex')}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}

export function getCartSession(event: any): string | null {
  const session = getCookie(event, 'cart_session')
  if (!session) {
    const newSession = generateSessionId()
    setCookie(event, 'cart_session', newSession, {
      maxAge: 180 * 24 * 60 * 60, // 180 gün
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    })
    return newSession
  }
  return session
}
