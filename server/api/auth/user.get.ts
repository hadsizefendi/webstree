import jwt from 'jsonwebtoken'
import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized - No token provided'
      })
    }

    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
    
    if (!decoded?.userId) {
      return createError({
        statusCode: 401,
        message: 'Invalid token'
      })
    }

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return user.toObject()
  } catch (error: any) {
    console.error('User fetch error:', error)
    return createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})
