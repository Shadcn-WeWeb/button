export default {
  editor: {
    label: {
      en: "Shadcn UI Label",
      fr: "Label Shadcn UI"
    },
    icon: "tag"
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
    text: {
      label: { en: "Label text", fr: "Texte du label" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Label"
    },
    htmlFor: {
      label: { en: "Associated input ID", fr: "ID du champ associé" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: ""
    },
    required: {
      label: { en: "Required field", fr: "Champ obligatoire" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },
    size: {
      label: { en: "Label size", fr: "Taille du label" },
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
    }
  }
};
