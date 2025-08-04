<template>
  <div class="ww-avatar">
    <div :class="avatarClasses" @click="handleClick">
      <img 
        v-if="content.src && !imageError"
        :src="content.src"
        :alt="content.alt"
        :class="imageClasses"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      
      <div v-else :class="fallbackClasses">
        <span v-if="content.fallbackText">{{ content.fallbackText }}</span>
        <span v-else>{{ getInitials() }}</span>
      </div>
      
      <div v-if="content.showStatus" :class="statusClasses">
        <div :class="statusDotClasses" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnAvatar',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        src: "",
        name: "John Doe",
        alt: "Avatar",
        size: "default",
        variant: "default",
        showStatus: false,
        status: "online",
        fallbackText: ""
      })
    },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  data() {
    return {
      imageError: false
    }
  },
  computed: {
    avatarClasses() {
      const baseClass = 'ww-avatar__container'
      const sizeClass = `ww-avatar__container--${this.content.size || 'default'}`
      const variantClass = `ww-avatar__container--variant-${this.content.variant || 'default'}`
      return `${baseClass} ${sizeClass} ${variantClass}`
    },
    imageClasses() {
      return 'ww-avatar__image'
    },
    fallbackClasses() {
      return 'ww-avatar__fallback'
    },
    statusClasses() {
      return 'ww-avatar__status'
    },
    statusDotClasses() {
      const baseClass = 'ww-avatar__status-dot'
      const statusClass = `ww-avatar__status-dot--${this.content.status || 'online'}`
      return `${baseClass} ${statusClass}`
    }
  },
  methods: {
    getInitials() {
      if (this.content.name) {
        return this.content.name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase()
      }
      return 'JD'
    },
    handleImageError(event) {
      this.imageError = true
      this.$emit('trigger-event', { 
        domEvent: event, 
        value: { event: 'image-error', src: this.content.src } 
      })
    },
    handleImageLoad(event) {
      this.imageError = false
      this.$emit('trigger-event', { 
        domEvent: event, 
        value: { event: 'image-load', src: this.content.src } 
      })
    },
    handleClick(event) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          name: this.content.name,
          src: this.content.src,
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

/* Avatar Container */
.ww-avatar__container {
  position: relative;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
}

/* Sizes */
.ww-avatar__container--sm {
  height: 32px;
  width: 32px;
}

.ww-avatar__container--default {
  height: 40px;
  width: 40px;
}

.ww-avatar__container--lg {
  height: 48px;
  width: 48px;
}

.ww-avatar__container--xl {
  height: 64px;
  width: 64px;
}

/* Variants */
.ww-avatar__container--variant-default {
  border-radius: 50%;
}

.ww-avatar__container--variant-square {
  border-radius: 6px;
}

/* Image */
.ww-avatar__image {
  aspect-ratio: 1;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

/* Fallback */
.ww-avatar__fallback {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  font-weight: 500;
  font-size: 0.875rem;
}

/* Size-specific font sizes for fallback */
.ww-avatar__container--sm .ww-avatar__fallback {
  font-size: 0.75rem;
}

.ww-avatar__container--default .ww-avatar__fallback {
  font-size: 0.875rem;
}

.ww-avatar__container--lg .ww-avatar__fallback {
  font-size: 1rem;
}

.ww-avatar__container--xl .ww-avatar__fallback {
  font-size: 1.25rem;
}

/* Status Indicator */
.ww-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  height: 12px;
  width: 12px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid hsl(var(--background));
}

.ww-avatar__status-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
}

/* Status Colors */
.ww-avatar__status-dot--online {
  background-color: hsl(140, 84%, 39%);
}

.ww-avatar__status-dot--offline {
  background-color: hsl(215.4, 16.3%, 56.9%);
}

.ww-avatar__status-dot--away {
  background-color: hsl(38, 92%, 50%);
}

.ww-avatar__status-dot--busy {
  background-color: hsl(0, 84.2%, 60.2%);
}

/* Hover Effect */
.ww-avatar__container:hover {
  opacity: 0.8;
  transition: opacity 0.2s;
}
</style>