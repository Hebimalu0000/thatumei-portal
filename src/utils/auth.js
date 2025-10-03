// src/utils/auth.js

// 💡 注意: firebaseConfig のパスは、相対パスに修正しています
import { db } from '../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { useMainStore } from '@/stores/main';

// ===========================================
// ⭐ 永続化（localStorage）関連の関数
// ===========================================

/**
 * ログイン情報をlocalStorageに保存する
 * @param {Object} userData - ユーザーの認証済みデータ (name, gradeを含む)
 * @param {boolean} isAdministrator
 * @param {boolean} isTeacher
 */
function saveToLocalStorage(userData, isAdministrator, isTeacher) {
  // ⭐ ユーザーの名前と生徒の学年情報を追加
  const sessionData = {
    uid: userData.uid,
    id: userData.id,
    name: userData.name || '名前なし', // Firestoreのnameフィールドを保存
    isAdministrator: isAdministrator,
    isTeacher: isTeacher,
    // 生徒の場合のみgradeを保存
    grade: !isAdministrator && !isTeacher ? userData.grade : undefined,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    console.log("LocalStorage: ログイン情報を保存しました。", sessionData);
  } catch (e) {
    console.error("LocalStorageへの保存に失敗しました。", e);
  }
}

/**
 * ログイン情報をlocalStorageからすべて削除する
 */
function removeFromLocalStorage() {
  try {
    localStorage.removeItem('userSession');
    console.log("LocalStorage: ログイン情報を削除しました。");
  } catch (e) {
    console.error("LocalStorageからの削除に失敗しました。", e);
  }
}

// ===========================================
// 仮の関数: 実際はFirestoreからデータを取得するロジックが必要です
// ===========================================
// 生徒のステータスを取得する関数を更新 (grade情報を含むと仮定)
async function getStudentStatus(studentId) {
  // 実際には Firestore から生徒の最新ステータスと学年を取得する処理
  return {
    currentStatus: '出席済み',
    lastUpdateTime: new Date().toISOString(),
    grade: 'G3' // 仮の学年情報
  };
}

/**
 * IDとパスワードをFirestoreのユーザーデータと照合してログインを試みる
 */
export async function universalLogin(id, password) {
  const mainStore = useMainStore();
  mainStore.setError(null); // エラーをリセット

  if (typeof id !== 'string' || !id) {
    mainStore.setError("ログインIDが不正です。");
    throw new Error("IDが不正です。");
  }

  const normalizedId = id.trim().toUpperCase();

  let isAdministrator = false;
  let isTeacher = false;
  let collectionName = '';

  // 1. ロールの判別とコレクションの決定 (省略)
  if (normalizedId.startsWith('T')) {
    isTeacher = true;
    collectionName = 'teachers';
  } else if (normalizedId.startsWith('A')) {
    isAdministrator = true;
    collectionName = 'admins';
  } else if (normalizedId.startsWith('S')) {
    collectionName = 'students';
  } else {
    const msg = "IDの形式が不正です。A, T, Sから始まるIDを入力してください。";
    mainStore.setError(msg);
    throw new Error(msg);
  }

  try {
    // 2. Firestoreでユーザーを検索 (省略)
    const userRef = doc(db, collectionName, normalizedId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const msg = "IDまたはパスワードが正しくありません。";
      mainStore.setError(msg);
      throw new Error("IDが見つかりません。");
    }

    const userDataFromFirestore = userSnap.data();

    // 3. パスワードの照合 (省略)
    if (userDataFromFirestore.password !== password) {
      const msg = "IDまたはパスワードが正しくありません。";
      mainStore.setError(msg);
      throw new Error("パスワードが正しくありません。");
    }

    // 4. Piniaストアの状態を更新
    let userData = {
      uid: normalizedId,
      id: normalizedId,
      name: userDataFromFirestore.name, // ⭐ nameをuserDataに追加
      ...userDataFromFirestore
    };

    if (isAdministrator) {
      mainStore.loginAdmin(userData);
    } else if (isTeacher) {
      mainStore.loginTeacher(userData);
    } else {
      // 生徒の場合はstatusとgradeを取得し、userDataを拡張
      const studentStatus = await getStudentStatus(normalizedId);
      userData = { ...userData, grade: studentStatus.grade }; // ⭐ gradeをuserDataに追加
      mainStore.setUser(userData, studentStatus);
    }

    // ⭐ ログイン成功時にlocalStorageに情報を保存 (更新されたuserDataを使用)
    saveToLocalStorage(userData, isAdministrator, isTeacher);

    // 5. ログインコンポーネントが期待する値を返す (省略)
    return {
      success: true,
      isAdministrator: isAdministrator,
      isTeacher: isTeacher
    };

  } catch (error) {
    console.error("Login Error:", error.message || error);

    if (!mainStore.error) {
      mainStore.setError("ログイン処理中に予期せぬエラーが発生しました。");
    }
    throw error;
  }
}

/**
 * ログアウト処理 (省略)
 */
export async function universalLogout() {
  const mainStore = useMainStore();
  try {
    mainStore.clearUser();
    removeFromLocalStorage();
  } catch (error) {
    mainStore.setError("ログアウト処理中にエラーが発生しました。");
    throw error;
  }
}