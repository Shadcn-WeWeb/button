export default {
  editor: {
    label: {
      en: "Shadcn UI Button",
      fr: "Bouton Shadcn UI"
    },
    icon: "fa-regular fa-square",
    bubble: {
      icon: "button",
      tooltip: { 
        en: "Shadcn UI Button Component", 
        fr: "Composant Bouton Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["variant", "size"],
      ["disabled", "type"],
      ["leftIcon", "rightIcon"]
    ],
    customSettingsPropertiesOrder: [
      "text",
      "variant", 
      "size",
      "showIcon",
      "iconName",
      "loadingText",
      "disabled",
      "type"
    ]
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: true
  },
  triggerEvents: [
    {
      name: "trigger-event",
      label: { en: "On click", fr: "Au clic" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    // ===== CONTENU =====
    text: {
      label: { en: "Button text", fr: "Texte du bouton" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "Click me"
      },
      bindable: true,
      defaultValue: "Button"
    },

    // ===== STYLE =====
    variant: {
      label: { en: "Variant", fr: "Variante" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "default", label: { en: "Default (Primary)", fr: "Par défaut (Principal)" } },
          { value: "destructive", label: { en: "Destructive (Danger)", fr: "Destructif (Danger)" } },
          { value: "outline", label: { en: "Outline (Border)", fr: "Contour (Bordure)" } },
          { value: "secondary", label: { en: "Secondary (Muted)", fr: "Secondaire (Sourd)" } },
          { value: "ghost", label: { en: "Ghost (Transparent)", fr: "Fantôme (Transparent)" } },
          { value: "link", label: { en: "Link (Underlined)", fr: "Lien (Souligné)" } },
          { value: "icon", label: { en: "Icon Only", fr: "Icône seule" } },
          { value: "loading", label: { en: "Loading State", fr: "État de chargement" } }
        ]
      },
      defaultValue: "default"
    },

    size: {
      label: { en: "Size", fr: "Taille" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "sm", label: { en: "Small (36px)", fr: "Petit (36px)" } },
          { value: "default", label: { en: "Default (40px)", fr: "Par défaut (40px)" } },
          { value: "lg", label: { en: "Large (44px)", fr: "Grand (44px)" } }
        ]
      },
      defaultValue: "default"
    },

    // ===== ICÔNE LUCIDE =====
    showIcon: {
      label: { en: "Show icon", fr: "Afficher l'icône" },
      type: "OnOff",
      section: "content",
      defaultValue: false,
      bindable: true,
      hidden: content => ['icon', 'loading'].includes(content.variant)
    },

    iconName: {
      label: { en: "Icon name", fr: "Nom de l'icône" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "home, star, heart, trash, settings, search..."
      },
      bindable: true,
      hidden: content => !content.showIcon && content.variant !== 'icon'
    },

    // ===== COMPORTEMENT =====
    disabled: {
      label: { en: "Disabled state", fr: "État désactivé" },
      type: "OnOff",
      section: "behavior",
      bindable: true,
      defaultValue: false
    },

    type: {
      label: { en: "HTML type", fr: "Type HTML" },
      type: "TextSelect",
      section: "behavior",
      options: {
        options: [
          { value: "button", label: { en: "Button (default)", fr: "Bouton (défaut)" } },
          { value: "submit", label: { en: "Submit form", fr: "Soumettre formulaire" } },
          { value: "reset", label: { en: "Reset form", fr: "Réinitialiser formulaire" } }
        ]
      },
      defaultValue: "button"
    },

    // ===== TEXTES PERSONNALISÉS =====
    loadingText: {
      label: { en: "Loading text", fr: "Texte de chargement" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "Loading..."
      },
      bindable: true,
      defaultValue: "Loading...",
      hidden: content => content.variant !== 'loading'
    }
  }
};