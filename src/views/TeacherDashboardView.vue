<template>
  <div class="teacher-dashboard-container">
    <header class="page-header teacher-blue">
      <h1 class="portal-title">👨‍🏫 講師ポータル</h1>
      <button class="logout-button" @click="handleLogout">ログアウト</button>
    </header>

    <div class="main-content-wrapper">
      
      <div class="sidebar">
        <div class="sidebar-card required-actions">
          <h3 class="summary-title">今日のアクション</h3>
          <ul class="action-list">
            <li class="action-item" @click="goToAttendanceCheck">
              <span class="action-icon">📝</span> <span>本日の活動の出席確認 (必須)</span>
            </li>
            <li class="action-item" @click="goToGradingQueue">
              <span class="action-icon">💯</span> <span>採点待ちの課題: {{ totalPendingGrades }} 件</span>
            </li>
            <li class="action-item" @click="goToClassCommunication">
              <span class="action-icon">✉️</span> <span>未読の質問 (担当クラス)</span>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-card class-overview">
          <h3 class="summary-title">クラブ概要</h3>
          <p class="overview-item">担当クラス数: **{{ assignedClasses.length }}**</p>
          <p class="overview-item">総担当生徒数: **{{ totalAssignedStudents }}** 名</p>
        </div>
      </div>

      <div class="main-content">
        <h2 class="section-title">担当クラス一覧</h2>
        
        <div class="class-card-grid">
          <div 
            v-for="cls in assignedClasses" 
            :key="cls.id" 
            class="class-card" 
            :style="{ 'border-left-color': cls.color }"
            @click="goToClassDetails(cls)"
          >
            <div class="card-header">
              <h3 class="class-name">{{ cls.name }}</h3>
              <p class="class-meta">生徒数: {{ cls.studentCount }} 名</p>
            </div>
            <div class="card-body">
              <p class="next-event">次の活動: {{ cls.nextActivity }}</p>
              <div class="card-actions">
                <button class="card-action-btn primary" @click.stop="goToAssignmentView(cls)">課題を見る</button>
                <button class="card-action-btn secondary" @click.stop="goToGrading(cls)">採点 ({{ cls.pendingGrades }} 件)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { universalLogout } from '@/utils/auth';

const router = useRouter();

// --- データ取得/モック ---

const assignedClasses = ref([
  { 
    id: 101, 
    name: 'ロボット工学（基礎）', 
    studentCount: 25, 
    pendingGrades: 7, 
    nextActivity: '10/10 13:00 - 第2回実験',
    color: '#34A853' // Green
  },
  { 
    id: 102, 
    name: 'プログラミング（Scratch）', 
    studentCount: 30, 
    pendingGrades: 12, 
    nextActivity: '10/12 10:00 - 自由制作',
    color: '#F9AB00' // Yellow
  },
  { 
    id: 103, 
    name: '発明発想コース', 
    studentCount: 18, 
    pendingGrades: 0, 
    nextActivity: '10/15 15:00 - アイデア発表会',
    color: '#4285F4' // Blue
  },
]);

// 派生データ
const totalAssignedStudents = computed(() => {
  return assignedClasses.value.reduce((sum, cls) => sum + cls.studentCount, 0);
});

const totalPendingGrades = computed(() => {
  return assignedClasses.value.reduce((sum, cls) => sum + cls.pendingGrades, 0);
});


// --- アクション ---
const handleLogout = async () => {
  await universalLogout();
  router.push({ name: 'teacher-login' }); 
};

// サイドバーアクション
const goToAttendanceCheck = () => { console.log("出席確認画面へ"); };
const goToGradingQueue = () => { console.log("全採点待ちリストへ"); };
const goToClassCommunication = () => { console.log("クラス質問/連絡へ"); };

// クラスカードアクション
const goToClassDetails = (cls) => {
    console.log(`クラス詳細へ遷移: ${cls.name}`);
    // router.push({ name: 'teacher-class-stream', params: { classId: cls.id } });
};

const goToAssignmentView = (cls) => {
    console.log(`課題管理へ遷移: ${cls.name}`);
    // router.push({ name: 'teacher-assignment-view', params: { classId: cls.id } });
};

const goToGrading = (cls) => {
    console.log(`採点画面へ遷移: ${cls.name}`);
    // router.push({ name: 'teacher-grading', params: { classId: cls.id } });
};
</script>

<style scoped>
/* 🎨 Google Classroom のテーマカラーを再定義 */
:root {
  --color-blue: #4285F4;
  --color-green: #34A853;
  --color-yellow: #FBBC04;
  --color-text-dark: #202124;
  --color-text-light: #5f6368;
  --color-background: #f1f3f4; 
}

.teacher-dashboard-container {
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
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 24px;
  display: flex; /* Flexboxに変更 */
  gap: 24px;
}

.main-content {
  flex-grow: 1;
}

.section-title {
  font-size: 1.5em;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 20px;
}

/* === サイドバー === */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-card {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: 1px solid #dadce0;
}

.summary-title {
  font-size: 1.1em;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f0f0f0;
}

/* アクションリスト */
.action-list {
  list-style: none;
  padding: 0;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 0.95em;
  cursor: pointer;
  color: var(--color-text-dark);
  transition: color 0.1s;
  border-bottom: 1px dotted #e0e0e0;
}

.action-item:last-child {
  border-bottom: none;
}

.action-item:hover {
  color: var(--color-blue);
}

.action-icon {
  font-size: 1.1em;
  margin-right: 10px;
}

.overview-item {
    font-size: 0.95em;
    color: var(--color-text-dark);
    margin: 8px 0;
}

/* === クラスカードグリッド === */
.class-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.class-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 8px solid; /* クラスカラーを適用 */
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.class-name {
  font-size: 1.3em;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.class-meta {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin: 5px 0 0 0;
}

.card-body {
  padding: 15px 20px 20px 20px;
}

.next-event {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin-bottom: 15px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.card-action-btn {
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  transition: background-color 0.2s;
}

.card-action-btn.primary {
  background-color: var(--color-blue);
  color: white;
}

.card-action-btn.primary:hover {
  background-color: #357ae8;
}

.card-action-btn.secondary {
  background-color: #e8f0fe;
  color: var(--color-blue);
  border: 1px solid #cce0ff;
}

.card-action-btn.secondary:hover {
  background-color: #d2e3fc;
}

/* レスポンシブ対応 */
@media (max-width: 900px) {
  .main-content-wrapper {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    order: -1; /* サイドバーを上に移動 */
  }
}
</style>