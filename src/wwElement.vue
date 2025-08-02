<template>
  <button
    :class="computedClasses"
    :disabled="content.disabled || content.variant === 'loading'"
    :type="content.type || 'button'"
    @click="handleClick"
  >
    <!-- VARIANT LOADING: Spinner + texte -->
    <template v-if="content.variant === 'loading'">
      <div class="loading-spinner"></div>
      <span class="button-text">{{ content.loadingText || 'Loading...' }}</span>
    </template>
    
    <!-- VARIANT ICON: Icône seule -->
    <template v-else-if="content.variant === 'icon'">
      <i 
        v-if="content.iconName" 
        :data-lucide="content.iconName"
        class="button-icon icon-only"
      ></i>
      <span v-else class="button-text">⬜</span>
    </template>
    
    <!-- AUTRES VARIANTS: Icône optionnelle + texte -->
    <template v-else>
      <i 
        v-if="content.showIcon && content.iconName" 
        :data-lucide="content.iconName"
        class="button-icon left-icon"
      ></i>
      <span class="button-text">{{ content.text || 'Button' }}</span>
    </template>
  </button>
</template>

<script>
export default {
  name: 'ShadcnButton',
  props: {
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ["trigger-event"],
  mounted() {
    // Charger Lucide Icons dynamiquement si pas déjà présent
    if (!window.lucide) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
      script.onload = () => {
        if (window.lucide) {
          window.lucide.createIcons();
        }
      };
      document.head.appendChild(script);
    } else {
      this.$nextTick(() => {
        window.lucide.createIcons();
      });
    }
  },
  updated() {
    // Re-créer les icônes après chaque mise à jour
    this.$nextTick(() => {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  },
  computed: {
    computedClasses() {
      const variant = this.content.variant || 'default';
      const size = this.content.size || 'default';
      
      let classes = ['ww-button', 'btn', `btn-${variant}`];
      
      // Ajouter la classe de taille
      classes.push(`btn-${size}`);
      
      // Classe pour l'état de chargement
      if (this.content.variant === 'loading') {
        classes.push('btn-loading');
      }
      
      return classes.join(' ');
    }
  },
  methods: {
    handleClick(event) {
      // Ne pas émettre d'événement si disabled ou loading  
      if (this.content.disabled || this.content.variant === 'loading') {
        event.preventDefault();
        return;
      }
      
      this.$emit("trigger-event", {
        name: "click",
        event: { 
          domEvent: event,
          value: this.content.text || '',
          variant: this.content.variant,
          size: this.content.size
        }
      });
    }
  }
};
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

/* ===== BUTTON BASE STYLES ===== */

/* Base button styles - EXACTEMENT comme Shadcn UI */
.ww-button.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  font-family: inherit;
  user-select: none;
  position: relative;
  /* Taille par défaut - h-10 px-4 */
  height: 2.5rem;
  padding: 0 1rem;
}

/* Focus ring exact - Shadcn UI specs */
.ww-button.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
}

/* Disabled state */
.ww-button.btn:disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* ===== VARIANTS AVEC CSS VARIABLES ===== */

/* DEFAULT (Primary) */
.ww-button.btn-default {
  background-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary-foreground)) !important;
  border-color: hsl(var(--primary)) !important;
}

.ww-button.btn-default:hover:not(:disabled):not(.btn-loading) {
  background-color: hsl(var(--primary) / 0.9) !important;
}

.ww-button.btn-default:active:not(:disabled):not(.btn-loading) {
  background-color: hsl(222.2, 47.4%, 9.2%) !important;
}

/* DESTRUCTIVE */
.ww-button.btn-destructive {
  background-color: hsl(var(--destructive)) !important;
  color: hsl(var(--destructive-foreground)) !important;
  border-color: hsl(var(--destructive)) !important;
}

.ww-button.btn-destructive:hover:not(:disabled):not(.btn-loading) {
  background-color: hsl(var(--destructive) / 0.9) !important;
}

.ww-button.btn-destructive:active:not(:disabled):not(.btn-loading) {
  background-color: hsl(0, 84.2%, 50.2%) !important;
}

/* OUTLINE */
.ww-button.btn-outline {
  background-color: hsl(var(--background)) !important;
  color: hsl(var(--foreground)) !important;
  border-color: hsl(var(--border)) !important;
}

.ww-button.btn-outline:hover:not(:disabled):not(.btn-loading) {
  background-color: hsl(var(--accent)) !important;
  color: hsl(var(--accent-foreground)) !important;
}

.ww-button.btn-outline:active:not(:disabled):not(.btn-loading) {
  background-color: hsl(210, 40%, 94.1%) !important;
}

/* SECONDARY */
.ww-button.btn-secondary {
  background-color: hsl(var(--secondary)) !important;
  color: hsl(var(--secondary-foreground)) !important;
  border-color: hsl(var(--secondary)) !important;
}

.ww-button.btn-secondary:hover:not(:disabled):not(.btn-loading) {
  background-color: hsl(var(--secondary) / 0.8) !important;
}

.ww-button.btn-secondary:active:not(:disabled):not(.btn-loading) {
  background-color: hsl(210, 40%, 90.1%) !important;
}

/* GHOST */
.ww-button.btn-ghost {
  background-color: transparent !important;
  color: hsl(var(--foreground)) !important;
  border-color: transparent !important;
}

.ww-button.btn-ghost:hover:not(:disabled):not(.btn-loading) {
  background-color: hsl(var(--accent)) !important;
  color: hsl(var(--accent-foreground)) !important;
}

.ww-button.btn-ghost:active:not(:disabled):not(.btn-loading) {
  background-color: hsl(210, 40%, 94.1%) !important;
}

/* LINK */
.ww-button.btn-link {
  background-color: transparent !important;
  color: hsl(var(--primary)) !important;
  border-color: transparent !important;
  text-decoration: underline !important;
  text-underline-offset: 4px !important;
  padding: 0 !important;
  height: auto !important;
  min-height: auto !important;
}

.ww-button.btn-link:hover:not(:disabled):not(.btn-loading) {
  text-decoration: underline !important;
}

.ww-button.btn-link:active:not(:disabled):not(.btn-loading) {
  color: hsl(222.2, 47.4%, 9.2%) !important;
}

/* ===== SIZES ===== */

/* Small: h-9 px-3 */
.ww-button.btn.btn-sm {
  height: 2.25rem !important;
  padding: 0 0.75rem !important;
  font-size: 0.875rem !important;
}

/* Large: h-11 px-8 */
.ww-button.btn.btn-lg {
  height: 2.75rem !important;
  padding: 0 2rem !important;
  font-size: 1rem !important;
}

/* Icon: square dimensions */
.ww-button.btn.btn-icon {
  height: 2.5rem !important;
  width: 2.5rem !important;
  padding: 0 !important;
}

/* Icon small variant: 36x36px */
.ww-button.btn.btn-icon.btn-sm {
  height: 2.25rem !important;
  width: 2.25rem !important;
  padding: 0 !important;
}

/* Icon large variant: 44x44px */
.ww-button.btn.btn-icon.btn-lg {
  height: 2.75rem !important;
  width: 2.75rem !important;
  padding: 0 !important;
}

/* Exception pour le variant link qui ne doit pas avoir de padding fixe */
.ww-button.btn-link.btn-sm {
  padding: 0 !important;
  height: auto !important;
}

.ww-button.btn-link.btn-lg {
  padding: 0 !important;
  height: auto !important;
}

/* ===== VARIANT ICON - Exactement comme Shadcn ===== */

.ww-button.btn-icon {
  background-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary-foreground)) !important;
  border-color: hsl(var(--primary)) !important;
  height: 2.5rem !important;
  width: 2.5rem !important;
  padding: 0 !important;
  border-radius: calc(var(--radius) - 2px) !important;
}

.ww-button.btn-icon:hover:not(:disabled) {
  background-color: hsl(222.2, 47.4%, 10.2%) !important;
}

/* ===== VARIANT LOADING - État fonctionnel ===== */

.ww-button.btn-loading {
  width: auto !important;
  max-width: none !important;
  min-width: fit-content !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  white-space: nowrap !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-overflow: clip !important;
  overflow: visible !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

.ww-button.btn-loading .button-text {
  text-overflow: clip !important;
  overflow: visible !important;
  white-space: nowrap !important;
  max-width: none !important;
  width: auto !important;
}

.ww-button .loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.ww-button.btn-icon .loading-spinner {
  margin-right: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== ICÔNES LUCIDE ===== */

.ww-button .button-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
  vertical-align: middle;
}

/* Mode icon-only - centrage parfait */
.ww-button.btn-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Gap géré par flexbox gap: 0.5rem sur .btn */
.ww-button .left-icon,
.ww-button .right-icon {
  /* Pas de margin nécessaire avec gap */
}

.ww-button .icon-only {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive des icônes selon la taille */
.ww-button.btn-sm .button-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.ww-button.btn-lg .button-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.ww-button.btn-sm .icon-only {
  width: 1rem;
  height: 1rem;
}

.ww-button.btn-lg .icon-only {
  width: 1.5rem;
  height: 1.5rem;
}
</style>