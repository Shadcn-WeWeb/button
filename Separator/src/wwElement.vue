<template>
  <div
    :class="separatorClasses"
    role="separator"
    :aria-orientation="content.orientation"
  />
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ShadcnSeparator',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        orientation: "horizontal"
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  setup(props) {
    const separatorClasses = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      
      const classes = [
        'separator-base',
        `separator-${orientation}`
      ]
      
      return classes.join(' ')
    })

    return {
      separatorClasses
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --border: hsl(214.3, 31.8%, 91.4%);
}

/* Base Separator Styles */
.separator-base {
  flex-shrink: 0;
  background-color: var(--border);
}

/* Horizontal separator */
.separator-horizontal {
  height: 1px;
  width: 100%;
}

/* Vertical separator */
.separator-vertical {
  width: 1px;
  height: 100%;
  min-height: 20px;
}
</style>