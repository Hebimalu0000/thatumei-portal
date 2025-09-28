// src/utils/attendanceLogic.js

import { db } from '@/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * 学生の出席を記録し、モードを「授業中」に切り替える
 * @param {string} studentId - タッチした学生の学籍番号
 * @param {string} currentEventId - 現在の授業ID
 */
export async function registerAttendance(studentId, currentEventId) {
    // 1. 学生情報の取得
    const studentRef = doc(db, "students", studentId);
    const studentSnap = await getDoc(studentRef);
    if (!studentSnap.exists()) {
        console.error("Student not found:", studentId);
        throw new Error("Student data not found.");
    }
    const studentData = studentSnap.data();

    // 2. user_status を「授業中」に更新
    const statusRef = doc(db, "user_status", studentId);
    await setDoc(statusRef, {
        current_mode: "授業中",
        current_event_id: currentEventId,
        last_attendance_time: serverTimestamp(),
        student_name: studentData.name 
    }, { merge: true });

    console.log(`Attendance registered and mode set to 授業中 for ${studentData.name}.`);
}

/**
 * 生徒のuser_statusを取得する
 * @param {string} uid - Firebase AuthenticationのUID
 */
export async function getStudentStatus(uid) {
    // 🔥 修正: ドキュメントIDとして UID を使用する 🔥
    const statusRef = doc(db, "user_status", uid); 
    const statusSnap = await getDoc(statusRef);

    if (statusSnap.exists()) {
        return statusSnap.data();
    }
    // ステータスデータがない場合はデフォルトを返す
    return { current_mode: '通常モード', current_event_id: null }; 
}