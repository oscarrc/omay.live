import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'

import { VitePWA } from 'vite-plugin-pwa'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

export default ({ mode }) => {
    let env = loadEnv(mode, process.cwd());

    return defineConfig({
        base: '/',
        plugins: [
            {enforce: 'pre', ...mdx(/* jsxImportSource: …, otherOptions… */)},
            react(),
            splitVendorChunkPlugin(),
            VitePWA({ 
                registerType: 'autoUpdate',
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
                    maximumFileSizeToCacheInBytes: 3000000,
                    runtimeCaching: [
                        {
                            urlPattern: new RegExp(`^${env.VITE_SERVER_URL}\/ad\/.*`, "i"),
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'ads-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 // <== 1 day
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        }
                    ]
                }
            })
        ],
        server: {    
            open: true, 
            port: 3000,
            host: true,
            watch: {
                usePolling: true
            }
        },
        resolve: {
            alias: [
                {
                    find: 'nsfwjs',
                    replacement: 'nsfwjs/dist/nsfwjs.min.js',
                },
            ],
        },
        build: {
            outDir: "../www",
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if(id.includes('nsfw')) return 'nsfw'
                        if(id.includes('i18next')) return 'react-i18next'
                        if(id.includes('react-router-dom') || id.includes('@remix-run') || id.includes('react-router')) {
                            return 'react-router';
                        }
                    }
                },
                plugins: [
                    visualizer()
                ]
            }
        },
    })
}