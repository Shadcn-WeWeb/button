export default {
  editor: {
    label: {
      en: "Shadcn UI Alert",
      fr: "Alerte Shadcn UI"
    },
    icon: "exclamation-triangle",
    bubble: {
      icon: "alert",
      tooltip: { 
        en: "Shadcn UI Alert Component", 
        fr: "Composant Alerte Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["variant"],
      ["customClasses"]
    ],
    customSettingsPropertiesOrder: [
      "title",
      "description", 
      "variant",
      "customClasses"
    ]
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "click",
      label: { en: "On click", fr: "Au clic" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    // ===== CONTENU =====
    title: {
      label: { en: "Alert title", fr: "Titre de l'alerte" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Alert Title"
    },

    description: {
      label: { en: "Alert description", fr: "Description de l'alerte" },
      type: "LongText",
      section: "content",
      bindable: true,
      defaultValue: "This is an alert description that provides additional context."
    },

    // ===== STYLE =====
    variant: {
      label: { en: "Alert variant", fr: "Variante d'alerte" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "default", label: { en: "Default (Info)", fr: "Défaut (Info)" } },
          { value: "destructive", label: { en: "Destructive (Error)", fr: "Destructive (Erreur)" } },
          { value: "warning", label: { en: "Warning", fr: "Avertissement" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    customClasses: {
      label: { en: "Custom CSS classes", fr: "Classes CSS personnalisées" },
      type: "Text",
      section: "style",
      bindable: true,
      defaultValue: ""
    }
  }
};
