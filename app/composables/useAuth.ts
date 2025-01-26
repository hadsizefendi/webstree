export const useAuth = () => {
  const user = useState('user', () => null)

  const getUserInfo = async () => {
    try {
      const response = await $fetch('/api/auth/user', {
        headers: useRequestHeaders(['cookie'])
      })
      user.value = response
      return response
    } catch (error) {
      console.error('Error fetching user info:', error)
      user.value = null
      return null
    }
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  
  const checkIsAdmin = () => {
    if (!isAdmin.value) {
      throw createError({
        statusCode: 403,
        message: 'Admin yetkisi gerekli'
      })
    }
  }

  const requireAdmin = async () => {
    await getUserInfo()
    checkIsAdmin()
  }

  // Composable'ı başlatırken kullanıcı bilgisini al
  if (process.client) {
    getUserInfo()
  }

  return {
    user,
    getUserInfo,
    isAdmin,
    checkIsAdmin,
    requireAdmin
  }
}
