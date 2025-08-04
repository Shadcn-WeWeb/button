<template>
  <button
    :class="switchClasses"
    :aria-checked="content.checked"
    :disabled="content.disabled"
    :name="content.name"
    :value="content.value"
    role="switch"
    type="button"
    @click="handleToggle"
    @keydown.space.prevent="handleToggle"
    @keydown.enter.prevent="handleToggle"
  >
    <span :class="thumbClasses" />
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ShadcnSwitch',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        checked: false,
        disabled: false,
        size: "default",
        name: "",
        value: "on"
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const switchClasses = computed(() => {
      const size = props.content.size || 'default'
      const checked = props.content.checked
      
      const classes = [
        'switch-base',
        `switch-size-${size}`
      ]
      
      if (checked) {
        classes.push('switch-checked')
      }
      
      if (props.content.disabled) {
        classes.push('switch-disabled')
      }
      
      return classes.join(' ')
    })

    const thumbClasses = computed(() => {
      const size = props.content.size || 'default'
      const checked = props.content.checked
      
      const classes = [
        'switch-thumb',
        `switch-thumb-${size}`
      ]
      
      if (checked) {
        classes.push('switch-thumb-checked')
      }
      
      return classes.join(' ')
    })

    const handleToggle = (event) => {
      if (props.content.disabled) return

      const newValue = !props.content.checked
      
      const eventData = {
        checked: newValue,
        name: props.content.name,
        value: props.content.value,
        content: props.content
      }
      
      emit('trigger-event', { domEvent: event, value: eventData })
    }

    return {
      switchClasses,
      thumbClasses,
      handleToggle
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --primary: hsl(222.2, 47.4%, 11.2%);
  --input: hsl(214.3, 31.8%, 91.4%);
  --background: hsl(0, 0%, 100%);
  --ring: hsl(222.2, 84%, 4.9%);
}

/* Base Switch Styles */
.switch-base {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  border-radius: 9999px;
  border: 2px solid transparent;
  background-color: var(--input);
  transition: background-color 0.2s, border-color 0.2s;
  outline: none;
}

.switch-base:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Sizes */
.switch-size-sm {
  height: 16px;
  width: 28px;
}

.switch-size-default {
  height: 24px;
  width: 44px;
}

.switch-size-lg {
  height: 32px;
  width: 56px;
}

/* Checked state */
.switch-checked {
  background-color: var(--primary);
}

/* Disabled state */
.switch-disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

/* Thumb Styles */
.switch-thumb {
  pointer-events: none;
  display: block;
  border-radius: 9999px;
  background-color: var(--background);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  transform: translateX(0);
}

/* Thumb sizes */
.switch-thumb-sm {
  height: 12px;
  width: 12px;
}

.switch-thumb-default {
  height: 20px;
  width: 20px;
}

.switch-thumb-lg {
  height: 28px;
  width: 28px;
}

/* Thumb checked positions */
.switch-thumb-sm.switch-thumb-checked {
  transform: translateX(12px);
}

.switch-thumb-default.switch-thumb-checked {
  transform: translateX(20px);
}

.switch-thumb-lg.switch-thumb-checked {
  transform: translateX(24px);
}

/* Hover states */
.switch-base:hover:not(.switch-disabled) {
  opacity: 0.9;
}

.switch-base:active:not(.switch-disabled) .switch-thumb {
  transform: scale(0.95);
}

.switch-base:active:not(.switch-disabled).switch-checked .switch-thumb-sm {
  transform: translateX(12px) scale(0.95);
}

.switch-base:active:not(.switch-disabled).switch-checked .switch-thumb-default {
  transform: translateX(20px) scale(0.95);
}

.switch-base:active:not(.switch-disabled).switch-checked .switch-thumb-lg {
  transform: translateX(24px) scale(0.95);
}
</style> 