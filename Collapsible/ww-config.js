export default {
    editor: {
        label: {
            en: 'Collapsible',
            fr: 'Repliable'
        },
        icon: 'chevron-down',
    },
    triggerEvents: [
        { name: 'trigger-event', label: { en: 'On toggle', fr: 'Au basculement' }, event: { value: '' }, default: true },
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
                triggerText: 'Click to expand',
                defaultContent: 'This is the collapsible content.',
                defaultOpen: false,
                disabled: false,
                triggerVariant: 'default',
                animation: 'slide'
            },
            options: {
                item: {
                    triggerText: {
                        label: {
                            en: 'Trigger text',
                            fr: 'Texte du déclencheur'
                        },
                        type: 'Text',
                        section: 'content',
                        bindable: true,
                        defaultValue: 'Click to expand'
                    },
                    defaultContent: {
                        label: {
                            en: 'Content text',
                            fr: 'Texte du contenu'
                        },
                        type: 'LongText',
                        section: 'content',
                        bindable: true,
                        defaultValue: 'This is the collapsible content.'
                    },
                    defaultOpen: {
                        label: {
                            en: 'Default open',
                            fr: 'Ouvert par défaut'
                        },
                        type: 'OnOff',
                        section: 'settings',
                        bindable: true,
                        defaultValue: false
                    },
                    triggerVariant: {
                        label: {
                            en: 'Trigger variant',
                            fr: 'Variante du déclencheur'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'default', label: { en: 'Default', fr: 'Par défaut' } },
                                { value: 'outline', label: { en: 'Outline', fr: 'Contour' } },
                                { value: 'ghost', label: { en: 'Ghost', fr: 'Fantôme' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'default'
                    },
                    animation: {
                        label: {
                            en: 'Animation',
                            fr: 'Animation'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'slide', label: { en: 'Slide', fr: 'Glissement' } },
                                { value: 'fade', label: { en: 'Fade', fr: 'Fondu' } },
                                { value: 'scale', label: { en: 'Scale', fr: 'Echelle' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'slide'
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
