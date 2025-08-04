<template>
  <div class="ww-aspectratio">
    <div 
      :class="containerClasses"
      :style="containerStyle"
      @click="handleClick"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnAspectRatio',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        ratio: 1.777, // 16:9 default
        customRatio: ''
      })
    },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    aspectRatio() {
      // If custom ratio is selected
      if (this.content.ratio === 'custom' && this.content.customRatio) {
        // Parse custom ratio like "16:9" or "4:3"
        const customValue = this.content.customRatio.toString().trim()
        
        if (customValue.includes(':')) {
          const parts = customValue.split(':')
          if (parts.length === 2) {
            const width = parseFloat(parts[0])
            const height = parseFloat(parts[1])
            if (!isNaN(width) && !isNaN(height) && height !== 0) {
              return width / height
            }
          }
        } else {
          // Try to parse as decimal like "1.777"
          const decimal = parseFloat(customValue)
          if (!isNaN(decimal) && decimal > 0) {
            return decimal
          }
        }
      }
      
      // Use predefined ratio
      return parseFloat(this.content.ratio) || 1.777
    },
    containerClasses() {
      return 'ww-aspectratio__container'
    },
    containerStyle() {
      return {
        aspectRatio: this.aspectRatio.toString()
      }
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          ratio: this.aspectRatio,
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

.ww-aspectratio__container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Fallback for browsers that don't support aspect-ratio */
@supports not (aspect-ratio: 1) {
  .ww-aspectratio__container::before {
    content: '';
    display: block;
    padding-bottom: calc(100% / var(--aspect-ratio, 1.777));
  }
  
  .ww-aspectratio__container > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>