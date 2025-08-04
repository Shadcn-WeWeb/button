export default {
    editor: {
        label: {
            en: 'Radio Group',
            fr: 'Groupe Radio'
        },
        icon: 'radio-button-on',
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
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' }
                ],
                orientation: 'vertical',
                size: 'default',
                disabled: false,
                defaultValue: null
            },
            options: {
                item: {
                    options: {
                        label: {
                            en: 'Options',
                            fr: 'Options'
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
                                        description: {
                                            label: { en: 'Description', fr: 'Description' },
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
                    orientation: {
                        label: {
                            en: 'Orientation',
                            fr: 'Orientation'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'vertical', label: { en: 'Vertical', fr: 'Vertical' } },
                                { value: 'horizontal', label: { en: 'Horizontal', fr: 'Horizontal' } }
                            ]
                        },
                        bindable: true,
                        defaultValue: 'vertical'
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
