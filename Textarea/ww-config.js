export default {
  editor: {
    label: {
      en: "Shadcn UI Textarea",
      fr: "Zone de texte Shadcn UI"
    },
    icon: "align-left"
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
    value: {
      label: { en: "Textarea value", fr: "Valeur de la zone de texte" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: ""
    },
    placeholder: {
      label: { en: "Placeholder text", fr: "Texte d'indication" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Type your message here..."
    },
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
      label: { en: "Required field", fr: "Champ obligatoire" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },
    rows: {
      label: { en: "Number of rows", fr: "Nombre de lignes" },
      type: "Number",
      section: "style",
      bindable: true,
      defaultValue: 4,
      options: {
        min: 1,
        max: 20,
        step: 1
      }
    },
    resize: {
      label: { en: "Resize behavior", fr: "Comportement de redimensionnement" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "none", label: { en: "None", fr: "Aucun" } },
          { value: "both", label: { en: "Both", fr: "Les deux" } },
          { value: "horizontal", label: { en: "Horizontal", fr: "Horizontal" } },
          { value: "vertical", label: { en: "Vertical", fr: "Vertical" } }
        ]
      },
      defaultValue: "vertical",
      bindable: true
    },
    maxLength: {
      label: { en: "Maximum length", fr: "Longueur maximum" },
      type: "Number",
      section: "settings",
      bindable: true,
      defaultValue: null,
      options: {
        min: 1,
        step: 1
      }
    },
    name: {
      label: { en: "Input name", fr: "Nom du champ" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: ""
    }
  }
};
