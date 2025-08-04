export default {
  editor: {
    label: {
      en: "Shadcn UI Avatar",
      fr: "Avatar Shadcn UI"
    },
    icon: "user-circle",
    bubble: {
      icon: "avatar",
      tooltip: { 
        en: "Shadcn UI Avatar Component", 
        fr: "Composant Avatar Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["size"],
      ["variant"]
    ],
    customSettingsPropertiesOrder: [
      "src",
      "name",
      "alt",
      "size",
      "variant", 
      "showStatus",
      "status",
      "fallbackText"
    ]
  },
  options: {
    autoByContent: false,
    sizable: false,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "click",
      label: { en: "On click", fr: "Au clic" },
      event: { value: "" },
      default: true
    },
    {
      name: "image-error",
      label: { en: "On image error", fr: "Sur erreur d'image" },
      event: { value: "" }
    },
    {
      name: "image-load",
      label: { en: "On image load", fr: "Sur chargement d'image" },
      event: { value: "" }
    }
  ],
  properties: {
    // ===== IMAGE =====
    src: {
      label: { en: "Image source", fr: "Source de l'image" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "https://example.com/avatar.jpg"
      },
      bindable: true,
      defaultValue: ""
    },

    alt: {
      label: { en: "Alt text", fr: "Texte alternatif" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "Profile picture"
      },
      bindable: true,
      defaultValue: "Avatar"
    },

    // ===== FALLBACK =====
    name: {
      label: { en: "Name (for initials)", fr: "Nom (pour initiales)" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "John Doe"
      },
      bindable: true,
      defaultValue: "John Doe"
    },

    fallbackText: {
      label: { en: "Custom fallback text", fr: "Texte de secours personnalisé" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "JD"
      },
      bindable: true,
      defaultValue: ""
    },

    // ===== STYLE =====
    size: {
      label: { en: "Avatar size", fr: "Taille de l'avatar" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "sm", label: { en: "Small (32px)", fr: "Petit (32px)" } },
          { value: "default", label: { en: "Default (40px)", fr: "Par défaut (40px)" } },
          { value: "lg", label: { en: "Large (48px)", fr: "Grand (48px)" } },
          { value: "xl", label: { en: "Extra Large (64px)", fr: "Très grand (64px)" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    variant: {
      label: { en: "Avatar variant", fr: "Variante d'avatar" },
      type: "TextSelect",
      section: "style", 
      options: {
        options: [
          { value: "default", label: { en: "Default (Round)", fr: "Par défaut (Rond)" } },
          { value: "square", label: { en: "Square", fr: "Carré" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    // ===== STATUS =====
    showStatus: {
      label: { en: "Show status indicator", fr: "Afficher l'indicateur de statut" },
      type: "OnOff",
      section: "settings",
      defaultValue: false,
      bindable: true
    },

    status: {
      label: { en: "Status", fr: "Statut" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "online", label: { en: "Online (Green)", fr: "En ligne (Vert)" } },
          { value: "offline", label: { en: "Offline (Gray)", fr: "Hors ligne (Gris)" } },
          { value: "away", label: { en: "Away (Yellow)", fr: "Absent (Jaune)" } },
          { value: "busy", label: { en: "Busy (Red)", fr: "Occupé (Rouge)" } }
        ]
      },
      defaultValue: "online",
      bindable: true,
      hidden: content => !content.showStatus
    }
  }
};