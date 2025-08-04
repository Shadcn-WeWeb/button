# Documentation Complète - Composant utooltip Shadcn UI

Cette documentation détaille tous les aspects du composant utooltip de Shadcn UI avec ses variants, tailles, couleurs et spécifications techniques complètes.

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Installation et Usage](#installation-et-usage)
3. [Configuration](#configuration)
4. [Variants et Options](#variants-et-options)
5. [Système de Couleurs](#système-de-couleurs)
6. [Spécifications CSS](#spécifications-css)
7. [États et Interactions](#états-et-interactions)
8. [Exemples d'Utilisation](#exemples-dutilisation)
9. [Personnalisation Avancée](#personnalisation-avancée)

## Vue d'ensemble

Le composant **utooltip** de Shadcn UI est un composant essentiel qui offre une interface moderne et accessible pour les infobulles contextuelles.

### Caractéristiques Principales
- **Design moderne** conforme aux standards Shadcn UI
- **Accessibilité** native avec support clavier et screen reader
- **Personnalisation** complète via CSS et props
- **Performance** optimisée pour tous les appareils
- **TypeScript** support complet

## Installation et Usage

### Installation via Shadcn CLI
```bash
pnpm dlx shadcn@latest add tooltip
```

### Import et Usage de Base
```jsx
import { utooltip } from "@/components/ui/tooltip"

<utooltip>
  Contenu du composant
</utooltip>
```

## Configuration

### Props Principales
- `variant`: Style variant du composant
- `size`: Taille du composant
- `disabled`: État désactivé
- `className`: Classes CSS additionnelles

### Variants Disponibles
- `default`: Style par défaut
- `secondary`: Style secondaire
- `outline`: Style avec bordure

### Tailles Disponibles
- `sm`: Petite taille
- `default`: Taille standard
- `lg`: Grande taille

## Système de Couleurs

Le composant utilise les variables CSS de Shadcn UI:

```css
--background: hsl(0 0% 100%);
--foreground: hsl(222.2 84% 4.9%);
--primary: hsl(222.2 47.4% 11.2%);
--primary-foreground: hsl(210 40% 98%);
--secondary: hsl(210 40% 96%);
--secondary-foreground: hsl(222.2 84% 4.9%);
--border: hsl(214.3 31.8% 91.4%);
```

## Spécifications CSS

### Structure CSS
```css
.component-base {
  /* Styles de base */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--radius) - 2px);
  transition: colors 0.2s;
}

.component-variant-default {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.component-size-default {
  height: 2.5rem;
  padding: 0 1rem;
  font-size: 0.875rem;
}
```

## États et Interactions

### États Supportés
- **Default**: État normal
- **Hover**: Au survol de la souris
- **Focus**: Lors du focus clavier
- **Active**: Lors du clic
- **Disabled**: État désactivé

### Interactions Clavier
- `Tab`: Navigation entre les éléments
- `Enter/Space`: Activation
- `Escape`: Fermeture (si applicable)

## Exemples d'Utilisation

### Exemple Simple
```jsx
<utooltip>
  Exemple de contenu
</utooltip>
```

### Avec Variants
```jsx
<utooltip variant="outline">
  Avec bordure
</utooltip>
```

### Avec Tailles
```jsx
<utooltip size="lg">
  Grande taille
</utooltip>
```

## Personnalisation Avancée

### Classes CSS Personnalisées
```jsx
<utooltip className="custom-class">
  Personnalisé
</utooltip>
```

### Variables CSS Override
```css
.custom-component {
  --primary: hsl(200 100% 50%);
  --radius: 8px;
}
```

## Intégration WeWeb

Ce composant est optimisé pour WeWeb avec:
- **Configuration ww-config.js** complète
- **Props bindables** dans l'éditeur WeWeb
- **Events triggers** pour les workflows
- **Responsive design** automatique

### Utilisation dans WeWeb
1. Importer le composant depuis GitHub
2. Configurer les props dans le panneau Settings
3. Utiliser les triggers pour les workflows

## Support et Maintenance

- **Documentation officielle**: [shadcn/ui](https://ui.shadcn.com/)
- **Issues GitHub**: Signaler les bugs
- **Communauté**: Discord et GitHub Discussions
- **Updates**: Suivre les releases Shadcn UI

---

*Documentation générée pour la communauté WeWeb - Version 2024*