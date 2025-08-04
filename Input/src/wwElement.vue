<template>
  <input
    v-model="inputValue"
    :type="content.type || 'text'"
    :placeholder="content.placeholder"
    :disabled="content.disabled"
    :readonly="content.readonly"
    :required="content.required"
    :class="inputClasses"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script>
export default {
  name: 'ShadcnInput',
  props: {
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['update:content:effect', 'update:content', 'element-event'],
  data() {
    return {
      inputValue: this.content.value || ''
    }
  },
  computed: {
    inputClasses() {
      const size = this.content.size || 'default'
      const variant = this.content.variant || 'default'
      
      const classes = [
        'input-base',
        `input-size-${size}`,
        `input-variant-${variant}`
      ]
      
      if (this.content.disabled) {
        classes.push('input-disabled')
      }
      
      if (this.content.readonly) {
        classes.push('input-readonly')
      }
      
      return classes.join(' ')
    }
  },
  watch: {
    'content.value': {
      handler(newValue) {
        this.inputValue = newValue || ''
      },
      immediate: true
    }
  },
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.inputValue = value
      
      // WeWeb standard events
      this.$emit('element-event', {
        type: 'input',
        domEvent: event,
        value: {
          value,
          type: this.content?.type || 'text',
          content: this.content
        }
      })
      
      // Update content
      this.$emit('update:content', { value })
    },
    
    handleChange(event) {
      const value = event.target.value
      
      this.$emit('element-event', {
        type: 'change',
        domEvent: event,
        value: {
          value,
          type: this.content?.type || 'text',
          content: this.content
        }
      })
    },
    
    handleFocus(event) {
      this.$emit('element-event', {
        type: 'focus',
        domEvent: event,
        value: {
          value: event.target.value,
          type: this.content?.type || 'text',
          content: this.content
        }
      })
    },
    
    handleBlur(event) {
      this.$emit('element-event', {
        type: 'blur',
        domEvent: event,
        value: {
          value: event.target.value,
          type: this.content?.type || 'text',
          content: this.content
        }
      })
    }
  }
}
</script>

<style>
/* SHADCN UI INPUT - WeWeb Compatible */

/* Base Input Styles with direct colors */
input.input-base {
  display: flex;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #e2e8f0 !important;
  background-color: #ffffff !important;
  padding: 8px 12px;
  font-size: 14px;
  color: #0f172a !important;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  font-family: inherit;
}

input.input-base::placeholder {
  color: #64748b !important;
}

input.input-base:focus {
  border-color: #0f172a !important;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1) !important;
}

input.input-base:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  background-color: #f8fafc !important;
}

input.input-base:readonly {
  background-color: #f8fafc !important;
  cursor: default !important;
}

/* Sizes with specific selectors */
input.input-base.input-size-sm {
  height: 32px !important;
  padding: 4px 8px !important;
  font-size: 13px !important;
}

input.input-base.input-size-default {
  height: 40px !important;
  padding: 8px 12px !important;
  font-size: 14px !important;
}

input.input-base.input-size-lg {
  height: 48px !important;
  padding: 12px 16px !important;
  font-size: 16px !important;
}

/* Variants */
.input-variant-default {
  /* Default styles already applied in base */
}

.input-variant-ghost {
  border: none;
  background-color: transparent;
  box-shadow: none;
}

.input-variant-ghost:focus {
  border: 1px solid var(--ring);
  background-color: var(--background);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

/* States */
.input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.input-readonly {
  background-color: hsl(210, 40%, 98%);
  cursor: default;
}

.input-readonly:focus {
  border-color: var(--input);
  box-shadow: none;
}

/* Error state (for validation) */
.input-error {
  border-color: var(--destructive);
}

.input-error:focus {
  border-color: var(--destructive);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

/* File input specific styles */
.input-base[type="file"] {
  padding: 6px 8px;
  cursor: pointer;
}

.input-base[type="file"]::-webkit-file-upload-button {
  margin-right: 8px;
  padding: 4px 8px;
  border: 1px solid var(--input);
  border-radius: 4px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: inherit;
  cursor: pointer;
}

.input-base[type="file"]::-webkit-file-upload-button:hover {
  background-color: hsl(210, 40%, 96%);
}

/* Number input arrows */
.input-base[type="number"]::-webkit-outer-spin-button,
.input-base[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-base[type="number"] {
  -moz-appearance: textfield;
}

/* Search input clear button */
.input-base[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--muted-foreground);
  cursor: pointer;
  position: relative;
}

.input-base[type="search"]::-webkit-search-cancel-button:before {
  content: '×';
  color: white;
  font-weight: bold;
  position: absolute;
  top: -2px;
  left: 3px;
  font-size: 12px;
}
</style>