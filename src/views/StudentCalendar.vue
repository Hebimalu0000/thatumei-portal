<template>
  <div class="student-calendar">
    <div class="calendar-header">
      <button @click="goBack" class="back-button">
        &larr; ダッシュボードへ
      </button>

      <h2>生徒用活動カレンダー</h2>

      <div class="controls">
        <div class="control-group">
            <label for="course-select">教室/コース:</label>
            <select id="course-select" v-model="courseId" @change="fetchCalendarData">
              <option v-for="course in availableCourses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
        </div>
        
        <button @click="fetchCalendarData" :disabled="isLoading" class="update-button">
            {{ isLoading ? '取得中...' : '再取得' }}
        </button>
      </div>
      <p v-if="sessionsToFetch.length > 0 && !isLoading" class="session-info">
        現在、<strong>{{ courseId }}</strong> の <strong>{{ sessionsToFetch.length }}回分</strong>の授業を表示しています。
      </p>
    </div>

    <div v-if="isLoading" class="loading-message">
      {{ courseId }} のデータを読み込み中...
    </div>

    <div v-else-if="error" class="error-message">
      データの読み込みに失敗しました: {{ error.message }}
    </div>

    <div v-else class="activities-list">
      <div v-if="activities.length === 0" class="no-data-message">
        {{ courseId }} の予定は見つかりませんでした。
      </div>

      <div 
        v-for="activity in activities" 
        :key="activity.id" 
        class="activity-card"
      >
        <h3 class="activity-title">{{ activity.session }} の授業: {{ activity.title }}</h3>
        
        <p class="activity-detail date">
          🗓️ <strong>開催日時:</strong> {{ activity.event_date }}～
        </p>
        
        <p v-if="activity.make_up_date" class="activity-detail makeup">
          🔁 <strong>予備日/振替日:</strong> {{ activity.make_up_date }}～
        </p>
        
        <p class="activity-detail belonging">
          🎒 <strong>持ち物:</strong> {{ activity.belonging }}
        </p>
        
        <p v-if="activity.notes" class="activity-notes">
          <strong>備考事項:</strong> {{ activity.notes }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import { db } from '@/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore'; 

const router = useRouter(); 
const activities = ref([]);
const isLoading = ref(true);
const error = ref(null);
const sessionsToFetch = ref([]); 

// gradeとcourseIdの対応付け
const gradeToCourseMap = {
    'AD1': 'AD1',      
    'G2': 'BASIC2',   
};

const availableCourses = [
    { id: 'AD1', name: 'アドバンスクラス (AD1)' },
    { id: 'BASIC2', name: 'ベーシッククラス (BASIC2)' },
];

const courseId = ref('AD1'); 
const mainCollectionName = 'calender'; 

/* <strong>
 * Timestamp オブジェクトを 「MM月DD日(曜日)HH:MM」 形式の文字列にフォーマットする関数
 * @param {import('@firebase/firestore').Timestamp | null | undefined} timestamp 
 * @returns {string | null}
 */
const formatTimestamp = (timestamp) => {
    if (!timestamp) {
        return null;
    }
    try {
        const date = timestamp.toDate();
        
        // 日本のロケール設定で日付と時刻をフォーマット
        const options = {
            month: 'numeric',
            day: 'numeric',
            weekday: 'short', // 曜日を短縮形で表示 (月, 火, 水...)
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24時間表記
        };

        // toLocaleString() を使用して一括でフォーマット
        // 例: "10月29日(月) 18:30"
        return date.toLocaleString('ja-JP', options).replace(/\s/, ''); // スペースを削除

    } catch (e) {
        console.error("Timestampのフォーマットに失敗しました:", e);
        return '日付エラー';
    }
};

/*<strong>
 * ⭐ 追加: セッション文字列 (例: '1th', '10th') を日本語表記 ('1回目', '10回目') に変換する関数
 * @param {string} sessionStr 
 * @returns {string}
 */
const formatSession = (sessionStr) => {
    // 文字列から数字部分 ('th', 'st', 'nd'などを除く) を抽出
    const match = sessionStr.match(/\d+/);
    if (match) {
        return `${match[0]}回目`;
    }
    return sessionStr; // 数字が抽出できなければ元の文字列を返す
};


/*<strong>
 * 戻るボタンのロジックをダッシュボードへの遷移に変更
 */
const goBack = () => {
    router.push({ name: 'dashboard' }); 
};

/*<strong>
 * 親ドキュメントからセッションリスト（サブコレクション名）を動的に取得する
 */
const getParentSessionList = async (courseId) => {
    try {
        const docRef = doc(db, mainCollectionName, courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && Array.isArray(docSnap.data().availableSessions)) {
            // availableSessionsのソートロジックはセッション名をそのまま比較する必要があるため、ここでは formatSession を適用しない
            return docSnap.data().availableSessions.sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
            });
        }
        return [];
    } catch (e) {
        console.error("セッションリストの取得に失敗しました:", e);
        error.value = { message: "セッションリストの取得に失敗しました。Firestoreルールを確認してください。" };
        return [];
    }
}


/*<strong>
 * Firestoreからカレンダーデータを取得する (動的にセッション数を取得)
 * student がドキュメントであることを前提
 */
const fetchCalendarData = async () => {
  isLoading.value = true;

  sessionsToFetch.value = await getParentSessionList(courseId.value);
  const sessions = sessionsToFetch.value; 
  
  if (sessions.length === 0) {
    if (!error.value || error.value.message.includes("Firestoreルール")) {
        error.value = { message: 'このコースのセッションリストが見つかりませんでした。Firestoreのデータ構成を確認してください。' };
    }
    activities.value = [];
    isLoading.value = false;
    return;
  }
  
  error.value = null;
  const fetchedActivities = [];

  try {
    for (const session of sessions) {
      const finalDocPath = `${mainCollectionName}/${courseId.value}/${session}/student`;
      const finalDocRef = doc(db, finalDocPath); 

      const docSnap = await getDoc(finalDocRef); 
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        fetchedActivities.push({
          id: `${courseId.value}-${session}-${docSnap.id}`, 
          // ⭐ 修正: formatSession を適用
          session: formatSession(session), 
          title: data.title || 'タイトル未定',
          event_date: formatTimestamp(data.event_date) || '日時未定',
          make_up_date: formatTimestamp(data.make_up_date),
          belonging: data.belonging || 'なし',
          notes: data.notes || null,
        });
      }
    }

    // activities のソートは getParentSessionList で取得したセッションリストの順序に従っているため、ここでは不要です。
    activities.value = fetchedActivities;

  } catch (e) {
    console.error("Firestoreデータ取得エラー:", e);
    error.value = { message: `活動データの取得中にエラーが発生しました。Firestoreの接続状態を確認してください。` };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    // LocalStorageから学年を読み取り、初期コースを設定
    const storedData = localStorage.getItem('userSession');
    if (storedData) {
        try {
            const session = JSON.parse(storedData);
            const userGrade = session.grade;
            
            if (userGrade && gradeToCourseMap[userGrade]) {
                courseId.value = gradeToCourseMap[userGrade];
            }
        } catch (e) {
            console.error("LocalStorageの読み込みまたは解析に失敗しました。", e);
        }
    }
    fetchCalendarData();
});
</script>

<style scoped>
/* スタイル部分は以前のコードと同一です */
.student-calendar {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.calendar-header {
    position: relative; 
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e0e0e0;
}

h2 {
    color: #4285F4;
    margin: 0 0 10px 0;
    font-size: 1.8em;
}

.back-button {
    position: absolute;
    top: 5px;
    left: 0;
    padding: 8px 15px;
    background-color: #f0f4f8;
    color: #444;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.back-button:hover {
    background-color: #e0e0e0;
}

.controls {
    margin-top: 10px;
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.controls label {
    font-weight: 600;
    color: #555;
    font-size: 0.9em;
    white-space: nowrap;
}

.controls select, .controls input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
}

.update-button {
    padding: 8px 15px;
    background-color: #4285F4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.update-button:hover:not(:disabled) {
    background-color: #357ae8;
}

.update-button:disabled {
    background-color: #a7cbf5;
    cursor: not-allowed;
}

.session-info {
    text-align: center;
    margin-top: 15px;
    font-size: 0.95em;
    color: #00796b;
    font-weight: 500;
}

.loading-message, .error-message, .no-data-message {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  font-weight: bold;
}
.loading-message {
  color: #4caf50;
  background-color: #e8f5e9;
}
.error-message {
  color: #f44336;
  background-color: #ffebee;
  border: 1px solid #f44336;
}

.activities-list {
  display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
  gap: 25px;
}

.activity-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-left: 5px solid #4285F4; 
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.activity-title {
  color: #3f51b5;
  border-bottom: 1px dashed #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 1.2em;
  font-weight: 700;
}

.activity-detail {
  margin: 10px 0;
  font-size: 1em;
  color: #444;
}

.activity-detail.date {
    color: #00796b;
    font-weight: 600;
}

.activity-notes {
  margin-top: 20px;
  padding: 12px;
  background-color: #f3f9ff;
  border: 1px solid #c2e2ff;
  border-radius: 6px;
  color: #1a73e8;
  font-size: 0.95em;
  line-height: 1.5;
}
</style>