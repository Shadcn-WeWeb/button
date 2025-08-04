<template>
  <div 
    :class="cn(
      'space-y-2'
    )"
  >
    <!-- Trigger -->
    <button
      type="button"
      :disabled="content.disabled"
      :class="cn(
        'flex w-full items-center justify-between rounded-md p-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        content.triggerVariant === 'outline' && 'border border-input bg-background',
        content.triggerVariant === 'ghost' && 'hover:bg-accent',
        content.triggerVariant === 'default' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      )"
      @click="toggle($event)"
      :aria-expanded="isOpen"
      :aria-controls="`collapsible-content-${componentId}`"
    >
      <!-- Trigger content -->
      <div class="flex items-center gap-2">
        <!-- Custom trigger icon -->
        <div 
          :class="cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
        
        <!-- Trigger text -->
        <span>{{ content.triggerText || 'Click to expand' }}</span>
      </div>
    </button>

    <!-- Collapsible content -->
    <Transition
      :name="content.animation || 'slide'"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
    >
      <div
        v-show="isOpen"
        :id="`collapsible-content-${componentId}`"
        ref="contentRef"
        :class="cn(
          'overflow-hidden'
        )"
      >
        <div 
          :class="cn(
            'pb-4 pt-0 px-4 rounded-md bg-muted/50'
          )"
        >
          <!-- Default content -->
          <div 
            :class="cn(
              'text-sm text-muted-foreground'
            )"
          >
            {{ content.defaultContent || 'This is the collapsible content.' }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

export default {
  name: 'ShadcnCollapsible',
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

    // Reactive data
    const internalOpen = ref(false)
    const contentRef = ref(null)
    const componentId = ref(`collapsible-${Math.random().toString(36).substr(2, 9)}`)

    // Computed properties
    const isOpen = computed(() => internalOpen.value)

    // Methods
    const toggle = (domEvent) => {
      if (props.content.disabled) return
      
      const newValue = !isOpen.value
      internalOpen.value = newValue
      
      // Emit WeWeb event
      emit('trigger-event', {
        domEvent,
        value: newValue
      })
    }

    // Animation handlers
    const onEnter = (el) => {
      if (props.content.animation === 'slide') {
        el.style.height = '0px'
        el.style.overflow = 'hidden'
        nextTick(() => {
          el.style.height = el.scrollHeight + 'px'
        })
      }
    }

    const onAfterEnter = (el) => {
      if (props.content.animation === 'slide') {
        el.style.height = 'auto'
        el.style.overflow = 'visible'
      }
    }

    const onBeforeLeave = (el) => {
      if (props.content.animation === 'slide') {
        el.style.height = el.scrollHeight + 'px'
        el.style.overflow = 'hidden'
      }
    }

    const onLeave = (el) => {
      if (props.content.animation === 'slide') {
        nextTick(() => {
          el.style.height = '0px'
        })
      }
    }

    // Watchers
    watch(() => props.content.defaultOpen, (newValue) => {
      if (newValue && !isOpen.value) {
        internalOpen.value = true
      }
    }, { immediate: true })

    // Lifecycle
    onMounted(() => {
      if (props.content.defaultOpen) {
        internalOpen.value = true
      }
    })

    return {
      cn,
      isOpen,
      contentRef,
      componentId,
      toggle,
      onEnter,
      onAfterEnter,
      onBeforeLeave,
      onLeave
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
.bg-accent { background-color: hsl(var(--accent)); }
.text-accent-foreground { color: hsl(var(--accent-foreground)); }
.bg-background { background-color: hsl(var(--background)); }
.border-input { border-color: hsl(var(--input)); }
.bg-secondary { background-color: hsl(var(--secondary)); }
.text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
.focus-visible\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }
.hover\:bg-accent:hover { background-color: hsl(var(--accent)); }
.hover\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
.hover\:bg-secondary\/80:hover { background-color: hsl(var(--secondary) / 0.8); }
.bg-muted\/50 { background-color: hsl(var(--muted) / 0.5); }

/* Additional utility classes */
.space-y-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.5rem * var(--tw-space-y-reverse)); }
.flex { display: flex; }
.w-full { width: 100%; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.rounded-md { border-radius: calc(var(--radius) - 2px); }
.p-2 { padding: 0.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.pb-4 { padding-bottom: 1rem; }
.pt-0 { padding-top: 0; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-medium { font-weight: 500; }
.h-4 { height: 1rem; }
.w-4 { width: 1rem; }
.shrink-0 { flex-shrink: 0; }
.overflow-hidden { overflow: hidden; }
.border { border-width: 1px; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.rotate-180 { transform: rotate(180deg); }
.focus-visible\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
.focus-visible\:ring-2:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus-visible\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
.disabled\:pointer-events-none:disabled { pointer-events: none; }
.disabled\:opacity-50:disabled { opacity: 0.5; }

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: height 0.3s ease;
}

/* Scale animation */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style> 