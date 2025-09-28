// src/utils/auth.js

import { db } from '@/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { useMainStore } from '@/stores/main';
import { getStudentStatus } from '@/utils/attendanceLogic'; // 生徒ステータス取得は残す

/**
 * IDとパスワードをFirestoreのユーザーデータと照合してログインを試みる
 * ユーザーデータは "users" コレクションに ID (例: T001, S2024001) をドキュメントIDとして保存されていると仮定
 */
export async function universalLogin(id, password) {
  const mainStore = useMainStore();
  mainStore.error = null;
  const normalizedId = id.trim().toUpperCase();

  let isAdministrator = false;
  let collectionName = '';
  
  // 1. ロールの判別とコレクションの決定
  if (normalizedId.startsWith('T')) {
    isAdministrator = true;
    collectionName = 'teachers'; // 先生のユーザーデータコレクション
  } else if (normalizedId.startsWith('S')) {
    isAdministrator = false;
    collectionName = 'students'; // 生徒のユーザーデータコレクション
  } else {
    mainStore.error = "IDの形式が不正です。TまたはSから始まるIDを入力してください。";
    throw new Error(mainStore.error);
  }

  try {
    // 2. Firestoreでユーザーを検索
    const userRef = doc(db, collectionName, normalizedId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      mainStore.error = "IDが見つかりません。";
      throw new Error(mainStore.error);
    }

    const userDataFromFirestore = userSnap.data();
    
    // 3. パスワードの照合 (※ パスワードはプレーンテキストではなくハッシュ化を推奨)
    // ここでは単純比較を実装
    if (userDataFromFirestore.password !== password) {
      mainStore.error = "パスワードが正しくありません。";
      throw new Error(mainStore.error);
    }
    
    // 4. Piniaストアの状態を更新
    const userData = { 
      uid: normalizedId, // Auth UIDの代わりにFirestore Document ID (IDそのもの) を使用
      email: userDataFromFirestore.email || null, // オプション
      id: normalizedId 
    };
    
    if (isAdministrator) {
      mainStore.loginAdmin(userData);
    } else {
      // 生徒ステータスを取得 (ドキュメントIDは生徒IDであると仮定)
      const studentStatus = await getStudentStatus(normalizedId); 
      mainStore.loginStudent(userData, studentStatus);
    }
    
    return { success: true, isAdministrator: isAdministrator };

  } catch (error) {
    console.error("Login Error:", error.message);
    let errorMessage = mainStore.error || "ログイン処理中に予期せぬエラーが発生しました。";
    mainStore.error = errorMessage;
    throw error;
  }
}

/**
 * ログアウト処理 (Firebase Authを使用しないため、Piniaの状態リセットのみ)
 */
export async function universalLogout() {
  const mainStore = useMainStore();
  try {
    // Piniaの状態をリセット
    mainStore.logout(); // PiniaストアのlogoutAdminをlogoutに統一
  } catch (error) {
    mainStore.error = "ログアウト処理中にエラーが発生しました。";
    throw error;
  }
}