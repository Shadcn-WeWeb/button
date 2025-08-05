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
      ["disabled", "loading"],
      ["leftIcon", "rightIcon"]
    ],
    customSettingsPropertiesOrder: [
      "text",
      "variant", 
      "size",
      "showIcon",
      "iconName",
      "loading",
      "loadingText",
      "disabled",
      "buttonType"
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
          { value: "primary", label: { en: "Primary", fr: "Principal" } },
          { value: "secondary", label: { en: "Secondary", fr: "Secondaire" } },
          { value: "destructive", label: { en: "Destructive", fr: "Destructif" } },
          { value: "outline", label: { en: "Outline", fr: "Contour" } },
          { value: "ghost", label: { en: "Ghost", fr: "Fantôme" } },
          { value: "link", label: { en: "Link", fr: "Lien" } }
        ]
      },
      defaultValue: "primary"
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

    // ===== LOADING STATE =====
    loading: {
      label: { en: "Loading state", fr: "État de chargement" },
      type: "OnOff",
      section: "behavior",
      bindable: true,
      defaultValue: false
    },

    loadingText: {
      label: { en: "Loading text", fr: "Texte de chargement" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "Loading..."
      },
      bindable: true,
      defaultValue: "Loading...",
      hidden: content => !content.loading
    },

    // ===== ICÔNE LUCIDE =====
    showIcon: {
      label: { en: "Show icon", fr: "Afficher l'icône" },
      type: "OnOff",
      section: "content",
      defaultValue: false,
      bindable: true,
      hidden: content => content.loading
    },

    iconName: {
      label: { en: "Icon name", fr: "Nom de l'icône" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "home, star, heart, trash, settings, search..."
      },
      bindable: true,
      hidden: content => !content.showIcon || content.loading
    },

    // ===== COMPORTEMENT =====
    disabled: {
      label: { en: "Disabled state", fr: "État désactivé" },
      type: "OnOff",
      section: "behavior",
      bindable: true,
      defaultValue: false
    },

    buttonType: {
      label: { en: "Button type", fr: "Type de bouton" },
      type: "TextSelect",
      section: "behavior",
      options: {
        options: [
          { value: "button", label: { en: "Button", fr: "Bouton" } },
          { value: "submit", label: { en: "Submit", fr: "Soumettre" } },
          { value: "reset", label: { en: "Reset", fr: "Réinitialiser" } }
        ]
      },
      defaultValue: "button"
    }
  }
};