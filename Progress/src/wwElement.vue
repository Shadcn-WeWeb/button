<template>
  <div :class="progressClasses" role="progressbar" :aria-valuenow="content.value" :aria-valuemax="content.max">
    <div 
      :class="indicatorClasses"
      :style="indicatorStyle"
    />
    
    <div v-if="content.showValue" class="progress-value">
      {{ Math.round(progressPercentage) }}%
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ShadcnProgress',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        value: 0,
        max: 100,
        size: "default",
        showValue: false,
        animated: true
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  setup(props) {
    const progressPercentage = computed(() => {
      const value = Math.min(Math.max(props.content.value || 0, 0), props.content.max || 100)
      return (value / (props.content.max || 100)) * 100
    })

    const progressClasses = computed(() => {
      const size = props.content.size || 'default'
      const animated = props.content.animated !== false
      
      const classes = [
        'progress-base',
        `progress-size-${size}`
      ]
      
      if (animated) {
        classes.push('progress-animated')
      }
      
      return classes.join(' ')
    })

    const indicatorClasses = computed(() => {
      const classes = ['progress-indicator']
      
      if (props.content.animated !== false) {
        classes.push('progress-indicator-animated')
      }
      
      return classes.join(' ')
    })

    const indicatorStyle = computed(() => ({
      transform: `translateX(-${100 - progressPercentage.value}%)`
    }))

    return {
      progressPercentage,
      progressClasses,
      indicatorClasses,
      indicatorStyle
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --primary: hsl(222.2, 47.4%, 11.2%);
  --secondary: hsl(210, 40%, 96%);
  --muted: hsl(210, 40%, 96%);
  --muted-foreground: hsl(215.4, 16.3%, 46.9%);
}

/* Base Progress Styles */
.progress-base {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background-color: var(--secondary);
}

/* Sizes */
.progress-size-sm {
  height: 8px;
}

.progress-size-default {
  height: 16px;
}

.progress-size-lg {
  height: 24px;
}

/* Progress Indicator */
.progress-indicator {
  height: 100%;
  width: 100%;
  flex: 1 1 0%;
  background-color: var(--primary);
  transition: transform 0.3s ease-in-out;
}

.progress-indicator-animated {
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

/* Progress Value Display */
.progress-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-foreground);
  text-align: center;
  pointer-events: none;
}

/* Progress sizes for value display */
.progress-size-sm .progress-value {
  font-size: 9px;
}

.progress-size-lg .progress-value {
  font-size: 12px;
}

/* Accessibility */
.progress-base:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style> 