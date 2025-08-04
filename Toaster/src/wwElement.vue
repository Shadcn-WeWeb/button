<template>
  <teleport to="body">
    <div
      v-if="toasts.length > 0"
      :class="cn(
        'fixed z-[100] flex flex-col gap-2 p-4 pointer-events-none',
        getPositionClasses()
      )"
    >
      <transition-group
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-for="toast in visibleToasts"
          :key="toast.id"
          :class="cn(
            'relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all pointer-events-auto',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
            // Variant styles
            toast.variant === 'default' ? 'border bg-background text-foreground' : '',
            toast.variant === 'destructive' ? 'destructive border-destructive bg-destructive text-destructive-foreground' : '',
            toast.variant === 'success' ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100' : '',
            toast.variant === 'warning' ? 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : '',
            toast.variant === 'info' ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100' : '',
            toastClass
          )"
          :style="toastStyle"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <!-- Icon -->
          <div v-if="toast.icon || getVariantIcon(toast.variant)" class="flex-shrink-0">
            <component
              v-if="toast.icon"
              :is="toast.icon"
              class="h-5 w-5"
            />
            <svg
              v-else-if="toast.variant === 'success'"
              class="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="toast.variant === 'destructive'"
              class="h-5 w-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="toast.variant === 'warning'"
              class="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <svg
              v-else-if="toast.variant === 'info'"
              class="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="grid gap-1 flex-1">
            <div v-if="toast.title" class="text-sm font-semibold">
              {{ toast.title }}
            </div>
            <div v-if="toast.description" class="text-sm opacity-90">
              {{ toast.description }}
            </div>
            
            <!-- HTML Content -->
            <div v-if="toast.htmlContent" v-html="toast.htmlContent" class="text-sm" />
            
            <!-- Actions -->
            <div v-if="toast.actions && toast.actions.length > 0" class="flex gap-2 mt-2">
              <button
                v-for="(action, index) in toast.actions"
                :key="`action-${index}`"
                @click="handleAction(toast, action, index)"
                :class="cn(
                  'inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  action.variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : '',
                  action.variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : '',
                  action.variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : '',
                  !action.variant ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                )"
              >
                {{ action.label }}
              </button>
            </div>
          </div>

          <!-- Close button -->
          <button
            v-if="toast.dismissible !== false"
            @click="dismissToast(toast.id)"
            :class="cn(
              'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100'
            )"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Progress bar -->
          <div
            v-if="toast.showProgress && toast.duration && toast.duration > 0"
            class="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-out"
            :style="{ width: `${getToastProgress(toast)}%` }"
          />
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export default {
  props: {
        // Individual props will be auto-generated based on the component type
        // This is a placeholder that will be manually refined per component
    },
  emits: ['toast-show', 'toast-dismiss', 'toast-action'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const toasts = ref([])
    const timers = ref(new Map())

    const visibleToasts = computed(() => {
      const max = props.maxToasts || 5
      return toasts.value.slice(0, max)
    })

    const getPositionClasses = () => {
      const position = props.position || 'bottom-right'
      
      const positions = {
        'top-left': 'top-0 left-0',
        'top-center': 'top-0 left-1/2 -translate-x-1/2',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-0 right-0'
      }
      
      return positions[position] || positions['bottom-right']
    }

    const getVariantIcon = (variant) => {
      return ['success', 'destructive', 'warning', 'info'].includes(variant)
    }

    const generateId = () => {
      return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    const addToast = (toastData) => {
      const toast = {
        id: generateId(),
        variant: 'default',
        duration: 5000,
        dismissible: true,
        showProgress: false,
        ...toastData,
        startTime: Date.now()
      }

      // Add to beginning for bottom positions, end for top positions
      if (props.position?.startsWith('bottom')) {
        toasts.value.unshift(toast)
      } else {
        toasts.value.push(toast)
      }

      emit('toast-show', { toast })

      // Auto dismiss if duration is set
      if (toast.duration && toast.duration > 0) {
        startTimer(toast.id, toast.duration)
      }

      return toast.id
    }

    const dismissToast = (id) => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index >= 0) {
        const toast = toasts.value[index]
        toasts.value.splice(index, 1)
        stopTimer(id)
        emit('toast-dismiss', { toast })
      }
    }

    const startTimer = (id, duration) => {
      const timer = setTimeout(() => {
        dismissToast(id)
      }, duration)
      
      timers.value.set(id, timer)
    }

    const stopTimer = (id) => {
      const timer = timers.value.get(id)
      if (timer) {
        clearTimeout(timer)
        timers.value.delete(id)
      }
    }

    const pauseToast = (id) => {
      if (props.pauseOnHover !== false) {
        stopTimer(id)
      }
    }

    const resumeToast = (id) => {
      if (props.pauseOnHover !== false) {
        const toast = toasts.value.find(t => t.id === id)
        if (toast && toast.duration && toast.duration > 0) {
          const elapsed = Date.now() - toast.startTime
          const remaining = Math.max(0, toast.duration - elapsed)
          if (remaining > 0) {
            startTimer(id, remaining)
          } else {
            dismissToast(id)
          }
        }
      }
    }

    const getToastProgress = (toast) => {
      if (!toast.duration || toast.duration <= 0) return 100
      
      const elapsed = Date.now() - toast.startTime
      const progress = Math.max(0, 100 - (elapsed / toast.duration) * 100)
      return progress
    }

    const handleAction = (toast, action, index) => {
      emit('toast-action', {
        toast,
        action,
        index
      })
      
      if (action.dismissToast !== false) {
        dismissToast(toast.id)
      }
    }

    const clearAllToasts = () => {
      toasts.value.forEach(toast => {
        stopTimer(toast.id)
      })
      toasts.value = []
      timers.value.clear()
    }

    // Animation hooks
    const onBeforeEnter = (el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(-20px)'
    }

    const onEnter = (el, done) => {
      el.offsetHeight // trigger reflow
      el.style.transition = 'all 0.3s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      setTimeout(done, 300)
    }

    const onLeave = (el, done) => {
      el.style.transition = 'all 0.3s ease'
      el.style.opacity = '0'
      el.style.transform = 'translateX(100%)'
      setTimeout(done, 300)
    }

    // Watch for external toast requests
    watch(() => props.toastQueue, (newQueue) => {
      if (newQueue && newQueue.length > 0) {
        newQueue.forEach(toastData => {
          addToast(toastData)
        })
      }
    }, { deep: true })

    // Global toast methods
    const toast = {
      add: addToast,
      dismiss: dismissToast,
      clear: clearAllToasts,
      success: (data) => addToast({ ...data, variant: 'success' }),
      error: (data) => addToast({ ...data, variant: 'destructive' }),
      warning: (data) => addToast({ ...data, variant: 'warning' }),
      info: (data) => addToast({ ...data, variant: 'info' })
    }

    // Make toast methods globally available
    if (typeof window !== 'undefined') {
      window.$toast = toast
    }

    onBeforeUnmount(() => {
      clearAllToasts()
      if (typeof window !== 'undefined') {
        delete window.$toast
      }
    })

    return {
      cn,
      toasts,
      visibleToasts,
      getPositionClasses,
      getVariantIcon,
      addToast,
      dismissToast,
      pauseToast,
      resumeToast,
      getToastProgress,
      handleAction,
      clearAllToasts,
      onBeforeEnter,
      onEnter,
      onLeave,
      toast
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style> 