// src/utils/auth.js (修正版)

import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useMainStore } from '@/stores/main';
import { getStudentStatus } from '@/utils/attendanceLogic'; 

const ADMIN_DOMAIN = '@thatumei-admin.com';
const STUDENT_DOMAIN = '@thatumei-student.com';

/**
 * IDとパスワードをメールアドレスに変換し、ログインを試みる
 */
export async function universalLogin(id, password) {
  const mainStore = useMainStore();
  mainStore.error = null;
  const normalizedId = id.trim().toUpperCase();

  let email = '';
  let email_temp = '';
  let isAdministrator = false;
  
  if (normalizedId.startsWith('T')) {
    email_temp = normalizedId + ADMIN_DOMAIN;
    email = email_temp.toLowerCase();
    isAdministrator = true;
  } else if (normalizedId.startsWith('S')) {
    email_temp = normalizedId + STUDENT_DOMAIN;
    email = email_temp.toLowerCase();
    isAdministrator = false;
  } else {
    mainStore.error = "IDの形式が不正です。TまたはSから始まるIDを入力してください。";
    throw new Error(mainStore.error);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData = { uid: user.uid, email: user.email, id: normalizedId };
    
    if (isAdministrator) {
      mainStore.loginAdmin(userData);
    } else {
      // 🔥 修正: 生徒ID (normalizedId) ではなく、Firebase UID (user.uid) を渡す 🔥
      const studentStatus = await getStudentStatus(user.uid); 
      mainStore.loginStudent(userData, studentStatus); 
    }
    
    return { success: true, isAdministrator: isAdministrator };

  } catch (error) {
    console.error("Login Error:", error.message, error.code);
    let errorMessage = "ログインに失敗しました。IDまたはパスワードを確認してください。";
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      errorMessage = "IDまたはパスワードが正しくありません。";
    }
    mainStore.error = errorMessage;
    throw error;
  }
}

/**
 * ログアウト処理
 */
export async function logoutAdmin() {
  const mainStore = useMainStore();
  try {
    await signOut(auth);
    mainStore.logoutAdmin(); 
  } catch (error) {
    mainStore.error = "ログアウト処理中にエラーが発生しました。";
    throw error;
  }
}