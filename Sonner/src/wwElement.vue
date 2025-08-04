<template>
  <div 
    ref="toasterRef"
    :class="cn(
      'fixed z-[100] flex flex-col gap-2 p-4 pointer-events-none',
      positionClasses,
      customClass
    )"
    :style="{ 
      '--toast-width': width || '356px',
      '--toast-gap': gap || '8px'
    }"
  >
    <TransitionGroup
      :name="transitionName"
      tag="div"
      class="flex flex-col gap-2"
    >
      <div
        v-for="toast in visibleToasts"
        :key="toast.id"
        :class="cn(
          'relative flex items-start gap-3 rounded-lg border p-4 shadow-lg pointer-events-auto',
          'bg-background text-foreground',
          'transition-all duration-300 ease-out',
          'hover:shadow-xl',
          toastVariantClasses(toast.type),
          toast.className
        )"
        :style="{ 
          transform: getToastTransform(toast),
          opacity: getToastOpacity(toast),
          scale: getToastScale(toast)
        }"
        @click="handleToastClick(toast)"
        @mouseenter="() => pauseToast(toast.id)"
        @mouseleave="() => resumeToast(toast.id)"
      >
        <!-- Swipe indicator -->
        <div
          v-if="enableSwipe && toast.swipeProgress > 0"
          class="absolute inset-0 bg-destructive/10 rounded-lg transition-opacity"
          :style="{ opacity: toast.swipeProgress }"
        />
        
        <!-- Icon -->
        <div 
          v-if="getToastIcon(toast)"
          :class="cn(
            'flex-shrink-0 w-5 h-5 mt-0.5',
            iconColorClasses(toast.type)
          )"
        >
          <component 
            :is="getToastIcon(toast)" 
            class="w-full h-full"
          />
        </div>
        
        <!-- Loading spinner -->
        <div
          v-else-if="toast.type === 'loading'"
          class="flex-shrink-0 w-5 h-5 mt-0.5"
        >
          <div class="animate-spin rounded-full h-full w-full border-2 border-muted-foreground border-t-foreground"></div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div 
            v-if="toast.title"
            :class="cn(
              'font-semibold text-sm leading-tight',
              toast.description ? 'mb-1' : ''
            )"
          >
            {{ toast.title }}
          </div>
          
          <div 
            v-if="toast.description"
            class="text-sm text-muted-foreground leading-relaxed"
          >
            {{ toast.description }}
          </div>
          
          <!-- Action buttons -->
          <div 
            v-if="toast.action || toast.cancel"
            class="flex items-center gap-2 mt-3"
          >
            <button
              v-if="toast.action"
              @click.stop="() => handleAction(toast, 'action')"
              :class="cn(
                'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'transition-colors'
              )"
            >
              {{ toast.action.label }}
            </button>
            
            <button
              v-if="toast.cancel"
              @click.stop="() => handleAction(toast, 'cancel')"
              :class="cn(
                'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium',
                'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'transition-colors'
              )"
            >
              {{ toast.cancel.label }}
            </button>
          </div>
        </div>
        
        <!-- Close button -->
        <button
          v-if="showCloseButton && !toast.action && !toast.cancel"
          @click.stop="() => dismissToast(toast.id)"
          :class="cn(
            'flex-shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'transition-colors'
          )"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Progress bar -->
        <div
          v-if="toast.duration && showProgress"
          class="absolute bottom-0 left-0 h-1 bg-primary/20 rounded-b-lg overflow-hidden"
          :style="{ width: '100%' }"
        >
          <div
            class="h-full bg-primary transition-all duration-100 ease-linear rounded-b-lg"
            :style="{ 
              width: `${((toast.duration - toast.remainingTime) / toast.duration) * 100}%` 
            }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { cn } from './cn.js'

export default {
  name: 'Sonner',
  props: {
        // Individual props will be auto-generated based on the component type
        // This is a placeholder that will be manually refined per component
    },
  emits: ['toast-shown', 'toast-dismissed', 'action-clicked'],
  setup(props, { emit }) {
    const toasterRef = ref(null)
    const toasts = ref([])
    const maxToasts = computed(() => props.maxToasts || 5)
    const pausedToasts = ref(new Set())
    const timers = ref(new Map())
    
    // Computed properties
    const visibleToasts = computed(() => {
      return toasts.value.slice(0, maxToasts.value)
    })
    
    const positionClasses = computed(() => {
      const position = props.position || 'bottom-right'
      const positions = {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4'
      }
      return positions[position] || positions['bottom-right']
    })
    
    const transitionName = computed(() => {
      const position = props.position || 'bottom-right'
      if (position.includes('top')) return 'toast-top'
      if (position.includes('bottom')) return 'toast-bottom'
      return 'toast-bottom'
    })
    
    // Toast styling functions
    const toastVariantClasses = (type) => {
      const variants = {
        default: 'border-border bg-background text-foreground',
        success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
        error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
        info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
        loading: 'border-border bg-background text-foreground'
      }
      return variants[type] || variants.default
    }
    
    const iconColorClasses = (type) => {
      const colors = {
        success: 'text-green-600 dark:text-green-400',
        error: 'text-red-600 dark:text-red-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400'
      }
      return colors[type] || 'text-muted-foreground'
    }
    
    const getToastIcon = (toast) => {
      if (toast.icon) return toast.icon
      
      const icons = {
        success: 'CheckCircle',
        error: 'XCircle',
        warning: 'AlertTriangle',
        info: 'Info'
      }
      
      // Return simple SVG components instead of external icons for simplicity
      const iconComponents = {
        CheckCircle: {
          template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        },
        XCircle: {
          template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        },
        AlertTriangle: {
          template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>'
        },
        Info: {
          template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        }
      }
      
      return iconComponents[icons[toast.type]]
    }
    
    // Toast positioning and animation
    const getToastTransform = (toast) => {
      const index = visibleToasts.value.findIndex(t => t.id === toast.id)
      const offset = index * 60
      
      if (props.position?.includes('bottom')) {
        return `translateY(-${offset}px)`
      } else {
        return `translateY(${offset}px)`
      }
    }
    
    const getToastOpacity = (toast) => {
      const index = visibleToasts.value.findIndex(t => t.id === toast.id)
      return Math.max(0.4, 1 - (index * 0.1))
    }
    
    const getToastScale = (toast) => {
      const index = visibleToasts.value.findIndex(t => t.id === toast.id)
      return Math.max(0.95, 1 - (index * 0.02))
    }
    
    // Toast management functions
    const createToast = (toastData) => {
      const id = Date.now() + Math.random()
      const duration = toastData.duration !== undefined ? toastData.duration : 
                      (toastData.type === 'error' ? 5000 : 4000)
      
      const toast = {
        id,
        type: toastData.type || 'default',
        title: toastData.title || toastData.message,
        description: toastData.description,
        icon: toastData.icon,
        action: toastData.action,
        cancel: toastData.cancel,
        duration,
        remainingTime: duration,
        createdAt: Date.now(),
        swipeProgress: 0,
        className: toastData.className
      }
      
      toasts.value.unshift(toast)
      
      // Remove excess toasts
      if (toasts.value.length > maxToasts.value + 2) {
        toasts.value = toasts.value.slice(0, maxToasts.value + 2)
      }
      
      // Start timer if duration is set
      if (duration > 0) {
        startToastTimer(toast)
      }
      
      emit('toast-shown', { toast })
      return id
    }
    
    const startToastTimer = (toast) => {
      if (timers.value.has(toast.id)) {
        clearInterval(timers.value.get(toast.id))
      }
      
      const interval = setInterval(() => {
        if (pausedToasts.value.has(toast.id)) return
        
        toast.remainingTime -= 100
        
        if (toast.remainingTime <= 0) {
          dismissToast(toast.id)
        }
      }, 100)
      
      timers.value.set(toast.id, interval)
    }
    
    const pauseToast = (id) => {
      if (props.pauseOnHover !== false) {
        pausedToasts.value.add(id)
      }
    }
    
    const resumeToast = (id) => {
      pausedToasts.value.delete(id)
    }
    
    const dismissToast = (id) => {
      const toastIndex = toasts.value.findIndex(t => t.id === id)
      if (toastIndex === -1) return
      
      const toast = toasts.value[toastIndex]
      
      // Clear timer
      if (timers.value.has(id)) {
        clearInterval(timers.value.get(id))
        timers.value.delete(id)
      }
      
      // Remove from paused set
      pausedToasts.value.delete(id)
      
      // Remove toast
      toasts.value.splice(toastIndex, 1)
      
      emit('toast-dismissed', { toast })
    }
    
    const dismissAll = () => {
      const toastsCopy = [...toasts.value]
      toasts.value = []
      timers.value.clear()
      pausedToasts.value.clear()
      
      toastsCopy.forEach(toast => {
        emit('toast-dismissed', { toast })
      })
    }
    
    // Event handlers
    const handleToastClick = (toast) => {
      if (props.dismissOnClick !== false) {
        dismissToast(toast.id)
      }
    }
    
    const handleAction = (toast, actionType) => {
      const action = toast[actionType]
      if (action && action.onClick) {
        action.onClick()
      }
      
      emit('action-clicked', { toast, actionType, action })
      
      if (action?.closeOnClick !== false) {
        dismissToast(toast.id)
      }
    }
    
    // API exposure via window for external calls
    const exposeAPI = () => {
      if (typeof window !== 'undefined') {
        window.sonner = {
          toast: (message, options = {}) => createToast({ title: message, ...options }),
          success: (message, options = {}) => createToast({ title: message, type: 'success', ...options }),
          error: (message, options = {}) => createToast({ title: message, type: 'error', ...options }),
          warning: (message, options = {}) => createToast({ title: message, type: 'warning', ...options }),
          info: (message, options = {}) => createToast({ title: message, type: 'info', ...options }),
          loading: (message, options = {}) => createToast({ title: message, type: 'loading', duration: 0, ...options }),
          promise: async (promise, options = {}) => {
            const loadingId = createToast({
              title: options.loading || 'Loading...',
              type: 'loading',
              duration: 0
            })
            
            try {
              const result = await promise
              dismissToast(loadingId)
              createToast({
                title: options.success || 'Success!',
                type: 'success',
                ...options.successOptions
              })
              return result
            } catch (error) {
              dismissToast(loadingId)
              createToast({
                title: options.error || 'Something went wrong',
                type: 'error',
                ...options.errorOptions
              })
              throw error
            }
          },
          dismiss: dismissToast,
          dismissAll
        }
      }
    }
    
    // Lifecycle
    onMounted(() => {
      exposeAPI()
      
      // Handle manual toasts from content
      if (props.toasts) {
        props.toasts.forEach(toastData => {
          createToast(toastData)
        })
      }
    })
    
    onUnmounted(() => {
      timers.value.forEach(timer => clearInterval(timer))
      timers.value.clear()
    })
    
    // Watch for new toasts from content
    watch(() => props.toasts, (newToasts) => {
      if (newToasts && Array.isArray(newToasts)) {
        newToasts.forEach(toastData => {
          if (!toasts.value.find(t => t.id === toastData.id)) {
            createToast(toastData)
          }
        })
      }
    }, { deep: true })
    
    return {
      toasterRef,
      visibleToasts,
      positionClasses,
      transitionName,
      toastVariantClasses,
      iconColorClasses,
      getToastIcon,
      getToastTransform,
      getToastOpacity,
      getToastScale,
      handleToastClick,
      handleAction,
      pauseToast,
      resumeToast,
      dismissToast,
      cn
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style>

<style scoped>
/* Toast animations */
.toast-top-enter-active,
.toast-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-top-enter-from {
  opacity: 0;
  transform: translateY(-100%) scale(0.95);
}

.toast-top-leave-to {
  opacity: 0;
  transform: translateY(-100%) scale(0.95);
}

.toast-bottom-enter-active,
.toast-bottom-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-bottom-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.95);
}

.toast-bottom-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.95);
}

/* Smooth transitions for positioning */
.toast-item {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              scale 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Progress bar animation */
@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
</style> 