<template>
  <div class="admin-dashboard-container">
    <header class="page-header">
      <h1 class="portal-title">🛠️ 管理者ダッシュボード</h1>
      <button class="logout-button" @click="handleLogout">ログアウト</button>
    </header>

    <div class="main-content-wrapper">
      <div class="summary-grid">
        <div class="metric-card total-students">
          <p class="metric-label">全クラブ員数</p>
          <p class="metric-value">{{ totalStudents }} 名</p>
          <div class="metric-icon">🧑‍💻</div>
        </div>
        <div class="metric-card today-present">
          <p class="metric-label">本日出席</p>
          <p class="metric-value">{{ todayPresentCount }} / {{ totalStudents }}</p>
          <div class="metric-icon">✅</div>
        </div>
        <div class="metric-card new-submissions">
          <p class="metric-label">未確認の課題提出</p>
          <p class="metric-value">{{ pendingSubmissions }} 件</p>
          <div class="metric-icon">📁</div>
        </div>
        <div class="metric-card active-teachers">
          <p class="metric-label">担当講師数</p>
          <p class="metric-value">{{ activeTeachers }} 名</p>
          <div class="metric-icon">👨‍🏫</div>
        </div>
      </div>

      <div class="action-and-recent-wrapper">
        
        <div class="management-actions">
          <h2 class="section-title">クイック管理アクション</h2>
          <div class="action-grid">
            <button class="action-button primary" @click="goToAttendanceManagement">
              <span class="action-icon">⏱️</span> 出席状況管理
            </button>
            <button class="action-button secondary" @click="goToUserManagement">
              <span class="action-icon">👥</span> 生徒・講師アカウント管理
            </button>
            <button class="action-button primary" @click="goToCreateAnnouncement">
              <span class="action-icon">📣</span> お知らせ新規作成
            </button>
            <button class="action-button secondary" @click="goToSubmissionReview">
              <span class="action-icon">👀</span> 課題レビュー
            </button>
          </div>
        </div>

        <div class="recent-activity-card">
          <h2 class="section-title">最近の活動ログ</h2>
          <ul class="activity-list">
            <li v-for="log in recentActivity" :key="log.id" class="activity-item">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </li>
          </ul>
          <button class="action-link" @click="viewFullLog">全てのアクティビティを見る →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { universalLogout } from '@/utils/auth';

const router = useRouter();

// --- データ取得/モック ---
const totalStudents = ref(150);
const todayPresentCount = ref(128);
const pendingSubmissions = ref(5);
const activeTeachers = ref(8);

const recentActivity = ref([
  { id: 1, time: '10:05', message: '講師T003が本日の活動ログを記録しました。' },
  { id: 2, time: '09:55', message: '生徒S2024045の出席が登録されました。' },
  { id: 3, time: '09:00', message: 'お知らせ「緊急連絡」を配信しました。' },
]);

// --- アクション ---
const handleLogout = async () => {
  await universalLogout();
  router.push({ name: 'admin-login' }); // 管理者ログイン画面へリダイレクト
};

// クイックアクションのルーティング (ルートはrouter/index.jsで定義されているものとする)
const goToAttendanceManagement = () => {
  console.log("出席状況管理へ");
  // router.push({ name: 'attendance' }); 
};

const goToUserManagement = () => {
  console.log("アカウント管理画面へ");
  // router.push({ name: 'admin-user-management' });
};

const goToCreateAnnouncement = () => {
  console.log("お知らせ作成画面へ");
  // router.push({ name: 'admin-create-announcement' });
};

const goToSubmissionReview = () => {
  console.log("課題レビュー画面へ");
  // router.push({ name: 'admin-submission-review' });
};

const viewFullLog = () => {
    console.log("全ログビューへ");
};
</script>

<style scoped>
/* 🎨 Google Classroom のテーマカラーを継承し、管理用カラーを設定 */

/* 💡 修正: CSS変数の定義をこのスコープのトップ要素に移動 */
.admin-dashboard-container {
  /* 変数をこのコンポーネント内で使えるように再定義 */
  --color-admin-blue: #1A73E8; /* 管理者向けにより濃いブルー */
  --color-primary: #4285F4;
  --color-green: #34A853;
  --color-red: #EA4335;
  --color-yellow: #FBBC04;
  --color-text-dark: #202124;
  --color-text-light: #5f6368;
  --color-background: #f1f3f4; 

  min-height: 100vh;
  background-color: var(--color-background);
  font-family: Roboto, 'Noto Sans JP', sans-serif;
  color: var(--color-text-dark);
}

/* === ヘッダー (Admin Blueで強調) === */
.page-header {
  background-color: var(--color-admin-blue); /* <-- 変数で参照 */
  padding: 10px 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.portal-title {
  font-size: 1.4em;
  font-weight: 500;
  color: white;
  margin: 0;
}

.logout-button {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* === メインレイアウト === */
.main-content-wrapper {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 24px;
}

/* === セクション 1: サマリーメトリクス === */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.metric-card {
  background-color: white;
  padding: 20px 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border-left: 5px solid var(--color-primary); /* アクセントカラー */
}

.metric-card:hover {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
}

.metric-label {
  font-size: 0.9em;
  font-weight: 500;
  color: var(--color-text-light);
  margin: 0 0 5px 0;
}

.metric-value {
  font-size: 2em;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.metric-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 2.5em;
  opacity: 0.1;
}

/* === セクション 2: アクションと活動ログ === */
.action-and-recent-wrapper {
  display: flex;
  gap: 24px;
}

.management-actions {
  flex: 1.5; 
  min-width: 400px;
}

.recent-activity-card {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #dadce0;
}

.section-title {
  font-size: 1.2em;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

/* アクションボタン */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.action-button {
  padding: 20px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 2em;
  margin-bottom: 8px;
}

.action-button.primary {
  background-color: var(--color-primary);
  color: white;
}
.action-button.secondary {
  background-color: #e8f0fe;
  color: var(--color-text-dark);
  border: 1px solid #cce0ff;
}

/* 活動ログ */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9em;
}

.log-time {
  font-weight: 600;
  color: var(--color-text-light);
  margin-right: 15px;
  flex-shrink: 0;
}

.log-message {
  color: var(--color-text-dark);
}

.action-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-top: 15px;
  display: block;
  font-size: 0.9em;
  text-align: right;
}

/* レスポンシブ対応 */
@media (max-width: 900px) {
  .action-and-recent-wrapper {
    flex-direction: column;
  }
  .management-actions, .recent-activity-card {
    min-width: 100%;
    flex: none;
  }
}
</style>