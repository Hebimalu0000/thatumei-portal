import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMainStore = defineStore('main', () => {
    // --- 状態 (State) ---
    const user = ref(null);
    const error = ref(null); 
    // ⭐ 追加: ローカルストレージからの初期化が完了したかどうかのフラグ
    const isStoreInitialized = ref(false); 

    // --- ゲッター (Getters / Computed) ---
    const isLoggedIn = computed(() => !!user.value);
    const userId = computed(() => user.value?.uid || null);
    const isAdminLoggedIn = computed(() => user.value?.role === 'admin');
    const isTeacherLoggedIn = computed(() => user.value?.role === 'teacher');
    const isStudentLoggedIn = computed(() => user.value?.role === 'student');

    // --- アクション (Actions) ---

    // 共通のユーザー設定関数 (以前の定義をベースに)
    function setUser(userData, role, optionalData = {}) {
        user.value = {
            uid: userData.id || userData.uid,
            ...userData,
            role: role,
            ...optionalData 
        };
        delete user.value.password; 
        error.value = null;
        console.log(`Pinia: User set successfully (${role}).`, user.value);
    }
    
    // 管理者ログインアクション
    function loginAdmin(userData) {
        setUser(userData, 'admin');
    }

    // 講師ログインアクション
    function loginTeacher(userData) {
        setUser(userData, 'teacher');
    }
    
    // 生徒ログインアクション
    function loginStudent(userData, studentStatus) {
        setUser(userData, 'student', { studentStatus });
    }
    
    function clearUser() {
        user.value = null;
        error.value = null;
        console.log("Pinia: User logged out.");
    }

    function setError(errorMessage) {
        error.value = errorMessage;
        if (errorMessage) {
            console.error("Pinia Error:", errorMessage);
        }
    }
    
    /**
     * ⭐ 新規追加: localStorageから情報をロードし、ストアを初期化する
     */
    function initializeStoreFromLocalStorage() {
        if (isStoreInitialized.value) return; // 二重初期化を防止

        try {
            const storedData = localStorage.getItem('userSession');
            if (storedData) {
                const session = JSON.parse(storedData);
                
                // ロールを特定
                let role = '';
                if (session.isAdministrator) {
                    role = 'admin';
                } else if (session.isTeacher) {
                    role = 'teacher';
                } else if (session.id.startsWith('S') && session.grade) { 
                    // 生徒の場合（gradeの存在で判断を強化）
                    role = 'student';
                }

                if (role) {
                    // ローカルデータから読み込んだ情報でユーザー状態を復元
                    // ※ 注意: Firestoreから最新のユーザー名や権限を再取得するのがより安全ですが、
                    // ここではlocalStorageのデータのみでPiniaの状態を更新します。
                    const recoveredUserData = {
                        uid: session.uid,
                        id: session.id,
                        name: session.name,
                        grade: session.grade, // 生徒の場合のみ
                        // ... その他の必要なセッションデータ
                    };
                    
                    // 復元したデータを使ってsetUser（または対応するlogin関数）を呼び出す
                    // 🚨 ここではsetUserを復元用として統一的に使用します
                    setUser(recoveredUserData, role); 
                    console.log("Pinia: LocalStorageからユーザーセッションを復元しました。");
                }
            }
        } catch (e) {
            console.error("LocalStorageからの読み込みに失敗しました:", e);
            // 失敗した場合は localStorage の不正なデータをクリア
            localStorage.removeItem('userSession');
        } finally {
            isStoreInitialized.value = true;
        }
    }


    return {
        user,
        error,
        isStoreInitialized, // ゲッターに追加
        isLoggedIn,
        userId,
        isAdminLoggedIn,
        isTeacherLoggedIn,
        isStudentLoggedIn,
        // アクション
        loginAdmin,
        loginTeacher,
        loginStudent,
        setUser, 
        clearUser,
        setError,
        initializeStoreFromLocalStorage, // ⭐ 新しい初期化アクション
    };
});