<template>
  <label 
    :for="content.htmlFor"
    :class="labelClasses"
    @click="handleClick"
  >
    <span v-if="content.text">{{ content.text }}</span>
    <slot v-else />
    <span v-if="content.required" class="label-required">*</span>
  </label>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ShadcnLabel',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        text: "Label",
        htmlFor: "",
        required: false,
        size: "default"
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const labelClasses = computed(() => {
      const size = props.content.size || 'default'
      
      const classes = [
        'label-base',
        `label-size-${size}`
      ]
      
      return classes.join(' ')
    })

    const handleClick = (event) => {
      emit('trigger-event', {
        domEvent: event,
        value: {
          text: props.content.text,
          htmlFor: props.content.htmlFor,
          content: props.content
        }
      })
    }

    return {
      labelClasses,
      handleClick
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --foreground: hsl(222.2, 84%, 4.9%);
  --destructive: hsl(0, 84.2%, 60.2%);
}

/* Base Label Styles */
.label-base {
  font-weight: 500;
  line-height: 1;
  color: var(--foreground);
  cursor: pointer;
  user-select: none;
}

/* Sizes */
.label-size-sm {
  font-size: 12px;
}

.label-size-default {
  font-size: 14px;
}

.label-size-lg {
  font-size: 16px;
}

/* Required asterisk */
.label-required {
  color: var(--destructive);
  margin-left: 4px;
  font-weight: 500;
}

/* Peer disabled state (when associated input is disabled) */
.label-base:has(+ input:disabled),
.label-base:has(+ [disabled]) {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>