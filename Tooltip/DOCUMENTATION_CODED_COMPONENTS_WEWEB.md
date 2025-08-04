# Documentation Complète - Coded Components WeWeb

Cette documentation fournit une guide complète pour créer et configurer des coded components dans WeWeb, basée sur la documentation officielle 2024.

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture des Components](#architecture-des-components)
3. [Configuration ww-config.js](#configuration-ww-configjs)
4. [Structure Vue Component](#structure-vue-component)
5. [Types de Propriétés](#types-de-propriétés)
6. [Développement Local](#développement-local)
7. [Génération avec IA](#génération-avec-ia)
8. [Exemples Pratiques](#exemples-pratiques)
9. [Bonnes Pratiques](#bonnes-pratiques)

## Vue d'ensemble

Les **Coded Components** WeWeb permettent de créer des composants personnalisés avec un code complet tout en conservant l'expérience d'édition visuelle de WeWeb. Ils offrent une flexibilité maximale pour implémenter des bibliothèques spécifiques et créer des interactions uniques.

### Avantages Clés
- **Génération IA** : Création de composants complexes par description en langage naturel
- **Bibliothèques externes** : Intégration de librairies non disponibles nativement dans WeWeb
- **Personnalisation complète** : Contrôle total sur l'apparence et le comportement
- **Éléments interactifs** : Triggers personnalisés, actions et variables exposées

## Architecture des Components

### Structure Principale

Un coded component WeWeb se compose de **deux fichiers essentiels** :

1. **Composant Vue** : `src/wwElement.vue` ou `src/wwSection.vue`
2. **Configuration** : `ww-config.js`

### Types de Components

1. **Elements** (`wwElement.vue`)
   - Blocs plus petits utilisables par les sections
   - Peuvent être répétés
   - Hauteur généralement ≤ 300px

2. **Sections** (`wwSection.vue`)
   - Blocs larges autonomes
   - Ne peuvent pas être utilisés dans d'autres composants
   - Hauteur généralement > 300px

## Configuration ww-config.js

Le fichier `ww-config.js` décrit les propriétés et métadonnées de votre composant.

### Structure de Base

```javascript
export default {
  editor: {
    label: { 
      en: "Mon Composant",
      fr: "Mon Composant" 
    },
    noHover: false, // Désactive les effets de survol par défaut
    infoTag: content => ({
      color: 'var(--ww-color-blue-500)',
      backgroundColor: 'var(--ww-color-blue-100)',
      text: 'BTN',
      action: () => console.log('Tag clicked')
    }),
    bubble: {
      icon: 'star',
      tooltip: { en: 'Special component' }
    }
  },
  options: {
    autoByContent: false, // Ajuste automatiquement la largeur au contenu
    sizable: true,        // Active les poignées de redimensionnement
    hyperlink: true       // Permet l'encapsulation dans une balise <a>
  },
  properties: {
    // Définition des propriétés (voir section suivante)
  },
  triggerEvents: [
    // Événements personnalisés (voir section suivante)
  ]
}
```

### Configuration des Options

```javascript
options: {
  // Largeur automatique basée sur le contenu
  autoByContent: true,
  
  // Active les poignées de redimensionnement visuel
  sizable: true,
  
  // Permet l'encapsulation dans un lien hypertexte
  hyperlink: true
}
```

## Structure Vue Component

### Template de Base

```vue
<template>
  <div class="mon-composant">
    <button 
      :class="buttonClass"
      :style="buttonStyle"
      :disabled="content.disabled"
      @click="handleClick"
    >
      <!-- Icône gauche -->
      <wwElement 
        v-if="content.leftIcon"
        v-bind="content.leftIcon"
        class="icon-left"
      />
      
      <!-- Texte du bouton -->
      <span v-if="content.text">{{ content.text }}</span>
      
      <!-- Icône droite -->
      <wwElement 
        v-if="content.rightIcon"
        v-bind="content.rightIcon"
        class="icon-right"
      />
    </button>
  </div>
</template>

<script>
export default {
  name: 'MonComposant',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  emits: ['trigger-event'],
  computed: {
    buttonClass() {
      return [
        'btn',
        `btn-${this.content.variant || 'default'}`,
        `btn-${this.content.size || 'default'}`
      ]
    },
    buttonStyle() {
      return {
        '--custom-color': this.content.customColor || '#000'
      }
    }
  },
  methods: {
    handleClick() {
      // Émission d'événement WeWeb
      this.$emit('trigger-event', {
        name: 'click',
        event: {
          domEvent: event,
          value: this.content.text
        }
      })
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-default {
  background-color: hsl(222.2, 47.4%, 11.2%);
  color: white;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid hsl(214.3, 31.8%, 91.4%);
  color: hsl(222.2, 47.4%, 11.2%);
}
</style>
```

## Types de Propriétés

### Propriétés de Base

```javascript
properties: {
  // Texte simple
  text: {
    label: { en: "Button Text", fr: "Texte du Bouton" },
    type: "Text",
    section: "content",
    defaultValue: "Click me"
  },
  
  // Couleur
  backgroundColor: {
    label: { en: "Background Color" },
    type: "Color",
    section: "style",
    defaultValue: "#3b82f6"
  },
  
  // Booléen
  disabled: {
    label: { en: "Disabled" },
    type: "OnOff",
    section: "behavior",
    defaultValue: false
  },
  
  // Sélection
  variant: {
    label: { en: "Variant" },
    type: "TextSelect",
    section: "style",
    options: {
      options: [
        { value: "default", label: { en: "Default" } },
        { value: "outline", label: { en: "Outline" } },
        { value: "ghost", label: { en: "Ghost" } }
      ]
    },
    defaultValue: "default"
  },
  
  // Nombre
  borderRadius: {
    label: { en: "Border Radius" },
    type: "Number",
    section: "style",
    options: {
      min: 0,
      max: 50,
      step: 1,
      suffix: "px"
    },
    defaultValue: 6
  }
}
```

### Propriétés Avancées

```javascript
properties: {
  // Élément WeWeb imbriqué
  leftIcon: {
    label: { en: "Left Icon" },
    type: "Element",
    section: "content",
    options: {
      placeholder: "Drag an icon here"
    },
    defaultValue: {
      isWwObject: true,
      type: "ww-icon"
    }
  },
  
  // Collection de données
  items: {
    label: { en: "Items" },
    type: "Info",
    section: "data",
    options: {
      text: { en: "Connect to a collection" }
    },
    bindable: true
  },
  
  // URL/Lien
  href: {
    label: { en: "Link" },
    type: "Text",
    section: "behavior",
    bindable: true,
    options: {
      placeholder: "https://example.com"
    }
  }
}
```

### Organisation en Sections

```javascript
properties: {
  // Contenu
  text: {
    section: "content", // Tab "Content"
    // ...
  },
  
  // Style
  variant: {
    section: "style",   // Tab "Style"
    // ...
  },
  
  // Comportement
  disabled: {
    section: "behavior", // Tab "Settings" 
    // ...
  }
}
```

## Développement Local

### Installation et Configuration

```bash
# Création d'un nouveau composant
npm init @weweb/component mon-bouton --type element

# ou avec yarn
yarn create @weweb/component mon-bouton --type element

# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run serve
```

### Configuration HTTPS

1. Aller sur `https://localhost:8080`
2. Cliquer sur "Continuer vers localhost"
3. Dans WeWeb Editor, aller dans l'onglet "Dev"
4. Ajouter l'URL de développement : `https://localhost:8080`

### Structure de Fichiers

```
mon-composant/
├── src/
│   └── wwElement.vue        # Composant Vue principal
├── ww-config.js            # Configuration WeWeb
├── package.json            # Dépendances npm
└── test-final.html         # Fichier de test local
```

## Génération avec IA

### Interface IA WeWeb

Pour générer un coded component avec l'IA :

1. Ouvrir le panneau de chat IA dans WeWeb
2. Décrire le composant souhaité en détail
3. Spécifier les bibliothèques externes si nécessaire
4. Définir les propriétés désirées

### Exemples de Prompts IA

```
Crée un composant bouton type Shadcn UI avec les variantes suivantes :
- default (fond sombre)
- outline (transparent avec bordure) 
- destructive (rouge pour les actions dangereuses)
- ghost (transparent avec hover)

Inclut les propriétés :
- text (texte du bouton)
- variant (sélection de variante)
- size (sm, default, lg)
- disabled (état désactivé)
- leftIcon et rightIcon (éléments WeWeb)

Utilise les couleurs HSL exactes de Shadcn UI.
```

```
Crée un composant graphique en ligne utilisant Chart.js avec :
- Propriétés pour les données (bindable à une collection)
- Couleurs personnalisables pour la ligne et l'arrière-plan
- Titre du graphique éditable
- Animation configurable
- Responsive design
```

## Exemples Pratiques

### Exemple 1 : Bouton Simple

**ww-config.js :**
```javascript
export default {
  editor: {
    label: { 
      en: "Custom Button",
      fr: "Bouton Personnalisé"
    }
  },
  properties: {
    text: {
      label: { en: "Text" },
      type: "Text",
      section: "content",
      defaultValue: "Click me"
    },
    variant: {
      label: { en: "Variant" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "primary", label: { en: "Primary" } },
          { value: "secondary", label: { en: "Secondary" } }
        ]
      },
      defaultValue: "primary"
    }
  },
  triggerEvents: [
    {
      name: "click",
      label: { en: "On Click" },
      event: {
        value: ""
      }
    }
  ]
}
```

### Exemple 2 : Card avec Contenu Dynamique

**ww-config.js :**
```javascript
export default {
  editor: {
    label: { en: "Dynamic Card" }
  },
  properties: {
    title: {
      label: { en: "Title" },
      type: "Text",
      section: "content",
      bindable: true
    },
    image: {
      label: { en: "Image" },
      type: "Element",
      section: "content",
      defaultValue: {
        isWwObject: true,
        type: "ww-image"
      }
    },
    showButton: {
      label: { en: "Show Button" },
      type: "OnOff",
      section: "behavior",
      defaultValue: true
    }
  }
}
```

## Bonnes Pratiques

### 1. Structure du Code

- **Composant racine unique** : Éviter les fragments dans le template
- **Props content** : Toujours valider et typer le prop `content`
- **Émission d'événements** : Utiliser `trigger-event` pour les interactions WeWeb

### 2. Configuration

- **Propriétés obligatoires** : Définir toutes les propriétés dans `ww-config.js`
- **Sections logiques** : Organiser les propriétés en sections cohérentes
- **Valeurs par défaut** : Toujours fournir des `defaultValue`

### 3. Styles

- **Styles scoped** : Utiliser les styles scoped Vue pour éviter les conflits
- **Variables CSS** : Utiliser les variables CSS pour les valeurs dynamiques
- **Éviter les styles fixes** : Ne pas définir padding/margin gérés par WeWeb

### 4. Performance

- **Computed properties** : Utiliser les propriétés calculées pour les transformations
- **Event handling** : Optimiser la gestion des événements
- **Réactivité** : Éviter les opérations coûteuses dans les watchers

### 5. Accessibilité

- **ARIA labels** : Ajouter les attributs d'accessibilité appropriés
- **Focus management** : Gérer correctement le focus clavier
- **Contrastes** : Respecter les ratios de contraste

### 6. Tests

- **Test local** : Utiliser `test-final.html` pour tester toutes les variantes
- **Validation** : Vérifier le comportement dans l'éditeur WeWeb
- **Responsive** : Tester sur différentes tailles d'écran

## Déploiement et Publication

### Build de Production

```bash
npm run build
```

### Versioning avec Git

WeWeb utilise GitHub pour versionner les composants :

1. Commit des changements
2. Tag de version (`git tag v1.0.0`)
3. Push avec tags (`git push --tags`)

### Publication

1. Push du composant sur GitHub
2. Configuration dans WeWeb pour pointer vers le repository
3. Sélection de la version à utiliser

---

Cette documentation couvre tous les aspects essentiels des coded components WeWeb. Pour des cas d'usage spécifiques, consultez la documentation officielle WeWeb Developer Docs (developer.weweb.io) et n'hésitez pas à utiliser l'IA WeWeb pour générer des composants personnalisés.