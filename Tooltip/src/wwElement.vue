<template>
  <div class="relative inline-block">
    <!-- Tooltip Trigger -->
    <div
      ref="triggerRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="cn('inline-block cursor-default')"
      :tabindex="content.disabled ? -1 : 0"
    >
      <span>{{ content.triggerText || 'Hover me' }}</span>
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
          placementClasses
        )"
      >
        <!-- Arrow -->
        <div
          :class="cn(
            'absolute h-2 w-2 rotate-45 border bg-popover',
            arrowClasses
          )"
        ></div>

        <!-- Content -->
        <div>
          {{ content.text }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

export default {
  name: 'ShadcnTooltip',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({})
    },
    wwEditorState: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    // Refs
    const triggerRef = ref(null)
    const tooltipRef = ref(null)
    const isVisible = ref(false)
    const tooltipStyles = ref({})
    const showTimer = ref(null)
    const hideTimer = ref(null)

    // Computed
    const placement = computed(() => props.content.side || 'top')

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
      if (props.content.disabled || !props.content.text) return
      
      clearTimeout(hideTimer.value)
      
      showTimer.value = setTimeout(async () => {
        isVisible.value = true
        await nextTick()
        updatePosition()
        
        // Emit WeWeb event
        emit('trigger-event', {
          domEvent: null,
          value: 'show'
        })
      }, props.content.delayDuration || 700)
    }

    const hideTooltip = () => {
      clearTimeout(showTimer.value)
      
      hideTimer.value = setTimeout(() => {
        isVisible.value = false
      }, props.content.skipDelayDuration || 300)
    }

    const handleMouseEnter = () => {
      showTooltip()
    }

    const handleMouseLeave = () => {
      hideTooltip()
    }

    const handleFocus = () => {
      showTooltip()
    }

    const handleBlur = () => {
      hideTooltip()
    }

    const updatePosition = () => {
      if (!triggerRef.value || !tooltipRef.value) return
      
      const triggerRect = triggerRef.value.getBoundingClientRect()
      const tooltipRect = tooltipRef.value.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const offset = 8
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

    return {
      cn,
      triggerRef,
      tooltipRef,
      isVisible,
      tooltipStyles,
      placement,
      placementClasses,
      arrowClasses,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur
    }
  }
}
</script>

<style scoped>
/* Shadcn UI CSS Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 98%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --ring: 212.7 26.8% 83.9%;
}

/* Base styles */
* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Component styles with HSL colors */
.bg-popover { background-color: hsl(var(--popover)); }
.text-popover-foreground { color: hsl(var(--popover-foreground)); }
.border { border-color: hsl(var(--border)); }

/* Additional utility classes */
.relative { position: relative; }
.inline-block { display: inline-block; }
.absolute { position: absolute; }
.z-50 { z-index: 50; }
.overflow-hidden { overflow: hidden; }
.rounded-md { border-radius: calc(var(--radius) - 2px); }
.border { border-width: 1px; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-1\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
.h-2 { height: 0.5rem; }
.w-2 { width: 0.5rem; }
.rotate-45 { transform: rotate(45deg); }
.cursor-default { cursor: default; }
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.\-translate-x-1\/2 { --tw-translate-x: -50%; }
.\-translate-y-1\/2 { --tw-translate-y: -50%; }
.left-1\/2 { left: 50%; }
.bottom-\[-4px\] { bottom: -4px; }
.top-\[-4px\] { top: -4px; }
.right-\[-4px\] { right: -4px; }
.left-\[-4px\] { left: -4px; }
.top-1\/2 { top: 50%; }
.border-t-0 { border-top-width: 0px; }
.border-l-0 { border-left-width: 0px; }
.border-b-0 { border-bottom-width: 0px; }
.border-r-0 { border-right-width: 0px; }

/* Animation classes */
.animate-in {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}

.fade-in-0 {
  --tw-enter-opacity: 0;
}

.zoom-in-95 {
  --tw-enter-scale: .95;
}

@keyframes enter {
  from {
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}
</style> 