<template>
  <!-- Dialog Trigger -->
  <div 
    v-if="showTrigger"
    @click="openDialog"
    :class="['dialog-trigger-wrapper', triggerClass]"
  >
    <slot name="trigger">
      <button
        type="button"
        class="dialog-trigger-button"
      >
        {{ triggerText || 'Open Dialog' }}
      </button>
    </slot>
  </div>

  <!-- Dialog Portal -->
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="dialog-backdrop"
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
        :class="[
          'dialog-content',
          {
            'dialog-content-sm': size === 'sm',
            'dialog-content-md': size === 'md',
            'dialog-content-lg': size === 'lg',
            'dialog-content-xl': size === 'xl',
            'dialog-content-full': size === 'full'
          },
          contentClass
        ]"
      >
        <!-- Close Button -->
        <button
          v-if="showCloseButton !== false"
          type="button"
          @click="closeDialog"
          class="dialog-close-button"
        >
          <svg class="dialog-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="dialog-close-text">Close</span>
        </button>

        <!-- Header -->
        <div v-if="title || description" class="dialog-header">
          <h2 
            v-if="title"
            :id="headerId"
            :class="[
              'dialog-title',
              titleClass
            ]"
          >
            {{ title }}
          </h2>
          <p 
            v-if="description"
            :id="descriptionId"
            :class="[
              'dialog-description',
              descriptionClass
            ]"
          >
            {{ description }}
          </p>
        </div>

        <!-- Content -->
        <div 
          :class="[
            'dialog-body',
            bodyClass
          ]"
        >
          <wwElement v-if="body" v-bind="body" />
          <slot v-else></slot>
        </div>

        <!-- Footer -->
        <div 
          v-if="showFooter !== false"
          :class="[
            'dialog-footer',
            footerClass
          ]"
        >
          <!-- Cancel Button -->
          <button
            v-if="showCancelButton !== false"
            type="button"
            @click="handleCancel"
            class="dialog-button dialog-button-cancel"
          >
            {{ cancelText || 'Cancel' }}
          </button>

          <!-- Confirm Button -->
          <button
            v-if="showConfirmButton !== false"
            type="button"
            @click="handleConfirm"
            :class="[
              'dialog-button dialog-button-confirm',
              { 'dialog-button-destructive': confirmVariant === 'destructive' }
            ]"
          >
            {{ confirmText || 'Confirm' }}
          </button>

          <!-- Custom Footer Content -->
          <wwElement v-if="footer" v-bind="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.modelValue,
      headerId: `dialog-header-${Math.random().toString(36).substr(2, 9)}`,
      descriptionId: `dialog-description-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  computed: {
    showTrigger() {
      return this.content.showTrigger !== false
    },
    triggerClass() {
      return this.content.triggerClass || ''
    },
    triggerText() {
      return this.content.triggerText || 'Open Dialog'
    },
    size() {
      return this.content.size || 'lg'
    },
    contentClass() {
      return this.content.contentClass || ''
    },
    showCloseButton() {
      return this.content.showCloseButton !== false
    },
    title() {
      return this.content.title
    },
    description() {
      return this.content.description
    },
    titleClass() {
      return this.content.titleClass || ''
    },
    descriptionClass() {
      return this.content.descriptionClass || ''
    },
    body() {
      return this.content.body
    },
    bodyClass() {
      return this.content.bodyClass || ''
    },
    showFooter() {
      return this.content.showFooter !== false
    },
    footerClass() {
      return this.content.footerClass || ''
    },
    showCancelButton() {
      return this.content.showCancelButton !== false
    },
    cancelText() {
      return this.content.cancelText || 'Cancel'
    },
    showConfirmButton() {
      return this.content.showConfirmButton !== false
    },
    confirmText() {
      return this.content.confirmText || 'Confirm'
    },
    confirmVariant() {
      return this.content.confirmVariant || 'default'
    },
    footer() {
      return this.content.footer
    },
    closeOnBackdropClick() {
      return this.content.closeOnBackdropClick !== false
    },
    closeOnCancel() {
      return this.content.closeOnCancel !== false
    },
    closeOnConfirm() {
      return this.content.closeOnConfirm !== false
    },
    closeOnEscape() {
      return this.content.closeOnEscape !== false
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue !== this.isOpen) {
        if (newValue) {
          this.openDialog()
        } else {
          this.closeDialog()
        }
      }
    }
  },
  methods: {
    // Import utility function
    cn(...inputs) {
      return inputs.filter(Boolean).join(' ')
    },

    async openDialog() {
      this.isOpen = true
      this.$emit('update:modelValue', true)
      this.$emit('open')
      
      await this.$nextTick()
      
      // Focus the dialog
      if (this.$refs.dialogRef) {
        this.$refs.dialogRef.focus()
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    },

    closeDialog() {
      this.isOpen = false
      this.$emit('update:modelValue', false)
      this.$emit('close')
      
      // Restore body scroll
      document.body.style.overflow = ''
    },

    handleBackdropClick() {
      if (this.closeOnBackdropClick) {
        this.closeDialog()
      }
    },

    handleCancel() {
      this.$emit('cancel')
      if (this.closeOnCancel) {
        this.closeDialog()
      }
    },

    handleConfirm() {
      this.$emit('confirm')
      if (this.closeOnConfirm) {
        this.closeDialog()
      }
    },

    handleKeyDown(event) {
      if (event.key === 'Escape' && this.closeOnEscape) {
        this.closeDialog()
      }
    },

    // Trap focus within dialog
    trapFocus(event) {
      if (!this.$refs.dialogRef) return
      
      const focusableElements = this.$refs.dialogRef.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            if (lastElement) lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            if (firstElement) firstElement.focus()
          }
        }
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.trapFocus)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.trapFocus)
    // Restore body scroll on unmount
    document.body.style.overflow = ''
  }
}
</script>

<style>
/* Shadcn UI variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* Dialog Styles */
.dialog-trigger-wrapper {
  display: inline-block;
}

.dialog-trigger-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
  outline: none;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  height: 2.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dialog-trigger-button:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.dialog-trigger-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--background));
}

.dialog-trigger-button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: hsl(var(--background) / 0.8);
  backdrop-filter: blur(0.125rem);
  animation: fadeIn 0.2s ease-out;
}

.dialog-content {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: 32rem;
  transform: translate(-50%, -50%);
  gap: 1rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
  border-radius: 0.5rem;
  animation: slideInAndScale 0.2s ease-out;
}

.dialog-content-sm {
  max-width: 24rem;
}

.dialog-content-md {
  max-width: 28rem;
}

.dialog-content-lg {
  max-width: 42rem;
}

.dialog-content-xl {
  max-width: 56rem;
}

.dialog-content-full {
  max-width: 95vw;
  max-height: 95vh;
}

.dialog-close-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 0.125rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  color: hsl(var(--foreground));
  padding: 0.25rem;
}

.dialog-close-button:hover {
  opacity: 1;
}

.dialog-close-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--background));
}

.dialog-close-button:disabled {
  pointer-events: none;
}

.dialog-close-icon {
  height: 1rem;
  width: 1rem;
}

.dialog-close-text {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: center;
}

@media (min-width: 640px) {
  .dialog-header {
    text-align: left;
  }
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.025em;
  color: hsl(var(--foreground));
}

.dialog-description {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

.dialog-body {
  flex: 1 1 0%;
}

.dialog-footer {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .dialog-footer {
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}

.dialog-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
  outline: none;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dialog-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--background));
}

.dialog-button-cancel {
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  margin-top: 0.5rem;
}

@media (min-width: 640px) {
  .dialog-button-cancel {
    margin-top: 0;
  }
}

.dialog-button-cancel:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.dialog-button-confirm {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
}

.dialog-button-confirm:hover {
  background-color: hsl(var(--primary) / 0.9);
}

.dialog-button-destructive {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.dialog-button-destructive:hover {
  background-color: hsl(var(--destructive) / 0.9);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInAndScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style> 