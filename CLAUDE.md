
# CLAUDE.md - Guide Complet Composants Shadcn UI pour WeWeb

Cette documentation compile toutes les bonnes pratiques apprises lors du développement du composant Button Shadcn UI pour WeWeb, **basée sur l'analyse du button de référence WeWeb officiel**.

## 🎯 Philosophie Composant WeWeb Officielle

### Principes Fondamentaux Validés
1. **Respect strict de Shadcn UI** - Couleurs, variants, et comportements EXACTS
2. **CSS Variables Shadcn** - Variables locales dans style scoped
3. **WeWeb Native Compatibility** - États et interactions WeWeb standards  
4. **Template Dynamique** - `<component :is="tag">` intelligent
5. **Zero Hardcoding** - Variables CSS et spécificité (pas !important)

## 🏗️ Architecture WeWeb Officielle

### Structure de Fichiers WeWeb (Validée)
```
ComponentName/
├── src/
│   └── wwElement.vue          # SEUL fichier Vue nécessaire
├── package.json               # Scripts WeWeb standard (build, serve, create-config)
├── ww-config.js              # Configuration WeWeb complète
├── AI.md                     # Documentation composant
└── README.md                 # (optionnel)
```

### Template Vue WeWeb (Pattern Officiel)
```vue
<template>
  <component 
    :is="tag"
    :class="dynamicClasses"
    :type="buttonType"
    :disabled="content.disabled"
    v-bind="properties"
    @focus="onFocus"
    @blur="onBlur"
    @mousedown="onActivate"
    @mouseup="onDeactivate"
    @touchstart="onTouchActivate"
    @touchend="onDeactivate"
    @keydown.enter="onActivate"
    @keydown.space="onActivate"
  >
    <wwElement v-if="content.hasLeftIcon" v-bind="content.leftIcon" />
    <wwText tag="span" :text="text" />  
    <wwElement v-if="content.hasRightIcon" v-bind="content.rightIcon" />
  </component>
</template>
```

## 🎨 Système CSS Shadcn

### Variables CSS Shadcn (Obligatoires)
```css
/* Toujours inclure ces variables exactes */
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
  /* ... autres couleurs dark mode */
}
```

### Structure CSS WeWeb Scoped (Validée)
```scss
<style lang="scss" scoped>
.ww-component-shadcn {
  // Variables Shadcn locales
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
  
  // Base Shadcn exacte
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(var(--radius) - 2px);
  
  // États WeWeb avec feedback visuel
  &.focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }
  
  &.active {
    transform: scale(0.98);
  }
  
  // Variants Shadcn avec variables
  &.variant-default {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }
  
  // Sizes avec rem
  &.size-sm {
    height: 2.25rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
```

## ⚙️ Logique JavaScript WeWeb

### Computed Classes WeWeb (Pattern Officiel)
```javascript
computed: {
  tag() {
    // Mode édition -> div (évite conflits éditeur)
    if (this.wwEditorState?.isSelected) return 'div';
    // Mode lien -> tag lien (useLink WeWeb)
    if (this.hasLink && !this.isEditing) return 'a';
    // Mode button -> button standard
    return 'button';
  },
  
  dynamicClasses() {
    return {
      'ww-component-shadcn': true,
      'focus': this.isReallyFocused,
      'active': this.isReallyActive,
      'disabled': this.content.disabled,
      [`variant-${this.content.variant || 'default'}`]: true,
      [`size-${this.content.size || 'default'}`]: true
    };
  }
}
```

### Event Handling WeWeb (Pattern Officiel)  
```javascript
setup(props) {
  // useLink WeWeb pour liens
  const { hasLink, linkProps, isEditing } = wwLib.wwElement.useLink({
    ...props,
    options: { linkable: true },
  });
  return { hasLink, linkProps, isEditing };
},

data() {
  return {
    isReallyFocused: false,    // Focus réel (pas programmatique)
    isReallyActive: false,     // État activation interaction
  };
},

methods: {
  // FOCUS: Gestion focus réel WeWeb
  onFocus() {
    this.isReallyFocused = true;
    this.$emit('trigger-event', { name: 'focus' });
  },
  
  onBlur() {
    this.isReallyFocused = false;
    this.$emit('trigger-event', { name: 'blur' });
  },
  
  // ACTIVATION: Feedback visuel WeWeb
  onActivate() {
    if (!this.content.disabled) {
      this.isReallyActive = true;
    }
  },
  
  onDeactivate() {
    this.isReallyActive = false;
  }
}
```

## 📋 Configuration WeWeb Officielle

### Structure ww-config.js Validée (Référence WeWeb)
```javascript
export default {
  // HÉRITAGE WeWeb natif
  inherit: 'ww-text',
  
  // OPTIONS WeWeb standard
  options: {
    autoByContent: true,
    displayAllowedValues: ['flex', 'inline-flex'],
    linkable: true,
  },
  
  // ÉDITEUR avec UX avancée
  editor: {
    label: { en: 'Shadcn Button', fr: 'Bouton Shadcn' },
    icon: 'cursor-click',
    
    // INFO TAGS contextuels (Pattern WeWeb)
    infoTags: content => {
      if (content.variant && content.variant !== 'default') {
        return {
          color: 'var(--ww-color-blue-500)',
          backgroundColor: 'var(--ww-color-blue-100)',
          text: content.variant.toUpperCase()
        };
      }
      return [];
    },
    
    // WORKFLOW HINTS intelligents (Pattern WeWeb)
    workflowHint: content => {
      if (content.buttonType === 'submit') {
        return {
          type: 'warning',
          header: { en: 'Form submission warning' },
          text: { en: 'Consider triggering workflows on form container instead.' }
        };
      }
    }
  },
  
  // EVENTS WeWeb complets
  triggerEvents: [
    { name: 'click', default: true },
    { name: 'focus' },
    { name: 'blur' }, 
    { name: 'keydown' },
    { name: 'keyup' }
  ],
  
  properties: {
    // STYLE - Variants Shadcn
    variant: {
      section: 'style',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'default', label: { en: 'Default (Primary)' }, default: true },
          { value: 'destructive', label: { en: 'Destructive' } },
          { value: 'outline', label: { en: 'Outline' } },
          { value: 'secondary', label: { en: 'Secondary' } },
          { value: 'ghost', label: { en: 'Ghost' } },
          { value: 'link', label: { en: 'Link' } }
        ]
      }
    },
    
    // BEHAVIOR - État WeWeb
    disabled: {
      section: 'behavior',
      type: 'OnOff',
      bindable: true,
      defaultValue: false
    }
  }
};
```

## 🔧 Règles CSS WeWeb Validées

### ❌ ÉVITER - Patterns Obsolètes
```css
/* MAUVAIS - !important partout */
.ww-button.btn-default {
  background-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary-foreground)) !important;
}

/* MAUVAIS - Préfixes multiples */
.ww-component-name.base-class.base-variant {
  property: value !important;
}

/* MAUVAIS - globals.css */
/* Fichier globals.css - WeWeb ne le supporte pas */
```

### ✅ CORRECT - WeWeb Scoped Officiel
```scss
<style lang="scss" scoped>
.ww-button-shadcn {
  // Variables locales
  --primary: 222.2 47.4% 11.2%;
  
  // Base sans !important
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  
  // États avec classes
  &.variant-destructive {
    background-color: hsl(var(--destructive));
  }
  
  &.focus {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }
}
</style>
```

## 🚨 Limitations WeWeb CRITIQUES

### ❌ CSS Moderne NON SUPPORTÉ
```css
/* ❌ INTERDIT - WeWeb ne supporte PAS */
@layer components { }     /* Layers CSS */
@container (min-width: 200px) { }  /* Container queries */
:has(.child) { }          /* :has() selector */
@scope (.parent) { }      /* CSS Scoping */
color-mix(in srgb, red, blue)  /* CSS Functions modernes */

/* ✅ AUTORISÉ - CSS basique seulement */
.ww-component.class {
  property: value !important;
}
```

### ❌ JavaScript Moderne LIMITÉ  
```javascript
// ❌ INTERDIT - Features avancées
window.lucide.createIcons({ scope: element }); // Scope non supporté
element.animate({ opacity: 1 }); // Web Animations API
new IntersectionObserver(); // APIs modernes limitées

// ✅ AUTORISÉ - JavaScript basique
window.lucide.createIcons(); // Global seulement
element.innerHTML = ''; // DOM basique
querySelectorAll('[data-lucide]'); // Sélecteurs classiques
```

### ❌ COMMENTAIRES EXCESSIFS CASSENT LA SÉLECTION ⚠️ CRITIQUE
```html
<!-- ❌ INTERDIT - Commentaires HTML dans templates Vue -->
<!-- 
  COMPOSANT DESCRIPTION
  Long commentaire qui casse la sélection WeWeb
-->
<template>
  <!-- Commentaire qui perturbe WeWeb -->
  <button>Content</button>
</template>
```

```javascript 
// ❌ INTERDIT - Commentaires JS excessifs
/**
 * LONGUE DOCUMENTATION
 * Description détaillée qui interfère avec WeWeb
 */
export default {
  // Commentaires multiples qui posent problème
  methods: {
    // Chaque méthode commentée
  }
}
```

```css
/* ❌ INTERDIT - Commentaires CSS détaillés */
/* 
  ===== SECTION LONGUE =====
  Description extensive qui perturbe le parsing WeWeb
*/
.class {
  /* Commentaire sur chaque propriété */
  property: value;
}
```

**✅ SOLUTION - Code minimal et auto-documenté**
```vue
<template>
  <button :class="computedClasses" @click="handleClick">
    <span>{{ content.text }}</span>
  </button>
</template>

<script>
export default {
  name: 'ComponentName',
  props: { content: Object },
  computed: {
    computedClasses() {
      return ['ww-component', `variant-${this.content.variant}`];
    }
  }
}
</script>
```

## 🎯 Patterns WeWeb Validés

### Gestion des États WeWeb
```javascript
// États WeWeb standard requis
data() {
  return {
    isReallyFocused: false,    // Focus réel (pas programmatique)
    isReallyActive: false,     // État activation interaction
  };
}

// Classes dynamiques avec objet
computed: {
  dynamicClasses() {
    return {
      'ww-component-shadcn': true,
      'focus': this.isReallyFocused,
      'active': this.isReallyActive,
      'disabled': this.content.disabled,
      [`variant-${this.content.variant || 'default'}`]: true
    };
  }
}
```

### useLink WeWeb Pattern
```javascript
setup(props) {
  // Intégration liens WeWeb native
  const { hasLink, linkProps, isEditing } = wwLib.wwElement.useLink({
    ...props,
    options: { linkable: true },
  });
  
  return { hasLink, linkProps, isEditing };
}
```

### Icon Integration Pattern
```javascript
// Lucide Icons dynamique - WeWeb Compatible
mounted() {
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
  this.$nextTick(() => {
    if (window.lucide) {
      // Nettoyer les icônes existantes pour mise à jour
      const icons = this.$el.querySelectorAll('[data-lucide]');
      icons.forEach(icon => {
        icon.innerHTML = '';
        icon.removeAttribute('data-icon');
      });
      window.lucide.createIcons();
    }
  });
},
// Watchers pour mise à jour dynamique des icônes
watch: {
  'content.iconName'() { this.$nextTick(() => this.refreshLucide()); },
  'content.showIcon'() { this.$nextTick(() => this.refreshLucide()); }
}
```

## 🚀 Checklist Composant Fini

### Avant Commit Final
- [ ] **CSS Variables** - Toutes les couleurs utilisent `hsl(var(--variable))`
- [ ] **Préfixes CSS** - Toutes les classes ont le préfixe `ww-component`
- [ ] **!important** - Tous les styles critiques forcés avec `!important`
- [ ] **Variants Exacts** - Correspondent exactement à Shadcn UI
- [ ] **Responsive** - Fonctionne sur mobile et desktop
- [ ] **WeWeb Compatible** - Sélectionnable et configurable dans l'éditeur
- [ ] **Zero Hardcoding** - Aucune couleur/dimension hardcodée
- [ ] **Template Propre** - Logique claire avec variants conditionnels
- [ ] **Events WeWeb** - Intégration complète avec les workflows
- [ ] **⚠️ Code Minimal** - AUCUN commentaire excessif (critique pour sélection)

### Test Final
1. **WeWeb Editor** - Composant sélectionnable et configurable
2. **Tous Variants** - Chaque variant fonctionne visuellement
3. **Toutes Tailles** - Dimensions correctes pour chaque size
4. **États Hover/Focus** - Interactions Shadcn exactes
5. **Mobile Responsive** - Affichage correct sur petit écran

## 💡 Leçons Apprises - Button

### Erreurs à Éviter
1. **Complexité inutile** - Garder la logique simple comme Shadcn
2. **Hardcoding couleurs** - TOUJOURS utiliser les variables CSS
3. **Oublier les conflits** - WeWeb a ses propres styles, utiliser préfixes
4. **Template compliqué** - Structure claire avec variants conditionnels
5. **CSS générique** - Spécifier `.ww-component.class` pour la spécificité
6. **⚠️ COMMENTAIRES EXCESSIFS** - CASSENT LA SÉLECTION WEWEB (découverte critique)

### Patterns qui Marchent
1. **Variables HSL** - `hsl(var(--primary))` pour toutes les couleurs
2. **Classes Composées** - `ww-button btn btn-default btn-lg`
3. **!important Strategic** - Sur les propriétés critiques uniquement
4. **Template Variants** - `v-if="variant === 'specific'"` pour logique claire
5. **CSS Defensive** - Surcharger les propriétés WeWeb problématiques
6. **Code Minimal** - Aucun commentaire, code auto-documenté (découverte critique)

## 🎨 Spécificités Button Réussies

### Variants Finaux Fonctionnels
- **default** - `hsl(var(--primary))` + hover à 90% opacité
- **destructive** - `hsl(var(--destructive))` rouge vif 
- **outline** - Transparent + bordure `hsl(var(--border))`
- **secondary** - `hsl(var(--secondary))` gris clair
- **ghost** - Transparent + hover `hsl(var(--accent))`
- **link** - `hsl(var(--primary))` + underline
- **icon** - 40x40px carré + couleurs primary
- **loading** - Couleurs primary + spinner + texte complet

### CSS Patterns Validés
```css
/* Préfixe WeWeb pour éviter conflicts */
.ww-button.btn {
  /* Base Shadcn exacte */
}

/* Variants avec variables */
.ww-button.btn-default {
  background-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary-foreground)) !important;
}

/* Sizes précises */
.ww-button.btn-sm {
  height: 2.25rem !important;
  padding: 0.5rem 0.75rem !important;
}

/* États spéciaux */
.ww-button.btn-loading {
  width: auto !important;
  text-overflow: clip !important;
}
```

# 🎯 RÈGLES WEWEB OFFICIELLES - Basées sur Button Référence

## 🏆 **RÈGLE FONDAMENTALE - Architecture WeWeb Standard**

### **Structure Fichiers WeWeb (Validée)**
```
ComponentName/
├── src/
│   └── wwElement.vue          # SEUL fichier Vue nécessaire
├── package.json               # Scripts WeWeb standard (build, serve, create-config)
├── ww-config.js              # Configuration WeWeb complète
├── AI.md                     # Documentation composant
└── README.md                 # (optionnel)
```

### **Scripts Package.json Obligatoires**
```json
{
  "scripts": {
    "build": "weweb build",
    "serve": "weweb serve", 
    "create-config": "weweb config"
  }
}
```

## 🏆 **RÈGLE TEMPLATE VUE - Pattern Officiel WeWeb**

### **Template Dynamique (Validé par Référence)**
```vue
<template>
  <component 
    :is="tag"
    :class="dynamicClasses"
    :type="buttonType"
    :disabled="content.disabled"
    v-bind="properties"
    @focus="onFocus"
    @blur="onBlur"
    @mousedown="onActivate"
    @mouseup="onDeactivate"
    @touchstart="onActivate"
    @touchend="onDeactivate"
    @keydown.enter="onActivate"
    @keydown.space="onActivate"
  >
    <wwElement v-if="content.hasLeftIcon" v-bind="content.leftIcon" />
    <wwText tag="span" :text="text" />  
    <wwElement v-if="content.hasRightIcon" v-bind="content.rightIcon" />
  </component>
</template>
```

### **Computed Tag Intelligent (Pattern WeWeb)**
```javascript
computed: {
  tag() {
    // Mode édition -> div (évite conflits éditeur)
    if (this.wwEditorState?.isSelected) return 'div';
    // Mode lien -> tag lien (useLink WeWeb)
    if (this.hasLink && !this.isEditing) return 'a';
    // Mode button -> button standard
    return 'button';
  }
}
```

## 🏆 **RÈGLE ÉTATS WEWEB - Gestion Avancée Validée**

### **États WeWeb Standard (Requis)**
```javascript
data() {
  return {
    isReallyFocused: false,    // Focus réel (pas programmatique)
    isReallyActive: false,     // État activation interaction
  };
}
```

### **Classes Dynamiques WeWeb + Shadcn**
```javascript
computed: {
  dynamicClasses() {
    return {
      'ww-button-shadcn': true,
      'focus': this.isReallyFocused,
      'active': this.isReallyActive,
      'disabled': this.content.disabled,
      [`variant-${this.content.variant}`]: this.content.variant,
      [`size-${this.content.size}`]: this.content.size
    };
  }
}
```

## 🏆 **RÈGLE CONFIGURATION WEWEB - Pattern Officiel**

### **ww-config.js Structure Validée**
```javascript
export default {
  // HÉRITAGE WeWeb natif
  inherit: 'ww-text',
  
  // OPTIONS WeWeb standard
  options: {
    autoByContent: true,
    displayAllowedValues: ['flex', 'inline-flex'],
    linkable: true,
  },
  
  // ÉDITEUR avec UX avancée
  editor: {
    label: { en: 'Button', fr: 'Bouton' },
    icon: 'cursor-click',
    
    // INFO TAGS contextuels (Pattern WeWeb)
    infoTags: content => {
      if (content.buttonType && INFO[content.buttonType]) {
        return {
          color: 'var(--ww-color-blue-500)',
          backgroundColor: 'var(--ww-color-blue-100)',
          text: INFO[content.buttonType].toUpperCase()
        };
      }
    },
    
    // WORKFLOW HINTS intelligents (Pattern WeWeb)
    workflowHint: content => {
      if (content.buttonType === 'submit') {
        return {
          type: 'warning',
          header: { en: 'Form submission warning' },
          text: { en: 'Consider triggering workflows on form container instead.' }
        };
      }
    }
  },
  
  // EVENTS WeWeb complets
  triggerEvents: [
    { name: 'click', default: true },
    { name: 'focus' },
    { name: 'blur' }, 
    { name: 'keydown' },
    { name: 'keyup' }
  ]
};
```

## 🏆 **RÈGLE CSS - Style Scoped SEULEMENT**

### **❌ INTERDICTION ABSOLUE globals.css**
- WeWeb ne supporte PAS les globals.css correctement
- Utiliser SEULEMENT `<style lang="scss" scoped>`

### **✅ CSS Scoped avec Variables Shadcn**
```scss
<style lang="scss" scoped>
.ww-button-shadcn {
  // Variables Shadcn locales si pas globales
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
  
  // Base Shadcn exacte
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
  
  // États WeWeb avec feedback visuel
  &.focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }
  
  &.active {
    transform: scale(0.98);
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Variants Shadcn avec variables
  &.variant-default {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    
    &:hover:not(.disabled) {
      background-color: hsl(var(--primary) / 0.9);
    }
  }
  
  &.variant-destructive {
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
  }
  
  // Sizes avec rem
  &.size-sm {
    height: 2.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  &.size-default {
    height: 2.5rem;
    padding: 0.5rem 1rem;
  }
  
  &.size-lg {
    height: 2.75rem;
    padding: 0.5rem 2rem;
  }
}
</style>
```

## 🏆 **RÈGLE EVENT HANDLING - Pattern WeWeb Complet**

### **Méthodes Interaction WeWeb Standard**
```javascript
setup(props) {
  // useLink WeWeb pour liens
  const { hasLink, linkProps, isEditing } = wwLib.wwElement.useLink({
    ...props,
    options: { linkable: true },
  });
  
  return { hasLink, linkProps, isEditing };
},

methods: {
  // FOCUS: Gestion focus réel WeWeb
  onFocus() {
    this.isReallyFocused = true;
    this.$emit('trigger-event', { name: 'focus' });
  },
  
  onBlur() {
    this.isReallyFocused = false;
    this.$emit('trigger-event', { name: 'blur' });
  },
  
  // ACTIVATION: Feedback visuel WeWeb
  onActivate() {
    if (!this.content.disabled) {
      this.isReallyActive = true;
    }
  },
  
  onDeactivate() {
    this.isReallyActive = false;
  },
  
  // TOUCH: Gestion tactile WeWeb
  onTouchActivate(event) {
    event.preventDefault(); // Évite conflits mouse
    this.onActivate();
  }
}
```

## 🚨 **INTERDICTIONS CRITIQUES WEWEB**

### **❌ NEVER - Patterns qui Cassent WeWeb**
1. **globals.css** - WeWeb ne le supporte pas
2. **Commentaires excessifs** - Cassent la sélection WeWeb
3. **CSS moderne** (@layer, @container, :has()) - Non supporté
4. **!important** - Éviter, utiliser spécificité CSS
5. **JavaScript moderne avancé** - APIs limitées

### **✅ ALWAYS - Patterns WeWeb Validés**
1. **Style scoped uniquement** 
2. **Variables CSS Shadcn locales**
3. **Template `<component :is="tag">`**
4. **États `isReallyFocused`, `isReallyActive`**
5. **useLink WeWeb pour liens**
6. **Events complets WeWeb**

---

Cette documentation servira de référence OFFICIELLE pour tous les autres composants Shadcn UI à développer.