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
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
            }
        })
    ],
    server: {    
        open: true, 
        port: 3000, 
    },
    resolve: {
        alias: [
            {
                find: 'nsfwjs',
                replacement: 'nsfwjs/dist/nsfwjs.min.js',
            },
        ],
    }
})