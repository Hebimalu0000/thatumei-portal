// src/main.js

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router'; // src/router/index.js をインポート

const app = createApp(App);

// Piniaをインストール
app.use(createPinia());

// Vue Routerをインストール (router/index.js でガードロジックが既に実行されます)
app.use(router);

// アプリケーションをマウント
app.mount('#app');