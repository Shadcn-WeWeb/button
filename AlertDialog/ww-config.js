export default {
  editor: {
    label: {
      en: "Shadcn UI Alert Dialog",
      fr: "Dialogue d'Alerte Shadcn UI"
    },
    icon: "exclamation-triangle",
    bubble: {
      icon: "alert-dialog",
      tooltip: { 
        en: "Shadcn UI Alert Dialog Component", 
        fr: "Composant Dialogue d'Alerte Shadcn UI" 
      }
    },
    customStylePropertiesOrder: [
      ["variant"],
      ["size"]
    ],
    customSettingsPropertiesOrder: [
      "isOpen",
      "title",
      "description",
      "variant",
      "showCancel",
      "cancelLabel",
      "confirmLabel",
      "requireConfirmation",
      "confirmationLabel",
      "confirmationPlaceholder",
      "confirmationMatch"
    ]
  },
  options: {
    autoByContent: false,
    sizable: false,
    hyperlink: false
  },
  triggerEvents: [
    {
      name: "confirm",
      label: { en: "On confirm", fr: "Sur confirmation" },
      event: { value: "" },
      default: true
    },
    {
      name: "cancel",
      label: { en: "On cancel", fr: "Sur annulation" },
      event: { value: "" }
    },
    {
      name: "close",
      label: { en: "On close", fr: "Sur fermeture" },
      event: { value: "" }
    }
  ],
  properties: {
    // ===== VISIBILITÉ =====
    isOpen: {
      label: { en: "Show dialog", fr: "Afficher le dialogue" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false
    },

    // ===== CONTENU =====
    title: {
      label: { en: "Dialog title", fr: "Titre du dialogue" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Are you absolutely sure?"
    },

    description: {
      label: { en: "Dialog description", fr: "Description du dialogue" },
      type: "LongText",
      section: "content",
      bindable: true,
      defaultValue: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
    },

    // ===== STYLE =====
    variant: {
      label: { en: "Dialog variant", fr: "Variante du dialogue" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "default", label: { en: "Default", fr: "Défaut" } },
          { value: "destructive", label: { en: "Destructive (Delete/Danger)", fr: "Destructif (Supprimer/Danger)" } },
          { value: "warning", label: { en: "Warning", fr: "Avertissement" } },
          { value: "info", label: { en: "Information", fr: "Information" } },
          { value: "success", label: { en: "Success", fr: "Succès" } }
        ]
      },
      defaultValue: "destructive",
      bindable: true
    },

    // ===== BOUTONS =====
    showCancel: {
      label: { en: "Show cancel button", fr: "Afficher le bouton d'annulation" },
      type: "OnOff",
      section: "settings",
      defaultValue: true,
      bindable: true
    },

    cancelLabel: {
      label: { en: "Cancel button text", fr: "Texte du bouton d'annulation" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Cancel",
      hidden: content => !content.showCancel
    },

    confirmLabel: {
      label: { en: "Confirm button text", fr: "Texte du bouton de confirmation" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Continue"
    },

    // ===== CONFIRMATION =====
    requireConfirmation: {
      label: { en: "Require confirmation input", fr: "Exiger une saisie de confirmation" },
      type: "OnOff",
      section: "settings",
      defaultValue: false,
      bindable: true
    },

    confirmationLabel: {
      label: { en: "Confirmation input label", fr: "Label de saisie de confirmation" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "Type 'delete' to confirm",
      hidden: content => !content.requireConfirmation
    },

    confirmationPlaceholder: {
      label: { en: "Confirmation input placeholder", fr: "Placeholder de saisie de confirmation" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "delete",
      hidden: content => !content.requireConfirmation
    },

    confirmationMatch: {
      label: { en: "Required confirmation text", fr: "Texte de confirmation requis" },
      type: "Text",
      section: "content",
      bindable: true,
      defaultValue: "delete",
      hidden: content => !content.requireConfirmation
    }
  }
};
