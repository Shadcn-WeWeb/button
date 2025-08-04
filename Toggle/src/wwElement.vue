<template>
  <button
    :class="toggleClasses"
    :aria-pressed="content.pressed"
    :disabled="content.disabled"
    type="button"
    @click="handleToggle"
  >
    <span v-if="content.text">{{ content.text }}</span>
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ShadcnToggle',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        pressed: false,
        disabled: false,
        text: "Toggle",
        variant: "default",
        size: "default"
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const toggleClasses = computed(() => {
      const variant = props.content.variant || 'default'
      const size = props.content.size || 'default'
      
      const classes = [
        'toggle-base',
        `toggle-variant-${variant}`,
        `toggle-size-${size}`
      ]
      
      if (props.content.pressed) {
        classes.push('toggle-pressed')
      }
      
      if (props.content.disabled) {
        classes.push('toggle-disabled')
      }
      
      return classes.join(' ')
    })

    const handleToggle = (event) => {
      if (props.content.disabled) return

      const newValue = !props.content.pressed
      
      const eventData = {
        pressed: newValue,
        text: props.content.text,
        content: props.content
      }
      
      emit('trigger-event', { domEvent: event, value: eventData })
    }

    return {
      toggleClasses,
      handleToggle
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(222.2, 84%, 4.9%);
  --muted: hsl(210, 40%, 96%);
  --muted-foreground: hsl(215.4, 16.3%, 46.9%);
  --accent: hsl(210, 40%, 96%);
  --accent-foreground: hsl(222.2, 84%, 4.9%);
  --border: hsl(214.3, 31.8%, 91.4%);
  --input: hsl(214.3, 31.8%, 91.4%);
  --ring: hsl(222.2, 84%, 4.9%);
}

/* Base Toggle Styles */
.toggle-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  outline: none;
  border: none;
}

.toggle-base:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Variants */
.toggle-variant-default {
  background-color: transparent;
  color: var(--foreground);
}

.toggle-variant-default:hover:not(.toggle-disabled) {
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.toggle-variant-default.toggle-pressed {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.toggle-variant-outline {
  border: 1px solid var(--input);
  background-color: transparent;
  color: var(--foreground);
}

.toggle-variant-outline:hover:not(.toggle-disabled) {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.toggle-variant-outline.toggle-pressed {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

/* Sizes */
.toggle-size-sm {
  height: 36px;
  padding: 0 10px;
  font-size: 13px;
}

.toggle-size-default {
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
}

.toggle-size-lg {
  height: 44px;
  padding: 0 20px;
  font-size: 16px;
}

/* States */
.toggle-disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

/* Pressed state visual feedback */
.toggle-pressed {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Active state */
.toggle-base:active:not(.toggle-disabled) {
  transform: scale(0.98);
}
</style>