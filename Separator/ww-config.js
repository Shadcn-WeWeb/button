export default {
  editor: {
    label: {
      en: "Shadcn UI Separator",
      fr: "Séparateur Shadcn UI"
    },
    icon: "minus"
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  properties: {
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
    }
  }
};