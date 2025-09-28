<template>
  <div id="app">
    <header class="app-header">
      <router-link to="/" class="logo">
        &#x1f4a1; 発明クラブ ポータル
      </router-link>
      <nav>
        <router-link 
          v-if="mainStore.isAdminLoggedIn" 
          to="/admin/dashboard"
          class="nav-link"
        >
          管理ボード
        </router-link>
        <button 
          v-if="mainStore.isAdminLoggedIn" 
          @click="handleLogout" 
          class="logout-button nav-link"
        >
          ログアウト
        </button>
        <router-link 
          v-else 
          to="/"
          class="nav-link"
        >
          ログイン
        </router-link>
      </nav>
    </header>

    <main class="app-main">
      <div v-if="isAuthLoading" class="loading-overlay">
        <p>アプリケーションを初期化中...</p>
      </div>
      <router-view v-else />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useMainStore } from '@/stores/main';
import { logoutAdmin } from '@/utils/auth';

const router = useRouter();
const mainStore = useMainStore();
const isAuthLoading = ref(true);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // TODO: ここでFirestoreやカスタムクレームをチェックし、本当に「管理者」か確認すべき
      mainStore.loginAdmin({ 
        uid: user.uid, 
        email: user.email 
      });
    } else {
      mainStore.logoutAdmin(); 
    }
    isAuthLoading.value = false; 
  });
});

const handleLogout = async () => {
  try {
    await logoutAdmin();
    router.push({ name: 'portal-login' });
  } catch (error) {
    alert("ログアウト処理に失敗しました。");
  }
};
</script>

<style>
/* グローバルスタイル */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f8ff; /* パステルカラーの背景 */
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ヘッダーのスタイル */
.app-header {
  background-color: #80aeff; /* スカイブルー */
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 優しい影 */
}

.logo {
  color: white;
  text-decoration: none;
  font-size: 1.6em;
  font-weight: 600;
}

.app-header nav a, .app-header nav button {
  color: white;
  text-decoration: none;
  margin-left: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: transparent;
  transition: background-color 0.2s, transform 0.1s;
}

.app-header nav a:hover, .app-header nav button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-button {
  border: 2px solid white;
  cursor: pointer;
  font-size: 1em;
}

.app-main {
  flex-grow: 1;
  padding: 20px;
}

/* 共通UI要素の基本設定 */
button {
  transition: all 0.2s;
}
</style>