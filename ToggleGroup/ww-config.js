export default {
    editor: {
        label: {
            en: 'Toggle Group',
            fr: 'Groupe de Basculement'
        },
        icon: 'toggle-right',
    },
    triggerEvents: [
        { name: 'trigger-event', label: { en: 'On change', fr: 'Au changement' }, event: { value: '' }, default: true },
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
                type: 'single',
                size: 'default',
                variant: 'default',
                disabled: false,
                items: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' }
                ],
                defaultValue: null
            },
            options: {
                item: {
                    type: {
                        label: {
                            en: 'Selection type',
                            fr: 'Type de sélection'
                        },
                        type: 'TextSelect',
                        section: 'content',
                        options: {
                            options: [
                                { value: 'single', label: { en: 'Single', fr: 'Simple' } },
                                { value: 'multiple', label: { en: 'Multiple', fr: 'Multiple' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'single'
                    },
                    items: {
                        label: {
                            en: 'Items',
                            fr: 'Elements'
                        },
                        type: 'Array',
                        section: 'content',
                        options: {
                            item: {
                                type: 'Object',
                                options: {
                                    item: {
                                        value: {
                                            label: { en: 'Value', fr: 'Valeur' },
                                            type: 'Text',
                                            bindable: true
                                        },
                                        label: {
                                            label: { en: 'Label', fr: 'Libellé' },
                                            type: 'Text',
                                            bindable: true
                                        },
                                        disabled: {
                                            label: { en: 'Disabled', fr: 'Désactivé' },
                                            type: 'OnOff',
                                            bindable: true,
                                            defaultValue: false
                                        }
                                    }
                                }
                            }
                        },
                        bindable: true,
                        defaultValue: [
                            { value: 'option1', label: 'Option 1' },
                            { value: 'option2', label: 'Option 2' },
                            { value: 'option3', label: 'Option 3' }
                        ]
                    },
                    size: {
                        label: {
                            en: 'Size',
                            fr: 'Taille'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'sm', label: { en: 'Small', fr: 'Petit' } },
                                { value: 'default', label: { en: 'Default', fr: 'Par défaut' } },
                                { value: 'lg', label: { en: 'Large', fr: 'Grand' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'default'
                    },
                    variant: {
                        label: {
                            en: 'Variant',
                            fr: 'Variante'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'default', label: { en: 'Default', fr: 'Par défaut' } },
                                { value: 'outline', label: { en: 'Outline', fr: 'Contour' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'default'
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
