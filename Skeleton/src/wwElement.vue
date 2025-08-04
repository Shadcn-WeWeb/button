<template>
  <div :class="skeletonClasses" :style="skeletonStyle" />
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ShadcnSkeleton',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        variant: "default",
        width: "100%",
        height: "20px",
        animated: true,
        borderRadius: "4px"
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  setup(props) {
    const skeletonClasses = computed(() => {
      const variant = props.content.variant || 'default'
      const animated = props.content.animated !== false
      
      const classes = ['skeleton-base']
      
      if (animated) {
        classes.push('skeleton-animated')
      }
      
      // Variant-specific classes
      switch (variant) {
        case 'circle':
          classes.push('skeleton-circle')
          break
        case 'text':
          classes.push('skeleton-text')
          break
        case 'button':
          classes.push('skeleton-button')
          break
        case 'card':
          classes.push('skeleton-card')
          break
        default:
          classes.push('skeleton-default')
      }
      
      return classes.join(' ')
    })
    
    const skeletonStyle = computed(() => {
      const style = {}
      
      if (props.content.width) {
        style.width = props.content.width
      }
      
      if (props.content.height) {
        style.height = props.content.height
      }
      
      if (props.content.borderRadius && props.content.variant !== 'circle') {
        style.borderRadius = props.content.borderRadius
      }
      
      return style
    })

    return {
      skeletonClasses,
      skeletonStyle
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --muted: hsl(210, 40%, 96%);
}

/* Base Skeleton Styles */
.skeleton-base {
  background-color: var(--muted);
  position: relative;
  overflow: hidden;
}

/* Animation */
.skeleton-animated {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shimmer effect for more sophisticated animation */
.skeleton-animated::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Variant Styles */
.skeleton-default {
  border-radius: 4px;
}

.skeleton-circle {
  border-radius: 50%;
  aspect-ratio: 1;
}

.skeleton-text {
  height: 1em;
  border-radius: 2px;
}

.skeleton-button {
  height: 40px;
  border-radius: 6px;
}

.skeleton-card {
  height: 200px;
  border-radius: 8px;
}

/* Responsive adjustments */
@media (prefers-reduced-motion: reduce) {
  .skeleton-animated {
    animation: none;
  }
  
  .skeleton-animated::after {
    animation: none;
  }
}
</style> 