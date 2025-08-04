<template>
  <div 
    :class="cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      content.variant === 'outline' ? 'border border-input bg-transparent' : '',
      content.variant === 'default' ? 'bg-muted' : '',
      content.size === 'sm' ? 'h-9' : content.size === 'lg' ? 'h-11' : 'h-10'
    )"
    role="group"
    :aria-label="'Toggle group'"
  >
    <button
      v-for="(item, index) in (content.items || [])"
      :key="item.value || index"
      :class="cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        // States
        isSelected(item.value) ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
        item.disabled || content.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted/50',
        // Positioning
        index === 0 ? 'rounded-l-md' : '',
        index === (content.items || []).length - 1 ? 'rounded-r-md' : '',
        index > 0 && index < (content.items || []).length - 1 ? 'rounded-none' : '',
        // Border adjustments for outline variant
        content.variant === 'outline' && index > 0 ? 'border-l-0' : ''
      )"
      @click="toggleItem(item.value, $event)"
      :disabled="item.disabled || content.disabled"
      :aria-pressed="isSelected(item.value)"
      :title="item.tooltip"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ShadcnToggleGroup',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({})
    },
    wwEditorState: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const selectedValues = ref(props.content.type === 'multiple' ? [] : null)

    // Initialize selected values
    watch(() => props.content.defaultValue, (newValue) => {
      if (newValue !== undefined) {
        selectedValues.value = props.content.type === 'multiple' 
          ? (Array.isArray(newValue) ? newValue : [newValue])
          : newValue
      }
    }, { immediate: true })

    const isSelected = (value) => {
      if (props.content.type === 'multiple') {
        return Array.isArray(selectedValues.value) && selectedValues.value.includes(value)
      }
      return selectedValues.value === value
    }

    const toggleItem = (value, domEvent) => {
      if (props.content.disabled) return
      
      let newValue
      
      if (props.content.type === 'multiple') {
        const currentValues = Array.isArray(selectedValues.value) ? [...selectedValues.value] : []
        const index = currentValues.indexOf(value)
        
        if (index > -1) {
          currentValues.splice(index, 1)
        } else {
          currentValues.push(value)
        }
        
        newValue = currentValues
      } else {
        // Single selection
        newValue = selectedValues.value === value ? null : value
      }
      
      selectedValues.value = newValue

      // Emit WeWeb event
      emit('trigger-event', {
        domEvent,
        value: newValue
      })
    }

    return {
      cn,
      selectedValues,
      isSelected,
      toggleItem
    }
  }
}
</script>

<style scoped>
/* Shadcn UI CSS Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 98%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --ring: 212.7 26.8% 83.9%;
}

/* Base styles */
* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Component styles with HSL colors */
.bg-background { background-color: hsl(var(--background)); }
.bg-muted { background-color: hsl(var(--muted)); }
.text-foreground { color: hsl(var(--foreground)); }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
.border-input { border-color: hsl(var(--input)); }
.ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
.focus-visible\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }

/* Hover effects */
.hover\:bg-muted\/50:hover {
  background-color: hsl(var(--muted) / 0.5);
}

/* Additional utility classes */
.inline-flex { display: inline-flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.rounded-md { border-radius: calc(var(--radius) - 2px); }
.rounded-l-md { border-top-left-radius: calc(var(--radius) - 2px); border-bottom-left-radius: calc(var(--radius) - 2px); }
.rounded-r-md { border-top-right-radius: calc(var(--radius) - 2px); border-bottom-right-radius: calc(var(--radius) - 2px); }
.rounded-none { border-radius: 0; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-medium { font-weight: 500; }
.whitespace-nowrap { white-space: nowrap; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-1\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.h-9 { height: 2.25rem; }
.h-10 { height: 2.5rem; }
.h-11 { height: 2.75rem; }
.border { border-width: 1px; }
.border-l-0 { border-left-width: 0; }
.bg-transparent { background-color: transparent; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.cursor-not-allowed { cursor: not-allowed; }
.opacity-50 { opacity: 0.5; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.focus-visible\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
.focus-visible\:ring-2:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus-visible\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
.disabled\:pointer-events-none:disabled { pointer-events: none; }
.disabled\:opacity-50:disabled { opacity: 0.5; }
</style> 