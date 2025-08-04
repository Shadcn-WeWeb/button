export default {
    editor: {
        label: 'Shadcn Sheet',
        icon: 'border-outer',
    },
    triggerEvents: [
        { name: 'close', label: 'On Close', event: { value: '' } },
        { name: 'action-click', label: 'On Action Click', event: { value: '' } },
    ],
    properties: {
        open: {
            label: 'Open',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        side: {
            label: 'Side',
            type: 'TextSelect',
            section: 'settings',
            options: {
                options: [
                    { value: 'top', label: 'Top' },
                    { value: 'right', label: 'Right' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' }
                ]
            },
            defaultValue: 'right'
        },
        title: {
            label: 'Title',
            type: 'Text',
            section: 'content',
            bindable: true,
            multiLang: true,
            defaultValue: 'Sheet Title'
        },
        description: {
            label: 'Description',
            type: 'Text',
            section: 'content',
            bindable: true,
            multiLang: true,
            defaultValue: ''
        },
        content: {
            label: 'Custom Content',
            type: 'RichText',
            section: 'content',
            bindable: true,
            defaultValue: ''
        },
        showHeader: {
            label: 'Show Header',
            type: 'OnOff',
            section: 'layout',
            defaultValue: true
        },
        showClose: {
            label: 'Show Close Button',
            type: 'OnOff',
            section: 'layout',
            defaultValue: true
        },
        showFooter: {
            label: 'Show Footer',
            type: 'OnOff',
            section: 'layout',
            defaultValue: true
        },
        closeLabel: {
            label: 'Close Button Label',
            type: 'Text',
            section: 'content',
            bindable: true,
            multiLang: true,
            defaultValue: 'Close'
        },
        closeOnBackdrop: {
            label: 'Close on Backdrop Click',
            type: 'OnOff',
            section: 'behavior',
            defaultValue: true
        },
        closeOnEscape: {
            label: 'Close on Escape Key',
            type: 'OnOff',
            section: 'behavior',
            defaultValue: true
        },
        fields: {
            label: 'Form Fields',
            type: 'Array',
            section: 'form',
            bindable: true,
            options: {
                item: {
                    type: 'Object',
                    options: {
                        item: {
                            id: {
                                label: 'Field ID',
                                type: 'Text'
                            },
                            label: {
                                label: 'Label',
                                type: 'Text'
                            },
                            type: {
                                label: 'Type',
                                type: 'TextSelect',
                                options: {
                                    options: [
                                        { value: 'text', label: 'Text' },
                                        { value: 'email', label: 'Email' },
                                        { value: 'password', label: 'Password' },
                                        { value: 'textarea', label: 'Textarea' },
                                        { value: 'select', label: 'Select' },
                                        { value: 'checkbox', label: 'Checkbox' }
                                    ]
                                }
                            },
                            placeholder: {
                                label: 'Placeholder',
                                type: 'Text'
                            },
                            required: {
                                label: 'Required',
                                type: 'OnOff'
                            },
                            disabled: {
                                label: 'Disabled',
                                type: 'OnOff'
                            },
                            value: {
                                label: 'Default Value',
                                type: 'Text'
                            }
                        }
                    }
                }
            },
            defaultValue: []
        },
        actions: {
            label: 'Action Buttons',
            type: 'Array',
            section: 'actions',
            bindable: true,
            options: {
                item: {
                    type: 'Object',
                    options: {
                        item: {
                            id: {
                                label: 'Action ID',
                                type: 'Text'
                            },
                            label: {
                                label: 'Button Label',
                                type: 'Text'
                            },
                            variant: {
                                label: 'Variant',
                                type: 'TextSelect',
                                options: {
                                    options: [
                                        { value: 'default', label: 'Default' },
                                        { value: 'destructive', label: 'Destructive' },
                                        { value: 'outline', label: 'Outline' },
                                        { value: 'secondary', label: 'Secondary' },
                                        { value: 'ghost', label: 'Ghost' },
                                        { value: 'link', label: 'Link' }
                                    ]
                                }
                            },
                            disabled: {
                                label: 'Disabled',
                                type: 'OnOff'
                            },
                            closeSheet: {
                                label: 'Close Sheet on Click',
                                type: 'OnOff'
                            }
                        }
                    }
                }
            },
            defaultValue: [
                {
                    id: 'cancel',
                    label: 'Cancel',
                    variant: 'outline',
                    closeSheet: true
                },
                {
                    id: 'save',
                    label: 'Save',
                    variant: 'default',
                    closeSheet: true
                }
            ]
        },
        customClass: {
            label: 'Custom CSS Class',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        contentClass: {
            label: 'Content CSS Class',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        footerClass: {
            label: 'Footer CSS Class',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        }
    }
};
