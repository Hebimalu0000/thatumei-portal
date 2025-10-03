<template>
  <div class="not-found-container">
    <div class="error-card">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">ページが見つかりません</h2>
      <p class="error-message">お探しのページは、移動されたか、削除されたか、またはURLが間違っている可能性があります。</p>
      
      <router-link :to="{ name: 'welcome' }" class="back-button">
        <span class="icon">🏠</span> ポータルのトップページへ戻る
      </router-link>
      
      <p v-if="isLoggedIn" class="dashboard-link-area">
        <router-link :to="{ name: currentDashboardName }" class="dashboard-link">
          自分のダッシュボードへ移動
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/stores/main'; 

const mainStore = useMainStore();

// ログイン状態をチェック
const isLoggedIn = computed(() => mainStore.isLoggedIn);

// ログインしている場合に、現在の権限に応じたダッシュボード名を返す
const currentDashboardName = computed(() => {
    if (mainStore.isAdminLoggedIn) {
        return 'admin-dashboard';
    }
    if (mainStore.isTeacherLoggedIn) {
        return 'teacher-dashboard';
    }
    // 生徒、またはログインしているが権限が不明確な場合
    return 'dashboard'; 
});
</script>

<style scoped>
/* 🎨 Google Classroom のテーマカラーを再定義 */
:root {
  --color-blue: #4285F4;
  --color-red: #EA4335;
  --color-text-dark: #202124;
  --color-background: #f1f3f4; 
}

.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-background);
  font-family: Roboto, 'Noto Sans JP', sans-serif;
  color: var(--color-text-dark);
}

.error-card {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background-color: white;
  border-radius: 12px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
  text-align: center;
  border-top: 5px solid var(--color-red); /* エラーを赤で強調 */
}

.error-code {
  font-size: 5em;
  font-weight: 700;
  color: var(--color-red);
  margin: 0 0 10px 0;
}

.error-title {
  font-size: 1.8em;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 15px;
}

.error-message {
  font-size: 1em;
  color: #5f6368;
  margin-bottom: 30px;
  line-height: 1.6;
}

/* ボタン (メインアクション) */
.back-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 25px;
  background-color: var(--color-blue);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background-color: #357ae8;
  transform: translateY(-1px);
  text-decoration: none;
}

.icon {
    margin-right: 8px;
    font-size: 1.2em;
}

/* ダッシュボードリンク (サブアクション) */
.dashboard-link-area {
    margin-top: 20px;
}

.dashboard-link {
    color: var(--color-blue);
    font-size: 0.9em;
    font-weight: 500;
    text-decoration: underline;
}

.dashboard-link:hover {
    text-decoration: none;
}
</style>