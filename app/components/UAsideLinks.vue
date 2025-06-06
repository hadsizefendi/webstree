<template>
  <div
    v-if="links?.length"
    :class="ui.wrapper"
    v-bind="attrs"
    class="!flex flex-col !text-center !items-center !justify-center h-[80vh]"
  >
    <ULink
      v-for="(link, index) in links"
      :key="index"
      v-slot="{ isActive }"
      v-bind="getULinkProps(link)"
      class="inline-flex items-center gap-1.5 lg:gap-2 group justify-center"
      :active-class="ui.active"
      :inactive-class="ui.inactive"
      @click="link.click"
    >
      <UIcon
        :name="link.icon"
        class="w-8 h-8"
      />
      <span :class="ui.label">
        {{ link.label }}
        <UIcon
          v-if="link.target === '_blank'"
          :name="ui.externalIcon.name"
          :class="ui.externalIcon.base"
        />
      </span>
    </ULink>
  </div>
</template>

<script setup lang="ts">
import { getULinkProps } from '#ui/utils'
import type { AsideLink } from '#ui-pro/types'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'space-y-3 mb-3 lg:mb-6 -mx-1 lg:mx-0',
  base: 'flex items-center gap-1.5 lg:gap-2 group',
  active: 'text-primary font-semibold',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium',
  icon: {
    wrapper: 'rounded-md p-1 inline-flex ring-inset ring-1',
    base: 'w-4 h-4 flex-shrink-0',
    active: 'bg-primary ring-primary text-background',
    inactive: 'bg-gray-100/50 dark:bg-gray-800/50 ring-gray-300 dark:ring-gray-700 group-hover:bg-primary group-hover:ring-primary group-hover:text-background'
  },
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500'
  },
  label: 'text-2xl relative leading-[60px] font-black'
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  links: {
    type: Array as PropType<AsideLink[]>,
    default: () => []
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('aside.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const _isActive = (path: string) => {
  // ...existing code...
}
</script>
