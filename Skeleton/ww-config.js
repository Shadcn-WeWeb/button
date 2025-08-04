export default {
  editor: {
    label: {
      en: "Shadcn UI Skeleton",
      fr: "Squelette Shadcn UI"
    },
    icon: "loader"
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  properties: {
    variant: {
      label: { en: "Skeleton type", fr: "Type de squelette" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "default", label: { en: "Default rectangle", fr: "Rectangle par défaut" } },
          { value: "circle", label: { en: "Circle/Avatar", fr: "Cercle/Avatar" } },
          { value: "text", label: { en: "Text line", fr: "Ligne de texte" } },
          { value: "button", label: { en: "Button", fr: "Bouton" } },
          { value: "card", label: { en: "Card", fr: "Carte" } }
        ]
      },
      defaultValue: "default",
      bindable: true
    },
    width: {
      label: { en: "Width", fr: "Largeur" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "100%"
    },
    height: {
      label: { en: "Height", fr: "Hauteur" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "20px"
    },
    animated: {
      label: { en: "Animated pulse", fr: "Animation pulsation" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: true
    },
    borderRadius: {
      label: { en: "Border radius", fr: "Rayon des bordures" },
      type: "Length",
      section: "style",
      bindable: true,
      defaultValue: "4px"
    }
  }
};
