<template>
  <div class="ww-card">
    <div :class="cardClasses" @click="handleClick">
      <!-- Header Section -->
      <div v-if="content.showHeader" :class="headerClasses">
        <div v-if="content.title" :class="titleClasses">
          {{ content.title }}
        </div>
        <div v-if="content.description" :class="descriptionClasses">
          {{ content.description }}
        </div>
      </div>
      
      <!-- Content Section -->
      <div :class="contentClasses">
        <div v-if="content.bodyContent" v-html="content.bodyContent"></div>
        
        <!-- Dropzone pour insérer d'autres composants Weweb -->
        <div v-if="isEditor" class="ww-card__dropzone" data-ww-dropzone="content">
          <!-- Les composants glissés ici seront dans content -->
        </div>
        <template v-else>
          <component
            v-for="(item, index) in content.wwContent"
            :key="index"
            :is="item.wwElement"
            v-bind="item"
          />
        </template>
        
        <slot />
      </div>
      
      <!-- Footer Section -->
      <div v-if="content.showFooter" :class="footerClasses">
        <div v-if="content.footerContent" v-html="content.footerContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnCard',
  props: {
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    isEditor() {
      return typeof window !== 'undefined' && window.wwLib && window.wwLib.getFrontDocument
    },
    
    cardClasses() {
      return 'ww-card__base'
    },
    
    headerClasses() {
      return `ww-card__header ww-card__header--${this.content?.headerPadding || 'default'}`
    },
    
    titleClasses() {
      return 'ww-card__title'
    },
    
    descriptionClasses() {
      return 'ww-card__description'
    },
    
    contentClasses() {
      return `ww-card__content ww-card__content--${this.content?.contentPadding || 'default'}`
    },
    
    footerClasses() {
      return `ww-card__footer ww-card__footer--${this.content?.footerPadding || 'default'}`
    }
  },
  
  methods: {
    handleClick(event) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          title: this.content?.title,
          description: this.content?.description,
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

/* Card base styles */
.ww-card__base {
  border-radius: calc(var(--radius));
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.ww-card__base:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Header styles */
.ww-card__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ww-card__header--default {
  padding: 24px;
}

.ww-card__header--sm {
  padding: 16px;
}

.ww-card__header--lg {
  padding: 32px;
}

.ww-card__header--none {
  padding: 0;
}

/* Title styles */
.ww-card__title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.025em;
  margin: 0;
  color: hsl(var(--foreground));
}

/* Description styles */
.ww-card__description {
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin: 0;
  line-height: 1.5;
}

/* Content styles */
.ww-card__content {
  flex: 1;
}

.ww-card__content--default {
  padding: 24px;
  padding-top: 0;
}

.ww-card__content--sm {
  padding: 16px;
  padding-top: 0;
}

.ww-card__content--lg {
  padding: 32px;
  padding-top: 0;
}

.ww-card__content--none {
  padding: 0;
}

.ww-card__content--full {
  padding: 24px;
}

/* Footer styles */
.ww-card__footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ww-card__footer--default {
  padding: 24px;
  padding-top: 0;
}

.ww-card__footer--sm {
  padding: 16px;
  padding-top: 0;
}

.ww-card__footer--lg {
  padding: 32px;
  padding-top: 0;
}

.ww-card__footer--none {
  padding: 0;
}

.ww-card__footer--full {
  padding: 24px;
}

/* Weweb dropzone styles */
.ww-card__dropzone {
  min-height: 100px;
  border: 2px dashed hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
  margin: 12px 0;
  position: relative;
}

.ww-card__dropzone:hover {
  border-color: hsl(var(--border));
  background-color: hsl(var(--muted) / 0.3);
}

.ww-card__dropzone:before {
  content: "Drop components here";
  font-size: 14px;
  pointer-events: none;
}
</style>