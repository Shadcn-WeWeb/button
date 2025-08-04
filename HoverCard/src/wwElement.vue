<template>
  <div 
    ref="triggerRef"
    :class="content.triggerClass"
    :style="content.triggerStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Trigger content -->
    <slot>
      <span :class="content.triggerContentClass">
        {{ content.triggerText || 'Hover me' }}
      </span>
    </slot>

    <!-- Hover Card -->
    <teleport to="body">
      <div
        v-if="isVisible"
        ref="cardRef"
        :class="cn(
          'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95',
          content.side === 'top' ? 'slide-in-from-bottom-2' : '',
          content.side === 'bottom' ? 'slide-in-from-top-2' : '',
          content.side === 'left' ? 'slide-in-from-right-2' : '',
          content.side === 'right' ? 'slide-in-from-left-2' : '',
          content.customClass
        )"
        :style="cardStyle"
        role="tooltip"
        @mouseenter="handleCardMouseEnter"
        @mouseleave="handleCardMouseLeave"
      >
        <!-- Avatar section -->
        <div v-if="content.avatar || content.avatarSrc" class="flex justify-between space-x-4">
          <div class="flex items-center space-x-2">
            <img
              v-if="content.avatarSrc"
              :src="content.avatarSrc"
              :alt="content.avatarAlt || 'Avatar'"
              class="h-10 w-10 rounded-full"
            />
            <div v-else-if="content.avatar" class="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <component
                v-if="content.avatar"
                :is="content.avatar"
                class="h-6 w-6"
              />
            </div>
            <div>
              <h4 v-if="content.title" class="text-sm font-semibold">{{ content.title }}</h4>
              <p v-if="content.username" class="text-sm text-muted-foreground">{{ content.username }}</p>
            </div>
          </div>
        </div>

        <!-- Content without avatar -->
        <div v-else-if="content.title || content.description">
          <h4 v-if="content.title" class="mb-1 text-sm font-semibold">{{ content.title }}</h4>
          <p v-if="content.description" class="text-sm text-muted-foreground">
            {{ content.description }}
          </p>
        </div>

        <!-- Custom HTML content -->
        <div v-if="content.htmlContent" v-html="content.htmlContent" />

        <!-- Stats/Info section -->
        <div v-if="content.stats && content.stats.length > 0" class="mt-3 flex items-center pt-2">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div v-for="(stat, index) in content.stats" :key="index" class="text-xs">
              <div class="font-medium">{{ stat.value }}</div>
              <div class="text-muted-foreground">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Links/Actions -->
        <div v-if="content.links && content.links.length > 0" class="mt-3 flex space-x-2">
          <button
            v-for="(link, index) in content.links"
            :key="index"
            @click="handleLinkClick(link, index)"
            :class="cn(
              'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              link.variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : '',
              link.variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : '',
              link.variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : '',
              !link.variant ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            )"
          >
            <component
              v-if="link.icon"
              :is="link.icon"
              class="mr-1 h-3 w-3"
            />
            {{ link.label }}
          </button>
        </div>

        <!-- Additional content -->
        <div v-if="content.content" class="mt-3 text-sm">
          {{ content.content }}
        </div>

        <!-- Footer info -->
        <div v-if="content.footer" class="mt-3 pt-2 border-t text-xs text-muted-foreground">
          {{ content.footer }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['open', 'close', 'link-click'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const triggerRef = ref(null)
    const cardRef = ref(null)
    const isVisible = ref(false)
    const cardPosition = ref({ x: 0, y: 0 })
    
    let openTimeout = null
    let closeTimeout = null

    const cardStyle = computed(() => ({
      position: 'fixed',
      left: `${cardPosition.value.x}px`,
      top: `${cardPosition.value.y}px`
    }))

    const calculatePosition = () => {
      if (!triggerRef.value || !cardRef.value) return

      const triggerRect = triggerRef.value.getBoundingClientRect()
      const cardRect = cardRef.value.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const side = props.content.side || 'bottom'
      const offset = props.content.offset || 4
      const align = props.content.align || 'center'
      
      let x = 0
      let y = 0

      // Calculate position based on side
      switch (side) {
        case 'top':
          x = triggerRect.left
          y = triggerRect.top - cardRect.height - offset
          break
        case 'bottom':
          x = triggerRect.left
          y = triggerRect.bottom + offset
          break
        case 'left':
          x = triggerRect.left - cardRect.width - offset
          y = triggerRect.top
          break
        case 'right':
          x = triggerRect.right + offset
          y = triggerRect.top
          break
      }

      // Adjust alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            // x already set correctly
            break
          case 'center':
            x = triggerRect.left + (triggerRect.width - cardRect.width) / 2
            break
          case 'end':
            x = triggerRect.right - cardRect.width
            break
        }
      } else {
        switch (align) {
          case 'start':
            // y already set correctly
            break
          case 'center':
            y = triggerRect.top + (triggerRect.height - cardRect.height) / 2
            break
          case 'end':
            y = triggerRect.bottom - cardRect.height
            break
        }
      }

      // Ensure card stays within viewport
      x = Math.max(8, Math.min(x, viewportWidth - cardRect.width - 8))
      y = Math.max(8, Math.min(y, viewportHeight - cardRect.height - 8))

      cardPosition.value = { x, y }
    }

    const showCard = () => {
      clearTimeout(closeTimeout)
      openTimeout = setTimeout(() => {
        isVisible.value = true
        emit('open')
        
        nextTick(() => {
          calculatePosition()
        })
      }, props.content.openDelay || 700)
    }

    const hideCard = () => {
      clearTimeout(openTimeout)
      closeTimeout = setTimeout(() => {
        isVisible.value = false
        emit('close')
      }, props.content.closeDelay || 300)
    }

    const handleMouseEnter = () => {
      if (props.content.trigger === 'hover' || !props.content.trigger) {
        showCard()
      }
    }

    const handleMouseLeave = () => {
      if (props.content.trigger === 'hover' || !props.content.trigger) {
        hideCard()
      }
    }

    const handleCardMouseEnter = () => {
      clearTimeout(closeTimeout)
    }

    const handleCardMouseLeave = () => {
      hideCard()
    }

    const handleFocus = () => {
      if (props.content.trigger === 'focus') {
        showCard()
      }
    }

    const handleBlur = () => {
      if (props.content.trigger === 'focus') {
        hideCard()
      }
    }

    const handleLinkClick = (link, index) => {
      emit('link-click', { link, index })
      
      if (link.closeOnClick !== false) {
        isVisible.value = false
        emit('close')
      }
    }

    // Handle clicks outside to close
    const handleClickOutside = (event) => {
      if (isVisible.value && 
          !triggerRef.value?.contains(event.target) && 
          !cardRef.value?.contains(event.target)) {
        isVisible.value = false
        emit('close')
      }
    }

    // Handle window resize
    const handleResize = () => {
      if (isVisible.value) {
        nextTick(() => {
          calculatePosition()
        })
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      clearTimeout(openTimeout)
      clearTimeout(closeTimeout)
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })

    return {
      cn,
      triggerRef,
      cardRef,
      isVisible,
      cardStyle,
      handleMouseEnter,
      handleMouseLeave,
      handleCardMouseEnter,
      handleCardMouseLeave,
      handleFocus,
      handleBlur,
      handleLinkClick
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 