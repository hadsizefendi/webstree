export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth_token')
  const router = useRouter()
  const toast = useToast()

  // Public routes - her zaman erişilebilir
  if (to.path === '/panel/login') {
    if (token.value) {
      return router.push('/panel')
    }
    return
  }

  // Token kontrolü
  if (!token.value) {
    return router.push('/panel/login')
  }

  try {
    // Kullanıcı bilgilerini al
    const userInfo = await $fetch('/api/auth/user', {
      headers: useRequestHeaders(['cookie'])
    })

    // Admin-only routes - Tüm yönetim sayfalarını ekleyelim
    const adminOnlyRoutes = [
      '/panel/media',
      '/panel/hero',
      '/panel/product',
      '/panel/category',
      '/panel/blog',
      '/panel/theme',
      '/panel/users'
    ]

    if (adminOnlyRoutes.some(route => to.path.startsWith(route)) && userInfo.role !== 'admin') {
      toast.add({
        title: 'Yetkisiz Erişim',
        description: 'Bu sayfaya erişim yetkiniz bulunmuyor',
        color: 'red'
      })
      return router.push('/panel')
    }

  } catch (error) {
    // Hata durumunda token'ı silmiyoruz, sadece yönlendirme yapıyoruz
    console.error('Auth check failed:', error)
    
    toast.add({
      title: 'Hata',
      description: 'Oturum bilgileriniz kontrol edilirken bir hata oluştu',
      color: 'yellow'
    })
    
    if (to.path !== '/panel') {
      return router.push('/panel')
    }
  }
})
