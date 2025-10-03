:App Component (Single Script Setup):src/App.vue
<script setup>
import { onMounted } from 'vue';
import { useMainStore } from '@/stores/main'; 
// RouterViewは通常、テンプレートで使うために明示的にインポートする必要はありませんが、
// 念のため、他のインポートと統合します。
import { RouterView } from 'vue-router'; 

const mainStore = useMainStore();

onMounted(() => {
    // アプリケーションがマウントされたらすぐにローカルストレージからの復元を試みる
    mainStore.initializeStoreFromLocalStorage();
    
    // 💡 注意: ここでrouter.pushロジックは追加しない
    // routerの保護（ナビゲーションガード）で、isLoggedInがtrueならログイン画面をスキップするように設定すべきです。
});
</script>

<template>
  <RouterView />
</template>

<style>
/* === グローバルスタイル (Google Classroom風) === */
:root {
  --color-blue: #4285F4;
  --color-text-dark: #202124;
  --color-background: #f1f3f4; 
}

/* 全体のフォントと背景の設定 */
body {
  font-family: Roboto, 'Noto Sans JP', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0; /* bodyのデフォルトマージンを削除 */
  padding: 0;
  background-color: var(--color-background);
  color: var(--color-text-dark);
}

/* App.vue のルート要素は、bodyと同じ設定を継承するか、特に設定しません。 */
#app {
  /* ここに設定を追加する場合は、bodyの設定と重複しないように注意します */
}

/* リンクのデフォルトスタイルをリセット/調整 */
a {
  color: var(--color-blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* ボタンの共通スタイルリセット */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
}
</style>