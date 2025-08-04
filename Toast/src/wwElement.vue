<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      :class="cn(
        'fixed z-[100] flex w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        position === 'top-center' && 'top-0 left-1/2 transform -translate-x-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2',
        position === 'top-left' && 'top-0 left-0 sm:left-0',
        position === 'top-right' && 'top-0 right-0 sm:right-0',
        position === 'bottom-center' && 'bottom-0 left-1/2 transform -translate-x-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2',
        position === 'bottom-left' && 'bottom-0 left-0 sm:left-0',
        position === 'bottom-right' && 'bottom-0 right-0 sm:right-0',
        !position && 'bottom-0 right-0 sm:right-0',
        containerClass
      )"
    >
      <div
        ref="toastRef"
        role="alert"
        :aria-live="variant === 'destructive' ? 'assertive' : 'polite'"
        :aria-atomic="true"
        :class="cn(
          'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
          'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
          toastVariants({ variant: variant }),
          customClass
        )"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
      >
        <!-- Icon -->
        <div v-if="showIcon" class="flex-shrink-0">
          <svg 
            v-if="variant === 'destructive'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <svg 
            v-else-if="variant === 'success'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg 
            v-else-if="variant === 'warning'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <svg 
            v-else-if="variant === 'info'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <svg 
            v-else
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>

        <!-- Content -->
        <div class="grid gap-1 flex-1">
          <h3 
            v-if="title"
            :class="cn(
              'text-sm font-semibold',
              titleClass
            )"
          >
            {{ title }}
          </h3>
          <div 
            v-if="description"
            :class="cn(
              'text-sm opacity-90',
              descriptionClass
            )"
          >
            {{ description }}
          </div>
          
          <!-- Custom content -->
          <wwElement v-if="body" v-bind="body" />
        </div>

        <!-- Action -->
        <button
          v-if="actionText"
          type="button"
          @click="handleAction"
          :class="cn(
            'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-xs font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            'group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
            actionClass
          )"
        >
          {{ actionText }}
        </button>

        <!-- Close Button -->
        <button
          v-if="showCloseButton !== false"
          type="button"
          @click="closeToast"
          :class="cn(
            'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
            'group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600'
          )"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Progress bar -->
        <div
          v-if="showProgress && duration > 0"
          :class="cn(
            'absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-100',
            progressClass
          )"
        >
          <div
            :class="cn(
              'h-full bg-primary transition-all duration-100 ease-linear',
              progressBarClass
            )"
            :style="`width: ${progress}%`"
          ></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'action'])

// Refs
const toastRef = ref(null)
const isVisible = ref(props.modelValue)
const timer = ref(null)
const progress = ref(100)
const progressTimer = ref(null)
const isPaused = ref(false)
const startTime = ref(null)
const remainingTime = ref(null)

// Computed
const showIcon = computed(() => props.showIcon !== false)

const toastVariants = (props) => {
  const variants = {
    default: 'border bg-background text-foreground',
    destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
    success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100'
  }
  
  return variants[props.variant] || variants.default
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== isVisible.value) {
    if (newValue) {
      showToast()
    } else {
      closeToast()
    }
  }
})

// Methods
const showToast = () => {
  isVisible.value = true
  emit('update:modelValue', true)
  
  if (props.duration > 0) {
    startTimer()
  }
}

const closeToast = () => {
  isVisible.value = false
  emit('update:modelValue', false)
  emit('close')
  
  clearTimer()
}

const handleAction = () => {
  emit('action')
  if (props.closeOnAction !== false) {
    closeToast()
  }
}

const startTimer = () => {
  if (!props.duration || props.duration <= 0) return
  
  startTime.value = Date.now()
  remainingTime.value = props.duration
  
  timer.value = setTimeout(() => {
    closeToast()
  }, props.duration)
  
  // Start progress animation
  if (props.showProgress) {
    startProgressAnimation()
  }
}

const clearTimer = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
    progressTimer.value = null
  }
}

const pauseTimer = () => {
  if (!timer.value || isPaused.value) return
  
  isPaused.value = true
  clearTimer()
  
  // Calculate remaining time
  const elapsed = Date.now() - startTime.value
  remainingTime.value = Math.max(0, props.duration - elapsed)
}

const resumeTimer = () => {
  if (!isPaused.value || remainingTime.value <= 0) return
  
  isPaused.value = false
  startTime.value = Date.now()
  
  timer.value = setTimeout(() => {
    closeToast()
  }, remainingTime.value)
  
  // Resume progress animation
  if (props.showProgress) {
    startProgressAnimation()
  }
}

const startProgressAnimation = () => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
  }
  
  const duration = isPaused.value ? remainingTime.value : props.duration
  const startProgress = isPaused.value ? (remainingTime.value / props.duration) * 100 : 100
  progress.value = startProgress
  
  const interval = 16 // ~60fps
  const decrement = (100 / duration) * interval
  
  progressTimer.value = setInterval(() => {
    progress.value = Math.max(0, progress.value - decrement)
    
    if (progress.value <= 0) {
      clearInterval(progressTimer.value)
      progressTimer.value = null
    }
  }, interval)
}

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    showToast()
  }
})

onUnmounted(() => {
  clearTimer()
})

// Expose methods
defineExpose({
  show: showToast,
  close: closeToast
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 