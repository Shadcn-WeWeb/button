export default {
    editor: {
        label: {
            en: 'Tooltip',
            fr: 'Info-bulle'
        },
        icon: 'info-circle',
    },
    triggerEvents: [
        { name: 'trigger-event', label: { en: 'On show', fr: 'A l\'affichage' }, event: { value: '' }, default: true },
    ],
    properties: {
        content: {
            label: {
                en: 'Configuration',
                fr: 'Configuration'
            },
            type: 'Object',
            section: 'settings',
            bindable: true,
            defaultValue: {
                text: 'Tooltip content',
                side: 'top',
                align: 'center',
                delayDuration: 700,
                skipDelayDuration: 300,
                disabled: false
            },
            options: {
                item: {
                    text: {
                        label: {
                            en: 'Tooltip text',
                            fr: 'Texte de l\'info-bulle'
                        },
                        type: 'Text',
                        section: 'content',
                        bindable: true,
                        defaultValue: 'Tooltip content'
                    },
                    triggerText: {
                        label: {
                            en: 'Trigger text',
                            fr: 'Texte du déclencheur'
                        },
                        type: 'Text',
                        section: 'content',
                        bindable: true,
                        defaultValue: 'Hover me'
                    },
                    side: {
                        label: {
                            en: 'Position',
                            fr: 'Position'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'top', label: { en: 'Top', fr: 'Haut' } },
                                { value: 'bottom', label: { en: 'Bottom', fr: 'Bas' } },
                                { value: 'left', label: { en: 'Left', fr: 'Gauche' } },
                                { value: 'right', label: { en: 'Right', fr: 'Droite' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'top'
                    },
                    align: {
                        label: {
                            en: 'Alignment',
                            fr: 'Alignement'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'start', label: { en: 'Start', fr: 'Début' } },
                                { value: 'center', label: { en: 'Center', fr: 'Centre' } },
                                { value: 'end', label: { en: 'End', fr: 'Fin' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'center'
                    },
                    delayDuration: {
                        label: {
                            en: 'Show delay (ms)',
                            fr: 'Délai d\'affichage (ms)'
                        },
                        type: 'Number',
                        section: 'settings',
                        bindable: true,
                        defaultValue: 700
                    },
                    skipDelayDuration: {
                        label: {
                            en: 'Hide delay (ms)',
                            fr: 'Délai de masquage (ms)'
                        },
                        type: 'Number',
                        section: 'settings',
                        bindable: true,
                        defaultValue: 300
                    },
                    disabled: {
                        label: {
                            en: 'Disabled',
                            fr: 'Désactivé'
                        },
                        type: 'OnOff',
                        section: 'settings',
                        bindable: true,
                        defaultValue: false
                    }
                }
            }
        }
    }
};
