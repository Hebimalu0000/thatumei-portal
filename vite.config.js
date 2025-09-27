// vite.config.ts

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa' // PWAプラグインをインポート

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // PWAプラグインの設定
    VitePWA({
      registerType: 'autoUpdate', // Service Workerの自動更新を有効化
      // マニフェストファイルの設定
      manifest: {
        name: '豊田少年少女発明クラブポータルアプリ', // アプリのフルネーム
        short_name: '発明クラブポータル', // ホーム画面に表示される短い名前
        description: '豊田少年少女発明クラブポータルアプリ',
        theme_color: '#304ffe', // テーマカラー (例: 青系)
        icons: [
          // 必要なアイコンをpublic/img/icons/などに配置
          {
            src: 'img/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        // アプリケーションの表示モード
        display: 'standalone', 
        start_url: '/',
      },
      // Service Worker (Workbox) の設定
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,vue}'],
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})