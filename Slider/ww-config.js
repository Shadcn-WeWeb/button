export default {
  editor: {
    label: {
      en: "Shadcn UI Slider",
      fr: "Curseur Shadcn UI"
    },
    icon: "sliders-horizontal"
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "change",
      label: { en: "On value change", fr: "Au changement de valeur" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    value: {
      label: { en: "Current value", fr: "Valeur actuelle" },
      type: "Number",
      section: "content",
      bindable: true,
      defaultValue: 50
    },
    min: {
      label: { en: "Minimum value", fr: "Valeur minimum" },
      type: "Number",
      section: "content",
      bindable: true,
      defaultValue: 0
    },
    max: {
      label: { en: "Maximum value", fr: "Valeur maximum" },
      type: "Number",
      section: "content",
      bindable: true,
      defaultValue: 100
    },
    step: {
      label: { en: "Step increment", fr: "Pas d'incrément" },
      type: "Number",
      section: "content",
      bindable: true,
      defaultValue: 1,
      options: {
        min: 0.1,
        step: 0.1
      }
    },
    disabled: {
      label: { en: "Disabled", fr: "Désactivé" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },
    orientation: {
      label: { en: "Orientation", fr: "Orientation" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "horizontal", label: { en: "Horizontal", fr: "Horizontal" } },
          { value: "vertical", label: { en: "Vertical", fr: "Vertical" } }
        ]
      },
      defaultValue: "horizontal",
      bindable: true
    },
    size: {
      label: { en: "Slider size", fr: "Taille du curseur" },
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
    showValue: {
      label: { en: "Show current value", fr: "Afficher la valeur actuelle" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
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
