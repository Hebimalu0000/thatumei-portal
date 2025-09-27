import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';

// PWA: Service Workerの登録
// Vite PWAプラグイン（vite-plugin-pwa）がビルド時に生成するService Worker（sw.js）を登録します。
// アプリがPWAとしてオフライン動作するために重要です。
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker 登録成功: ', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker 登録失敗: ', err);
      });
  });
}

// Vueアプリケーションの作成と初期化
const app = createApp(App);

// ルーター (画面遷移) を使用
app.use(router);

// Pinia (状態管理) を使用
app.use(pinia);

// アプリケーションをHTMLの #app 要素にマウント
app.mount('#app');