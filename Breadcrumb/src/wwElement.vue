<template>
  <div class="ww-breadcrumb">
    <nav 
      :class="breadcrumbClasses"
      aria-label="breadcrumb"
    >
      <ol :class="breadcrumbListClasses">
        <template v-for="(item, index) in visibleItems" :key="`breadcrumb-${index}`">
          <!-- Regular Breadcrumb Item -->
          <li 
            v-if="item.type !== 'ellipsis'"
            :class="breadcrumbItemClasses"
          >
            <!-- Link Item -->
            <a
              v-if="item.href && !item.isCurrentPage"
              :href="item.href"
              :class="breadcrumbLinkClasses"
              @click="handleClick(item, index, $event)"
            >
              {{ item.label }}
            </a>
            
            <!-- Current Page -->
            <span
              v-else
              :class="breadcrumbPageClasses"
              role="link"
              aria-disabled="true"
              aria-current="page"
            >
              {{ item.label }}
            </span>
          </li>

          <!-- Ellipsis -->
          <li
            v-else
            :class="breadcrumbEllipsisClasses"
            role="presentation"
            aria-hidden="true"
          >
            <span class="ww-breadcrumb__ellipsis-content">
              <svg class="ww-breadcrumb__ellipsis-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
              <span class="ww-breadcrumb__sr-only">More</span>
            </span>
          </li>

          <!-- Separator -->
          <li
            v-if="index < visibleItems.length - 1"
            :class="breadcrumbSeparatorClasses"
            role="presentation"
            aria-hidden="true"
          >
            <svg v-if="content.separator === 'chevron'" class="ww-breadcrumb__separator-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span v-else-if="content.separator === 'slash'" class="ww-breadcrumb__separator-text">/</span>
            <span v-else-if="content.separator === 'dash'" class="ww-breadcrumb__separator-text">-</span>
            <span v-else-if="content.separator === 'dot'" class="ww-breadcrumb__separator-text">•</span>
          </li>
        </template>
      </ol>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'ShadcnBreadcrumb',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        items: [
          { label: 'Home', href: '/', isCurrentPage: false },
          { label: 'Category', href: '/category', isCurrentPage: false },
          { label: 'Current Page', href: '', isCurrentPage: true }
        ],
        maxItems: 0,
        itemsBeforeCollapse: 1,
        itemsAfterCollapse: 1,
        separator: 'chevron'
      })
    },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    visibleItems() {
      const items = this.content.items || []
      const maxItems = this.content.maxItems || 0
      
      if (!maxItems || items.length <= maxItems) {
        return items
      }

      const beforeCollapse = this.content.itemsBeforeCollapse || 1
      const afterCollapse = this.content.itemsAfterCollapse || 1
      
      const startItems = items.slice(0, beforeCollapse)
      const endItems = items.slice(-afterCollapse)
      
      return [
        ...startItems,
        { type: 'ellipsis' },
        ...endItems
      ]
    },
    breadcrumbClasses() {
      return 'ww-breadcrumb__nav'
    },
    breadcrumbListClasses() {
      return 'ww-breadcrumb__list'
    },
    breadcrumbItemClasses() {
      return 'ww-breadcrumb__item'
    },
    breadcrumbLinkClasses() {
      return 'ww-breadcrumb__link'
    },
    breadcrumbPageClasses() {
      return 'ww-breadcrumb__page'
    },
    breadcrumbSeparatorClasses() {
      return 'ww-breadcrumb__separator'
    },
    breadcrumbEllipsisClasses() {
      return 'ww-breadcrumb__ellipsis'
    }
  },
  methods: {
    handleClick(item, index, event) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          item,
          index,
          label: item.label,
          href: item.href,
          content: this.content
        }
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

/* Screen reader only */
.ww-breadcrumb__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Breadcrumb Navigation */
.ww-breadcrumb__nav {
  /* No specific styles needed for nav */
}

.ww-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  word-break: break-words;
  font-size: 14px;
  color: hsl(var(--muted-foreground));
}

@media (min-width: 640px) {
  .ww-breadcrumb__list {
    gap: 10px;
  }
}

.ww-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Breadcrumb Link */
.ww-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
  color: inherit;
  text-decoration: none;
}

.ww-breadcrumb__link:hover {
  color: hsl(var(--foreground));
}

/* Current Page */
.ww-breadcrumb__page {
  display: inline-flex;
  align-items: center;
  font-weight: 400;
  color: hsl(var(--foreground));
}

/* Separator */
.ww-breadcrumb__separator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ww-breadcrumb__separator-icon {
  width: 14px;
  height: 14px;
}

.ww-breadcrumb__separator-text {
  font-size: 14px;
  font-weight: 400;
}

/* Ellipsis */
.ww-breadcrumb__ellipsis {
  display: flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
}

.ww-breadcrumb__ellipsis-content {
  display: flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
}

.ww-breadcrumb__ellipsis-icon {
  height: 16px;
  width: 16px;
}
</style>