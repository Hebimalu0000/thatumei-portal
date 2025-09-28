<template>
  <div class="attendance-view">
    <h1>豊田少年少女発明クラブ 出席登録</h1>
    <p class="instruction">ご自身の氏名をタッチしてください。</p>

    <div v-if="mainStore.isLoading" class="loading">名簿を読み込み中...</div>
    <p v-else-if="mainStore.error" class="error-message">{{ mainStore.error }}</p>
    
    <div v-else-if="currentActiveEvent">
      <h2>[{{ currentActiveEvent.name }}] の出席</h2>
      <div class="student-list">
        <button 
          v-for="student in mainStore.students" 
          :key="student.id"
          @click="handleAttendance(student.id)"
          :disabled="isAttendanceDisabled(student.id)"
          :class="{'attended': isAttended(student.id)}"
          class="student-button"
        >
          {{ student.name }} ({{ student.id }})
        </button>
      </div>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
    <div v-else class="no-event">
      <p>現在アクティブな授業イベントはありません。</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMainStore } from '@/stores/main';
import { registerAttendance } from '@/utils/attendanceLogic';
// Firestoreのデータ取得ロジック（以下で仮の関数を定義）

const mainStore = useMainStore();
const successMessage = ref('');
const recentAttendance = ref({}); // 最近の出席記録 { studentId: true/false }

// TODO: Firestoreからデータを取得する関数を実装
// (ここではダミーでデータをロードする関数を定義)
const fetchDummyData = async () => {
    // Firestoreから名簿とアクティブなイベントを取得する実際のロジックに置き換えてください
    mainStore.students = [
        { id: 'S001', name: '青山 太郎' },
        { id: 'S002', name: '伊藤 花子' },
        { id: 'S003', name: '上野 次郎' },
    ];
    mainStore.activeEvents = [
        { id: 'EVENT_A_2025', name: 'ロボット工学入門', status: 'Active' }
    ];
    mainStore.isLoading = false;
};


onMounted(() => {
  // ページロード時にデータ取得を開始
  mainStore.isLoading = true;
  fetchDummyData();
});

// 現在アクティブなイベントを計算
const currentActiveEvent = computed(() => {
    return mainStore.activeEvents.find(e => e.status === 'Active');
});

// すでにチェックイン済みか判定 (ここでは簡易的な判定)
const isAttended = (studentId) => {
    // TODO: 実際には user_status コレクションを監視して判断します
    return recentAttendance.value[studentId];
};

// ボタンを無効にする条件 (連打防止、またはすでに登録済み)
const isAttendanceDisabled = (studentId) => {
    return recentAttendance.value[studentId]; 
};

const handleAttendance = async (studentId) => {
    const eventId = currentActiveEvent.value?.id;
    if (!eventId) return;

    // 既に登録済みとして一時的にボタンを無効化
    recentAttendance.value[studentId] = true;
    successMessage.value = '';

    try {
        // 出席登録ロジックの実行
        await registerAttendance(studentId, eventId);
        
        const student = mainStore.students.find(s => s.id === studentId);
        successMessage.value = `${student.name} さんの出席を登録しました！`;
        
        // 成功後、数秒後にメッセージをクリア（オプション）
        setTimeout(() => { successMessage.value = ''; }, 3000);

    } catch (e) {
        // エラー処理
        recentAttendance.value[studentId] = false; // エラー時は無効化を解除
        alert("出席登録に失敗しました。時間をおいて再試行してください。");
        console.error("Attendance failed:", e);
    }
};
</script>

<style scoped>
.attendance-view { padding: 20px; max-width: 800px; margin: 0 auto; }
.instruction { margin-bottom: 20px; font-size: 1.1em; }
.student-list { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
  gap: 15px;
}
.student-button {
  padding: 15px 10px;
  background-color: #e0f2f1;
  color: #004d40;
  border: 1px solid #00796b;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.student-button:hover:not(:disabled) { background-color: #b2dfdb; }
.student-button:disabled { 
  background-color: #bdbdbd; 
  color: #757575; 
  cursor: not-allowed;
  opacity: 0.6;
}
.attended { 
  background-color: #a5d6a7 !important; /* 出席済み */
  border-color: #388e3c;
}
.success-message { color: green; margin-top: 20px; font-weight: bold; }
.error-message { color: red; }
</style>