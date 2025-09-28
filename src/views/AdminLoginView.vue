<template>
  <div class="admin-login-view">
    <h1>管理者ログイン</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="identifier">ID (Tから始まる管理者ID):</label>
        <input type="text" id="identifier" v-model="identifier" required placeholder="例: T001" />
      </div>
      <div class="form-group">
        <label for="password">パスワード:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'ログイン中...' : 'ログイン' }}
      </button>
      <p v-if="mainStore.error" class="error-message">{{ mainStore.error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { universalLogin } from '@/utils/auth';

const router = useRouter();
const mainStore = useMainStore();

// 🔥 修正2: emailをidentifierに変更 🔥
const identifier = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!identifier.value || !password.value) return;

  isLoading.value = true;
  mainStore.error = null; // エラーをリセット

  try {
    // 🔥 修正3: loginAdminをuniversalLoginに変更し、結果を取得 🔥
    const result = await universalLogin(identifier.value, password.value);
    
    if (result.isAdministrator) {
        // ログイン成功後、ダッシュボードへリダイレクト
        router.push({ name: 'admin-dashboard' });
    } else {
        // IDがTから始まっても生徒と認証された場合や、ログイン後のロールチェックに失敗した場合
        mainStore.error = "管理者権限が確認できませんでした。";
        // 念のためログアウト処理を行う
        // universalLoginは生徒/先生両方を処理するため、もし生徒としてログインされた場合はここに来る可能性がある
        // 現状、AdminLoginViewからは管理者のみを期待するため、エラーとして扱う
        throw new Error(mainStore.error);
    }

  } catch (e) {
    // エラーはauth.js内でPiniaストアに設定済み
    // 画面に表示される
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* スタイルは簡略化されたまま維持 */
.admin-login-view { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
.login-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { display: flex; flex-direction: column; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
button { padding: 10px; background-color: #304ffe; color: white; border: none; border-radius: 4px; cursor: pointer; }
.error-message { color: red; margin-top: 10px; }
</style>