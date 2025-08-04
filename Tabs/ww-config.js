export default {
  editor: {
    label: {
      en: "Shadcn UI Tabs",
      fr: "Onglets Shadcn UI"
    },
    icon: "folder-tabs"
  },
  options: {
    autoByContent: false,
    sizable: true,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "change",
      label: { en: "On tab change", fr: "Au changement d'onglet" },
      event: { value: "" },
      default: true
    }
  ],
  properties: {
    tabs: {
      label: { en: "Tab items", fr: "Éléments des onglets" },
      type: "Array",
      section: "content",
      options: {
        item: {
          type: "Object",
          options: {
            label: {
              type: "Text",
              label: { en: "Tab label", fr: "Libellé de l'onglet" },
              defaultValue: "Tab"
            },
            value: {
              type: "Text",
              label: { en: "Tab value", fr: "Valeur de l'onglet" },
              defaultValue: ""
            },
            content: {
              type: "Text",
              label: { en: "Tab content", fr: "Contenu de l'onglet" },
              defaultValue: "Tab content"
            },
            disabled: {
              type: "OnOff",
              label: { en: "Disabled", fr: "Désactivé" },
              defaultValue: false
            }
          }
        }
      },
      defaultValue: [
        { label: "Tab 1", value: "tab1", content: "Content 1", disabled: false },
        { label: "Tab 2", value: "tab2", content: "Content 2", disabled: false },
        { label: "Tab 3", value: "tab3", content: "Content 3", disabled: false }
      ],
      bindable: true
    },
    defaultValue: {
      label: { en: "Default active tab", fr: "Onglet actif par défaut" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "tab1"
    },
    variant: {
      label: { en: "Tabs variant", fr: "Variante des onglets" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "default", label: { en: "Default", fr: "Par défaut" } },
          { value: "pills", label: { en: "Pills", fr: "Pilules" } }
        ]
      },
      defaultValue: "default",
      bindable: true
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
    }
  }
};
