export default defineAppConfig({
  ui: {
    primary: 'sky',
    gray: 'slate',
    variables: {
      light: {
        background: 'var(--color-gray-50)'
      },
      dark: {
        background: 'var(--color-gray-950)'
      }
    },
    header: {
      wrapper: 'lg:!border-transparent bg-gray-50 dark:bg-gray-950 !bg-opacity-0 border-none sm:!backdrop-blur-none',
      links: {
        wrapper: ' px-3 gap-x-0 rounded-none backdrop-blur-2xl bg-white/50 dark:bg-gray-900/50 rounded-lg',
        base: 'py-2 px-4 font-medium transition-colors relative after:absolute after:-bottom-px after:inset-x-2 after:h-px after:rounded-none after:opacity-0 after:bg-gray-900 dark:after:bg-white after:transition-opacity',
        active: 'text-gray-900 dark:text-white after:opacity-100',
        inactive: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }
    }
  }
})
