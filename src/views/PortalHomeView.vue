<template>
  <div class="portal-home-container">
    <div class="portal-card">
      <h1 class="welcome-title">
        ようこそ、{{ userName }}さん！
      </h1>
      <p class="instruction">
        下のボタンから、次に進むページを選択してください。
      </p>

      <div class="action-section">
        <router-link
            v-if="mainStore.isAdminLoggedIn"
            to="/admin/dashboard"
            class="action-button admin-button large"
        >
            <span class="icon">⚙️</span>
            <h2>管理ダッシュボードへ</h2>
            <p>授業の開始/終了、名簿管理はこちら。</p>
        </router-link>

        <div v-if="mainStore.isStudentLoggedIn">
            <h3 class="mode-status">
                現在のモード: 
                <span :class="isStudentInClass ? 'mode-in-class' : 'mode-normal'">
                    {{ mainStore.studentStatus?.current_mode || '確認中...' }}
                </span>
            </h3>

            <div class="action-grid">
                <router-link
                    to="/attendance"
                    class="action-button default-button"
                >
                    <span class="icon-small">✅</span>
                    出席登録
                </router-link>

                <button class="action-button default-button">
                    <span class="icon-small">📁</span>
                    ファイルマネージャー
                </button>
                
                <button class="action-button default-button">
                    <span class="icon-small">📤</span>
                    ファイル転送
                </button>

                <button 
                    :class="['action-button', isStudentInClass ? 'in-class-button' : 'disabled-button']" 
                    :disabled="!isStudentInClass"
                >
                    <span class="icon-small">💬</span>
                    チャット (授業中のみ)
                </button>
                
                <button 
                    :class="['action-button', isStudentInClass ? 'in-class-button' : 'disabled-button']" 
                    :disabled="!isStudentInClass"
                >
                    <span class="icon-small">🖥️</span>
                    先生の画面共有
                </button>

                <button 
                    :class="['action-button', isStudentInClass ? 'in-class-button' : 'disabled-button']" 
                    :disabled="!isStudentInClass"
                >
                    <span class="icon-small">🪄</span>
                    一斉操作
                </button>
            </div>
        </div>

        <div v-else-if="!mainStore.isLoggedIn" class="error-state">
            <p>ユーザー情報が確認できません。ログアウトして再度ログインしてください。</p>
            <button @click="handleLogout" class="logout-link">ログアウトする</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/stores/main';
import { useRouter } from 'vue-router';
import { logoutAdmin } from '@/utils/auth';

const mainStore = useMainStore();
const router = useRouter();

// 表示名を設定
const userName = computed(() => {
  if (mainStore.isAdminLoggedIn && mainStore.adminUser) {
    return `先生 (${mainStore.adminUser.id})`;
  }
  if (mainStore.isStudentLoggedIn && mainStore.studentUser) {
    return `生徒 (${mainStore.studentUser.id})`;
  }
  return '発明クラブメンバー';
});

// 生徒が「授業中」モードにあるかを判別する
const isStudentInClass = computed(() => {
  return mainStore.isStudentLoggedIn && 
         mainStore.studentStatus && 
         mainStore.studentStatus.current_mode === '授業中';
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

<style scoped>
/* スタイルは前回のパステル調UIをベースに機能ボタンを追加 */
.portal-home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); 
  padding: 30px;
}

.portal-card {
  width: 100%;
  max-width: 900px; /* カードを少し広げる */
  padding: 40px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(128, 174, 255, 0.3);
  text-align: center;
}

.welcome-title {
  font-size: 2.2em;
  color: #304ffe;
  margin-bottom: 10px;
}

.instruction {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 40px;
}

.mode-status {
    font-size: 1.2em;
    margin-bottom: 30px;
    font-weight: 500;
}

.mode-in-class {
    color: #80ffb4;
    font-weight: 700;
    padding: 5px 10px;
    background-color: #006633;
    border-radius: 5px;
}

.mode-normal {
    color: #80aeff;
    font-weight: 700;
    padding: 5px 10px;
    background-color: #e0f0ff;
    border-radius: 5px;
}


.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列で表示 */
  gap: 20px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  padding: 15px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 1.1em;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.icon-small {
  font-size: 2em;
  margin-bottom: 5px;
}

/* 先生用ボタン (大きく表示される) */
.admin-button.large {
    background-color: #80aeff;
    color: white;
    height: 150px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1 / -1; /* 全幅を使う */
    box-shadow: 0 8px 15px rgba(128, 174, 255, 0.4);
}
.admin-button.large p {
    font-size: 0.9em;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 5px;
}
.admin-button.large h2 {
    margin: 5px 0;
}
.admin-button.large .icon {
    font-size: 3em;
}

/* 生徒のデフォルト機能ボタン (ファイルマネージャなど) */
.default-button {
    background-color: #e0f0ff; /* 明るい青 */
    color: #304ffe;
}

/* 生徒の授業中限定ボタン */
.in-class-button {
    background-color: #80ffb4; /* ミントグリーン */
    color: #006633;
}

/* 無効なボタン */
.disabled-button {
    background-color: #f0f0f0;
    color: #aaa;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
}

.error-state {
    padding: 20px;
    border: 1px solid #ff8080;
    background-color: #fff0f0;
    border-radius: 8px;
    color: #ff8080;
    grid-column: 1 / -1;
}
</style>