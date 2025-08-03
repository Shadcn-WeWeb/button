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
      
      // Ajouter la classe de taille seulement si différente de default
      if (size !== 'default') {
        classes.push(`btn-${size}`);
      }
      
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
@import './globals.css';

/* ===== STYLES SPÉCIFIQUES BUTTON ===== */

/* Préfixe WeWeb pour éviter conflits */
.ww-button {
  /* Hérite de .btn dans globals.css */
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