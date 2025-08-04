import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const pages = {"en/":{"outputDir":"./en/","lang":"en","title":"Blank | Start from scratch","cacheVersion":3,"meta":[{"name":"title","content":"Blank | Start from scratch"},{"itemprop":"name","content":"Blank | Start from scratch"},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Blank | Start from scratch"},{"property":"og:title","content":"Blank | Start from scratch"},{"property":"og:site_name","content":"Blank | Start from scratch"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://43ca4e27-48b4-4e73-947d-94a4cd4b743e.weweb-preview.io/fr/"},{"rel":"alternate","hreflang":"en","href":"https://43ca4e27-48b4-4e73-947d-94a4cd4b743e.weweb-preview.io/en/"},{"rel":"alternate","hreflang":"fr","href":"https://43ca4e27-48b4-4e73-947d-94a4cd4b743e.weweb-preview.io/fr/"}]},"fr/":{"outputDir":"./fr/","lang":"fr","title":"Vide | Commencer à partir de zéro","cacheVersion":3,"meta":[{"name":"title","content":"Vide | Commencer à partir de zéro"},{"itemprop":"name","content":"Vide | Commencer à partir de zéro"},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Vide | Commencer à partir de zéro"},{"property":"og:title","content":"Vide | Commencer à partir de zéro"},{"property":"og:site_name","content":"Vide | Commencer à partir de zéro"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://43ca4e27-48b4-4e73-947d-94a4cd4b743e.weweb-preview.io/fr/"},{"rel":"alternate","hreflang":"en","href":"https://43ca4e27-48b4-4e73-947d-94a4cd4b743e.weweb-preview.io/en/"},{"rel":"alternate","hreflang":"fr","href":"https://43ca4e27-48b4-4e73-947d-94a4cd4b743e.weweb-preview.io/fr/"}]}};

// Read the main HTML template
const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8');
const compiledTemplate = handlebars.compile(template);

// Generate an HTML file for each page with its metadata
Object.values(pages).forEach(pageConfig => {
    // Compile the template with page metadata
    const html = compiledTemplate({
        title: pageConfig.title,
        lang: pageConfig.lang,
        meta: pageConfig.meta,
        scripts: {
            head: pageConfig.scripts.head,
            body: pageConfig.scripts.body,
        },
        alternateLinks: pageConfig.alternateLinks,
        cacheVersion: pageConfig.cacheVersion,
        baseTag: pageConfig.baseTag,
    });

    // Save output html for each page
    if (!fs.existsSync(pageConfig.outputDir)) {
        fs.mkdirSync(pageConfig.outputDir, { recursive: true });
    }
    fs.writeFileSync(`${pageConfig.outputDir}/index.html`, html);
});

const rollupOptionsInput = {};
for (const pageName in pages) {
    rollupOptionsInput[pageName] = path.resolve(__dirname, pages[pageName].outputDir, 'index.html');
}

export default defineConfig(() => {
    return {
        plugins: [nodePolyfills({ include: ['events', 'stream', 'string_decoder'] }), vue()],
        base: "/",
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
            postcss: {
                plugins: [autoprefixer],
            },
        },
        build: {
            chunkSizeWarningLimit: 10000,
            rollupOptions: {
                input: rollupOptionsInput,
                onwarn: (entry, next) => {
                    if (entry.loc?.file && /js$/.test(entry.loc.file) && /Use of eval in/.test(entry.message)) return;
                    return next(entry);
                },
                maxParallelFileOps: 900,
            },
        },
        logLevel: 'warn',
    };
});
