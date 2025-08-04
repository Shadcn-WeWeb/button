<template>
  <div :class="cardClasses">
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
      <div v-if="isEditor" class="ww-dropzone" data-ww-dropzone="content">
        <!-- Les composants glissés ici seront dans content.content -->
      </div>
      <template v-else>
        <component
          v-for="(item, index) in content.content"
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
</template>

<script>
import { computed } from 'vue'
import { cn } from './cn.js'

export default {
  name: 'WewebCard',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        showHeader: true,
        title: '',
        description: '',
        bodyContent: '',
        showFooter: false,
        footerContent: '',
        content: [], // Pour les composants imbriqués
        customClasses: '',
        headerPadding: 'p-6',
        contentPadding: 'p-6 pt-0',
        footerPadding: 'p-6 pt-0'
      })
    }
  },
  setup(props) {
    // Détecter si on est en mode éditeur Weweb
    const isEditor = computed(() => {
      return typeof window !== 'undefined' && window.wwLib && window.wwLib.getFrontDocument;
    })

    const cardClasses = computed(() => cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      props.content.customClasses
    ))

    const headerClasses = computed(() => cn(
      "flex flex-col space-y-1.5",
      props.content.headerPadding
    ))

    const titleClasses = computed(() => cn(
      "text-2xl font-semibold leading-none tracking-tight"
    ))

    const descriptionClasses = computed(() => cn(
      "text-sm text-muted-foreground"
    ))

    const contentClasses = computed(() => cn(
      props.content.contentPadding
    ))

    const footerClasses = computed(() => cn(
      "flex items-center",
      props.content.footerPadding
    ))

    return {
      isEditor,
      cardClasses,
      headerClasses,
      titleClasses,
      descriptionClasses,
      contentClasses,
      footerClasses
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 