<template>
  <div class="welcome-container">
    <h1 class="title">発明クラブポータルへようこそ！</h1>
    <p class="subtitle">ご利用のユーザー種別を選択してください。</p>

    <div class="card-grid">
      <div class="card" @click="goToLogin('login')">
        <div class="card-icon">💡</div>
        <h2 class="card-title">クラブ生徒 / 保護者の方</h2>
        <p class="card-description">作品の進捗確認やイベント情報はこちら</p>
        <button class="action-button">ログインへ</button>
      </div>

      <div class="card" @click="goToLogin('teacher-login')">
        <div class="card-icon">👩‍🏫</div>
        <h2 class="card-title"> 先生 / 管理者</h2>
        <p class="card-description">出席登録や生徒データの管理はこちら</p>
        <button class="action-button teacher-button">先生 / 管理者ログインへ</button>
      </div>
    </div>
    
    <div class="info-link">
      <router-link to="/about">クラブ紹介や活動概要はこちら</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * ユーザー種別に応じてログインページへ遷移させる
 * @param {string} routeName - 遷移先のルート名 ('login' または 'admin-login')
 */
const goToLogin = (routeName) => {
  router.push({ name: routeName });
};
</script>

<style scoped>
.welcome-container {
  max-width: 900px;
  margin: 80px auto;
  padding: 20px;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.title {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 40px;
}

.card-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px;
  width: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #007bff; /* 生徒・保護者は青 */
}

.teacher-button {
  background-color: #28a745; /* 管理者は緑 */
}

.action-button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.action-button:hover {
  background-color: #0056b3;
}

.info-link {
    margin-top: 50px;
    font-size: 0.9em;
}

.info-link a {
    color: #007bff;
    text-decoration: none;
}

.info-link a:hover {
    text-decoration: underline;
}
</style>