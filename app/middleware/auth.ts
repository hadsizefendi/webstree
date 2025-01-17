export default defineNuxtRouteMiddleware((to, from) => {
  console.log('Auth middleware tetiklendi!') // Test için log ekledik
  const token = useCookie('auth_token')
  const router = useRouter()

  // Eğer token yoksa giriş sayfasına yönlendir
  if (!token.value && to.path !== '/panel/login') {
    console.log('Kullanıcı giriş yapmamış, giriş sayfasına yönlendiriliyor...')
    return router.push('/panel/login')
  }

  // Eğer token varsa ve kullanıcı giriş sayfasındaysa panel sayfasına yönlendir
  if (token.value && to.path === '/panel/login') {
    console.log('Kullanıcı giriş yapmış, panel sayfasına yönlendiriliyor...')
    return router.push('/panel')
  }
})
