<template>
  <div class="portal-login-container">
    <div class="login-card">
      <div class="logo-area">
        <h1 class="app-title">🚀 豊田少年少女発明クラブ</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <h2 class="form-title">ポータルログイン</h2>
        
        <div class="form-group">
          <label for="identifier">ID (例: T001 または S2024001)</label>
          <input 
            type="text" 
            id="identifier" 
            v-model="identifier" 
            required
            placeholder="TまたはSから始まるIDを入力"
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { universalLogin } from '@/utils/auth'; // 修正した統合ログイン関数をインポート

const router = useRouter();
const mainStore = useMainStore();

const identifier = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);

const handleLogin = async () => {
  errorMessage.value = null;
  isLoading.value = true;
  mainStore.error = null;

  try {
    const result = await universalLogin(identifier.value, password.value);

    console.log(result);

    if (result.isAdministrator) {
      // 🔥 先生(管理者)の場合、直接ダッシュボードへ
      router.push({ name: 'admin-dashboard' }); 
    } else {
      // 🔥 生徒の場合、ポータルホームへ
      router.push({ name: 'dashboard' }); 
    }

  } catch (e) {
    errorMessage.value = mainStore.error || "予期せぬエラーが発生しました。";
    console.error(mainStore.error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* スタイルは前回のパステル調UIを維持 */
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
</style>