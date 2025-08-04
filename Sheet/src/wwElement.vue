<template>
  <!-- Backdrop -->
  <teleport to="body">
    <div
      v-if="isOpen"
      :class="cn(
        'sheet-backdrop',
        isOpen ? 'sheet-backdrop--visible' : 'sheet-backdrop--hidden'
      )"
      @click="handleBackdropClick"
    />
    
    <!-- Sheet container -->
    <div
      v-if="isOpen"
      :class="cn(
        'sheet-container',
        // Side positioning
        side === 'top' ? 'sheet-container--top' : '',
        side === 'bottom' ? 'sheet-container--bottom' : '',
        side === 'left' ? 'sheet-container--left' : '',
        side === 'right' ? 'sheet-container--right' : '',
        // Animation classes
        side === 'top' ? 'sheet-animate--top' : '',
        side === 'bottom' ? 'sheet-animate--bottom' : '',
        side === 'left' ? 'sheet-animate--left' : '',
        side === 'right' ? 'sheet-animate--right' : '',
        customClass
      )"
      :style="customStyle"
      role="dialog"
      :aria-labelledby="title ? 'sheet-title' : undefined"
      :aria-describedby="description ? 'sheet-description' : undefined"
      @keydown="handleKeyDown"
      tabindex="-1"
    >
      <!-- Header -->
      <div v-if="showHeader !== false" class="sheet-header">
        <div class="sheet-header-content">
          <div class="sheet-header-text">
            <h2
              v-if="title"
              id="sheet-title"
              class="sheet-title"
            >
              {{ title }}
            </h2>
            <p
              v-if="description"
              id="sheet-description"
              class="sheet-description"
            >
              {{ description }}
            </p>
          </div>
          
          <!-- Close button -->
          <button
            v-if="showClose !== false"
            @click="closeSheet"
            class="sheet-close-button"
            :aria-label="closeLabel || 'Close'"
          >
            <svg class="sheet-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content area -->
      <div 
        :class="cn(
          'sheet-content',
          contentClass
        )"
      >
        <!-- Custom content slot -->
        <div v-if="content" v-html="content" />
        
        <!-- Form content -->
        <div v-if="fields && fields.length > 0" class="form-fields">
          <div
            v-for="(field, index) in fields"
            :key="field.id || index"
            class="form-field"
          >
            <label
              v-if="field.label"
              :for="`field-${index}`"
              class="form-label"
            >
              {{ field.label }}
              <span v-if="field.required" class="form-required">*</span>
            </label>
            
            <!-- Input field -->
            <input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
              :id="`field-${index}`"
              :type="field.type"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="field.disabled"
              v-model="field.value"
              class="form-input"
            />
            
            <!-- Textarea -->
            <textarea
              v-else-if="field.type === 'textarea'"
              :id="`field-${index}`"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="field.disabled"
              v-model="field.value"
              :rows="field.rows || 3"
              class="form-textarea"
            />
            
            <!-- Select -->
            <select
              v-else-if="field.type === 'select'"
              :id="`field-${index}`"
              :required="field.required"
              :disabled="field.disabled"
              v-model="field.value"
              class="form-select"
            >
              <option value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
              <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            
            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'" class="form-checkbox-wrapper">
              <input
                :id="`field-${index}`"
                type="checkbox"
                :required="field.required"
                :disabled="field.disabled"
                v-model="field.value"
                class="form-checkbox"
              />
              <label
                :for="`field-${index}`"
                class="form-checkbox-label"
              >
                {{ field.checkboxLabel || field.label }}
              </label>
            </div>
            
            <p v-if="field.description" class="form-field-description">
              {{ field.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer with actions -->
      <div
        v-if="showFooter !== false && (actions && actions.length > 0)"
        :class="cn(
          'sheet-footer',
          footerClass
        )"
      >
        <button
          v-for="(action, index) in actions"
          :key="action.id || index"
          @click="handleAction(action)"
          :disabled="action.disabled"
          :class="cn(
            'sheet-action-button',
            // Action variants
            action.variant === 'default' ? 'sheet-action-button--default' : '',
            action.variant === 'destructive' ? 'sheet-action-button--destructive' : '',
            action.variant === 'outline' ? 'sheet-action-button--outline' : '',
            action.variant === 'secondary' ? 'sheet-action-button--secondary' : '',
            action.variant === 'ghost' ? 'sheet-action-button--ghost' : '',
            action.variant === 'link' ? 'sheet-action-button--link' : '',
            !action.variant ? 'sheet-action-button--default' : '',
            action.customClass
          )"
        >
          <component
            v-if="action.icon"
            :is="action.icon"
            class="sheet-action-icon"
          />
          {{ action.label }}
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    open: {
      type: Boolean,
      default: false
    },
    side: {
      type: String,
      default: 'right',
      validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    closeLabel: {
      type: String,
      default: 'Close'
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    customStyle: {
      type: Object,
      default: () => ({})
    },
    contentClass: {
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isOpen: this.open
    }
  },
  watch: {
    open(newValue) {
      this.isOpen = newValue
      if (newValue) {
        // Focus the sheet when opened
        this.$nextTick(() => {
          const sheetElement = document.querySelector('[role="dialog"]')
          if (sheetElement) {
            sheetElement.focus()
          }
        })
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    // Import utility function
    cn(...inputs) {
      return inputs.filter(Boolean).join(' ')
    },

    closeSheet() {
      this.isOpen = false
      this.$emit('update:open', false)
      this.$emit('close')
    },

    handleBackdropClick() {
      if (this.closeOnBackdrop !== false) {
        this.closeSheet()
      }
    },

    handleKeyDown(event) {
      if (event.key === 'Escape' && this.closeOnEscape !== false) {
        event.preventDefault()
        this.closeSheet()
      }
    },

    handleAction(action) {
      // Emit action event with form data if available
      const formData = {}
      if (this.fields) {
        this.fields.forEach((field, index) => {
          formData[field.id || `field_${index}`] = field.value
        })
      }

      this.$emit('action-click', {
        action,
        formData,
        fields: this.fields
      })

      // Close sheet if action specifies it
      if (action.closeSheet !== false && action.variant !== 'secondary') {
        this.closeSheet()
      }
    },

    // Handle clicks outside when sheet is open
    handleClickOutside(event) {
      if (this.isOpen && this.closeOnBackdrop !== false) {
        const sheetElement = document.querySelector('[role="dialog"]')
        if (sheetElement && !sheetElement.contains(event.target)) {
          this.closeSheet()
        }
      }
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 