<template>
  <div class="admin-login-view">
    <h1>管理者ログイン</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">メールアドレス:</label>
        <input type="email" id="email" v-model="email" required />
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
import { loginAdmin } from '@/utils/auth';

const router = useRouter();
const mainStore = useMainStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) return;

  isLoading.value = true;
  try {
    await loginAdmin(email.value, password.value);
    
    // ログイン成功後、ダッシュボードへリダイレクト
    router.push({ name: 'admin-dashboard' });

  } catch (e) {
    // エラーはauth.js内でPiniaストアに設定済み
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.admin-login-view { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
.login-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { display: flex; flex-direction: column; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
button { padding: 10px; background-color: #304ffe; color: white; border: none; border-radius: 4px; cursor: pointer; }
.error-message { color: red; margin-top: 10px; }
</style>