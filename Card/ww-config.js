export default {
  editor: {
    label: {
      en: "Shadcn UI Card",
      fr: "Carte Shadcn UI"
    },
    icon: "square",
    bubble: {
      icon: "card",
      tooltip: { 
        en: "Shadcn UI Card Component", 
        fr: "Composant Carte Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["headerPadding", "contentPadding", "footerPadding"]
    ],
    customSettingsPropertiesOrder: [
      "showHeader",
      "title",
      "description",
      "bodyContent",
      "showFooter",
      "footerContent",
      "headerPadding",
      "contentPadding",
      "footerPadding"
    ]
  },
  options: {
    autoByContent: true,
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
    // ===== HEADER =====
    showHeader: {
      label: { en: "Show header", fr: "Afficher l'en-tête" },
      type: "OnOff",
      section: "content",
      defaultValue: true,
      bindable: true
    },

    title: {
      label: { en: "Card title", fr: "Titre de la carte" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Card Title",
      hidden: content => !content.showHeader
    },

    description: {
      label: { en: "Card description", fr: "Description de la carte" },
      type: "LongText",
      section: "content",
      bindable: true,
      defaultValue: "Card description goes here.",
      hidden: content => !content.showHeader
    },

    // ===== CONTENT =====
    bodyContent: {
      label: { en: "Body content", fr: "Contenu du corps" },
      type: "LongText",
      section: "content",
      bindable: true,
      defaultValue: "This is the main content of the card."
    },

    // ===== FOOTER =====
    showFooter: {
      label: { en: "Show footer", fr: "Afficher le pied de page" },
      type: "OnOff",
      section: "content",
      defaultValue: false,
      bindable: true
    },

    footerContent: {
      label: { en: "Footer content", fr: "Contenu du pied de page" },
      type: "LongText",
      section: "content",
      bindable: true,
      defaultValue: "Footer content goes here.",
      hidden: content => !content.showFooter
    },

    // ===== SPACING =====
    headerPadding: {
      label: { en: "Header padding", fr: "Espacement en-tête" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "none", label: { en: "None", fr: "Aucun" } },
          { value: "sm", label: { en: "Small (16px)", fr: "Petit (16px)" } },
          { value: "default", label: { en: "Default (24px)", fr: "Par défaut (24px)" } },
          { value: "lg", label: { en: "Large (32px)", fr: "Grand (32px)" } }
        ]
      },
      defaultValue: "default",
      bindable: true,
      hidden: content => !content.showHeader
    },

    contentPadding: {
      label: { en: "Content padding", fr: "Espacement contenu" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "none", label: { en: "None", fr: "Aucun" } },
          { value: "sm", label: { en: "Small (16px)", fr: "Petit (16px)" } },
          { value: "default", label: { en: "Default (24px)", fr: "Par défaut (24px)" } },
          { value: "lg", label: { en: "Large (32px)", fr: "Grand (32px)" } },
          { value: "full", label: { en: "Full (24px all sides)", fr: "Complet (24px tous côtés)" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    footerPadding: {
      label: { en: "Footer padding", fr: "Espacement pied de page" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "none", label: { en: "None", fr: "Aucun" } },
          { value: "sm", label: { en: "Small (16px)", fr: "Petit (16px)" } },
          { value: "default", label: { en: "Default (24px)", fr: "Par défaut (24px)" } },
          { value: "lg", label: { en: "Large (32px)", fr: "Grand (32px)" } },
          { value: "full", label: { en: "Full (24px all sides)", fr: "Complet (24px tous côtés)" } }
        ]
      },
      defaultValue: "default",
      bindable: true,
      hidden: content => !content.showFooter
    }
  }
};