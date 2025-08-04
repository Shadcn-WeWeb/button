export default {
  editor: {
    label: {
      en: "Shadcn UI Progress",
      fr: "Barre de progression Shadcn UI"
    },
    icon: "trending-up"
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  properties: {
    value: {
      label: { en: "Progress value", fr: "Valeur de progression" },
      type: "Number",
      section: "content",
      bindable: true,
      defaultValue: 0,
      options: {
        min: 0,
        max: 100,
        step: 1
      }
    },
    max: {
      label: { en: "Maximum value", fr: "Valeur maximum" },
      type: "Number",
      section: "content",
      bindable: true,
      defaultValue: 100,
      options: {
        min: 1,
        step: 1
      }
    },
    size: {
      label: { en: "Progress size", fr: "Taille de la barre" },
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
      label: { en: "Show percentage", fr: "Afficher le pourcentage" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },
    animated: {
      label: { en: "Animated progress", fr: "Animation de progression" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: true
    }
  }
};
