<template>
  <div 
    role="radiogroup"
    :class="cn('grid gap-2', content.orientation === 'horizontal' && 'grid-flow-col auto-cols-max')"
  >
    <div 
      v-for="(option, index) in (content.options || [])"
      :key="getOptionKey(option, index)"
      class="flex items-center space-x-2"
    >
      <button
        :id="`radio-${option.value || index}`"
        role="radio"
        type="button"
        :aria-checked="isSelected(option)"
        :disabled="content.disabled || option.disabled"
        @click="selectOption(option, $event)"
        @keydown="handleKeyDown($event, index)"
        :class="cn(
          'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          isSelected(option) && 'bg-primary border-primary',
          content.size === 'sm' && 'h-3 w-3',
          content.size === 'lg' && 'h-5 w-5'
        )"
      >
        <!-- Inner circle for selected state -->
        <div
          v-if="isSelected(option)"
          :class="cn(
            'flex items-center justify-center',
            'h-full w-full'
          )"
        >
          <div 
            :class="cn(
              'h-2.5 w-2.5 rounded-full bg-current',
              content.size === 'sm' && 'h-1.5 w-1.5',
              content.size === 'lg' && 'h-3 w-3'
            )"
          />
        </div>
      </button>
      
      <label
        :for="`radio-${option.value || index}`"
        :class="cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
          content.disabled || option.disabled && 'cursor-not-allowed opacity-70'
        )"
        @click="!content.disabled && !option.disabled && selectOption(option, $event)"
      >
        {{ getDisplayValue(option) }}
      </label>
      
      <!-- Description for option -->
      <div 
        v-if="getOptionDescription(option)"
        :class="cn(
          'text-sm text-muted-foreground'
        )"
      >
        {{ getOptionDescription(option) }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'ShadcnRadioGroup',
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

    const selectedValue = ref(props.content.defaultValue || null)

    // Computed properties
    const options = computed(() => props.content.options || [])

    // Helper functions
    const getDisplayValue = (option) => {
      if (typeof option === 'object') {
        return option.label || option.value || ''
      }
      return String(option)
    }

    const getOptionValue = (option) => {
      if (typeof option === 'object') {
        return option.value
      }
      return option
    }

    const getOptionKey = (option, index) => {
      return getOptionValue(option) || index
    }

    const getOptionDescription = (option) => {
      if (typeof option === 'object') {
        return option.description || ''
      }
      return ''
    }

    const isSelected = (option) => {
      const optionValue = getOptionValue(option)
      return optionValue === selectedValue.value
    }

    // Methods
    const selectOption = (option, domEvent) => {
      if (props.content.disabled || option.disabled) return
      
      const value = getOptionValue(option)
      selectedValue.value = value
      
      // Emit WeWeb event
      emit('trigger-event', {
        domEvent,
        value: value
      })
    }

    const handleKeyDown = (event, currentIndex) => {
      if (props.content.disabled) return
      
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          navigateToOption(currentIndex + 1)
          break
          
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          navigateToOption(currentIndex - 1)
          break
          
        case 'Home':
          event.preventDefault()
          navigateToOption(0)
          break
          
        case 'End':
          event.preventDefault()
          navigateToOption(options.value.length - 1)
          break
          
        case ' ':
        case 'Enter':
          event.preventDefault()
          selectOption(options.value[currentIndex], event)
          break
      }
    }

    const navigateToOption = (targetIndex) => {
      const availableOptions = options.value.filter(option => !option.disabled)
      if (availableOptions.length === 0) return
      
      let newIndex = targetIndex
      
      // Wrap around if necessary
      if (newIndex >= options.value.length) {
        newIndex = 0
      } else if (newIndex < 0) {
        newIndex = options.value.length - 1
      }
      
      // Skip disabled options
      while (options.value[newIndex]?.disabled && newIndex !== targetIndex) {
        newIndex = newIndex + 1 >= options.value.length ? 0 : newIndex + 1
      }
      
      // Focus the new option
      const radioElement = document.getElementById(`radio-${getOptionValue(options.value[newIndex]) || newIndex}`)
      if (radioElement) {
        radioElement.focus()
      }
    }

    return {
      cn,
      selectedValue,
      options,
      getDisplayValue,
      getOptionValue,
      getOptionKey,
      getOptionDescription,
      isSelected,
      selectOption,
      handleKeyDown
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
.border-primary { border-color: hsl(var(--primary)); }
.text-primary { color: hsl(var(--primary)); }
.bg-primary { background-color: hsl(var(--primary)); }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
.ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
.focus-visible\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }
.bg-current { background-color: currentColor; }

/* Additional utility classes */
.grid { display: grid; }
.gap-2 { gap: 0.5rem; }
.grid-flow-col { grid-auto-flow: column; }
.auto-cols-max { grid-auto-columns: max-content; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.space-x-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(0.5rem * var(--tw-space-x-reverse)); margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse))); }
.aspect-square { aspect-ratio: 1 / 1; }
.h-4 { height: 1rem; }
.w-4 { width: 1rem; }
.h-3 { height: 0.75rem; }
.w-3 { width: 0.75rem; }
.h-5 { height: 1.25rem; }
.w-5 { width: 1.25rem; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.h-2\.5 { height: 0.625rem; }
.w-2\.5 { width: 0.625rem; }
.h-1\.5 { height: 0.375rem; }
.w-1\.5 { width: 0.375rem; }
.rounded-full { border-radius: 9999px; }
.border { border-width: 1px; }
.focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus-visible\:ring-2:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus-visible\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
.disabled\:opacity-50:disabled { opacity: 0.5; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-medium { font-weight: 500; }
.leading-none { line-height: 1; }
.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }
.opacity-70 { opacity: 0.7; }
.peer-disabled\:cursor-not-allowed:disabled ~ * { cursor: not-allowed; }
.peer-disabled\:opacity-70:disabled ~ * { opacity: 0.7; }
</style> 