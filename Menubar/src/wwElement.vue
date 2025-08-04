<template>
  <div 
    :class="cn(
      'flex h-10 items-center space-x-1 rounded-md border bg-background p-1',
      customClass
    )"
    :style="customStyle"
    role="menubar"
  >
    <div
      v-for="(menu, index) in menus"
      :key="menu.id || index"
      class="relative"
      @mouseenter="handleMouseEnter(index)"
      @mouseleave="handleMouseLeave"
    >
      <button
        :class="cn(
          'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          activeMenuIndex === index ? 'bg-accent text-accent-foreground' : '',
          menu.disabled ? 'pointer-events-none opacity-50' : ''
        )"
        @click="toggleMenu(index)"
        @keydown="handleKeyDown($event, index)"
        :disabled="menu.disabled"
        :aria-expanded="activeMenuIndex === index"
        :aria-haspopup="menu.items && menu.items.length > 0"
        role="menuitem"
      >
        <component
          v-if="menu.icon"
          :is="menu.icon"
          class="mr-2 h-4 w-4"
        />
        {{ menu.label }}
        <svg
          v-if="menu.items && menu.items.length > 0"
          class="ml-auto h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="activeMenuIndex === index && menu.items && menu.items.length > 0"
        :class="cn(
          'absolute left-0 top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'mt-1'
        )"
        role="menu"
        @click.stop
      >
        <div
          v-for="(item, itemIndex) in menu.items"
          :key="item.id || itemIndex"
          :class="cn(
            item.type === 'separator' ? 'my-1 h-px bg-muted' : ''
          )"
        >
          <!-- Separator -->
          <div v-if="item.type === 'separator'" />
          
          <!-- Sub-menu item -->
          <div
            v-else-if="item.items && item.items.length > 0"
            class="relative"
            @mouseenter="handleSubMenuEnter(index, itemIndex)"
            @mouseleave="handleSubMenuLeave"
          >
            <button
              :class="cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                activeSubMenuIndex === itemIndex ? 'bg-accent text-accent-foreground' : '',
                item.disabled ? 'pointer-events-none opacity-50' : ''
              )"
              @click="handleItemClick(item, menu, index)"
              :disabled="item.disabled"
              role="menuitem"
              :aria-haspopup="true"
            >
              <component
                v-if="item.icon"
                :is="item.icon"
                class="mr-2 h-4 w-4"
              />
              {{ item.label }}
              <span v-if="item.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
                {{ item.shortcut }}
              </span>
              <svg class="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Sub-menu dropdown -->
            <div
              v-if="activeSubMenuIndex === itemIndex"
              :class="cn(
                'absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                'ml-1'
              )"
              role="menu"
            >
              <button
                v-for="(subItem, subIndex) in item.items"
                :key="subItem.id || subIndex"
                :class="cn(
                  'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  subItem.disabled ? 'pointer-events-none opacity-50' : ''
                )"
                @click="handleItemClick(subItem, item, index, itemIndex)"
                :disabled="subItem.disabled"
                role="menuitem"
              >
                <component
                  v-if="subItem.icon"
                  :is="subItem.icon"
                  class="mr-2 h-4 w-4"
                />
                {{ subItem.label }}
                <span v-if="subItem.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
                  {{ subItem.shortcut }}
                </span>
              </button>
            </div>
          </div>

          <!-- Regular menu item -->
          <button
            v-else
            :class="cn(
              'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              item.disabled ? 'pointer-events-none opacity-50' : ''
            )"
            @click="handleItemClick(item, menu, index)"
            :disabled="item.disabled"
            role="menuitem"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              class="mr-2 h-4 w-4"
            />
            {{ item.label }}
            <span v-if="item.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
              {{ item.shortcut }}
            </span>
            <svg
              v-if="item.type === 'checkbox' && item.checked"
              class="ml-auto h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  props: {
        // Individual props will be auto-generated based on the component type
        // This is a placeholder that will be manually refined per component
    },
  emits: ['item-click', 'menu-open', 'menu-close'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const activeMenuIndex = ref(-1)
    const activeSubMenuIndex = ref(-1)

    const toggleMenu = (index) => {
      if (activeMenuIndex.value === index) {
        closeMenus()
      } else {
        activeMenuIndex.value = index
        activeSubMenuIndex.value = -1
        emit('menu-open', { menuIndex: index, menu: props.menus[index] })
      }
    }

    const closeMenus = () => {
      const wasOpen = activeMenuIndex.value !== -1
      activeMenuIndex.value = -1
      activeSubMenuIndex.value = -1
      if (wasOpen) {
        emit('menu-close')
      }
    }

    const handleMouseEnter = (index) => {
      if (trigger === 'hover' || activeMenuIndex.value !== -1) {
        activeMenuIndex.value = index
        activeSubMenuIndex.value = -1
      }
    }

    const handleMouseLeave = () => {
      if (trigger === 'hover') {
        setTimeout(() => {
          closeMenus()
        }, 100)
      }
    }

    const handleSubMenuEnter = (menuIndex, itemIndex) => {
      activeSubMenuIndex.value = itemIndex
    }

    const handleSubMenuLeave = () => {
      setTimeout(() => {
        activeSubMenuIndex.value = -1
      }, 100)
    }

    const handleItemClick = (item, parent, menuIndex, itemIndex = null) => {
      if (item.disabled) return

      // Handle checkbox items
      if (item.type === 'checkbox') {
        item.checked = !item.checked
      }

      emit('item-click', {
        item,
        parent,
        menuIndex,
        itemIndex,
        path: itemIndex !== null ? [menuIndex, itemIndex] : [menuIndex]
      })

      // Close menus after action (unless it's a checkbox)
      if (item.type !== 'checkbox' && !item.items) {
        closeMenus()
      }
    }

    const handleKeyDown = (event, index) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          toggleMenu(index)
          break
        case 'ArrowRight':
          event.preventDefault()
          if (index < props.menus.length - 1) {
            activeMenuIndex.value = index + 1
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (index > 0) {
            activeMenuIndex.value = index - 1
          }
          break
        case 'Escape':
          event.preventDefault()
          closeMenus()
          break
      }
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('[role="menubar"]')) {
        closeMenus()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      cn,
      activeMenuIndex,
      activeSubMenuIndex,
      toggleMenu,
      closeMenus,
      handleMouseEnter,
      handleMouseLeave,
      handleSubMenuEnter,
      handleSubMenuLeave,
      handleItemClick,
      handleKeyDown
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 