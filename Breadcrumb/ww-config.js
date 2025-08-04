export default {
  editor: {
    label: {
      en: "Shadcn UI Breadcrumb",
      fr: "Fil d'Ariane Shadcn UI"
    },
    icon: "navigation",
    bubble: {
      icon: "breadcrumb",
      tooltip: { 
        en: "Shadcn UI Breadcrumb Component", 
        fr: "Composant Fil d'Ariane Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["separator"]
    ],
    customSettingsPropertiesOrder: [
      "items",
      "maxItems",
      "itemsBeforeCollapse",
      "itemsAfterCollapse",
      "separator"
    ]
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
    // ===== CONTENU =====
    items: {
      label: { en: "Breadcrumb items", fr: "Éléments du fil d'Ariane" },
      type: "Array",
      section: "content",
      options: {
        item: {
          type: "Object",
          options: {
            label: { type: "Text", label: { en: "Label", fr: "Libellé" } },
            href: { type: "Text", label: { en: "Link URL", fr: "URL du lien" } },
            isCurrentPage: { type: "OnOff", label: { en: "Current page", fr: "Page actuelle" } }
          }
        }
      },
      bindable: true,
      defaultValue: [
        { label: "Home", href: "/", isCurrentPage: false },
        { label: "Category", href: "/category", isCurrentPage: false },
        { label: "Current Page", href: "", isCurrentPage: true }
      ]
    },

    // ===== AFFICHAGE =====
    maxItems: {
      label: { en: "Max items (0 = unlimited)", fr: "Nombre max d'éléments (0 = illimité)" },
      type: "Number",
      section: "settings",
      bindable: true,
      defaultValue: 0
    },

    itemsBeforeCollapse: {
      label: { en: "Items before collapse", fr: "Éléments avant réduction" },
      type: "Number",
      section: "settings",
      bindable: true,
      defaultValue: 1,
      hidden: content => !content.maxItems || content.maxItems === 0
    },

    itemsAfterCollapse: {
      label: { en: "Items after collapse", fr: "Éléments après réduction" },
      type: "Number", 
      section: "settings",
      bindable: true,
      defaultValue: 1,
      hidden: content => !content.maxItems || content.maxItems === 0
    },

    // ===== STYLE =====
    separator: {
      label: { en: "Separator", fr: "Séparateur" },
      type: "TextSelect",
      section: "style",
      options: {
        options: [
          { value: "chevron", label: { en: "Chevron (>)", fr: "Chevron (>)" } },
          { value: "slash", label: { en: "Slash (/)", fr: "Barre oblique (/)" } },
          { value: "dash", label: { en: "Dash (-)", fr: "Tiret (-)" } },
          { value: "dot", label: { en: "Dot (•)", fr: "Point (•)" } }
        ]
      },
      defaultValue: "chevron",
      bindable: true
    }
  }
};