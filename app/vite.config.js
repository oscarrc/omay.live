import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'

import { VitePWA } from 'vite-plugin-pwa'
import { VitePluginRadar } from 'vite-plugin-radar';
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

export default ({ mode }) => {
    let env = loadEnv(mode, process.cwd());

    return defineConfig({
        base: '/',
        plugins: [
            {enforce: 'pre', ...mdx()},
            react(),
            splitVendorChunkPlugin(),
            VitePluginRadar({
                analytics: {
                  id: 'G-Y8XGQY29V9',
                  persistentValues: {
                    currency: 'EUR',
                  }
                },
            }),
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
                        },
                        {
                            urlPattern: new RegExp(`^${env.VITE_SERVER_URL}\/tf\/.*`, "i"),
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'model-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 1 year
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
            outDir: "dist",
            emptyOutDir: true,
            rollupOptions: {
                plugins: [
                    visualizer()
                ]
            }
        },
    })
}