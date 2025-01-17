export default defineNuxtPlugin(async () => {
  const appConfig = useAppConfig()
  const settings = useState('settings')
  try {
    const themeSettings = await $fetch('/api/settings/theme')
    settings.value = themeSettings
    appConfig.ui = {
      ...appConfig.ui,
      primary: themeSettings.primary || 'sky',
      gray: themeSettings.gray || 'slate',
      rounded: themeSettings.uiConfig?.rounded || '',
      shadow: themeSettings.uiConfig?.shadow || '',
      background: themeSettings.uiConfig?.background || '',
      border: themeSettings.uiConfig?.border || '',
      transition: themeSettings.uiConfig?.transition || ''
    }
  } catch (error) {
    console.error('Failed to load theme settings:', error)
  }
})
