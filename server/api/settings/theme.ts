import { Setting } from '~~/server/models/Setting'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    try {
      const primarySetting = await Setting.findOne({ key: 'theme.primary' })
      const graySetting = await Setting.findOne({ key: 'theme.gray' })
      const uiConfigSetting = await Setting.findOne({ key: 'theme.uiConfig' })

      const defaultUiConfig = {
        rounded: 'rounded-lg',
        shadow: 'shadow',
        background: 'bg-white dark:bg-gray-900',
        border: 'ring-0',
        transition: 'none'
      }

      return {
        primary: primarySetting?.value || 'sky',
        gray: graySetting?.value || 'slate',
        uiConfig: uiConfigSetting?.value || defaultUiConfig
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch theme settings'
      })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { primary, gray, uiConfig } = body

      // Update or create primary color setting
      await Setting.findOneAndUpdate(
        { key: 'theme.primary' },
        {
          key: 'theme.primary',
          value: primary,
          type: 'string',
          label: 'Primary Color',
          group: 'theme',
          createdBy: event.context.user?._id
        },
        { upsert: true }
      )

      // Update or create gray color setting
      await Setting.findOneAndUpdate(
        { key: 'theme.gray' },
        {
          key: 'theme.gray',
          value: gray,
          type: 'string',
          label: 'Gray Color',
          group: 'theme',
          createdBy: event.context.user?._id
        },
        { upsert: true }
      )

      // Update UI config settings
      await Setting.findOneAndUpdate(
        { key: 'theme.uiConfig' },
        {
          key: 'theme.uiConfig',
          value: uiConfig,
          type: 'object',
          label: 'UI Configuration',
          group: 'theme',
          createdBy: event.context.user?._id
        },
        { upsert: true }
      )

      return { success: true }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to update theme settings'
      })
    }
  }
})
