<template>
  <div class="dropdown-menu-root">
    <!-- Dropdown Trigger -->
    <div
      ref="triggerRef"
      @click="toggleDropdown"
      @keydown="handleTriggerKeyDown"
      :class="['dropdown-menu-trigger-wrapper', content.triggerClass]"
      :tabindex="content.disabled ? -1 : 0"
    >
      <slot name="trigger">
        <button
          type="button"
          :disabled="content.disabled"
          class="dropdown-menu-trigger"
        >
          {{ content.triggerText || 'Open Menu' }}
          <svg class="dropdown-menu-trigger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </slot>
    </div>

    <!-- Dropdown Content -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        role="menu"
        :aria-orientation="'vertical'"
        :style="menuStyles"
        @click.stop
        @keydown="handleMenuKeyDown"
        :class="[
          'dropdown-menu-content',
          placementClasses,
          {
            'dropdown-menu-content-sm': content.size === 'sm',
            'dropdown-menu-content-lg': content.size === 'lg'
          },
          content.contentClass
        ]"
      >
        <!-- Menu Items -->
        <div
          v-for="(item, index) in menuItems"
          :key="item.id || index"
          role="menuitem"
          :tabindex="item.disabled ? -1 : 0"
          @click="handleItemClick(item, index)"
          @mouseenter="highlightedIndex = index"
          @keydown="handleItemKeyDown($event, item, index)"
          :class="[
            'dropdown-menu-item',
            {
              'dropdown-menu-item-highlighted': highlightedIndex === index,
              'dropdown-menu-item-disabled': item.disabled,
              'dropdown-menu-item-destructive': item.variant === 'destructive',
              'dropdown-menu-separator': item.type === 'separator'
            },
            item.customClass
          ]"
        >
          <!-- Separator -->
          <template v-if="item.type === 'separator'">
            <div class="dropdown-menu-separator-line"></div>
          </template>

          <!-- Regular Item -->
          <template v-else>
            <!-- Icon -->
            <span v-if="item.icon" class="dropdown-menu-item-icon">
              <svg v-if="item.icon === 'check'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else-if="item.icon === 'edit'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <svg v-else-if="item.icon === 'delete'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14H6L5 6m5 0V4a2 2 0 012-2h0a2 2 0 012 2v2"></path>
              </svg>
              <svg v-else-if="item.icon === 'copy'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
              </svg>
              <svg v-else-if="item.icon === 'settings'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
              </svg>
              <span v-else v-html="item.icon"></span>
            </span>

            <!-- Label -->
            <span class="dropdown-menu-item-label">{{ item.label }}</span>

            <!-- Shortcut -->
            <span v-if="item.shortcut" class="dropdown-menu-item-shortcut">
              {{ item.shortcut }}
            </span>

            <!-- Checkbox -->
            <span v-if="item.type === 'checkbox'" class="dropdown-menu-checkbox">
              <svg v-if="item.checked" class="dropdown-menu-checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>

            <!-- Radio -->
            <span v-if="item.type === 'radio'" class="dropdown-menu-radio">
              <div v-if="item.checked" class="dropdown-menu-radio-indicator"></div>
            </span>

            <!-- Submenu arrow -->
            <span v-if="item.submenu" class="dropdown-menu-submenu-icon">
              <svg class="dropdown-menu-submenu-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </template>
        </div>

        <!-- Empty state -->
        <div
          v-if="menuItems.length === 0"
          class="dropdown-menu-empty"
        >
          {{ content.emptyText || 'No items' }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.modelValue,
      menuStyles: {},
      highlightedIndex: -1
    }
  },
  computed: {
    placement() {
      return this.content.placement || 'bottom-start'
    },
    
    placementClasses() {
      const classes = {
        'bottom-start': 'data-[side=bottom]:slide-in-from-top-2',
        'bottom-end': 'data-[side=bottom]:slide-in-from-top-2',
        'top-start': 'data-[side=top]:slide-in-from-bottom-2',
        'top-end': 'data-[side=top]:slide-in-from-bottom-2',
        'right-start': 'data-[side=right]:slide-in-from-left-2',
        'left-start': 'data-[side=left]:slide-in-from-right-2'
      }
      return classes[this.placement] || classes['bottom-start']
    },

    menuItems() {
      return this.content.items || []
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue !== this.isOpen) {
        if (newValue) {
          this.openDropdown()
        } else {
          this.closeDropdown()
        }
      }
    }
  },
  methods: {
    // Import utility function
    cn(...inputs) {
      return inputs.filter(Boolean).join(' ')
    },

    toggleDropdown() {
      if (this.content.disabled) return
      
      if (this.isOpen) {
        this.closeDropdown()
      } else {
        this.openDropdown()
      }
    },

    async openDropdown() {
      if (this.content.disabled) return
      
      this.isOpen = true
      this.$emit('update:modelValue', true)
      this.$emit('open')
      
      await this.$nextTick()
      this.updatePosition()
      
      // Focus first item
      this.highlightedIndex = this.findNextEnabledItem(-1)
    },

    closeDropdown() {
      this.isOpen = false
      this.$emit('update:modelValue', false)
      this.$emit('close')
      
      this.highlightedIndex = -1
      if (this.$refs.triggerRef) {
        this.$refs.triggerRef.focus()
      }
    },

    handleItemClick(item, index) {
      if (item.disabled || item.type === 'separator') return
      
      this.$emit('itemClick', { item, index })
      
      // Handle checkbox/radio state
      if (item.type === 'checkbox') {
        item.checked = !item.checked
      } else if (item.type === 'radio') {
        // Uncheck other radio items in the same group
        this.menuItems.forEach(menuItem => {
          if (menuItem.type === 'radio' && menuItem.group === item.group) {
            menuItem.checked = false
          }
        })
        item.checked = true
      }
      
      if (this.content.closeOnClick !== false && item.type !== 'checkbox' && item.type !== 'radio') {
        this.closeDropdown()
      }
    },

    handleTriggerKeyDown(event) {
      if (this.content.disabled) return
      
      switch (event.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          event.preventDefault()
          this.openDropdown()
          break
          
        case 'Escape':
          this.closeDropdown()
          break
      }
    },

    handleMenuKeyDown(event) {
      switch (event.key) {
        case 'Escape':
          this.closeDropdown()
          break
          
        case 'ArrowDown':
          event.preventDefault()
          this.highlightedIndex = this.findNextEnabledItem(this.highlightedIndex)
          break
          
        case 'ArrowUp':
          event.preventDefault()
          this.highlightedIndex = this.findPrevEnabledItem(this.highlightedIndex)
          break
          
        case 'Home':
          event.preventDefault()
          this.highlightedIndex = this.findNextEnabledItem(-1)
          break
          
        case 'End':
          event.preventDefault()
          this.highlightedIndex = this.findPrevEnabledItem(this.menuItems.length)
          break
      }
    },

    handleItemKeyDown(event, item, index) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.handleItemClick(item, index)
      }
    },

    findNextEnabledItem(currentIndex) {
      for (let i = currentIndex + 1; i < this.menuItems.length; i++) {
        if (!this.menuItems[i].disabled && this.menuItems[i].type !== 'separator') {
          return i
        }
      }
      // Wrap around
      for (let i = 0; i <= currentIndex; i++) {
        if (!this.menuItems[i].disabled && this.menuItems[i].type !== 'separator') {
          return i
        }
      }
      return -1
    },

    findPrevEnabledItem(currentIndex) {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (!this.menuItems[i].disabled && this.menuItems[i].type !== 'separator') {
          return i
        }
      }
      // Wrap around
      for (let i = this.menuItems.length - 1; i >= currentIndex; i--) {
        if (!this.menuItems[i].disabled && this.menuItems[i].type !== 'separator') {
          return i
        }
      }
      return -1
    },

    updatePosition() {
      if (!this.$refs.triggerRef || !this.$refs.menuRef) return
      
      const triggerRect = this.$refs.triggerRef.getBoundingClientRect()
      const menuRect = this.$refs.menuRef.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const offset = this.content.offset || 4
      let top, left
      
      // Calculate position based on placement
      switch (this.placement) {
        case 'bottom-start':
          top = triggerRect.bottom + offset + window.scrollY
          left = triggerRect.left + window.scrollX
          break
          
        case 'bottom-end':
          top = triggerRect.bottom + offset + window.scrollY
          left = triggerRect.right - menuRect.width + window.scrollX
          break
          
        case 'top-start':
          top = triggerRect.top - menuRect.height - offset + window.scrollY
          left = triggerRect.left + window.scrollX
          break
          
        case 'top-end':
          top = triggerRect.top - menuRect.height - offset + window.scrollY
          left = triggerRect.right - menuRect.width + window.scrollX
          break
          
        case 'right-start':
          top = triggerRect.top + window.scrollY
          left = triggerRect.right + offset + window.scrollX
          break
          
        case 'left-start':
          top = triggerRect.top + window.scrollY
          left = triggerRect.left - menuRect.width - offset + window.scrollX
          break
          
        default:
          top = triggerRect.bottom + offset + window.scrollY
          left = triggerRect.left + window.scrollX
      }
      
      // Adjust for viewport boundaries
      if (left < 8) {
        left = 8
      } else if (left + menuRect.width > viewportWidth - 8) {
        left = viewportWidth - menuRect.width - 8
      }
      
      if (top < 8) {
        top = 8
      } else if (top + menuRect.height > viewportHeight + window.scrollY - 8) {
        top = viewportHeight + window.scrollY - menuRect.height - 8
      }
      
      this.menuStyles = {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 50
      }
    },

    handleOutsideClick(event) {
      if (!this.$refs.triggerRef?.contains(event.target) && !this.$refs.menuRef?.contains(event.target)) {
        this.closeDropdown()
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('resize', this.updatePosition)
    window.addEventListener('scroll', this.updatePosition)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('resize', this.updatePosition)
    window.removeEventListener('scroll', this.updatePosition)
  }
}
</script>

<style>
/* Shadcn UI variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
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
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* Dropdown Menu Styles */
.dropdown-menu-root {
  position: relative;
}

.dropdown-menu-trigger-wrapper {
  display: inline-block;
}

.dropdown-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
  outline: none;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  height: 2.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-menu-trigger:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.dropdown-menu-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--background));
}

.dropdown-menu-trigger:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dropdown-menu-trigger-icon {
  margin-left: 0.5rem;
  height: 1rem;
  width: 1rem;
}

.dropdown-menu-content {
  position: absolute;
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  animation: slideInAndFade 0.2s ease-out;
}

.dropdown-menu-content-sm {
  min-width: 6rem;
  font-size: 0.75rem;
}

.dropdown-menu-content-lg {
  min-width: 12rem;
}

.dropdown-menu-item {
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: colors 0.2s;
  color: hsl(var(--foreground));
}

.dropdown-menu-item:focus {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.dropdown-menu-item:hover:not(.dropdown-menu-item-disabled):not(.dropdown-menu-separator) {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.dropdown-menu-item-highlighted {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.dropdown-menu-item-disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dropdown-menu-item-destructive {
  color: hsl(var(--destructive));
}

.dropdown-menu-item-destructive:focus,
.dropdown-menu-item-destructive:hover {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.dropdown-menu-separator {
  height: 1px;
  background-color: hsl(var(--border));
  margin: 0.25rem 0;
  cursor: default;
  pointer-events: none;
}

.dropdown-menu-separator-line {
  height: 1px;
  background-color: hsl(var(--border));
  width: 100%;
}

.dropdown-menu-item-icon {
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

.dropdown-menu-item-label {
  flex: 1 1 0%;
}

.dropdown-menu-item-shortcut {
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.dropdown-menu-checkbox,
.dropdown-menu-radio {
  margin-left: auto;
}

.dropdown-menu-checkbox-icon {
  height: 1rem;
  width: 1rem;
}

.dropdown-menu-radio-indicator {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background-color: currentColor;
}

.dropdown-menu-submenu-icon {
  margin-left: auto;
}

.dropdown-menu-submenu-chevron {
  height: 1rem;
  width: 1rem;
}

.dropdown-menu-empty {
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

/* Placement classes */
.data-\[side\=bottom\]\:slide-in-from-top-2 {
  animation: slideInFromTop 0.2s ease-out;
}

.data-\[side\=top\]\:slide-in-from-bottom-2 {
  animation: slideInFromBottom 0.2s ease-out;
}

.data-\[side\=left\]\:slide-in-from-right-2 {
  animation: slideInFromRight 0.2s ease-out;
}

.data-\[side\=right\]\:slide-in-from-left-2 {
  animation: slideInFromLeft 0.2s ease-out;
}

/* Animations */
@keyframes slideInAndFade {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style> 