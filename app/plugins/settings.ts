export default defineNuxtPlugin(() => {
  const settings = useState('settings', () => ({
    primary: 'sky',
    gray: 'cool',
    uiConfig: {
      rounded: 'lg',
      shadow: 'lg',
      background: 'white',
      border: true,
      transition: 'none'
    }
  }))

  return {
    provide: {
      settings
    }
  }
})
