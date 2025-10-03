<template>
  <div class="classroom-container">
    <header class="page-header classroom-blue">
      <h1 class="portal-title">🚀 豊田少年少女発明クラブ</h1>
      <button class="logout-button" @click="handleLogout">ログアウト</button>
    </header>

    <div class="main-content-wrapper">
      <div class="sidebar">
        <div class="sidebar-card upcoming-summary">
          <h3 class="summary-title">まもなく提出</h3>
          <ul class="due-list">
            <li v-for="task in nearDueTasks" :key="task.id" class="due-item">
              <span class="due-date">〆 {{ task.due }}</span>
              <p class="due-title">{{ task.title }}</p>
            </li>
          </ul>
          <p v-if="nearDueTasks.length === 0" class="no-due">提出期限が近い課題はありません。</p>
        </div>
        
        <div class="sidebar-card status-summary">
          <h3 class="summary-title">本日のステータス</h3>
          <p class="status-label" :class="statusClass">{{ currentStatus.label }}</p>
          <p class="status-detail">{{ currentStatus.detail }}</p>
          <button class="action-link" @click="viewAttendanceHistory">出席履歴 →</button>
        </div>

      </div>

      <div class="main-stream">
        <div class="stream-card banner-card">
          <div class="banner-content">
            <h2 class="class-name">クラブ活動ポータル</h2>
            <p class="greeting-message">こんにちは、{{ userName }}さん！ {{ currentDate }}</p>
            <div class="quick-actions">
               <button class="quick-button" @click="goToSubmission">課題提出・作品登録</button>
               <button class="quick-button secondary" @click="goToQnA">質問コーナー</button>
            </div>
          </div>
        </div>

        <div class="stream-card stream-assignment">
          <div class="assignment-border event-color"></div>
          <div class="assignment-body">
             <div class="assignment-icon">📅</div>
             <div class="assignment-text">
               <p class="assignment-title">{{ nextEvent.title }}</p>
               <p class="assignment-due">日時: {{ nextEvent.time }}</p>
             </div>
             <button class="view-button" @click="viewFullSchedule">確認</button>
          </div>
        </div>

        <div 
          v-for="n in notifications" 
          :key="n.id" 
          class="stream-card stream-post"
          @click="viewNotificationDetail(n)"
        >
          <div class="post-header">
            <div class="post-icon notification-icon">📣</div>
            <div class="post-meta">
              <p class="post-source">発明クラブ運営</p>
              <p class="post-date">{{ n.date }}</p>
            </div>
          </div>
          <p class="post-content">{{ n.summary }}</p>
          <span v-if="n.isNew" class="new-badge">NEW</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { universalLogout } from '@/utils/auth';

const router = useRouter();
const mainStore = useMainStore();

// --- データ取得/モック ---
const userName = computed(() => mainStore.loggedInUser?.name || 'クラブ会員');
const currentDate = ref(new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }));

const rawStatus = computed(() => mainStore.loggedInUser?.status?.currentStatus || '未確認'); 

const nextEvent = ref({
  title: '第3回 クラブ活動',
  time: '10/12 (土) 13:00 - 16:00',
  id: 1,
});

const notifications = ref([
  { id: 1, summary: 'プログラミング課題の提出期限が迫っています', isNew: true, date: '本日 15:00' },
  { id: 2, summary: '10月イベントの場所が変更になりました', isNew: false, date: '昨日 18:00' },
  { id: 3, summary: 'ロボットコンテストの出場者募集開始', isNew: true, date: '2日前' },
]);

// サイドバーの「まもなく提出」用データ
const nearDueTasks = ref([
    { id: 101, title: 'プログラミング課題#1', due: '本日 23:59' },
    { id: 102, title: 'ロボット設計図提出', due: '10/10' },
]);

// --- 派生データ ---
const currentStatus = computed(() => {
  const statusValue = rawStatus.value;
  let status = {};

  switch (statusValue) {
    case '出席済み':
      status = { label: '出席済み', detail: '本日の活動に参加中です。', className: 'present' };
      break;
    case '欠席':
      status = { label: '欠席', detail: '活動前に連絡をお願いします。', className: 'absent' };
      break;
    case '未確認':
    default:
      status = { label: 'ステータス未確認', detail: '出席登録を行ってください。', className: 'pending' };
      break;
  }
  return status;
});

const statusClass = computed(() => currentStatus.value.className);

// --- アクション ---
const handleLogout = async () => {
  await universalLogout();
  router.push({ name: 'welcome' });
};

const goToSubmission = () => { console.log("課題提出へ"); };
const goToQnA = () => { console.log("質問コーナーへ"); };
const viewNotificationDetail = (n) => { console.log("お知らせ詳細へ:", n.id); };

const viewAttendanceHistory = () => { /* 履歴ビューへ遷移 */ };
const viewFullSchedule = () => { router.push({ name: 'calendar' }); };
</script>

<style scoped>
/* 🎨 Google Classroom のテーマカラー */
:root {
  --color-blue: #4285F4;
  --color-green: #34A853;
  --color-red: #EA4335;
  --color-yellow: #FBBC04;
  --color-text-dark: #202124;
  --color-text-light: #5f6368;
  --color-background: #f1f3f4; /* クラスルームの背景色 */
}

.classroom-container {
  min-height: 100vh;
  background-color: var(--color-background);
  font-family: Roboto, 'Noto Sans JP', sans-serif;
  color: var(--color-text-dark);
}

/* === ヘッダー === */
.page-header {
  background-color: var(--color-blue);
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
  max-width: 1024px; /* クラスルーム風に幅を少し狭める */
  margin: 30px auto;
  padding: 0 16px;
  display: flex;
  gap: 24px;
}

/* メインストリーム */
.main-stream {
  flex-grow: 1;
  max-width: 65%; /* ストリームを広く */
}

/* サイドバー */
.sidebar {
  width: 35%; /* サイドバーを狭く */
  max-width: 300px;
}

/* === ストリームカード === */
.stream-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: 1px solid #dadce0;
}

/* 1. バナーカード (クラスヘッダー風) */
.banner-card {
  height: 160px;
  background: linear-gradient(135deg, var(--color-blue) 0%, #4db6ac 100%); /* ブルーとミントのグラデ */
  color: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.class-name {
  font-size: 1.8em;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.greeting-message {
  font-size: 1.1em;
  font-weight: 500;
  opacity: 0.9;
}

.quick-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.quick-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.quick-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 2. お知らせカード (投稿風) */
.stream-post {
  padding: 20px;
  position: relative;
  cursor: pointer;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-icon {
  font-size: 1.5em;
  margin-right: 12px;
  color: var(--color-blue);
}

.post-source {
  font-weight: 500;
  font-size: 0.9em;
  color: var(--color-text-dark);
}

.post-date {
  font-size: 0.8em;
  color: var(--color-text-light);
}

.post-content {
  font-size: 1em;
  line-height: 1.5;
  color: var(--color-text-dark);
}

.new-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--color-red);
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: 700;
}

/* 3. 課題/イベントカード (アサインメント風) */
.stream-assignment {
  display: flex;
  align-items: center;
  border-left: 6px solid var(--color-green); /* 課題の青いボーダーを模倣 */
  transition: background-color 0.2s;
}

.assignment-border.event-color {
  background-color: var(--color-yellow); /* イベントは黄色で */
  width: 6px; /* テンプレートに移動してCSSだけで表現 */
}

.stream-assignment:hover {
  background-color: #f8f8f8;
}

.assignment-body {
  display: flex;
  align-items: center;
  padding: 15px;
  flex-grow: 1;
}

.assignment-icon {
  font-size: 2em;
  margin-right: 15px;
  color: var(--color-green);
}

.assignment-text {
  flex-grow: 1;
}

.assignment-title {
  font-weight: 500;
  font-size: 1.1em;
  margin: 0;
}

.assignment-due {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin: 0;
}

.view-button {
  background-color: var(--color-blue);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.view-button:hover {
  background-color: #357ae8;
}

/* === サイドバーカード === */
.sidebar-card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 24px;
  border: 1px solid #dadce0;
}

.summary-title {
  font-size: 1em;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 10px;
}

/* 提出期限リスト */
.upcoming-summary {
  /* 提出期限が近い課題は赤枠で強調 */
  border-left: 5px solid var(--color-red); 
}

.due-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.due-item {
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  font-size: 0.9em;
  color: var(--color-text-dark);
}

.due-item:first-child {
  border-top: none;
}

.due-date {
  font-weight: 700;
  color: var(--color-red); 
  margin-right: 8px;
}

.due-title {
    margin: 0;
}

.no-due {
  font-style: italic;
  color: var(--color-text-light);
  padding: 10px 0 0 0;
  font-size: 0.9em;
}

/* ステータスサマリー */
.status-summary {
  border-left: 5px solid var(--color-blue);
}

.status-label {
  font-size: 1.2em;
  font-weight: 700;
  margin: 5px 0;
}

.status-label.present { color: var(--color-green); }
.status-label.absent { color: var(--color-red); }
.status-label.pending { color: var(--color-yellow); }

.status-detail {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin-bottom: 10px;
}

.action-link {
  background: none;
  border: none;
  color: var(--color-blue);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-top: 5px;
  font-size: 0.9em;
  text-align: left;
}

/* レスポンシブ対応 */
@media (max-width: 900px) {
  .main-content-wrapper {
    flex-direction: column; /* 1列レイアウトに変更 */
  }
  .main-stream, .sidebar {
    width: 100%;
    max-width: 100%;
  }
}
</style>