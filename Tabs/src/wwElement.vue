<template>
  <div 
    :class="tabsClasses"
    :data-orientation="orientation"
  >
    <!-- Tabs List -->
    <div 
      :class="tabsListClasses"
      role="tablist"
      :aria-orientation="orientation"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="`tab-${index}`"
        :class="getTabTriggerClasses(index)"
        :aria-selected="activeTab === index"
        :aria-controls="`content-${index}`"
        :id="`tab-${index}`"
        role="tab"
        :tabindex="activeTab === index ? 0 : -1"
        @click="setActiveTab(index)"
        @keydown="handleKeyDown($event, index)"
      >
        <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tabs Content -->
    <div
      v-for="(tab, index) in tabs"
      :key="`content-${index}`"
      :class="getTabContentClasses(index)"
      :id="`content-${index}`"
      :aria-labelledby="`tab-${index}`"
      role="tabpanel"
      :tabindex="0"
      v-show="activeTab === index"
    >
      <div v-if="tab.content" v-html="tab.content" />
      <slot v-else :name="`tab-${index}`" />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { cn } from './cn.js'

export default {
  name: 'WewebTabs',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        defaultTab: 0,
        orientation: 'horizontal',
        variant: 'default',
        size: 'default',
        tabs: [
          { label: 'Tab 1', content: 'Content 1', icon: null },
          { label: 'Tab 2', content: 'Content 2', icon: null }
        ],
        customClasses: ''
      })
    },
    modelValue: {
      type: Number,
      default: null
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const activeTab = ref(props.modelValue !== null ? props.modelValue : props.defaultTab)

    const tabsClasses = computed(() => cn(
      "w-full",
      {
        "flex": props.orientation === 'vertical',
        "flex-col": props.orientation === 'horizontal'
      },
      props.customClasses
    ))

    const tabsListClasses = computed(() => cn(
      "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      {
        "h-10": props.size === 'default',
        "h-8": props.size === 'sm',
        "h-12": props.size === 'lg',
        "flex-col h-auto w-auto": props.orientation === 'vertical'
      }
    ))

    const getTabTriggerClasses = (index) => {
      return cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-background text-foreground shadow-sm": activeTab.value === index,
          "hover:bg-background/50": activeTab.value !== index,
          "gap-2": props.tabs[index]?.icon
        }
      )
    }

    const getTabContentClasses = (index) => {
      return cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        {
          "ml-2 mt-0": props.orientation === 'vertical'
        }
      )
    }

    const setActiveTab = (index) => {
      if (index !== activeTab.value) {
        activeTab.value = index
        emit('update:modelValue', index)
        emit('change', { activeTab: index, tab: props.tabs[index] })

        // Execute Weweb workflow if defined
        if (props.changeWorkflowId && typeof wwLib !== 'undefined') {
          wwLib.executeWorkflow(props.changeWorkflowId)
        }
      }
    }

    const handleKeyDown = (event, currentIndex) => {
      const tabCount = props.tabs.length
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabCount - 1
          break
        case 'ArrowRight':
        case 'ArrowDown':
          newIndex = currentIndex < tabCount - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          newIndex = 0
          break
        case 'End':
          newIndex = tabCount - 1
          break
        default:
          return
      }

      event.preventDefault()
      setActiveTab(newIndex)
    }

    // Watch for external model value changes
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== null && newValue !== activeTab.value) {
        activeTab.value = newValue
      }
    })

    return {
      activeTab,
      tabsClasses,
      tabsListClasses,
      getTabTriggerClasses,
      getTabContentClasses,
      setActiveTab,
      handleKeyDown
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 