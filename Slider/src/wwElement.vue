<template>
  <div :class="sliderClasses">
    <div 
      ref="sliderRef"
      :class="trackClasses"
      :style="trackStyle"
      role="slider"
      :aria-valuenow="content.value"
      :aria-valuemin="content.min"
      :aria-valuemax="content.max"
      :aria-disabled="content.disabled"
      :tabindex="content.disabled ? -1 : 0"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      @keydown="handleKeyDown"
    >
      <div :class="rangeClasses" :style="rangeStyle" />
      <div :class="thumbClasses" :style="thumbStyle" />
    </div>
    
    <div v-if="content.showValue" class="slider-value">
      {{ content.value }}
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ShadcnSlider',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        orientation: "horizontal",
        size: "default",
        showValue: false,
        name: ""
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const sliderRef = ref(null)
    const isDragging = ref(false)

    const normalizedValue = computed(() => {
      const value = Math.min(Math.max(props.content.value || 0, props.content.min || 0), props.content.max || 100)
      return ((value - (props.content.min || 0)) / ((props.content.max || 100) - (props.content.min || 0))) * 100
    })

    const sliderClasses = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      const size = props.content.size || 'default'
      
      const classes = [
        'slider-base',
        `slider-${orientation}`,
        `slider-size-${size}`
      ]
      
      if (props.content.disabled) {
        classes.push('slider-disabled')
      }
      
      return classes.join(' ')
    })

    const trackClasses = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      
      const classes = [
        'slider-track',
        `slider-track-${orientation}`
      ]
      
      return classes.join(' ')
    })
    
    const trackStyle = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      
      if (orientation === 'vertical') {
        return {
          height: '200px',
          width: 'auto'
        }
      }
      
      return {}
    })

    const rangeClasses = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      
      const classes = [
        'slider-range',
        `slider-range-${orientation}`
      ]
      
      return classes.join(' ')
    })

    const rangeStyle = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      
      if (orientation === 'vertical') {
        return {
          height: `${normalizedValue.value}%`,
          bottom: '0'
        }
      }
      
      return {
        width: `${normalizedValue.value}%`
      }
    })

    const thumbClasses = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      const size = props.content.size || 'default'
      
      const classes = [
        'slider-thumb',
        `slider-thumb-${orientation}`,
        `slider-thumb-${size}`
      ]
      
      if (isDragging.value) {
        classes.push('slider-thumb-dragging')
      }
      
      return classes.join(' ')
    })

    const thumbStyle = computed(() => {
      const orientation = props.content.orientation || 'horizontal'
      
      if (orientation === 'vertical') {
        return {
          bottom: `calc(${normalizedValue.value}% - 10px)`
        }
      }
      
      return {
        left: `calc(${normalizedValue.value}% - 10px)`
      }
    })

    const updateValue = (clientX, clientY) => {
      if (!sliderRef.value || props.content.disabled) return

      const rect = sliderRef.value.getBoundingClientRect()
      const orientation = props.content.orientation || 'horizontal'
      
      let percentage
      
      if (orientation === 'vertical') {
        percentage = 1 - Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1)
      } else {
        percentage = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
      }
      
      const min = props.content.min || 0
      const max = props.content.max || 100
      const step = props.content.step || 1
      
      const rawValue = min + percentage * (max - min)
      const steppedValue = Math.round(rawValue / step) * step
      const clampedValue = Math.min(Math.max(steppedValue, min), max)

      const eventData = {
        value: clampedValue,
        min,
        max,
        step,
        content: props.content
      }
      
      emit('trigger-event', { domEvent: event, value: eventData })
    }

    const handleMouseDown = (event) => {
      if (props.content.disabled) return
      
      isDragging.value = true
      updateValue(event.clientX, event.clientY)
    }

    const handleTouchStart = (event) => {
      if (props.content.disabled) return
      
      isDragging.value = true
      const touch = event.touches[0]
      updateValue(touch.clientX, touch.clientY)
    }

    const handleMouseMove = (event) => {
      if (isDragging.value) {
        updateValue(event.clientX, event.clientY)
      }
    }

    const handleTouchMove = (event) => {
      if (isDragging.value) {
        const touch = event.touches[0]
        updateValue(touch.clientX, touch.clientY)
      }
    }

    const handleEnd = () => {
      isDragging.value = false
    }

    const handleKeyDown = (event) => {
      if (props.content.disabled) return

      const currentValue = props.content.value || 0
      const min = props.content.min || 0
      const max = props.content.max || 100
      const step = props.content.step || 1
      
      let newValue = currentValue

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(currentValue - step, min)
          break
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(currentValue + step, max)
          break
        case 'Home':
          newValue = min
          break
        case 'End':
          newValue = max
          break
        default:
          return
      }

      event.preventDefault()
      
      const eventData = {
        value: newValue,
        min,
        max,
        step,
        content: props.content
      }
      
      emit('trigger-event', { domEvent: event, value: eventData })
    }

    onMounted(() => {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleEnd)
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    })

    return {
      sliderRef,
      sliderClasses,
      trackClasses,
      trackStyle,
      rangeClasses,
      rangeStyle,
      thumbClasses,
      thumbStyle,
      handleMouseDown,
      handleTouchStart,
      handleKeyDown
    }
  }
}
</script>

<style scoped>
/* Variables CSS Shadcn/UI */
:root {
  --primary: hsl(222.2, 47.4%, 11.2%);
  --secondary: hsl(210, 40%, 96%);
  --background: hsl(0, 0%, 100%);
  --ring: hsl(222.2, 84%, 4.9%);
}

/* Base Slider Styles */
.slider-base {
  position: relative;
  display: flex;
  align-items: center;
  touch-action: none;
  user-select: none;
}

.slider-horizontal {
  width: 100%;
  height: 20px;
}

.slider-vertical {
  height: 200px;
  width: 20px;
  flex-direction: column;
}

/* Size variants */
.slider-size-sm {
  height: 16px;
}

.slider-size-default {
  height: 20px;
}

.slider-size-lg {
  height: 24px;
}

.slider-vertical.slider-size-sm {
  width: 16px;
  height: 200px;
}

.slider-vertical.slider-size-default {
  width: 20px;
  height: 200px;
}

.slider-vertical.slider-size-lg {
  width: 24px;
  height: 200px;
}

/* Track Styles */
.slider-track {
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  background-color: var(--secondary);
  cursor: pointer;
}

.slider-track-horizontal {
  height: 8px;
  width: 100%;
}

.slider-track-vertical {
  width: 8px;
  height: 100%;
}

/* Range Styles */
.slider-range {
  position: absolute;
  background-color: var(--primary);
  border-radius: 9999px;
}

.slider-range-horizontal {
  height: 100%;
  left: 0;
  top: 0;
}

.slider-range-vertical {
  width: 100%;
  left: 0;
}

/* Thumb Styles */
.slider-thumb {
  position: absolute;
  display: block;
  border-radius: 50%;
  border: 2px solid var(--primary);
  background-color: var(--background);
  transition: all 0.2s;
  cursor: grab;
  outline: none;
}

.slider-thumb:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.slider-thumb-dragging {
  cursor: grabbing;
  transform: scale(1.1);
}

/* Thumb sizes */
.slider-thumb-sm {
  height: 16px;
  width: 16px;
}

.slider-thumb-default {
  height: 20px;
  width: 20px;
}

.slider-thumb-lg {
  height: 24px;
  width: 24px;
}

/* Thumb positioning */
.slider-thumb-horizontal {
  top: 50%;
  transform: translateY(-50%);
}

.slider-thumb-vertical {
  left: 50%;
  transform: translateX(-50%);
}

/* Disabled state */
.slider-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.slider-disabled .slider-track {
  cursor: not-allowed;
}

.slider-disabled .slider-thumb {
  cursor: not-allowed;
}

/* Value display */
.slider-value {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: var(--primary);
}

.slider-vertical + .slider-value {
  margin-top: 0;
  margin-left: 8px;
}

/* Hover states */
.slider-base:hover:not(.slider-disabled) .slider-thumb {
  transform: scale(1.05);
}

.slider-thumb-horizontal:hover {
  transform: translateY(-50%) scale(1.05);
}

.slider-thumb-vertical:hover {
  transform: translateX(-50%) scale(1.05);
}
</style> 