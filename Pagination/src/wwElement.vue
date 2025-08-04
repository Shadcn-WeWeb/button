<template>
  <nav 
    role="navigation" 
    aria-label="pagination"
    :class="cn(
      'mx-auto flex w-full justify-center',
      customClass
    )"
  >
    <div 
      :class="cn(
        'flex flex-row items-center gap-1',
        size === 'sm' && 'gap-0.5',
        size === 'lg' && 'gap-2'
      )"
    >
      <!-- Previous Button -->
      <button
        v-if="showPrevious"
        :disabled="currentPage <= 1 || disabled"
        :class="cn(
          buttonBaseClass,
          buttonSizeClass,
          'gap-1 pl-2.5',
          (currentPage <= 1 || disabled) && 'pointer-events-none opacity-50',
          previousClass
        )"
        @click="goToPage(currentPage - 1)"
        :aria-label="$t('pagination.previous')"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        <span v-if="showPreviousText">{{ previousText || $t('pagination.previous') }}</span>
      </button>

      <!-- First Page -->
      <button
        v-if="showFirstPage"
        :class="cn(
          buttonBaseClass,
          buttonSizeClass,
          currentPage === 1 ? activeButtonClass : inactiveButtonClass
        )"
        @click="goToPage(1)"
        :aria-label="$t('pagination.goToPage', { page: 1 })"
        :aria-current="currentPage === 1 ? 'page' : undefined"
      >
        1
      </button>

      <!-- First Ellipsis -->
      <span
        v-if="showFirstEllipsis"
        :class="cn(
          'flex h-9 w-9 items-center justify-center',
          ellipsisClass
        )"
        aria-hidden="true"
      >
        {{ ellipsisText || '…' }}
      </span>

      <!-- Page Numbers -->
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="cn(
          buttonBaseClass,
          buttonSizeClass,
          currentPage === page ? activeButtonClass : inactiveButtonClass
        )"
        @click="goToPage(page)"
        :aria-label="$t('pagination.goToPage', { page })"
        :aria-current="currentPage === page ? 'page' : undefined"
      >
        {{ page }}
      </button>

      <!-- Last Ellipsis -->
      <span
        v-if="showLastEllipsis"
        :class="cn(
          'flex h-9 w-9 items-center justify-center',
          ellipsisClass
        )"
        aria-hidden="true"
      >
        {{ ellipsisText || '…' }}
      </span>

      <!-- Last Page -->
      <button
        v-if="showLastPage"
        :class="cn(
          buttonBaseClass,
          buttonSizeClass,
          currentPage === totalPages ? activeButtonClass : inactiveButtonClass
        )"
        @click="goToPage(totalPages)"
        :aria-label="$t('pagination.goToPage', { page: totalPages })"
        :aria-current="currentPage === totalPages ? 'page' : undefined"
      >
        {{ totalPages }}
      </button>

      <!-- Next Button -->
      <button
        v-if="showNext"
        :disabled="currentPage >= totalPages || disabled"
        :class="cn(
          buttonBaseClass,
          buttonSizeClass,
          'gap-1 pr-2.5',
          (currentPage >= totalPages || disabled) && 'pointer-events-none opacity-50',
          nextClass
        )"
        @click="goToPage(currentPage + 1)"
        :aria-label="$t('pagination.next')"
      >
        <span v-if="showNextText">{{ nextText || $t('pagination.next') }}</span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Page Info -->
    <div
      v-if="showInfo"
      :class="cn(
        'ml-4 flex items-center text-sm text-muted-foreground',
        infoClass
      )"
    >
      {{ formatPageInfo() }}
    </div>

    <!-- Jump to Page -->
    <div
      v-if="showJumpTo"
      :class="cn(
        'ml-4 flex items-center gap-2 text-sm',
        jumpToClass
      )"
    >
      <label 
        :for="`jump-to-page-${componentId}`"
        class="text-muted-foreground"
      >
        {{ jumpToText || $t('pagination.jumpTo') }}
      </label>
      <input
        :id="`jump-to-page-${componentId}`"
        type="number"
        :min="1"
        :max="totalPages"
        :value="jumpToValue"
        @input="onJumpToInput"
        @keydown.enter="jumpToPage"
        :class="cn(
          'h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-center text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )"
        :disabled="disabled"
      />
    </div>

    <!-- Per Page Selector -->
    <div
      v-if="showPerPage"
      :class="cn(
        'ml-4 flex items-center gap-2 text-sm',
        perPageClass
      )"
    >
      <label 
        :for="`per-page-${componentId}`"
        class="text-muted-foreground"
      >
        {{ perPageText || $t('pagination.perPage') }}
      </label>
      <select
        :id="`per-page-${componentId}`"
        :value="perPage"
        @change="onPerPageChange"
        :class="cn(
          'h-8 rounded-md border border-input bg-background px-2 py-1 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )"
        :disabled="disabled"
      >
        <option
          v-for="size in perPageOptions"
          :key="size"
          :value="size"
        >
          {{ size }}
        </option>
      </select>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  },
  perPage: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'update:perPage', 'change', 'perPageChange'])

// Reactive data
const jumpToValue = ref('')
const componentId = ref(`pagination-${Math.random().toString(36).substr(2, 9)}`)

// Computed properties
const currentPage = computed({
  get: () => props.modelValue || 1,
  set: (value) => emit('update:modelValue', value)
})

const totalItems = computed(() => props.total || value?.total || 0)

const itemsPerPage = computed({
  get: () => props.perPage !== undefined ? props.perPage : (value?.perPage || 10),
  set: (value) => emit('update:perPage', value)
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value) || 1)

const perPageOptions = computed(() => 
  value?.perPageOptions || [5, 10, 20, 50, 100]
)

// Button classes
const buttonBaseClass = computed(() => cn(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  value?.buttonClass
))

const buttonSizeClass = computed(() => cn(
  value?.size === 'sm' && 'h-8 w-8',
  value?.size === 'default' && 'h-9 w-9',
  value?.size === 'lg' && 'h-10 w-10'
))

const activeButtonClass = computed(() => cn(
  'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
  value?.activeClass
))

const inactiveButtonClass = computed(() => cn(
  'hover:bg-accent hover:text-accent-foreground',
  value?.inactiveClass
))

// Pagination logic
const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const maxVisible = Math.min(value?.maxVisible || 5, total)
  
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  // Adjust to avoid showing first/last page in the range if they are separately shown
  if (showFirstPage.value && start <= 2) {
    start = 2
  }
  if (showLastPage.value && end >= total - 1) {
    end = total - 1
  }
  
  const pages = []
  for (let i = start; i <= end; i++) {
    if ((showFirstPage.value && i === 1) || (showLastPage.value && i === total)) {
      continue
    }
    pages.push(i)
  }
  
  return pages
})

const showFirstPage = computed(() => {
  return value?.showFirstLast && totalPages.value > 1 && 
         (visiblePages.value.length === 0 || visiblePages.value[0] > 1)
})

const showLastPage = computed(() => {
  return value?.showFirstLast && totalPages.value > 1 && 
         (visiblePages.value.length === 0 || visiblePages.value[visiblePages.value.length - 1] < totalPages.value)
})

const showFirstEllipsis = computed(() => {
  return value?.showEllipsis && showFirstPage.value && 
         visiblePages.value.length > 0 && visiblePages.value[0] > 2
})

const showLastEllipsis = computed(() => {
  return value?.showEllipsis && showLastPage.value && 
         visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
})

// Methods
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value || value?.disabled) {
    return
  }
  
  currentPage.value = page
  jumpToValue.value = ''
  
  emit('change', {
    page,
    perPage: itemsPerPage.value,
    total: totalItems.value,
    totalPages: totalPages.value
  })
}

const formatPageInfo = () => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
  
  return value?.infoTemplate 
    ? value.infoTemplate
        .replace('{start}', start)
        .replace('{end}', end)
        .replace('{total}', totalItems.value)
        .replace('{page}', currentPage.value)
        .replace('{totalPages}', totalPages.value)
    : `${start}-${end} of ${totalItems.value}`
}

const onJumpToInput = (event) => {
  jumpToValue.value = event.target.value
}

const jumpToPage = () => {
  const page = parseInt(jumpToValue.value)
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    goToPage(page)
  }
}

const onPerPageChange = (event) => {
  const newPerPage = parseInt(event.target.value)
  if (!isNaN(newPerPage) && newPerPage > 0) {
    itemsPerPage.value = newPerPage
    
    // Adjust current page if necessary
    const newTotalPages = Math.ceil(totalItems.value / newPerPage)
    if (currentPage.value > newTotalPages) {
      goToPage(newTotalPages)
    }
    
    emit('perPageChange', {
      perPage: newPerPage,
      page: currentPage.value,
      total: totalItems.value
    })
  }
}

// Watchers
watch(() => totalPages.value, (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    goToPage(newTotal)
  }
})

// Expose methods
defineExpose({
  goToPage,
  jumpToPage,
  currentPage: readonly(currentPage),
  totalPages: readonly(totalPages)
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 