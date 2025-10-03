<template>
  <div class="portal-login-container">
    <div class="login-card">
      <div class="logo-area">
        <h1 class="app-title">🚀 豊田少年少女発明クラブ</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <h2 class="form-title">生徒ポータルログイン</h2>
        
        <div class="form-group">
          <label for="identifier">生徒ID (例: S00S000)</label>
          <input 
            type="text" 
            id="identifier" 
            v-model="identifier" 
            required
            placeholder="Sから始まる生徒IDを入力"
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

        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? '認証中...' : 'ログイン' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <!-- 💡 講師・管理者向けの導線フッターを追加 -->
      <div class="footer-link">
          <router-link :to="{ name: 'teacher-login' }">講師・管理者ログインはこちら &rarr;</router-link>
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

// ユーザーID入力欄
const identifier = ref(''); 
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);

const handleLogin = async () => {
  errorMessage.value = null; 
  isLoading.value = true;
  mainStore.setError(null); 

  try {
    // 💡 IDの形式が生徒（S）以外の場合はここで先に弾く（UI上の便宜）
    if (!identifier.value.toUpperCase().startsWith('S')) {
        errorMessage.value = "生徒IDは'S'から始まります。講師・管理者の方は下部のリンクをご利用ください。";
        return;
    }
    
    // universalLoginを実行
    const result = await universalLogin(identifier.value, password.value);

    // ログイン成功: 生徒用ポータルのため、無条件で生徒ダッシュボードへ
    if (result.success) {
      if (result.isAdministrator || result.isTeacher) {
        // 💡 認証は成功したが、権限が管理者/講師だった場合
        errorMessage.value = "このログイン画面は生徒専用です。講師・管理者アカウントでログインするには、下部のリンクをご利用ください。";
        // ログアウト処理を追加することが望ましいが、ここではリダイレクトしないことで対処
      } else {
        // 生徒アカウントでのログイン成功
        router.push({ name: 'dashboard' }); 
      }
    }

  } catch (e) {
    // 認証失敗時やその他のエラーを捕捉し、ユーザーに表示
    errorMessage.value = mainStore.error || "IDまたはパスワードが正しくありません。";
    console.error("Login attempt failed:", e); 
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* スタイルはそのまま維持 */
.portal-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px); 
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 30px;
  background-color: white;
  border-radius: 15px; 
  box-shadow: 0 8px 15px rgba(128, 174, 255, 0.2); 
}

.logo-area {
  text-align: center;
  margin-bottom: 25px;
}

.app-title {
  font-size: 1.8em;
  font-weight: 700;
  color: #80aeff; /* スカイブルー */
}

.form-title {
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 20px;
  color: #57606a;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0f0ff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.95em;
  margin-bottom: 8px;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0f0ff; 
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  background-color: #ffffff;
}

input:focus {
  border-color: #80aeff; 
  outline: none;
  box-shadow: 0 0 0 3px rgba(128, 174, 255, 0.4);
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #80ffb4; /* ミントグリーン */
  color: #006633;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(128, 255, 180, 0.4);
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.login-button:hover {
  background-color: #5ff199;
  transform: translateY(-1px);
}

.login-button:disabled {
  background-color: #d1e7c5;
  color: #888;
  cursor: not-allowed;
  box-shadow: none;
  transform: translateY(0);
}

.error-message {
  color: #ff8080; 
  background-color: #fff0f0;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
  border: 1px solid #ffaaaa;
}

/* 💡 講師・管理者へのリンクスタイル */
.footer-link {
    text-align: center;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.footer-link a {
    color: #80aeff;
    font-size: 0.9em;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-link a:hover {
    color: #4d90fe;
    text-decoration: underline;
}
</style>