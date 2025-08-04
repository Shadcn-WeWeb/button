<template>
  <nav 
    :class="cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      content.customClass
    )"
    ref="navigationRef"
  >
    <div 
      :class="cn(
        'group flex flex-1 list-none items-center justify-center space-x-1',
        content.orientation === 'vertical' && 'flex-col space-x-0 space-y-1'
      )"
    >
      <!-- Navigation Items -->
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        :class="cn(
          'relative',
          content.orientation === 'vertical' && 'w-full'
        )"
        @mouseenter="onItemHover(item, index)"
        @mouseleave="onItemLeave(item, index)"
      >
        <!-- Trigger -->
        <button
          v-if="item.children"
          :class="cn(
            'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            'data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
            activeIndex === index && 'bg-accent/50',
            content.triggerClass
          )"
          :data-active="item.active"
          :data-state="openIndexes.includes(index) ? 'open' : 'closed'"
          @click="toggleSubmenu(index)"
          :disabled="item.disabled"
        >
          <span>{{ item.label }}</span>
          <svg
            v-if="content.showArrows"
            :class="cn(
              'relative top-[1px] ml-1 h-3 w-3 transition duration-200',
              'group-data-[state=open]:rotate-180',
              openIndexes.includes(index) && 'rotate-180'
            )"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Direct Link -->
        <a
          v-else
          :href="item.href || '#'"
          :class="cn(
            'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            item.active && 'bg-accent/50',
            item.disabled && 'pointer-events-none opacity-50',
            content.linkClass
          )"
          @click="onItemClick(item, $event)"
        >
          {{ item.label }}
        </a>

        <!-- Submenu -->
        <Transition name="submenu" appear>
          <div
            v-if="item.children && (openIndexes.includes(index) || (content.trigger === 'hover' && hoveredIndex === index))"
            :class="cn(
              'absolute left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
              'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
              'data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52',
              'data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52',
              content.orientation === 'horizontal' && 'top-full',
              content.orientation === 'vertical' && 'left-full top-0',
              content.submenuClass
            )"
            :style="submenuStyle"
          >
            <div
              :class="cn(
                'absolute left-0 top-0 w-auto',
                content.orientation === 'horizontal' && 'mt-1.5',
                content.orientation === 'vertical' && 'ml-1.5'
              )"
            >
              <div
                :class="cn(
                  'relative w-auto rounded-md border bg-popover p-2 text-popover-foreground shadow-lg',
                  'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
                  'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
                  content.submenuPanelClass
                )"
              >
                <!-- Submenu Content -->
                <div 
                  :class="cn(
                    'grid gap-3',
                    item.columns && `grid-cols-${item.columns}`,
                    content.submenuContentClass
                  )"
                  :style="{ minWidth: content.submenuMinWidth || '400px' }"
                >
                  <!-- Submenu Items -->
                  <div
                    v-for="(subItem, subIndex) in item.children"
                    :key="subIndex"
                    :class="cn(
                      subItem.type === 'group' && 'space-y-2',
                      subItem.type === 'separator' && 'col-span-full border-t border-border'
                    )"
                  >
                    <!-- Group Title -->
                    <div
                      v-if="subItem.type === 'group'"
                      :class="cn(
                        'text-sm font-medium leading-none text-muted-foreground',
                        content.groupTitleClass
                      )"
                    >
                      {{ subItem.title }}
                    </div>

                    <!-- Group Items -->
                    <div
                      v-if="subItem.type === 'group'"
                      class="space-y-1"
                    >
                      <a
                        v-for="(groupItem, groupIndex) in subItem.items"
                        :key="groupIndex"
                        :href="groupItem.href || '#'"
                        :class="cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          groupItem.disabled && 'pointer-events-none opacity-50',
                          content.groupItemClass
                        )"
                        @click="onSubItemClick(groupItem, $event)"
                      >
                        <div class="text-sm font-medium leading-none">
                          {{ groupItem.title }}
                        </div>
                        <p 
                          v-if="groupItem.description"
                          class="line-clamp-2 text-sm leading-snug text-muted-foreground"
                        >
                          {{ groupItem.description }}
                        </p>
                      </a>
                    </div>

                    <!-- Single Item -->
                    <a
                      v-else-if="subItem.type !== 'separator'"
                      :href="subItem.href || '#'"
                      :class="cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        subItem.disabled && 'pointer-events-none opacity-50',
                        content.submenuItemClass
                      )"
                      @click="onSubItemClick(subItem, $event)"
                    >
                      <div class="text-sm font-medium leading-none">
                        {{ subItem.title }}
                      </div>
                      <p 
                        v-if="subItem.description"
                        class="line-clamp-2 text-sm leading-snug text-muted-foreground"
                      >
                        {{ subItem.description }}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Viewport indicator (for horizontal scrolling on mobile) -->
    <div
      v-if="content.showIndicator"
      :class="cn(
        'absolute left-[-1000px] top-full flex justify-center',
        content.indicatorClass
      )"
      ref="indicatorRef"
    >
      <div 
        class="relative mt-1.5 h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"
      />
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['itemClick', 'subItemClick', 'open', 'close'])

// Reactive data
const navigationRef = ref(null)
const indicatorRef = ref(null)
const openIndexes = ref([])
const activeIndex = ref(-1)
const hoveredIndex = ref(-1)
const delayTimer = ref(null)

// Computed properties
const menuItems = computed(() => {
  return content.value?.menuItems || [
    {
      label: 'Getting started',
      children: [
        {
          type: 'item',
          title: 'Introduction',
          description: 'Re-usable components built using Radix UI and Tailwind CSS.',
          href: '#'
        }
      ]
    },
    {
      label: 'Components',
      children: [
        {
          type: 'group',
          title: 'Layout',
          items: [
            { title: 'Card', description: 'Displays a card with header, content, and footer.', href: '#' },
            { title: 'Dialog', description: 'A modal dialog that interrupts the user.', href: '#' }
          ]
        }
      ]
    }
  ]
})

const submenuStyle = computed(() => ({
  zIndex: 50
}))

// Methods
const toggleSubmenu = (index) => {
  if (openIndexes.value.includes(index)) {
    closeSubmenu(index)
  } else {
    openSubmenu(index)
  }
}

const openSubmenu = (index) => {
  if (content.value?.single) {
    openIndexes.value = [index]
  } else {
    if (!openIndexes.value.includes(index)) {
      openIndexes.value.push(index)
    }
  }
  activeIndex.value = index
  emit('open', { index, item: menuItems.value[index] })
}

const closeSubmenu = (index) => {
  openIndexes.value = openIndexes.value.filter(i => i !== index)
  if (activeIndex.value === index) {
    activeIndex.value = -1
  }
  emit('close', { index, item: menuItems.value[index] })
}

const closeAllSubmenus = () => {
  openIndexes.value = []
  activeIndex.value = -1
  hoveredIndex.value = -1
}

const onItemHover = (item, index) => {
  if (content.value?.trigger !== 'hover') return
  
  if (delayTimer.value) {
    clearTimeout(delayTimer.value)
  }
  
  delayTimer.value = setTimeout(() => {
    hoveredIndex.value = index
    if (item.children) {
      openSubmenu(index)
    }
  }, content.value?.hoverDelay || 150)
}

const onItemLeave = (item, index) => {
  if (content.value?.trigger !== 'hover') return
  
  if (delayTimer.value) {
    clearTimeout(delayTimer.value)
  }
  
  delayTimer.value = setTimeout(() => {
    hoveredIndex.value = -1
    if (item.children) {
      closeSubmenu(index)
    }
  }, content.value?.leaveDelay || 300)
}

const onItemClick = (item, event) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  
  emit('itemClick', { item, event })
}

const onSubItemClick = (subItem, event) => {
  if (subItem.disabled) {
    event.preventDefault()
    return
  }
  
  emit('subItemClick', { subItem, event })
  
  // Close menus after navigation
  if (content.value?.closeOnClick) {
    closeAllSubmenus()
  }
}

// Handle outside clicks
const handleClickOutside = (event) => {
  if (navigationRef.value && !navigationRef.value.contains(event.target)) {
    closeAllSubmenus()
  }
}

// Handle escape key
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeAllSubmenus()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
  
  if (delayTimer.value) {
    clearTimeout(delayTimer.value)
  }
})

// Expose methods
defineExpose({
  openSubmenu,
  closeSubmenu,
  closeAllSubmenus
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style>

<style scoped>
/* Submenu animations */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 