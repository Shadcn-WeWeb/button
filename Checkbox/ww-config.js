export default {
  editor: {
    label: {
      en: "Shadcn UI Checkbox",
      fr: "Case à Cocher Shadcn UI"
    },
    icon: "check-square",
    bubble: {
      icon: "checkbox",
      tooltip: { 
        en: "Shadcn UI Checkbox Component", 
        fr: "Composant Case à Cocher Shadcn UI" 
      }
    }
  },
  options: {
    autoByContent: false,
    sizable: false,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "change",
      label: { en: "On change", fr: "Au changement" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    // ===== CONTENU =====
    label: {
      label: { en: "Checkbox label", fr: "Label de la case" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Accept terms and conditions"
    },

    // ===== ÉTAT =====
    checked: {
      label: { en: "Checked", fr: "Cochée" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },

    indeterminate: {
      label: { en: "Indeterminate state", fr: "État indéterminé" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },

    disabled: {
      label: { en: "Disabled", fr: "Désactivée" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },

    required: {
      label: { en: "Required", fr: "Obligatoire" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },

    // ===== STYLE =====
    size: {
      label: { en: "Checkbox size", fr: "Taille de la case" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "sm", label: { en: "Small (16px)", fr: "Petit (16px)" } },
          { value: "default", label: { en: "Default (20px)", fr: "Par défaut (20px)" } },
          { value: "lg", label: { en: "Large (24px)", fr: "Grand (24px)" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    }
  }
};