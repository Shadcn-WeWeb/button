<template>
  <div 
    ref="scrollAreaRef"
    :class="cn(
      'relative overflow-hidden',
      content.customClass
    )"
    :style="areaStyle"
  >
    <!-- Scrollable viewport -->
    <div
      ref="viewportRef"
      :class="cn(
        'h-full w-full rounded-[inherit]',
        content.hideScrollbar ? 'scrollbar-hide' : '',
        content.viewportClass
      )"
      :style="viewportStyle"
      @scroll="onScroll"
    >
      <!-- Content wrapper -->
      <div 
        ref="contentRef"
        :class="cn(
          'min-w-full table',
          content.contentClass
        )"
      >
        <slot />
      </div>
    </div>
    
    <!-- Custom scrollbar (vertical) -->
    <div
      v-if="!content.hideScrollbar && showVerticalScrollbar"
      :class="cn(
        'absolute right-0 top-0 z-50 flex h-full w-2.5 touch-none select-none border-l border-l-transparent p-[1px] transition-colors',
        'hover:w-3 hover:bg-border/50',
        content.scrollbarClass
      )"
    >
      <div
        ref="thumbVerticalRef"
        :class="cn(
          'relative flex-1 rounded-full bg-border transition-colors',
          'hover:bg-border/80 active:bg-border',
          content.thumbClass
        )"
        :style="thumbVerticalStyle"
        @mousedown="startDragVertical"
      />
    </div>
    
    <!-- Custom scrollbar (horizontal) -->
    <div
      v-if="!content.hideScrollbar && showHorizontalScrollbar"
      :class="cn(
        'absolute bottom-0 left-0 z-50 flex h-2.5 w-full touch-none select-none border-t border-t-transparent p-[1px] transition-colors',
        'hover:h-3 hover:bg-border/50',
        content.scrollbarClass
      )"
    >
      <div
        ref="thumbHorizontalRef"
        :class="cn(
          'relative flex-1 rounded-full bg-border transition-colors',
          'hover:bg-border/80 active:bg-border',
          content.thumbClass
        )"
        :style="thumbHorizontalStyle"
        @mousedown="startDragHorizontal"
      />
    </div>
    
    <!-- Scroll indicators -->
    <div
      v-if="content.showIndicators"
      class="absolute right-2 top-2 z-50 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm"
    >
      {{ Math.round(scrollTop) }} / {{ Math.round(maxScrollTop) }}
    </div>
    
    <!-- Fade overlays -->
    <div
      v-if="content.showFadeTop && scrollTop > 0"
      class="pointer-events-none absolute left-0 top-0 z-40 h-6 w-full bg-gradient-to-b from-background to-transparent"
    />
    <div
      v-if="content.showFadeBottom && scrollTop < maxScrollTop"
      class="pointer-events-none absolute bottom-0 left-0 z-40 h-6 w-full bg-gradient-to-t from-background to-transparent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['scroll', 'scrollTop', 'scrollBottom', 'scrollEnd'])

// Reactive data
const scrollAreaRef = ref(null)
const viewportRef = ref(null)
const contentRef = ref(null)
const thumbVerticalRef = ref(null)
const thumbHorizontalRef = ref(null)

const scrollTop = ref(0)
const scrollLeft = ref(0)
const maxScrollTop = ref(0)
const maxScrollLeft = ref(0)
const isDraggingVertical = ref(false)
const isDraggingHorizontal = ref(false)

// Computed properties
const areaStyle = computed(() => ({
  height: content.value?.height || 'auto',
  maxHeight: content.value?.maxHeight || 'none',
  width: content.value?.width || 'auto',
  maxWidth: content.value?.maxWidth || 'none'
}))

const viewportStyle = computed(() => ({
  overflowX: content.value?.horizontal ? 'auto' : 'hidden',
  overflowY: content.value?.vertical !== false ? 'auto' : 'hidden',
  scrollbarWidth: content.value?.hideScrollbar ? 'none' : 'auto',
  msOverflowStyle: content.value?.hideScrollbar ? 'none' : 'auto'
}))

const showVerticalScrollbar = computed(() => 
  content.value?.vertical !== false && maxScrollTop.value > 0
)

const showHorizontalScrollbar = computed(() => 
  content.value?.horizontal && maxScrollLeft.value > 0
)

const thumbVerticalStyle = computed(() => {
  if (!viewportRef.value) return {}
  
  const viewportHeight = viewportRef.value.clientHeight
  const contentHeight = viewportRef.value.scrollHeight
  const thumbHeight = Math.max(20, (viewportHeight / contentHeight) * viewportHeight)
  const thumbTop = (scrollTop.value / maxScrollTop.value) * (viewportHeight - thumbHeight)
  
  return {
    height: `${thumbHeight}px`,
    transform: `translateY(${thumbTop}px)`
  }
})

const thumbHorizontalStyle = computed(() => {
  if (!viewportRef.value) return {}
  
  const viewportWidth = viewportRef.value.clientWidth
  const contentWidth = viewportRef.value.scrollWidth
  const thumbWidth = Math.max(20, (viewportWidth / contentWidth) * viewportWidth)
  const thumbLeft = (scrollLeft.value / maxScrollLeft.value) * (viewportWidth - thumbWidth)
  
  return {
    width: `${thumbWidth}px`,
    transform: `translateX(${thumbLeft}px)`
  }
})

// Methods
const updateScrollInfo = () => {
  if (!viewportRef.value) return
  
  const viewport = viewportRef.value
  scrollTop.value = viewport.scrollTop
  scrollLeft.value = viewport.scrollLeft
  maxScrollTop.value = viewport.scrollHeight - viewport.clientHeight
  maxScrollLeft.value = viewport.scrollWidth - viewport.clientWidth
}

const onScroll = (event) => {
  updateScrollInfo()
  
  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollLeft: scrollLeft.value,
    maxScrollTop: maxScrollTop.value,
    maxScrollLeft: maxScrollLeft.value,
    target: event.target
  })
  
  // Emit specific scroll events
  if (scrollTop.value === 0) {
    emit('scrollTop')
  }
  
  if (scrollTop.value >= maxScrollTop.value) {
    emit('scrollBottom')
  }
  
  if (scrollTop.value >= maxScrollTop.value && scrollLeft.value >= maxScrollLeft.value) {
    emit('scrollEnd')
  }
}

// Drag handlers for custom scrollbar
const startDragVertical = (event) => {
  event.preventDefault()
  isDraggingVertical.value = true
  
  const onMouseMove = (e) => {
    if (!isDraggingVertical.value || !viewportRef.value) return
    
    const viewport = viewportRef.value
    const rect = viewport.getBoundingClientRect()
    const percentage = (e.clientY - rect.top) / rect.height
    const newScrollTop = Math.max(0, Math.min(maxScrollTop.value, percentage * maxScrollTop.value))
    
    viewport.scrollTop = newScrollTop
  }
  
  const onMouseUp = () => {
    isDraggingVertical.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const startDragHorizontal = (event) => {
  event.preventDefault()
  isDraggingHorizontal.value = true
  
  const onMouseMove = (e) => {
    if (!isDraggingHorizontal.value || !viewportRef.value) return
    
    const viewport = viewportRef.value
    const rect = viewport.getBoundingClientRect()
    const percentage = (e.clientX - rect.left) / rect.width
    const newScrollLeft = Math.max(0, Math.min(maxScrollLeft.value, percentage * maxScrollLeft.value))
    
    viewport.scrollLeft = newScrollLeft
  }
  
  const onMouseUp = () => {
    isDraggingHorizontal.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// Public methods
const scrollTo = (options) => {
  if (!viewportRef.value) return
  
  if (typeof options === 'number') {
    viewportRef.value.scrollTop = options
  } else {
    viewportRef.value.scrollTo(options)
  }
}

const scrollToTop = (smooth = true) => {
  scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}

const scrollToBottom = (smooth = true) => {
  scrollTo({ top: maxScrollTop.value, behavior: smooth ? 'smooth' : 'auto' })
}

const scrollIntoView = (selector, options = {}) => {
  if (!contentRef.value) return
  
  const element = contentRef.value.querySelector(selector)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', ...options })
  }
}

// Resize observer
let resizeObserver = null

// Lifecycle
onMounted(() => {
  nextTick(() => {
    updateScrollInfo()
    
    // Set up resize observer
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateScrollInfo()
      })
      
      if (viewportRef.value) {
        resizeObserver.observe(viewportRef.value)
      }
      
      if (contentRef.value) {
        resizeObserver.observe(contentRef.value)
      }
    }
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Watchers
watch(() => content.value, () => {
  nextTick(updateScrollInfo)
}, { deep: true })

// Expose methods
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollIntoView,
  scrollTop: readonly(scrollTop),
  scrollLeft: readonly(scrollLeft),
  maxScrollTop: readonly(maxScrollTop),
  maxScrollLeft: readonly(maxScrollLeft)
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style>

<style scoped>
/* Hide native scrollbar utility */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 