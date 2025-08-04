export default {
  editor: {
    label: {
      en: "Shadcn UI Badge",
      fr: "Badge Shadcn UI"
    },
    icon: "tag",
    bubble: {
      icon: "badge",
      tooltip: { 
        en: "Shadcn UI Badge Component", 
        fr: "Composant Badge Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["variant", "size"],
      ["dismissible"]
    ],
    customSettingsPropertiesOrder: [
      "text",
      "variant", 
      "size",
      "dismissible",
      "showIcon",
      "iconName",
      "iconPosition"
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
      name: "dismiss",
      label: { en: "On dismiss", fr: "Sur suppression" },
      event: { value: "" }
    }
  ],
  properties: {
    // ===== CONTENU =====
    text: {
      label: { en: "Badge text", fr: "Texte du badge" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "Badge"
      },
      bindable: true,
      defaultValue: "Badge"
    },

    // ===== STYLE =====
    variant: {
      label: { en: "Badge variant", fr: "Variante du badge" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "default", label: { en: "Default (Dark)", fr: "Par défaut (Sombre)" } },
          { value: "secondary", label: { en: "Secondary (Light)", fr: "Secondaire (Clair)" } },
          { value: "destructive", label: { en: "Destructive (Red)", fr: "Destructif (Rouge)" } },
          { value: "outline", label: { en: "Outline (Border)", fr: "Contour (Bordure)" } },
          { value: "success", label: { en: "Success (Green)", fr: "Succès (Vert)" } },
          { value: "warning", label: { en: "Warning (Yellow)", fr: "Avertissement (Jaune)" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    size: {
      label: { en: "Badge size", fr: "Taille du badge" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "sm", label: { en: "Small", fr: "Petit" } },
          { value: "default", label: { en: "Default", fr: "Par défaut" } },
          { value: "lg", label: { en: "Large", fr: "Grand" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    // ===== FONCTIONNALITÉS =====
    dismissible: {
      label: { en: "Dismissible (closable)", fr: "Supprimable (fermable)" },
      type: "OnOff",
      section: "settings",
      defaultValue: false,
      bindable: true
    },

    // ===== ICÔNE =====
    showIcon: {
      label: { en: "Show icon", fr: "Afficher l'icône" },
      type: "OnOff",
      section: "content",
      defaultValue: false,
      bindable: true
    },

    iconName: {
      label: { en: "Icon name", fr: "Nom de l'icône" },
      type: "Text",
      section: "content",
      options: {
        placeholder: "star, heart, check, info, alert..."
      },
      bindable: true,
      defaultValue: "star",
      hidden: content => !content.showIcon
    },

    iconPosition: {
      label: { en: "Icon position", fr: "Position de l'icône" },
      type: "TextSelect",
      section: "content",
      options: {
        options: [
          { value: "left", label: { en: "Left", fr: "Gauche" } },
          { value: "right", label: { en: "Right", fr: "Droite" } }
        ]
      },
      defaultValue: "left",
      bindable: true,
      hidden: content => !content.showIcon
    }
  }
};