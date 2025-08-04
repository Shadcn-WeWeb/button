<template>
  <div class="relative inline-block">
    <!-- Tooltip Trigger -->
    <div
      ref="triggerRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="cn('inline-block', content.triggerClass)"
      :tabindex="content.disabled ? -1 : 0"
    >
      <slot>
        <span>{{ content.triggerText || 'Hover me' }}</span>
      </slot>
    </div>

    <!-- Tooltip Content -->
    <Teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        role="tooltip"
        :style="tooltipStyles"
        :class="cn(
          'absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          placementClasses,
          content.size === 'sm' && 'px-2 py-1 text-xs',
          content.size === 'lg' && 'px-4 py-2',
          content.customClass
        )"
      >
        <!-- Arrow -->
        <div
          v-if="content.showArrow !== false"
          :class="cn(
            'absolute h-2 w-2 rotate-45 border bg-popover',
            arrowClasses
          )"
        ></div>

        <!-- Content -->
        <div>
          {{ content.text || content.content }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

// Refs
const triggerRef = ref(null)
const tooltipRef = ref(null)
const isVisible = ref(false)
const tooltipStyles = ref({})
const showTimer = ref(null)
const hideTimer = ref(null)

// Computed
const placement = computed(() => props.content.placement || 'top')

const placementClasses = computed(() => {
  const classes = {
    top: 'data-[side=top]:slide-in-from-bottom-2',
    bottom: 'data-[side=bottom]:slide-in-from-top-2',
    left: 'data-[side=left]:slide-in-from-right-2',
    right: 'data-[side=right]:slide-in-from-left-2'
  }
  return classes[placement.value] || classes.top
})

const arrowClasses = computed(() => {
  const classes = {
    top: 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-0 border-l-0',
    bottom: 'top-[-4px] left-1/2 transform -translate-x-1/2 border-b-0 border-r-0',
    left: 'right-[-4px] top-1/2 transform -translate-y-1/2 border-l-0 border-b-0',
    right: 'left-[-4px] top-1/2 transform -translate-y-1/2 border-r-0 border-t-0'
  }
  return classes[placement.value] || classes.top
})

// Methods
const showTooltip = async () => {
  if (props.content.disabled || !props.content.text && !props.content.content) return
  
  clearTimeout(hideTimer.value)
  
  showTimer.value = setTimeout(async () => {
    isVisible.value = true
    await nextTick()
    updatePosition()
  }, props.content.delay || 700)
}

const hideTooltip = () => {
  clearTimeout(showTimer.value)
  
  hideTimer.value = setTimeout(() => {
    isVisible.value = false
  }, props.content.hideDelay || 300)
}

const handleMouseEnter = () => {
  if (props.content.trigger === 'hover' || !props.content.trigger) {
    showTooltip()
  }
}

const handleMouseLeave = () => {
  if (props.content.trigger === 'hover' || !props.content.trigger) {
    hideTooltip()
  }
}

const handleFocus = () => {
  if (props.content.trigger === 'focus' || props.content.trigger === 'hover' || !props.content.trigger) {
    showTooltip()
  }
}

const handleBlur = () => {
  if (props.content.trigger === 'focus' || props.content.trigger === 'hover' || !props.content.trigger) {
    hideTooltip()
  }
}

const updatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  const offset = props.content.offset || 8
  let top, left
  
  switch (placement.value) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - offset + window.scrollY
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + window.scrollX
      break
      
    case 'bottom':
      top = triggerRect.bottom + offset + window.scrollY
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + window.scrollX
      break
      
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + window.scrollY
      left = triggerRect.left - tooltipRect.width - offset + window.scrollX
      break
      
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + window.scrollY
      left = triggerRect.right + offset + window.scrollX
      break
      
    default:
      top = triggerRect.top - tooltipRect.height - offset + window.scrollY
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + window.scrollX
  }
  
  // Adjust for viewport boundaries
  if (left < 8) {
    left = 8
  } else if (left + tooltipRect.width > viewportWidth - 8) {
    left = viewportWidth - tooltipRect.width - 8
  }
  
  if (top < 8) {
    top = 8
  } else if (top + tooltipRect.height > viewportHeight + window.scrollY - 8) {
    top = viewportHeight + window.scrollY - tooltipRect.height - 8
  }
  
  tooltipStyles.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 50
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
})

onUnmounted(() => {
  clearTimeout(showTimer.value)
  clearTimeout(hideTimer.value)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
})

// Expose methods
defineExpose({
  show: showTooltip,
  hide: hideTooltip
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 