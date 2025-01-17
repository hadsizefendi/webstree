export const useAuth = () => {
  const getUserInfo = async () => {
    try {
      const response = await $fetch('/api/auth/user', {
        headers: useRequestHeaders(['cookie'])
      })
      return response
    } catch (error) {
      console.error('Error fetching user info:', error)
      return null
    }
  }

  return {
    getUserInfo
  }
}
