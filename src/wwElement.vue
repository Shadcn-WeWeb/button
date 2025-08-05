<template>
  <component 
    :is="tag"
    :class="dynamicClasses"
    :type="buttonType"
    :disabled="content.disabled"
    v-bind="linkProps"
    @focus="onFocus"
    @blur="onBlur"
    @mousedown="onActivate"
    @mouseup="onDeactivate"
    @touchstart="onTouchActivate"
    @touchend="onDeactivate"
    @keydown.enter="onActivate"
    @keydown.space="onActivate"
    @click="handleClick"
  >
    <wwElement v-if="content.hasLeftIcon" v-bind="content.leftIcon" />
    <i 
      v-if="content.showIcon && content.iconName" 
      :data-lucide="content.iconName"
      class="button-icon"
    ></i>
    <div v-if="content.variant === 'loading'" class="loading-spinner"></div>
    <wwText tag="span" :text="text" class="button-text" />
    <wwElement v-if="content.hasRightIcon" v-bind="content.rightIcon" />
  </component>
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
  setup(props) {
    const { hasLink, linkProps, isEditing } = wwLib.wwElement.useLink({
      ...props,
      options: { linkable: true },
    });
    
    return { hasLink, linkProps, isEditing };
  },
  data() {
    return {
      isReallyFocused: false,
      isReallyActive: false,
    };
  },
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
    tag() {
      if (this.wwEditorState?.isSelected) return 'div';
      if (this.hasLink && !this.isEditing) return 'a';
      return 'button';
    },
    
    buttonType() {
      if (this.tag !== 'button') return undefined;
      return this.content.buttonType || 'button';
    },
    
    text() {
      if (this.content.variant === 'loading') {
        return this.content.loadingText || 'Loading...';
      }
      return this.content.text || 'Button';
    },
    
    dynamicClasses() {
      return {
        'ww-button-shadcn': true,
        'btn': true,
        'focus': this.isReallyFocused,
        'active': this.isReallyActive,
        'disabled': this.content.disabled,
        [`variant-${this.content.variant || 'default'}`]: true,
        [`size-${this.content.size || 'default'}`]: true,
        'loading': this.content.variant === 'loading',
        'icon-only': this.content.variant === 'icon'
      };
    }
  },
  methods: {
    onFocus() {
      this.isReallyFocused = true;
      this.$emit('trigger-event', { name: 'focus' });
    },
    
    onBlur() {
      this.isReallyFocused = false;
      this.$emit('trigger-event', { name: 'blur' });
    },
    
    onActivate() {
      if (!this.content.disabled) {
        this.isReallyActive = true;
      }
    },
    
    onDeactivate() {
      this.isReallyActive = false;
    },
    
    onTouchActivate(event) {
      event.preventDefault();
      this.onActivate();
    },
    
    handleClick(event) {
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
    },
    
    refreshLucide() {
      if (window.lucide) {
        const icons = this.$el.querySelectorAll('[data-lucide]');
        icons.forEach(icon => {
          icon.innerHTML = '';
          icon.removeAttribute('data-icon');
        });
        window.lucide.createIcons();
      }
    }
  },
  
  watch: {
    'content.iconName'() { this.$nextTick(() => this.refreshLucide()); },
    'content.showIcon'() { this.$nextTick(() => this.refreshLucide()); }
  }
};
</script>

<style>
@import './globals.css';

/* ===== ICÔNES LUCIDE ===== */
.ww-button-shadcn .button-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
  vertical-align: middle;
}

.ww-button-shadcn.icon-only .button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive des icônes selon la taille */
.ww-button-shadcn.size-sm .button-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.ww-button-shadcn.size-lg .button-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.ww-button-shadcn.size-sm.icon-only .button-icon {
  width: 1rem;
  height: 1rem;
}

.ww-button-shadcn.size-lg.icon-only .button-icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>