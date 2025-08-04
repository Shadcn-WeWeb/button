<template>
  <div ref="triggerRef" @contextmenu="handleRightClick" :class="content.customClass" :style="content.customStyle">
    <slot>
      <div class="context-menu-trigger">
        {{ content.triggerText || 'Right click here' }}
      </div>
    </slot>

    <!-- Context Menu -->
    <teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="context-menu-content"
        :style="menuStyle"
        @keydown="handleKeyDown"
        tabindex="0"
        role="menu"
        @blur="handleBlur"
      >
        <div
          v-for="(item, index) in content.items"
          :key="item.id || index"
          :class="[
            { 'context-menu-separator': item.type === 'separator' }
          ]"
        >
          <!-- Separator -->
          <div v-if="item.type === 'separator'" role="separator" />
          
          <!-- Sub-menu item -->
          <div
            v-else-if="item.items && item.items.length > 0"
            class="context-menu-submenu-container"
            @mouseenter="handleSubMenuEnter(index)"
            @mouseleave="handleSubMenuLeave"
          >
            <button
              :class="[
                'context-menu-item',
                'context-menu-submenu-trigger',
                {
                  'context-menu-item-selected': selectedIndex === index,
                  'context-menu-item-disabled': item.disabled
                }
              ]"
              @click="handleItemClick(item, index)"
              :disabled="item.disabled"
              role="menuitem"
              :aria-haspopup="true"
              :aria-expanded="activeSubMenuIndex === index"
            >
              <component
                v-if="item.icon"
                :is="item.icon"
                class="context-menu-icon"
              />
              <span class="context-menu-label">{{ item.label }}</span>
              <span v-if="item.shortcut" class="context-menu-shortcut">
                {{ item.shortcut }}
              </span>
              <svg class="context-menu-submenu-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Sub-menu -->
            <div
              v-if="activeSubMenuIndex === index"
              class="context-menu-submenu"
              role="menu"
            >
              <button
                v-for="(subItem, subIndex) in item.items"
                :key="subItem.id || subIndex"
                :class="[
                  'context-menu-item',
                  {
                    'context-menu-item-disabled': subItem.disabled
                  }
                ]"
                @click="handleItemClick(subItem, index, subIndex)"
                :disabled="subItem.disabled"
                role="menuitem"
              >
                <component
                  v-if="subItem.icon"
                  :is="subItem.icon"
                  class="context-menu-icon"
                />
                <span class="context-menu-label">{{ subItem.label }}</span>
                <span v-if="subItem.shortcut" class="context-menu-shortcut">
                  {{ subItem.shortcut }}
                </span>
                <svg
                  v-if="subItem.type === 'checkbox' && subItem.checked"
                  class="context-menu-checkbox"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Regular menu item -->
          <button
            v-else
            :class="[
              'context-menu-item',
              {
                'context-menu-item-selected': selectedIndex === index,
                'context-menu-item-disabled': item.disabled
              }
            ]"
            @click="handleItemClick(item, index)"
            :disabled="item.disabled"
            role="menuitem"
            :aria-checked="item.type === 'checkbox' ? item.checked : undefined"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              class="mr-2 h-4 w-4"
            />
            <span class="context-menu-label">{{ item.label }}</span>
            <span v-if="item.shortcut" class="context-menu-shortcut">
              {{ item.shortcut }}
            </span>
            <svg
              v-if="item.type === 'checkbox' && item.checked"
              class="context-menu-checkbox"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isOpen: false,
      selectedIndex: 0,
      activeSubMenuIndex: -1,
      menuPosition: { x: 0, y: 0 }
    }
  },
  computed: {
    menuStyle() {
      return {
        left: `${this.menuPosition.x}px`,
        top: `${this.menuPosition.y}px`
      }
    }
  },
  methods: {
    // Import utility function
    cn(...inputs) {
      return inputs.filter(Boolean).join(' ')
    },

    handleRightClick(event) {
      event.preventDefault()
      
      if (this.isOpen) {
        this.closeMenu()
        return
      }

      // Calculate menu position
      const x = event.clientX
      const y = event.clientY
      
      // Ensure menu doesn't go off screen
      this.$nextTick(() => {
        if (this.$refs.menuRef) {
          const menuRect = this.$refs.menuRef.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          
          let adjustedX = x
          let adjustedY = y
          
          // Adjust horizontal position
          if (x + menuRect.width > viewportWidth) {
            adjustedX = viewportWidth - menuRect.width - 10
          }
          
          // Adjust vertical position
          if (y + menuRect.height > viewportHeight) {
            adjustedY = viewportHeight - menuRect.height - 10
          }
          
          this.menuPosition = { x: adjustedX, y: adjustedY }
        }
      })
      
      this.menuPosition = { x, y }
      this.isOpen = true
      this.selectedIndex = 0
      this.activeSubMenuIndex = -1
      
      this.$emit('open', { x, y })
      
      // Focus menu for keyboard navigation
      this.$nextTick(() => {
        if (this.$refs.menuRef) {
          this.$refs.menuRef.focus()
        }
      })
    },

    closeMenu() {
      this.isOpen = false
      this.activeSubMenuIndex = -1
      this.$emit('close')
    },

    handleItemClick(item, index, subIndex = null) {
      if (item.disabled) return

      // Handle checkbox items
      if (item.type === 'checkbox') {
        item.checked = !item.checked
      }

      this.$emit('item-click', {
        item,
        index,
        subIndex,
        path: subIndex !== null ? [index, subIndex] : [index]
      })

      // Close menu after action (unless it's a checkbox)
      if (item.type !== 'checkbox' && !item.items) {
        this.closeMenu()
      }
    },

    handleSubMenuEnter(index) {
      this.activeSubMenuIndex = index
    },

    handleSubMenuLeave() {
      setTimeout(() => {
        this.activeSubMenuIndex = -1
      }, 100)
    },

    handleKeyDown(event) {
      const validItems = this.content.items?.filter(item => item.type !== 'separator') || []
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.selectedIndex = Math.min(this.selectedIndex + 1, validItems.length - 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
          break
        case 'ArrowRight':
          event.preventDefault()
          const currentItem = validItems[this.selectedIndex]
          if (currentItem?.items && currentItem.items.length > 0) {
            this.activeSubMenuIndex = this.selectedIndex
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          this.activeSubMenuIndex = -1
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (validItems[this.selectedIndex]) {
            this.handleItemClick(validItems[this.selectedIndex], this.selectedIndex)
          }
          break
        case 'Escape':
          event.preventDefault()
          this.closeMenu()
          break
      }
    },

    handleBlur(event) {
      // Only close if focus is not moving to a submenu
      if (!event.relatedTarget?.closest('[role="menu"]')) {
        setTimeout(this.closeMenu, 100)
      }
    },

    handleClickOutside(event) {
      if (this.isOpen && 
          !this.$refs.menuRef?.contains(event.target) && 
          !this.$refs.triggerRef?.contains(event.target)) {
        this.closeMenu()
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    document.addEventListener('contextmenu', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('contextmenu', this.handleClickOutside)
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

/* Context Menu Styles */
.context-menu-trigger {
  width: 100%;
  height: 100%;
}

.context-menu-content {
  position: fixed;
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  animation: contextMenuIn 0.2s ease-out;
}

.context-menu-separator {
  margin: 0.25rem 0;
  height: 1px;
  background-color: hsl(var(--muted));
}

.context-menu-submenu-container {
  position: relative;
}

.context-menu-item {
  position: relative;
  display: flex;
  width: 100%;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: colors 0.2s;
  background: transparent;
  border: none;
  color: hsl(var(--foreground));
  text-align: left;
}

.context-menu-item:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.context-menu-item:focus {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.context-menu-item-selected {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.context-menu-item-disabled {
  pointer-events: none;
  opacity: 0.5;
}

.context-menu-submenu {
  position: absolute;
  left: 100%;
  top: 0;
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  animation: submenuIn 0.2s ease-out;
  margin-left: 0.25rem;
}

.context-menu-icon {
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

.context-menu-label {
  flex: 1 1 0%;
}

.context-menu-shortcut {
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.context-menu-submenu-arrow,
.context-menu-checkbox {
  margin-left: 0.5rem;
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

/* Animations */
@keyframes contextMenuIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes submenuIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style> 