<template>
  <textarea
    v-model="textareaValue"
    :placeholder="content.placeholder"
    :disabled="content.disabled"
    :readonly="content.readonly"
    :required="content.required"
    :rows="content.rows || 4"
    :maxlength="content.maxLength"
    :name="content.name"
    :class="textareaClasses"
    :style="textareaStyle"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script>
import { computed, ref, watch } from 'vue'

export default {
  name: 'ShadcnTextarea',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        value: "",
        placeholder: "Type your message here...",
        disabled: false,
        readonly: false,
        required: false,
        rows: 4,
        resize: "vertical",
        maxLength: null,
        name: ""
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event', 'input', 'change', 'focus', 'blur'],
  setup(props, { emit }) {
    const textareaValue = ref(props.content.value || '')
    
    watch(() => props.content.value, (newValue) => {
      textareaValue.value = newValue || ''
    })
    
    const textareaClasses = computed(() => {
      const classes = ['textarea-base']
      
      if (props.content.disabled) {
        classes.push('textarea-disabled')
      }
      
      if (props.content.readonly) {
        classes.push('textarea-readonly')
      }
      
      return classes.join(' ')
    })
    
    const textareaStyle = computed(() => {
      const resize = props.content.resize || 'vertical'
      const resizeMap = {
        'none': 'none',
        'both': 'both',
        'horizontal': 'horizontal',
        'vertical': 'vertical'
      }
      
      return {
        resize: resizeMap[resize] || 'vertical'
      }
    })
    
    const handleInput = (event) => {
      const value = event.target.value
      textareaValue.value = value
      
      const eventData = {
        value,
        content: props.content
      }
      
      emit('input', { domEvent: event, value: eventData })
      emit('trigger-event', { domEvent: event, value: eventData })
    }
    
    const handleChange = (event) => {
      const value = event.target.value
      
      const eventData = {
        value,
        content: props.content
      }
      
      emit('change', { domEvent: event, value: eventData })
    }
    
    const handleFocus = (event) => {
      const eventData = {
        value: event.target.value,
        content: props.content
      }
      
      emit('focus', { domEvent: event, value: eventData })
    }
    
    const handleBlur = (event) => {
      const eventData = {
        value: event.target.value,
        content: props.content
      }
      
      emit('blur', { domEvent: event, value: eventData })
    }

    return {
      textareaValue,
      textareaClasses,
      textareaStyle,
      handleInput,
      handleChange,
      handleFocus,
      handleBlur
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --border: hsl(214.3, 31.8%, 91.4%);
  --input: hsl(214.3, 31.8%, 91.4%);
  --ring: hsl(222.2, 84%, 4.9%);
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(222.2, 84%, 4.9%);
  --muted-foreground: hsl(215.4, 16.3%, 46.9%);
  --destructive: hsl(0, 84.2%, 60.2%);
}

/* Base Textarea Styles */
.textarea-base {
  display: flex;
  min-height: 80px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--input);
  background-color: var(--background);
  padding: 8px 12px;
  font-size: 14px;
  color: var(--foreground);
  line-height: 1.4;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  resize: vertical;
}

.textarea-base::placeholder {
  color: var(--muted-foreground);
}

.textarea-base:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

/* States */
.textarea-disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.textarea-readonly {
  background-color: hsl(210, 40%, 98%);
  cursor: default;
}

.textarea-readonly:focus {
  border-color: var(--input);
  box-shadow: none;
}

/* Error state */
.textarea-error {
  border-color: var(--destructive);
}

.textarea-error:focus {
  border-color: var(--destructive);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

/* Focus visible for accessibility */
.textarea-base:focus-visible {
  border-color: var(--ring);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
  outline: none;
}

/* Responsive font size */
@media (max-width: 768px) {
  .textarea-base {
    font-size: 16px; /* Prevent zoom on mobile */
  }
}
</style> 