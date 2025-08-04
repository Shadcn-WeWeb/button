import emitter from 'tiny-emitter/instance';
import services from './services/index.js';
import { useIconsStore } from '@/pinia/icons';

 /* wwFront:start */
// eslint-disable-next-line no-undef
import plugin_41448d5d_ae26_49bd_82b6_1c79f462e972 from '@/components/plugins/plugin-41448d5d-ae26-49bd-82b6-1c79f462e972/src/wwPlugin.js';
import plugin_2bd1c688_31c5_443e_ae25_59aa5b6431fb from '@/components/plugins/plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb/src/wwPlugin.js';
/* wwFront:end */

import { computed, reactive } from 'vue';

export default {
    ...services,
     $on(event, fn) {
        emitter.on(event, fn);
    },
    $once(event, fn) {
        emitter.once(event, fn);
    },
    $emit(event, ...args) {
        if (!event) {
            return;
        }
        emitter.emit(event, ...args);
    },
    $off(event, fn) {
        emitter.off(event, fn);
    },
     front: {},
    $focus: null,
    env: process.env.NODE_ENV,
    async initFront({ router, store }) {
 
        this.front.router = router;
        /* wwFront:start */
        this.$store = store;
        /* wwFront:end */

        //Init services
        this.wwLog.init();

 
        wwLib.logStore.verbose('Starting the application...');
        await this.wwWebsiteData.init();
        this.wwLang.init(router);

        /* wwFront:start */
        // eslint-disable-next-line no-undef
        wwLib.wwPluginHelper.registerPlugin('plugin-41448d5d-ae26-49bd-82b6-1c79f462e972', plugin_41448d5d_ae26_49bd_82b6_1c79f462e972);
wwLib.wwPluginHelper.registerPlugin('plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb', plugin_2bd1c688_31c5_443e_ae25_59aa5b6431fb);
        /* wwFront:end */

 
        services.scrollStore.start();
        services.keyboardEventStore.start();
    },
     // TODO: Verify with Alexis, still uses wwImageMultiLang
    getResponsiveStyleProp({ store, style, uid, states = [], prop }) {
        store = store || wwLib.getFrontWindow().wwLib.$store;
        if (!style && uid) {
            const wwObject = this.$store.getters['websiteData/getWwObjects'][uid];
            if (!wwObject) return '';
            style = (wwObject._state || {}).style || {};
        }

        const screenSizes = store.getters['front/getScreenSizes'];
        const screenSize = store.getters['front/getScreenSize'];

        let value = '';

        for (const media in screenSizes) {
            if (style[media] && typeof style[media][prop] !== 'undefined') {
                value = style[media][prop];
            }
            if (media === screenSize) {
                break;
            }
        }
        for (const state of states) {
            for (const media in screenSizes) {
                if (style[`${state}_${media}`] && style[`${state}_${media}`][prop]) {
                    value = style[`${state}_${media}`][prop];
                }
                if (media === screenSize) {
                    break;
                }
            }
        }

        return value;
    },
    globalContext: reactive({
        page: computed(() => {
            const page = wwLib.$store.getters['websiteData/getPage'];
            if (!page) return {};
            else if (!page.cmsDataSetPath) return { ...pageSanitizer(page) };
            return { ...pageSanitizer(page), data: wwLib.$store.getters['data/getPageCollectionData'] };
        }),
        pageParameters: computed(() => {
            const pageParameters = Object.values(wwLib.$store.getters['data/getPageParameterVariables']);
            const pageParametersValueMap = {};
            for (const pageParameter of pageParameters) pageParametersValueMap[pageParameter.id] = pageParameter.value;
            return pageParametersValueMap;
        }),
        pages: computed(() => {
            const pages = wwLib.$store.getters['websiteData/getPages'];
            const pagesValueMap = {};
            for (const page of pages) pagesValueMap[page.id] = pageSanitizer(page);
            return pagesValueMap;
        }),
        colors: computed(() => {
            const theme = wwLib.$store.getters['front/getTheme'];
             /* wwFront:start */
            // eslint-disable-next-line no-unreachable, no-undef
            return theme === 'dark' ? {"fddd4451-6d26-43a7-9d60-01f425dc8c19":"#BAE7FF","643fcb17-fe56-4e1d-a7f8-e64302574486":"#91D5FF","8e1b69a6-4b9e-4824-8629-ab418b0fd0b0":"#69C0FF","98766ff7-90eb-4b07-90d4-2d792de0a4a8":"#40A9FF","d3ee168a-1853-4e93-97f8-124ba84b3daa":"#1890FF","e56bb028-6b06-401e-94c8-20cc11813835":"#0050B3","5f01ac11-d52c-4e20-9f36-da0e0146f3c7":"#096DD9","c48f8f05-ae6e-4d69-afd3-98eadfda3bf1":"#D2F4E7","1fd50990-264f-4273-bf84-a211f5ffb80a":"#A4EACE","70434021-450e-4ffd-8efc-cb28ff9de2c2":"#49D49D","8dfca471-6369-4897-b89b-6a336f793e68":"#256A4F","a74e0a84-e1d0-49d1-9524-32ab50961047":"#123527","a322d955-1e05-4564-b770-6475180cef66":"#E6F7FF","fdc91255-21ce-4e5c-add4-e83663c1b27b":"#003A8C","a00b44cd-b8cf-494d-a69f-6f5f9dc97363":"#002766","11769305-3725-49e7-856d-38f01cdc3534":"#FF4D4F","240ce6d0-7d59-4c35-8b16-7294bbd85429":"#FAAD14","83ab371c-f478-4ace-85a6-3200df21a615":"#52C41A","526aa6c0-cb5a-47cc-8b79-02a75de6125f":"#000000D9","924b208f-79a5-4f66-ad3d-a529952c46e6":"#FFFFFF","406e7321-b82b-4e6b-ba45-93ec13c78970":"#FAFAFA","61b3ca51-b78f-4926-aeaa-d4a3ec0a82bc":"#F5F5F5","5f0f3a01-c835-4e7c-a4d7-139c8b22725f":"#F0F0F0","50d396c9-15e7-4751-828f-d2cea3c11e20":"#D9D9D9","8febf4ed-ef60-4da5-b623-2939d51eda1a":"#BFBFBF","21d984b6-72a9-4675-ac22-cf862fb213e8":"#8C8C8C","0f8d121d-f8ab-4c79-b04c-631f43b90500":"#595959","8792505a-dfe4-46bb-9af0-865ae0ea9b99":"#434343","98f6dc01-dbd7-4f5e-b198-ab8ae01c548f":"#262626","cec2f905-edfc-4f9e-acbf-640f13b4aaa2":"#1F1F1F","ab852d98-d37b-41f8-9617-902102ef9ca5":"#141414","e806c3d9-5152-4aaf-8ebc-0b8066ca0aea":"#000000","9a274023-54f3-4471-b8f2-a8d1b6fdd5fd":"#FF7875","3cd9e0d7-43fb-4d6c-9286-60d5c6fd44f8":"#00000040","1c26aef7-b68f-4e9f-8705-d6a7408fd557":"#00000073","9bf72d67-d7bf-4f38-8e05-fb3d7d449362":"#0000000F","d368093a-d9d6-4f0c-a2c3-8f42ddc28b2e":"#000000D9","5ee78d3c-9828-49f4-bc6c-f991811da03d":"#00000040","b065fa51-0f07-40bb-adc3-3a0182621309":"#FFFFFF","7cc8278f-ccec-4ff0-85a2-5e9b29f73cd3":"#FF85C0","7808bf76-c71a-4c73-b57c-bdabc2339f07":"#FF4D4F","dae6ceb3-4342-404e-9bc4-93dd5e1cfaa2":"#FADB14","0f74cebf-871c-4a0a-8772-ce0d38f99ef5":"#FA8C16","c9ba1f4f-5868-4101-be56-3169f1376b36":"#13C2C2","960e7adb-6001-4c9d-9d9b-87a741dfeef6":"#52C41A","665872c1-fa6b-4e22-8858-ede5ec40c18f":"#1890FF","425862b3-7e70-4efa-9a43-7b74a04cdfa3":"#722ED1","30ce52dd-1376-4a8c-b2c3-38eca0f1f3ed":"#3E4462","41b802d4-1916-4067-a9d8-85c742432760":"#EB2F96","2e73f810-5a13-4795-83dc-6ac7b29b0502":"#FA541C","14233b7c-45fb-4ad4-9072-04fc99c8d0ef":"#FAAD14","5f95a65b-213b-4f2f-ae74-d8caf1c485f9":"#A0D911","0719f447-7e01-406e-a731-02e61c4a7fd6":"#FFD8BF"} : {"fddd4451-6d26-43a7-9d60-01f425dc8c19":"#BAE7FF","643fcb17-fe56-4e1d-a7f8-e64302574486":"#91D5FF","8e1b69a6-4b9e-4824-8629-ab418b0fd0b0":"#69C0FF","98766ff7-90eb-4b07-90d4-2d792de0a4a8":"#40A9FF","d3ee168a-1853-4e93-97f8-124ba84b3daa":"#1890FF","e56bb028-6b06-401e-94c8-20cc11813835":"#0050B3","5f01ac11-d52c-4e20-9f36-da0e0146f3c7":"#096DD9","c48f8f05-ae6e-4d69-afd3-98eadfda3bf1":"#D2F4E7","1fd50990-264f-4273-bf84-a211f5ffb80a":"#A4EACE","70434021-450e-4ffd-8efc-cb28ff9de2c2":"#49D49D","8dfca471-6369-4897-b89b-6a336f793e68":"#256A4F","a74e0a84-e1d0-49d1-9524-32ab50961047":"#123527","a322d955-1e05-4564-b770-6475180cef66":"#E6F7FF","fdc91255-21ce-4e5c-add4-e83663c1b27b":"#003A8C","a00b44cd-b8cf-494d-a69f-6f5f9dc97363":"#002766","11769305-3725-49e7-856d-38f01cdc3534":"#FF4D4F","240ce6d0-7d59-4c35-8b16-7294bbd85429":"#FAAD14","83ab371c-f478-4ace-85a6-3200df21a615":"#52C41A","526aa6c0-cb5a-47cc-8b79-02a75de6125f":"#000000D9","924b208f-79a5-4f66-ad3d-a529952c46e6":"#FFFFFF","406e7321-b82b-4e6b-ba45-93ec13c78970":"#FAFAFA","61b3ca51-b78f-4926-aeaa-d4a3ec0a82bc":"#F5F5F5","5f0f3a01-c835-4e7c-a4d7-139c8b22725f":"#F0F0F0","50d396c9-15e7-4751-828f-d2cea3c11e20":"#D9D9D9","8febf4ed-ef60-4da5-b623-2939d51eda1a":"#BFBFBF","21d984b6-72a9-4675-ac22-cf862fb213e8":"#8C8C8C","0f8d121d-f8ab-4c79-b04c-631f43b90500":"#595959","8792505a-dfe4-46bb-9af0-865ae0ea9b99":"#434343","98f6dc01-dbd7-4f5e-b198-ab8ae01c548f":"#262626","cec2f905-edfc-4f9e-acbf-640f13b4aaa2":"#1F1F1F","ab852d98-d37b-41f8-9617-902102ef9ca5":"#141414","e806c3d9-5152-4aaf-8ebc-0b8066ca0aea":"#000000","9a274023-54f3-4471-b8f2-a8d1b6fdd5fd":"#FF7875","3cd9e0d7-43fb-4d6c-9286-60d5c6fd44f8":"#00000040","1c26aef7-b68f-4e9f-8705-d6a7408fd557":"#00000073","9bf72d67-d7bf-4f38-8e05-fb3d7d449362":"#0000000F","d368093a-d9d6-4f0c-a2c3-8f42ddc28b2e":"#000000D9","5ee78d3c-9828-49f4-bc6c-f991811da03d":"#00000040","b065fa51-0f07-40bb-adc3-3a0182621309":"#FFFFFF","7cc8278f-ccec-4ff0-85a2-5e9b29f73cd3":"#FF85C0","7808bf76-c71a-4c73-b57c-bdabc2339f07":"#FF4D4F","dae6ceb3-4342-404e-9bc4-93dd5e1cfaa2":"#FADB14","0f74cebf-871c-4a0a-8772-ce0d38f99ef5":"#FA8C16","c9ba1f4f-5868-4101-be56-3169f1376b36":"#13C2C2","960e7adb-6001-4c9d-9d9b-87a741dfeef6":"#52C41A","665872c1-fa6b-4e22-8858-ede5ec40c18f":"#1890FF","425862b3-7e70-4efa-9a43-7b74a04cdfa3":"#722ED1","30ce52dd-1376-4a8c-b2c3-38eca0f1f3ed":"#3E4462","41b802d4-1916-4067-a9d8-85c742432760":"#EB2F96","2e73f810-5a13-4795-83dc-6ac7b29b0502":"#FA541C","14233b7c-45fb-4ad4-9072-04fc99c8d0ef":"#FAAD14","5f95a65b-213b-4f2f-ae74-d8caf1c485f9":"#A0D911","0719f447-7e01-406e-a731-02e61c4a7fd6":"#FFD8BF"};
            /* wwFront:end */
        }),
        spacings:
         /* wwFront:start */
        // eslint-disable-next-line no-unreachable, no-undef
        {"b3e5b5d9-3d77-4bbe-b549-a14294d2a4e9":"2px","4619926f-6b8b-4e4f-abb2-9fef695b9476":"8px","c5374820-e47f-4f1e-8db8-4464baf920ac":"4px","8cbcc362-946c-419d-96b6-d7aa8a728578":"8px","b0b14d7d-22c7-4771-b8d1-7675dfebc156":"12px","330b8b96-3b3e-4100-b4c7-b254fa01826b":"16px","f5436315-d06a-48d3-9062-ac5af8280cbd":"24px","c2edbf47-b33a-49e8-8d49-430c512a2b92":"32px","f5a7f74d-1898-45fa-a31f-36e41c819c1d":"40px","021b5248-84b2-4b1a-8c7e-fc3c31620791":"48px","0bd8a169-1a84-4ad1-ac18-cb9638d69d5b":"64px"},
        /* wwFront:end */
        typographies:
         /* wwFront:start */
        // eslint-disable-next-line no-unreachable, no-undef
        {"ec843100-d9db-43ef-8144-579a63079bc3":"700 38px/46px 'Inter', sans-serif","4d2d1ceb-04fc-4215-99d6-50571e5e9d67":"400 14px/22px var(--ww-default-font-family, sans-serif)","57ed0190-6563-4c9e-b964-b99de33a27af":"700 30px/40px 'Inter', sans-serif","404e7b5a-c3ac-404c-a71d-21edd2b46f43":"700 24px/32px 'Inter', sans-serif","479ac714-2887-417d-9990-6936c99e7f5a":"700 20px/28px 'Inter', sans-serif","e1dbca1d-4419-407c-916b-2eb4b7ebc696":"600 16px/24px 'Inter', sans-serif","253b9586-6889-4400-bcd2-f9758ca0e86b":"600 14px/22px var(--ww-default-font-family, sans-serif)","ff5d1be3-a9ac-458c-9ba5-c51cfc440d88":"600 16px/24px var(--ww-default-font-family, sans-serif)","0f77d5ad-d574-4f46-b664-3524ecc9f75a":"600 12px/18px var(--ww-default-font-family, sans-serif)","ee2f3cad-66ac-4f1e-8d7c-0fed71f28476":"400 12px/18px var(--ww-default-font-family, sans-serif)","736fc9c3-e7b4-4f19-9be1-896da97ae640":"400 16px/22px var(--ww-default-font-family, sans-serif)"},
        /* wwFront:end */
        browser: computed(() => {
            const router = wwLib.manager ? wwLib.getEditorRouter() : wwLib.getFrontRouter();
            const currentRoute = router.currentRoute.value;
            let currentQueries = currentRoute.query;
             return {
                url: window.location.origin + currentRoute.fullPath,
                path: currentRoute.path,
                // verify if auth plugin
                 /* wwFront:start */
                // eslint-disable-next-line no-dupe-keys
                source: currentQueries._source,
                /* wwFront:end */
                query: currentQueries,
                domain: window.location.hostname,
                baseUrl: window.location.origin,
                breakpoint: wwLib.$store.getters['front/getScreenSize'],
                environment: wwLib.getEnvironment(),
                theme: wwLib.$store.getters['front/getTheme'],
            };
        }),
        screen: services.scrollStore.screen,
        componentPositionInfo: services.scrollStore.componentPositionInfo,
    }),

    pageData: computed(() => {
        const lang = wwLib.$store.getters['front/getLang'];
        const cmsDataSetPath = wwLib.$store.getters['websiteData/getPage'].cmsDataSetPath;
        if (!cmsDataSetPath) {
            return { lang };
        }

        return { lang, data: wwLib.$store.getters['data/getPageCollectionData'] };
    }),

    getEnvironment() {
        return wwLib.manager
            ? 'editor'
            : window.location.host.includes(
                  // TODO: add staging2 ?
                  '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
              )
            ? 'staging'
            : window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL)
            ? 'preview'
            : 'production';
    },

    useBaseTag() {
        return (
            wwLib.getEnvironment() === 'production' &&
            window.wwg_designInfo.baseTag &&
            window.wwg_designInfo.baseTag.href
        );
    },

    getBaseTag() {
        let baseTag = window.wwg_designInfo.baseTag?.href || '';
        if (!baseTag.startsWith('/')) {
            baseTag = '/' + baseTag;
        }
        if (!baseTag.endsWith('/')) {
            baseTag += '/';
        }
        return baseTag;
    },

    /**
     * @PUBLIC_API
     */
    getFrontWindow() {
        if (document.querySelector('.ww-manager-iframe')) {
            return document.querySelector('.ww-manager-iframe').contentWindow;
        }
        return window;
    },

    /**
     * @PUBLIC_API
     */
    getFrontDocument() {
        return this.getFrontWindow().document;
    },

    /**
     * @PUBLIC_API
     */
    getFrontRouter() {
        return this.front.router;
    },

    /**
     * @PUBLIC_API
     */
    getEditorWindow() {
         // eslint-disable-next-line no-unreachable
        return null;
    },

    /**
     * @PUBLIC_API
     */
    getEditorDocument() {
         // eslint-disable-next-line no-unreachable
        return null;
    },

    /**
     * @PUBLIC_API
     */
    getEditorRouter() {
        return this.editor.router;
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwApp.goTo
     */
    goTo(...args) {
        wwLib.wwLog.warn('wwLib.goTo is DEPRECATED, use wwLib.wwApp.goTo instead');
        wwLib.wwApp.goTo(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.getStyleFromToken
     */
    getStyleFromToken(...args) {
        // wwLib.wwLog.warn('wwLib.getStyleFromToken is DEPRECATED, use wwLib.wwUtils.getStyleFromToken instead');
        return wwLib.wwUtils.getStyleFromToken(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.getTypoFromToken
     */
    getTypoFromToken(...args) {
        // wwLib.wwLog.warn('wwLib.getTypoFromToken is DEPRECATED, use wwLib.wwUtils.getTypoFromToken instead');
        return wwLib.wwUtils.getTypoFromToken(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED
     */
    element(value) {
        wwLib.wwLog.warn('wwLib.element is DEPRECATED');
        if (typeof value === 'object') {
            return { isWwObject: true, ...value };
        } else {
            return { isWwObject: true, type: value };
        }
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.resolveObjectPropertyPath
     */
    resolveObjectPropertyPath(...args) {
        // wwLib.wwLog.warn(
        //     'wwLib.resolveObjectPropertyPath is DEPRECATED, use wwLib.wwUtils.resolveObjectPropertyPath instead'
        // );
        return wwLib.wwUtils.resolveObjectPropertyPath(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwutils.getTextStyleFromContent
     */
    getTextStyleFromContent(...args) {
        // wwLib.wwLog.warn(
        //     'wwLib.getTextStyleFromContent is DEPRECATED, use wwLib.wwUtils.getTextStyleFromContent instead'
        // );
        return wwLib.wwUtils.getTextStyleFromContent(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwWorkflow.executeGlobal
     */
    async executeWorkflow(...args) {
        wwLib.wwLog.warn('wwLib.executeWorkflow is DEPRECATED, use wwLib.wwWorkflow.executeGlobal instead');
        return wwLib.wwWorkflow.executeGlobal(...args);
    },

    /**
     * @PUBLIC_API
     * @EDITOR
     * @DEPRECATED wwLib.wwEditor.findParentUidByFlag
     */
    findParentUidByFlag(...args) {
        wwLib.wwLog.warn('wwLib.wwEditor.findParentUidByFlag is DEPRECATED, use wwLib.findParentUidByFlag instead');
        return wwLib.wwEditor.findParentUidByFlag(...args);
    },

    /**
     * @PUBLIC_API
     * @EDITOR
     * @DEPRECATED wwLib.wwEditor.selectParentByFlag
     */
    selectParentByFlag(...args) {
        wwLib.wwLog.warn('wwLib.wwEditor.selectParentByFlag is DEPRECATED, use wwLib.selectParentByFlag instead');
        return wwLib.wwEditor.selectParentByFlag(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwElement.useCreate
     */
    useCreateElement() {
        wwLib.wwLog.warn('wwLib.useCreateElement is DEPRECATED, use wwLib.wwElement.useCreate instead');
        return this.wwElement.useCreate();
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwElement.useLayoutStyle
     */
    useLayoutStyle() {
        wwLib.wwLog.warn('wwLib.useLayoutStyle is DEPRECATED, use wwLib.wwElement.useLayoutStyle instead');
        return wwLib.wwElement.useLayoutStyle();
    },

    /**
     * @PUBLIC_API
     */
    useIcons() {
        const store = useIconsStore();
        return {
            getIcon: store.getIcon,
        };
    },
};

function pageSanitizer(page) {
    const keysToInclude = [
        'id',
        'name',
        'folder',
        'metaImage',
        'pageLoaded',
        'paths',
        'langs',
        'meta',
        'title',
        'sections',
        'pageUserGroups',
    ];

    const _page = {};
    keysToInclude.forEach(key => {
        _page[key] = page[key];
    });

    _page.meta && delete _page.meta.__typename;
    for (const section of _page.sections || []) {
        delete section.__typename;
    }

    const lang = wwLib.$store.getters['front/getLang'];
    if (_page.paths) _page.path = _page.paths[lang] || _page.paths.default;
    else _page.path = null;

    _page.lang = lang;

    return _page;
}
