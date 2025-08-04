export default {
  editor: {
    label: {
      en: "Shadcn UI Toggle",
      fr: "Bouton Toggle Shadcn UI"
    },
    icon: "toggle-left"
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "change",
      label: { en: "On toggle", fr: "Au changement" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    pressed: {
      label: { en: "Pressed state", fr: "État activé" },
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
      label: { en: "Toggle size", fr: "Taille du toggle" },
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
    variant: {
      label: { en: "Toggle variant", fr: "Variante du toggle" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "default", label: { en: "Default", fr: "Par défaut" } },
          { value: "outline", label: { en: "Outline", fr: "Contour" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },
    text: {
      label: { en: "Toggle text", fr: "Texte du toggle" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Toggle"
    }
  }
};
