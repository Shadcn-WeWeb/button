<template>
  <div class="ww-alertdialog">
    <!-- Backdrop -->
    <teleport to="body">
      <div
        v-if="content.isOpen"
        :class="backdropClasses"
        @click="handleBackdropClick"
      />
      
      <!-- Alert Dialog container -->
      <div
        v-if="content.isOpen"
        :class="dialogClasses"
        role="alertdialog"
        :aria-labelledby="content.title ? 'alert-dialog-title' : undefined"
        :aria-describedby="content.description ? 'alert-dialog-description' : undefined"
        @keydown="handleKeyDown"
        tabindex="-1"
      >
        <!-- Icon -->
        <div v-if="content.variant" class="ww-alertdialog__icon-container">
          <div :class="getIconClasses()">
            <svg
              v-if="content.variant === 'destructive'"
              class="ww-alertdialog__icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <svg
              v-else-if="content.variant === 'warning'"
              class="ww-alertdialog__icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="content.variant === 'info'"
              class="ww-alertdialog__icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="content.variant === 'success'"
              class="ww-alertdialog__icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="ww-alertdialog__content">
          <h2
            v-if="content.title"
            id="alert-dialog-title"
            class="ww-alertdialog__title"
          >
            {{ content.title }}
          </h2>
          <p
            v-if="content.description"
            id="alert-dialog-description"
            class="ww-alertdialog__description"
          >
            {{ content.description }}
          </p>
          
          <!-- Input field for confirmation -->
          <div v-if="content.requireConfirmation" class="ww-alertdialog__confirmation">
            <label
              v-if="content.confirmationLabel"
              for="confirmation-input"
              class="ww-alertdialog__confirmation-label"
            >
              {{ content.confirmationLabel }}
            </label>
            <input
              id="confirmation-input"
              ref="confirmationInput"
              v-model="confirmationValue"
              :placeholder="content.confirmationPlaceholder"
              class="ww-alertdialog__confirmation-input"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="ww-alertdialog__actions">
          <!-- Cancel button -->
          <button
            v-if="content.showCancel !== false"
            @click="handleCancel"
            class="ww-alertdialog__button ww-alertdialog__button--cancel"
          >
            {{ content.cancelLabel || 'Cancel' }}
          </button>
          
          <!-- Continue/Confirm button -->
          <button
            @click="handleConfirm"
            :disabled="isConfirmDisabled"
            :class="getConfirmButtonClasses()"
          >
            {{ content.confirmLabel || 'Continue' }}
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'ShadcnAlertDialog',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        isOpen: false,
        title: 'Are you absolutely sure?',
        description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        variant: 'destructive',
        showCancel: true,
        cancelLabel: 'Cancel',
        confirmLabel: 'Continue',
        requireConfirmation: false,
        confirmationLabel: "Type 'delete' to confirm",
        confirmationPlaceholder: 'delete',
        confirmationMatch: 'delete'
      })
    },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  data() {
    return {
      confirmationValue: ''
    }
  },
  computed: {
    backdropClasses() {
      return 'ww-alertdialog__backdrop'
    },
    dialogClasses() {
      return 'ww-alertdialog__container'
    },
    isConfirmDisabled() {
      if (this.content.requireConfirmation) {
        if (this.content.confirmationMatch) {
          return this.confirmationValue !== this.content.confirmationMatch
        }
        return !this.confirmationValue.trim()
      }
      return false
    }
  },
  watch: {
    'content.isOpen'(newValue) {
      if (newValue) {
        // Reset confirmation value
        this.confirmationValue = ''
        
        // Focus the confirmation input or first button
        this.$nextTick(() => {
          if (this.content.requireConfirmation && this.$refs.confirmationInput) {
            this.$refs.confirmationInput.focus()
          } else {
            const firstButton = document.querySelector('[role="alertdialog"] button')
            if (firstButton) {
              firstButton.focus()
            }
          }
        })
      }
    }
  },
  methods: {
    getIconClasses() {
      const baseClass = 'ww-alertdialog__icon-wrapper'
      const variantClass = `ww-alertdialog__icon-wrapper--${this.content.variant || 'default'}`
      return `${baseClass} ${variantClass}`
    },
    getConfirmButtonClasses() {
      const baseClass = 'ww-alertdialog__button ww-alertdialog__button--confirm'
      const variantClass = `ww-alertdialog__button--confirm-${this.content.variant || 'default'}`
      const disabledClass = this.isConfirmDisabled ? 'ww-alertdialog__button--disabled' : ''
      return `${baseClass} ${variantClass} ${disabledClass}`.trim()
    },
    handleConfirm() {
      if (this.isConfirmDisabled) return

      const eventData = {
        confirmationValue: this.confirmationValue,
        content: this.content
      }

      this.$emit('trigger-event', {
        domEvent: null,
        value: eventData
      })
    },
    handleCancel() {
      const eventData = {
        content: this.content
      }

      this.$emit('trigger-event', {
        domEvent: null,
        value: eventData
      })
    },
    handleBackdropClick() {
      if (this.content.closeOnBackdrop !== false) {
        this.handleCancel()
      }
    },
    handleKeyDown(event) {
      switch (event.key) {
        case 'Escape':
          if (this.content.closeOnEscape !== false) {
            event.preventDefault()
            this.handleCancel()
          }
          break
        case 'Enter':
          if (!this.content.requireConfirmation || !this.isConfirmDisabled) {
            event.preventDefault()
            this.handleConfirm()
          }
          break
      }
    }
  }
}
</script>

<style>
/* ===== SHADCN UI CSS VARIABLES ===== */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
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
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* Backdrop */
.ww-alertdialog__backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

/* Dialog Container */
.ww-alertdialog__container {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: 32rem;
  transform: translate(-50%, -50%);
  gap: 16px;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  animation: ww-alertdialog-in 0.3s ease-out;
}

@keyframes ww-alertdialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Icon */
.ww-alertdialog__icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ww-alertdialog__icon-wrapper {
  display: flex;
  height: 48px;
  width: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.ww-alertdialog__icon-wrapper--destructive {
  background-color: hsl(0, 84.2%, 97%);
  color: hsl(var(--destructive));
}

.ww-alertdialog__icon-wrapper--warning {
  background-color: hsl(48, 96%, 95%);
  color: hsl(25, 95%, 30%);
}

.ww-alertdialog__icon-wrapper--info {
  background-color: hsl(214, 100%, 97%);
  color: hsl(214, 84%, 56%);
}

.ww-alertdialog__icon-wrapper--success {
  background-color: hsl(143, 85%, 96%);
  color: hsl(140, 84%, 39%);
}

.ww-alertdialog__icon-wrapper--default {
  background-color: hsl(var(--secondary));
  color: hsl(var(--muted-foreground));
}

.ww-alertdialog__icon {
  height: 24px;
  width: 24px;
}

/* Content */
.ww-alertdialog__content {
  gap: 8px;
  text-align: center;
}

.ww-alertdialog__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: hsl(var(--foreground));
}

.ww-alertdialog__description {
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin: 0;
  line-height: 1.5;
}

/* Confirmation Input */
.ww-alertdialog__confirmation {
  margin-top: 16px;
  gap: 8px;
}

.ww-alertdialog__confirmation-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: hsl(var(--foreground));
}

.ww-alertdialog__confirmation-input {
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 8px 12px;
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: border-color 0.2s;
}

.ww-alertdialog__confirmation-input:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.ww-alertdialog__confirmation-input::placeholder {
  color: hsl(var(--muted-foreground));
}

/* Actions */
.ww-alertdialog__actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
}

@media (min-width: 640px) {
  .ww-alertdialog__actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .ww-alertdialog__content {
    text-align: left;
  }
}

/* Buttons */
.ww-alertdialog__button {
  display: inline-flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.ww-alertdialog__button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.ww-alertdialog__button--cancel {
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.ww-alertdialog__button--cancel:hover {
  background-color: hsl(var(--secondary));
}

.ww-alertdialog__button--confirm {
  color: hsl(var(--primary-foreground));
}

.ww-alertdialog__button--confirm-default {
  background-color: hsl(var(--primary));
}

.ww-alertdialog__button--confirm-default:hover {
  background-color: hsl(222.2, 47.4%, 8%);
}

.ww-alertdialog__button--confirm-destructive {
  background-color: hsl(var(--destructive));
}

.ww-alertdialog__button--confirm-destructive:hover {
  background-color: hsl(0, 84.2%, 55%);
}

.ww-alertdialog__button--confirm-warning {
  background-color: hsl(38, 92%, 50%);
}

.ww-alertdialog__button--confirm-warning:hover {
  background-color: hsl(38, 92%, 45%);
}

.ww-alertdialog__button--confirm-info {
  background-color: hsl(214, 84%, 56%);
}

.ww-alertdialog__button--confirm-info:hover {
  background-color: hsl(214, 84%, 51%);
}

.ww-alertdialog__button--confirm-success {
  background-color: hsl(140, 84%, 39%);
}

.ww-alertdialog__button--confirm-success:hover {
  background-color: hsl(140, 84%, 34%);
}

.ww-alertdialog__button--disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>