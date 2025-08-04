<template>
  <div class="ww-badge">
    <div :class="badgeClasses" @click="handleClick">
      <!-- Icon Left -->
      <i 
        v-if="content.showIcon && content.iconPosition === 'left' && content.iconName" 
        :data-lucide="content.iconName" 
        class="ww-badge__icon ww-badge__icon--left"
      ></i>
      
      <!-- Text Content -->
      <span v-if="content.text">
        {{ content.text }}
      </span>
      
      <slot v-else />
      
      <!-- Icon Right -->
      <i 
        v-if="content.showIcon && content.iconPosition === 'right' && content.iconName" 
        :data-lucide="content.iconName" 
        class="ww-badge__icon ww-badge__icon--right"
      ></i>
      
      <!-- Dismiss Button -->
      <button
        v-if="content.dismissible"
        @click="handleDismiss"
        class="ww-badge__dismiss"
        type="button"
        aria-label="Close badge"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnBadge',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        text: "Badge",
        variant: "default",
        size: "default",
        dismissible: false,
        showIcon: false,
        iconName: "star",
        iconPosition: "left"
      })
    },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    badgeClasses() {
      const variant = this.content.variant || 'default'
      const size = this.content.size || 'default'
      
      const classes = [
        'ww-badge__base',
        `ww-badge__base--${variant}`
      ]
      
      if (size !== 'default') {
        classes.push(`ww-badge__base--size-${size}`)
      }
      
      return classes.join(' ')
    }
  },
  mounted() {
    // Load Lucide icons on mount
    if (typeof lucide !== 'undefined') {
      lucide.createIcons()
    } else {
      // Load Lucide if not available
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js'
      script.onload = () => {
        if (typeof lucide !== 'undefined') {
          lucide.createIcons()
        }
      }
      document.head.appendChild(script)
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          text: this.content.text,
          variant: this.content.variant,
          content: this.content
        }
      })
    },
    handleDismiss(event) {
      event.stopPropagation() // Prevent triggering click event
      
      const eventData = {
        text: this.content.text,
        content: this.content
      }
      
      this.$emit('trigger-event', { 
        domEvent: event, 
        value: { event: 'dismiss', ...eventData } 
      })
    }
  }
}
</script>

<style>
/* ===== SHADCN UI CSS VARIABLES ===== */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* Badge base styles */
.ww-badge__base {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  padding: 4px 10px;
}

.ww-badge__base:hover {
  opacity: 0.8;
}

/* Variant styles */
.ww-badge__base--default {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.ww-badge__base--secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.ww-badge__base--destructive {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.ww-badge__base--outline {
  background-color: transparent;
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  padding: 3px 9px;
}

.ww-badge__base--success {
  background-color: hsl(140, 84%, 39%);
  color: hsl(210, 40%, 98%);
}

.ww-badge__base--warning {
  background-color: hsl(38, 92%, 50%);
  color: hsl(25, 95%, 15%);
}

/* Size variants */
.ww-badge__base--size-sm {
  font-size: 11px;
  padding: 2px 6px;
}

.ww-badge__base--size-lg {
  font-size: 13px;
  padding: 6px 12px;
}

/* Adjust outline padding for different sizes */
.ww-badge__base--size-sm.ww-badge__base--outline {
  padding: 1px 5px;
}

.ww-badge__base--size-lg.ww-badge__base--outline {
  padding: 5px 11px;
}

/* Icon styles */
.ww-badge__icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.ww-badge__icon--left {
  margin-right: 4px;
}

.ww-badge__icon--right {
  margin-left: 4px;
}

/* Size-specific icon adjustments */
.ww-badge__base--size-sm .ww-badge__icon {
  width: 10px;
  height: 10px;
}

.ww-badge__base--size-lg .ww-badge__icon {
  width: 14px;
  height: 14px;
}

/* Dismiss button */
.ww-badge__dismiss {
  margin-left: 4px;
  border-radius: 50%;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 1px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease-in-out;
}

.ww-badge__dismiss:hover {
  opacity: 0.7;
  background-color: rgba(255, 255, 255, 0.2);
}

.ww-badge__dismiss:focus {
  outline: 2px solid currentColor;
  outline-offset: 1px;
}

/* Size-specific dismiss button adjustments */
.ww-badge__base--size-sm .ww-badge__dismiss {
  width: 12px;
  height: 12px;
}

.ww-badge__base--size-lg .ww-badge__dismiss {
  width: 16px;
  height: 16px;
}
</style>