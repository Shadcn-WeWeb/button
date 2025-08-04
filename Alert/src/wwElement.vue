<template>
  <div class="ww-alert" role="alert">
    <div class="alert-content">
      <h4 v-if="content.title" class="alert-title">
        {{ content.title }}
      </h4>
      
      <div v-if="content.description" class="alert-description">
        {{ content.description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnAlert',
  props: {
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    alertClasses() {
      const variant = this.content.variant || 'default'
      return `ww-alert alert-${variant}`
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('trigger-event', {
        name: 'click',
        event: { 
          domEvent: event,
          variant: this.content.variant,
          title: this.content.title
        }
      })
    }
  }
}
</script>

<style>
/* ===== SHADCN UI CSS VARIABLES ===== */

/* Shadcn UI Variables */
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

/* ===== ALERT STYLES - EXACTEMENT COMME SHADCN UI ===== */

.ww-alert {
  position: relative;
  width: 100%;
  border-radius: calc(var(--radius));
  border: 1px solid hsl(var(--border));
  padding: 1rem;
  font-family: inherit;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

.ww-alert.alert-default {
  background-color: hsl(var(--background));
  border-color: hsl(var(--border));
  color: hsl(var(--foreground));
}

.ww-alert.alert-destructive {
  border-color: hsl(var(--destructive) / 0.5);
  color: hsl(var(--destructive));
  background-color: hsl(var(--destructive) / 0.1);
}

.ww-alert.alert-warning {
  border-color: hsl(38 92% 50% / 0.5);
  color: hsl(25 95% 39%);
  background-color: hsl(48 96% 53% / 0.1);
}

.ww-alert .alert-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ww-alert .alert-title {
  margin-bottom: 0.25rem;
  font-weight: 500;
  line-height: 1.25;
  font-size: 0.875rem;
  margin: 0;
  color: inherit;
}

.ww-alert .alert-description {
  font-size: 0.875rem;
  line-height: 1.25;
  margin: 0;
  opacity: 0.8;
  color: inherit;
}

/* Responsive et accessibilité */
.ww-alert:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
}
</style>