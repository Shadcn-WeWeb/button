export default {
  editor: {
    label: {
      en: "Shadcn UI Aspect Ratio",
      fr: "Ratio d'Aspect Shadcn UI"
    },
    icon: "aspect-ratio",
    bubble: {
      icon: "aspect-ratio",
      tooltip: { 
        en: "Shadcn UI Aspect Ratio Component", 
        fr: "Composant Ratio d'Aspect Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["ratio"],
      ["customRatio"]
    ],
    customSettingsPropertiesOrder: [
      "ratio",
      "customRatio"
    ]
  },
  options: {
    autoByContent: true,
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
    // ===== RATIO =====
    ratio: {
      label: { en: "Aspect ratio", fr: "Ratio d'aspect" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: 1, label: { en: "Square (1:1)", fr: "Carré (1:1)" } },
          { value: 1.333, label: { en: "Standard (4:3)", fr: "Standard (4:3)" } },
          { value: 1.777, label: { en: "Widescreen (16:9)", fr: "Grand écran (16:9)" } },
          { value: 2.35, label: { en: "Cinematic (21:9)", fr: "Cinématique (21:9)" } },
          { value: 0.75, label: { en: "Portrait (3:4)", fr: "Portrait (3:4)" } },
          { value: 0.5625, label: { en: "Vertical (9:16)", fr: "Vertical (9:16)" } },
          { value: "custom", label: { en: "Custom", fr: "Personnalisé" } }
        ]
      },
      defaultValue: 1.777,
      bindable: true
    },

    customRatio: {
      label: { en: "Custom ratio", fr: "Ratio personnalisé" },
      type: "Text",
      section: "settings",
      options: {
        placeholder: "16:9 or 1.777"
      },
      bindable: true,
      defaultValue: "",
      hidden: content => content.ratio !== "custom"
    }
  }
};
