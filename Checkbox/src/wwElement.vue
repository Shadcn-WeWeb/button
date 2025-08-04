<template>
  <div class="ww-checkbox">
    <div :class="wrapperClasses">
      <div 
        :class="checkboxClasses"
        :aria-checked="isChecked"
        :tabindex="content.disabled ? -1 : 0"
        role="checkbox"
        @click="handleToggle"
        @keydown.space.prevent="handleToggle"
        @keydown.enter.prevent="handleToggle"
      >
        <svg
          v-if="isChecked"
          class="ww-checkbox__check-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        
        <div
          v-else-if="content.indeterminate"
          class="ww-checkbox__indeterminate-icon"
        />
      </div>
      
      <label 
        v-if="content.label"
        :class="labelClasses"
        @click="handleToggle"
      >
        {{ content.label }}
        <span v-if="content.required" class="ww-checkbox__required">*</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnCheckbox',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        label: "Accept terms and conditions",
        checked: false,
        indeterminate: false,
        disabled: false,
        required: false,
        size: "default"
      })
    },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    isChecked() {
      return this.content.indeterminate ? false : this.content.checked
    },

    wrapperClasses() {
      return 'ww-checkbox__wrapper'
    },

    checkboxClasses() {
      const size = this.content.size || 'default'
      return [
        'ww-checkbox__base',
        `ww-checkbox__base--${size}`,
        {
          'ww-checkbox__base--checked': this.isChecked,
          'ww-checkbox__base--unchecked': !this.isChecked && !this.content.indeterminate,
          'ww-checkbox__base--disabled': this.content.disabled,
          'ww-checkbox__base--indeterminate': this.content.indeterminate
        }
      ]
    },

    labelClasses() {
      return [
        'ww-checkbox__label',
        {
          'ww-checkbox__label--disabled': this.content.disabled
        }
      ]
    }
  },
  methods: {
    handleToggle() {
      if (this.content.disabled) return

      const newChecked = !this.content.checked
      
      const eventData = {
        checked: newChecked,
        label: this.content.label,
        content: this.content
      }

      this.$emit('trigger-event', { 
        domEvent: null, 
        value: eventData 
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

/* Wrapper */
.ww-checkbox__wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Checkbox Base */
.ww-checkbox__base {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.ww-checkbox__base:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

/* Sizes */
.ww-checkbox__base--sm {
  width: 16px;
  height: 16px;
}

.ww-checkbox__base--default {
  width: 20px;
  height: 20px;
}

.ww-checkbox__base--lg {
  width: 24px;
  height: 24px;
}

/* States */
.ww-checkbox__base--unchecked {
  border-color: hsl(var(--border));
}

.ww-checkbox__base--unchecked:hover:not(.ww-checkbox__base--disabled) {
  border-color: hsl(var(--primary));
}

.ww-checkbox__base--checked {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.ww-checkbox__base--checked:hover:not(.ww-checkbox__base--disabled) {
  background-color: hsl(var(--primary) / 0.9);
  border-color: hsl(var(--primary) / 0.9);
}

.ww-checkbox__base--indeterminate {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.ww-checkbox__base--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Icons */
.ww-checkbox__check-icon {
  width: 12px;
  height: 12px;
}

.ww-checkbox__base--sm .ww-checkbox__check-icon {
  width: 10px;
  height: 10px;
}

.ww-checkbox__base--lg .ww-checkbox__check-icon {
  width: 14px;
  height: 14px;
}

.ww-checkbox__indeterminate-icon {
  width: 8px;
  height: 2px;
  background-color: currentColor;
  border-radius: 1px;
}

.ww-checkbox__base--sm .ww-checkbox__indeterminate-icon {
  width: 6px;
  height: 2px;
}

.ww-checkbox__base--lg .ww-checkbox__indeterminate-icon {
  width: 10px;
  height: 2px;
}

/* Label */
.ww-checkbox__label {
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  color: hsl(var(--foreground));
  cursor: pointer;
  user-select: none;
}

.ww-checkbox__label--disabled {
  color: hsl(var(--muted-foreground));
  cursor: not-allowed;
}

/* Required asterisk */
.ww-checkbox__required {
  color: hsl(var(--destructive));
  margin-left: 4px;
  font-weight: 500;
}
</style>