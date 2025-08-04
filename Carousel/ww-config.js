export default {
    editor: {
        label: {
            en: 'Carousel',
            fr: 'Carrousel'
        },
        icon: 'view_carousel',
    },
    triggerEvents: [
        { name: 'trigger-event', label: { en: 'On slide change', fr: 'Sur changement diapo' }, event: { domEvent: '', value: '' }, default: true },
    ],
    properties: {
        content: {
            label: {
                en: 'Carousel content',
                fr: 'Contenu carrousel'
            },
            type: 'Object',
            section: 'content',
            bindable: true,
            defaultValue: {
                slides: [
                    {
                        id: '1',
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                        alt: 'Slide 1',
                        title: 'First Slide',
                        description: 'This is the first slide'
                    },
                    {
                        id: '2',
                        type: 'image', 
                        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                        alt: 'Slide 2',
                        title: 'Second Slide',
                        description: 'This is the second slide'
                    }
                ],
                autoPlay: false,
                autoPlayInterval: 3000,
                loop: true,
                pauseOnHover: true,
                showArrows: true,
                showIndicators: true,
                showThumbnails: false,
                showPlayPause: false,
                height: 'md'
            },
            options: {
                item: {
                    slides: {
                        label: {
                            en: 'Slides',
                            fr: 'Diapositives'
                        },
                        type: 'Array',
                        section: 'content',
                        bindable: true,
                        options: {
                            item: {
                                type: 'Object',
                                options: {
                                    item: {
                                        id: {
                                            label: { en: 'ID', fr: 'ID' },
                                            type: 'Text'
                                        },
                                        type: {
                                            label: { en: 'Type', fr: 'Type' },
                                            type: 'TextSelect',
                                            options: {
                                                options: [
                                                    { value: 'image', label: 'Image' },
                                                    { value: 'video', label: 'Video' },
                                                    { value: 'content', label: 'Content' }
                                                ]
                                            }
                                        },
                                        src: {
                                            label: { en: 'Source', fr: 'Source' },
                                            type: 'Text'
                                        },
                                        alt: {
                                            label: { en: 'Alt text', fr: 'Texte alt' },
                                            type: 'Text'
                                        },
                                        title: {
                                            label: { en: 'Title', fr: 'Titre' },
                                            type: 'Text'
                                        },
                                        description: {
                                            label: { en: 'Description', fr: 'Description' },
                                            type: 'LongText'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    autoPlay: {
                        label: {
                            en: 'Auto play',
                            fr: 'Lecture auto'
                        },
                        type: 'OnOff',
                        section: 'style',
                        bindable: true
                    },
                    autoPlayInterval: {
                        label: {
                            en: 'Auto play interval (ms)',
                            fr: 'Intervalle lecture auto (ms)'
                        },
                        type: 'Number',
                        section: 'style',
                        bindable: true
                    },
                    loop: {
                        label: {
                            en: 'Loop slides',
                            fr: 'Boucler les diapos'
                        },
                        type: 'OnOff',
                        section: 'style',
                        bindable: true
                    },
                    showArrows: {
                        label: {
                            en: 'Show arrows',
                            fr: 'Afficher flèches'
                        },
                        type: 'OnOff',
                        section: 'style',
                        bindable: true
                    },
                    showIndicators: {
                        label: {
                            en: 'Show indicators',
                            fr: 'Afficher indicateurs'
                        },
                        type: 'OnOff',
                        section: 'style',
                        bindable: true
                    },
                    showThumbnails: {
                        label: {
                            en: 'Show thumbnails',
                            fr: 'Afficher miniatures'
                        },
                        type: 'OnOff',
                        section: 'style',
                        bindable: true
                    },
                    height: {
                        label: {
                            en: 'Height',
                            fr: 'Hauteur'
                        },
                        type: 'TextSelect',
                        section: 'style',
                        options: {
                            options: [
                                { value: 'sm', label: 'Small' },
                                { value: 'md', label: 'Medium' },
                                { value: 'lg', label: 'Large' },
                                { value: 'xl', label: 'Extra Large' }
                            ]
                        },
                        bindable: true
                    }
                }
            }
        }
    }
};