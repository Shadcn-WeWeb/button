<template>
  <!-- Dialog Trigger -->
  <div 
    v-if="content.showTrigger"
    @click="openDialog"
    :class="cn('inline-block', content.triggerClass)"
  >
    <slot name="trigger">
      <button
        type="button"
        :class="cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          'h-10 px-4 py-2'
        )"
      >
        {{ content.triggerText || 'Open Dialog' }}
      </button>
    </slot>
  </div>

  <!-- Dialog Portal -->
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      :class="cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
      )"
      @click="handleBackdropClick"
    >
      <!-- Dialog Content -->
      <div
        ref="dialogRef"
        role="dialog"
        :aria-labelledby="headerId"
        :aria-describedby="descriptionId"
        :aria-modal="true"
        tabindex="-1"
        @click.stop
        @keydown="handleKeyDown"
        :class="cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'rounded-lg',
          content.size === 'sm' && 'max-w-sm',
          content.size === 'md' && 'max-w-md', 
          content.size === 'lg' && 'max-w-2xl',
          content.size === 'xl' && 'max-w-4xl',
          content.size === 'full' && 'max-w-[95vw] max-h-[95vh]',
          content.contentClass
        )"
      >
        <!-- Close Button -->
        <button
          v-if="content.showCloseButton !== false"
          type="button"
          @click="closeDialog"
          :class="cn(
            'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:pointer-events-none'
          )"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>

        <!-- Header -->
        <div v-if="content.title || content.description" class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 
            v-if="content.title"
            :id="headerId"
            :class="cn(
              'text-lg font-semibold leading-none tracking-tight',
              content.titleClass
            )"
          >
            {{ content.title }}
          </h2>
          <p 
            v-if="content.description"
            :id="descriptionId"
            :class="cn(
              'text-sm text-muted-foreground',
              content.descriptionClass
            )"
          >
            {{ content.description }}
          </p>
        </div>

        <!-- Content -->
        <div 
          :class="cn(
            'flex-1',
            content.bodyClass
          )"
        >
          <wwElement v-if="content.body" v-bind="content.body" />
          <slot v-else></slot>
        </div>

        <!-- Footer -->
        <div 
          v-if="content.showFooter !== false"
          :class="cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            content.footerClass
          )"
        >
          <!-- Cancel Button -->
          <button
            v-if="content.showCancelButton !== false"
            type="button"
            @click="handleCancel"
            :class="cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
              'h-10 px-4 py-2',
              'mt-2 sm:mt-0'
            )"
          >
            {{ content.cancelText || 'Cancel' }}
          </button>

          <!-- Confirm Button -->
          <button
            v-if="content.showConfirmButton !== false"
            type="button"
            @click="handleConfirm"
            :class="cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              content.confirmVariant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90',
              'h-10 px-4 py-2'
            )"
          >
            {{ content.confirmText || 'Confirm' }}
          </button>

          <!-- Custom Footer Content -->
          <wwElement v-if="content.footer" v-bind="content.footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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

const emit = defineEmits(['update:modelValue', 'open', 'close', 'confirm', 'cancel'])

// Refs
const dialogRef = ref(null)
const isOpen = ref(props.modelValue)

// Computed
const headerId = computed(() => `dialog-header-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `dialog-description-${Math.random().toString(36).substr(2, 9)}`)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== isOpen.value) {
    if (newValue) {
      openDialog()
    } else {
      closeDialog()
    }
  }
})

// Methods
const openDialog = async () => {
  isOpen.value = true
  emit('update:modelValue', true)
  emit('open')
  
  await nextTick()
  
  // Focus the dialog
  if (dialogRef.value) {
    dialogRef.value.focus()
  }
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
}

const closeDialog = () => {
  isOpen.value = false
  emit('update:modelValue', false)
  emit('close')
  
  // Restore body scroll
  document.body.style.overflow = ''
}

const handleBackdropClick = () => {
  if (props.content.closeOnBackdropClick !== false) {
    closeDialog()
  }
}

const handleCancel = () => {
  emit('cancel')
  if (props.content.closeOnCancel !== false) {
    closeDialog()
  }
}

const handleConfirm = () => {
  emit('confirm')
  if (props.content.closeOnConfirm !== false) {
    closeDialog()
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.content.closeOnEscape !== false) {
    closeDialog()
  }
}

// Trap focus within dialog
const trapFocus = (event) => {
  if (!dialogRef.value) return
  
  const focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
  // Restore body scroll on unmount
  document.body.style.overflow = ''
})

// Expose methods for external control
defineExpose({
  open: openDialog,
  close: closeDialog
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 