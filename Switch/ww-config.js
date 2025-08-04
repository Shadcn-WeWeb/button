export default {
  editor: {
    label: {
      en: "Shadcn UI Switch",
      fr: "Interrupteur Shadcn UI"
    },
    icon: "toggle-right"
  },
  options: {
    autoByContent: false,
    sizable: true,
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
    checked: {
      label: { en: "Checked state", fr: "État activé" },
      type: "OnOff",
      section: "content",
      bindable: true,
      defaultValue: false
    },
    disabled: {
      label: { en: "Disabled", fr: "Désactivé" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },
    size: {
      label: { en: "Switch size", fr: "Taille de l'interrupteur" },
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
    name: {
      label: { en: "Input name", fr: "Nom du champ" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: ""
    },
    value: {
      label: { en: "Input value", fr: "Valeur du champ" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "on"
    }
  }
};
