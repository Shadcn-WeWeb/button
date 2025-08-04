export default {
  editor: {
    label: {
      en: "Shadcn UI Input",
      fr: "Champ de Saisie Shadcn UI"
    },
    icon: "text-box",
    bubble: {
      icon: "input",
      tooltip: { 
        en: "Shadcn UI Input Component", 
        fr: "Composant Champ de Saisie Shadcn UI" 
      }
    }
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "input",
      label: { en: "On input", fr: "À la saisie" },
      event: { value: "" },
      default: true
    },
    {
      name: "change",
      label: { en: "On change", fr: "Au changement" },
      event: { value: "" }
    },
    {
      name: "focus",
      label: { en: "On focus", fr: "Au focus" },
      event: { value: "" }
    },
    {
      name: "blur",
      label: { en: "On blur", fr: "À la perte de focus" },
      event: { value: "" }
    }
  ],
  properties: {
    // ===== CONTENU =====
    value: {
      label: { en: "Input value", fr: "Valeur du champ" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: ""
    },

    placeholder: {
      label: { en: "Placeholder text", fr: "Texte indicatif" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Enter text..."
    },

    // ===== TYPE =====
    type: {
      label: { en: "Input type", fr: "Type de champ" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "text", label: { en: "Text", fr: "Texte" } },
          { value: "email", label: { en: "Email", fr: "Email" } },
          { value: "password", label: { en: "Password", fr: "Mot de passe" } },
          { value: "number", label: { en: "Number", fr: "Nombre" } },
          { value: "tel", label: { en: "Phone", fr: "Téléphone" } },
          { value: "url", label: { en: "URL", fr: "URL" } },
          { value: "search", label: { en: "Search", fr: "Recherche" } }
        ]
      },
      defaultValue: "text",
      bindable: true
    },

    // ===== ÉTATS =====
    disabled: {
      label: { en: "Disabled", fr: "Désactivé" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },

    readonly: {
      label: { en: "Read only", fr: "Lecture seule" },
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
      label: { en: "Input size", fr: "Taille du champ" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "sm", label: { en: "Small (32px)", fr: "Petit (32px)" } },
          { value: "default", label: { en: "Default (40px)", fr: "Par défaut (40px)" } },
          { value: "lg", label: { en: "Large (48px)", fr: "Grand (48px)" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },

    variant: {
      label: { en: "Input variant", fr: "Variante du champ" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "default", label: { en: "Default", fr: "Par défaut" } },
          { value: "ghost", label: { en: "Ghost (borderless)", fr: "Fantôme (sans bordure)" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    }
  }
};