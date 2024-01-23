import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/',
    plugins: [
        {enforce: 'pre', ...mdx(/* jsxImportSource: …, otherOptions… */)},
        react(),
        VitePWA({ 
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
                maximumFileSizeToCacheInBytes: 3000000,
                runtimeCaching: [
                    {
                        urlPattern: new RegExp(`^https:\/\/${import.meta.env.VITE_SERVER_URL}\/ad\/.*`, "i"),
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
        chunkSizeWarningLimit: 600
    }
})