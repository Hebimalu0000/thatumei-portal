<template>
  <div class="portal-login-container">
    <div class="login-card">
      <div class="logo-area">
        <h1 class="app-title integrated-style">🌟 管理者・講師 ポータル</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <h2 class="form-title">認証ログイン</h2>
        
        <div class="form-group">
          <label for="identifier">ID (例: A001 または T001)</label>
          <input 
            type="text" 
            id="identifier" 
            v-model="identifier" 
            required
            placeholder="AまたはTから始まるIDを入力"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">パスワード</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="login-button integrated-style">
          {{ isLoading ? '認証中...' : 'ログイン' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      
      <div class="footer-link">
          <router-link :to="{ name: 'login' }">生徒ログインはこちら &rarr;</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { universalLogin } from '@/utils/auth'; 

const router = useRouter();
const mainStore = useMainStore();

const identifier = ref(''); 
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);

/**
 * ログイン処理を実行し、権限に応じてリダイレクトする
 * 💡 管理者/講師以外のログインはエラーとする
 */
const handleLogin = async () => {
  errorMessage.value = null; 
  isLoading.value = true;
  mainStore.setError(null); 

  try {
    // universalLoginを実行
    const result = await universalLogin(identifier.value, password.value);

    if (result.success) {
      let targetName;
      // 1. 管理者としてログイン成功
      if (result.isAdministrator) {
        targetName = 'admin-dashboard';
      // 2. 講師としてログイン成功
      } else if (result.isTeacher) {
        targetName = 'teacher-dashboard';
      } else {
        // 🚨 3. 生徒IDなどでログインが成功したが、このポータルが対象外の場合
        errorMessage.value = "生徒アカウントは専用のログイン画面をご利用ください。";
        // 認証セッションをリセットすることが理想的ですが、ここではエラーメッセージ表示に留める
        return; 
      }
      
      // 成功した場合のみリダイレクト
      router.push({ name: targetName }); 
    }
  } catch (e) {
    // auth.jsからスローされたエラーを捕捉
    errorMessage.value = mainStore.error || "IDまたはパスワードが正しくありません。";
    console.error("Login attempt failed:", e); 
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 💡 統合テーマカラー: Google Blue (4285F4) を使用 */

/* ✅ 修正: :root を削除し、最上位コンテナで変数を再定義 */
.portal-login-container {
    /* --- CSS変数定義 --- */
    --color-integrated-primary: #4285F4; /* Google Blue */
    --color-integrated-dark: #357ae8;
    --color-background: #f0f4f8; 
    --color-text-dark: #333;
    /* --- 既存のレイアウトスタイル --- */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background-color: var(--color-background);
}

/* 基本的なレイアウト */
.portal-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--color-background);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 35px;
  background-color: white;
  border-radius: 12px; 
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); 
  border: 1px solid #e0e0e0;
}

.logo-area {
  text-align: center;
  margin-bottom: 25px;
}

.app-title {
  font-size: 1.6em;
  font-weight: 700;
  display: inline-block;
  padding-bottom: 5px;
  /* 統合スタイルを適用 */
  color: var(--color-integrated-primary); 
  border-bottom: 3px solid var(--color-integrated-primary);
}

.form-title {
  font-size: 1.3em;
  text-align: center;
  margin-bottom: 25px;
  color: #555;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 8px;
  color: var(--color-text-dark);
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc; 
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  /* 統合スタイルを適用 */
  border-color: var(--color-integrated-primary); 
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2); 
}

.login-button {
  width: 100%;
  padding: 12px;
  /* 統合スタイルを適用 */
  background-color: var(--color-integrated-primary); 
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s, transform 0.2s;
}

.login-button:hover {
  background-color: var(--color-integrated-dark);
  transform: translateY(-2px);
}

.login-button:disabled {
  background-color: #a7cbf5;
  cursor: not-allowed;
  box-shadow: none;
  transform: translateY(0);
}

.error-message {
  color: #d32f2f; 
  background-color: #ffcdd2;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
  border: 1px solid #ef9a9a;
}

.footer-link {
    text-align: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.footer-link a {
    /* 統合スタイルを適用 */
    color: var(--color-integrated-primary);
    font-size: 0.9em;
    font-weight: 500;
}
</style>
