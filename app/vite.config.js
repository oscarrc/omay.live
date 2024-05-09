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
        plugins: [
            {enforce: 'pre', ...mdx()},
            react(),
            splitVendorChunkPlugin(),
            VitePluginRadar({
                analytics: [
                    {
                        id: 'G-Y8XGQY29V9',
                        persistentValues: {
                          currency: 'EUR',
                        }
                    },
                ]
            }),
            VitePWA({ 
                registerType: 'autoUpdate',
                manifest: {
                    "short_name": "Omay.live",
                    "name": "Omay.live | Live with strangers",
                    "description": "Omay.live is a free online video chat app. Connect live with strangers from all over the world anonymously and have fun with them.",
                    "icons": [
                      {
                        "src": "favicon.ico",
                        "sizes": "48x48",
                        "type": "image/x-icon"
                      },
                      {
                        "src": "logo.svg",
                        "type": "image/svg+xml",
                        "purpose": "any",
                        "sizes": "any"
                      },    
                      {
                        "src": "logo.png",
                        "type": "image/png",
                        "purpose": "maskable",
                        "sizes": "512x512"
                      }
                    ],
                    "screenshots" : [
                      {
                        "src": "screenshots/screenshot_wide.webp",
                        "sizes": "1280x720",
                        "type": "image/webp",
                        "form_factor": "wide",
                        "label": "Omay.live! Live with strangers"
                      },
                      {
                        "src": "screenshots/screenshot_narrow.webp",
                        "sizes": "1080x2264",
                        "type": "image/webp",
                        "form_factor": "narrow",
                        "label": "Omay.live! Live with strangers"
                      }
                    ],
                    "id": "/",
                    "start_url": ".",
                    "display": "fullscreen",
                    "orientation": "portrait",
                    "theme_color": "#44ADEE",
                    "background_color": "#44ADEE"
                },
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
        ]
    })
}