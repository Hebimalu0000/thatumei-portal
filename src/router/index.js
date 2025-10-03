// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useMainStore } from '@/stores/main'; 

// コンポーネントの遅延ロード (Lazy Loading)
const WelcomeView = () => import('../views/WelcomeView.vue');
const PortalLoginView = () => import('../views/PortalLoginView.vue');
// 💡 統合ビュー: 管理者・講師ログイン
const AdminTeacherLoginView = () => import('../views/AdminTeacherLoginView.vue'); 
const StudentDashboardView = () => import('../views/StudentDashboardView.vue');
const AdminDashboardView = () => import('../views/AdminDashboardView.vue');
const TeacherDashboardView = () => import('../views/TeacherDashboardView.vue');
const AttendanceView = () => import('../views/AttendanceView.vue');
const StudentCalendar = () => import('../views/StudentCalendar.vue');
const NotFoundView = () => import('../views/NotFoundView.vue'); // 💡 404ビュー

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // --- 共通 / 導入 ---
        {
            path: '/',
            name: 'welcome', 
            component: WelcomeView, 
            meta: { title: 'ようこそ' }
        },
        {
            path: '/login',
            name: 'login',
            component: PortalLoginView,
            meta: { title: '生徒ログイン' }
        },
        
        // --- 管理者・講師 統合ログイン ---
        {
            path: '/admin/login',
            name: 'admin-login',
            component: AdminTeacherLoginView, // 💡 統合ビュー
            meta: { title: '管理者ログイン' }
        },
        {
            path: '/teacher/login',
            name: 'teacher-login',
            component: AdminTeacherLoginView, // 💡 統合ビュー
            meta: { title: '講師ログイン' }
        },

        // --- ダッシュボード ---
        {
            path: '/dashboard',
            name: 'dashboard',
            component: StudentDashboardView,
            meta: { 
                title: '生徒ダッシュボード',
                requiresAuth: true
            }
        },
        {
            path: '/admin/dashboard',
            name: 'admin-dashboard',
            component: AdminDashboardView,
            meta: { 
                title: '管理ダッシュボード',
                requiresAuth: true,
                requiresAdmin: true
            }
        },
        {
            path: '/teacher/dashboard',
            name: 'teacher-dashboard',
            component: TeacherDashboardView,
            meta: {
                title: '講師ダッシュボード',
                requiresAuth: true,
                requiresTeacher: true
            }
        },

        // --- 生徒専用ページ ---
        {
            path: '/calendar',
            name: 'calendar',
            component: StudentCalendar,
            meta: { 
                title: '生徒ダッシュボード',
                requiresAuth: true
            }
        },

        // --- 管理者専用ページ ---
        {
            path: '/admin',
            name: 'attendance', 
            component: AttendanceView,
            meta: { 
                title: '出席登録（管理者）',
                requiresAuth: true,    
                requiresAdmin: true    
            }
        },
        
        // --- 404 Not Found (必ず最後に配置) ---
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFoundView,
            meta: { title: 'ページが見つかりません' }
        }
    ]
});

// グローバルナビゲーションガード（認証チェック）
router.beforeEach((to, from, next) => {
    // 💡 useMainStoreはVue Routerの外側で初期化されている必要があります (main.jsで実行)
    const mainStore = useMainStore(); 
    
    const requiresAuth = to.meta.requiresAuth;
    const requiresAdmin = to.meta.requiresAdmin;
    const requiresTeacher = to.meta.requiresTeacher;

    // --- 1. 認証チェック (未ログインの場合、適切なログインページへリダイレクト) ---
    if (requiresAuth && !mainStore.isLoggedIn) {
        if (requiresAdmin) {
            next({ name: 'admin-login' });
        } else if (requiresTeacher) {
            next({ name: 'teacher-login' });
        } else {
            next({ name: 'login' });
        }
        return;
    }

    // --- 2. 権限チェック (ログイン済みだが権限がない場合) ---
    
    // 2-A. 管理者権限チェック
    if (requiresAdmin && !mainStore.isAdminLoggedIn) {
        // 管理者権限がない場合、講師であれば講師ダッシュボード、そうでなければ生徒ダッシュボードへ
        const redirectName = mainStore.isTeacherLoggedIn ? 'teacher-dashboard' : 'dashboard';
        next({ name: redirectName });
        return;
    }
    
    // 2-B. 講師権限チェック (管理者は講師権限を兼ねている前提)
    if (requiresTeacher && !mainStore.isAdminLoggedIn && !mainStore.isTeacherLoggedIn) {
        // 講師権限がない場合、生徒ダッシュボードへ
        next({ name: 'dashboard' }); 
        return;
    }

    // --- 3. 重複ログイン防止 (ログイン済みユーザーがログインページにアクセスした場合) ---
    const isLoginPage = to.name === 'login' || to.name === 'admin-login' || to.name === 'teacher-login';
    
    if (isLoginPage && mainStore.isLoggedIn) {
        let redirectName;
        if (mainStore.isAdminLoggedIn) {
            redirectName = 'admin-dashboard';
        } else if (mainStore.isTeacherLoggedIn) {
            redirectName = 'teacher-dashboard';
        } else {
            redirectName = 'dashboard';
        }
        next({ name: redirectName });
        return;
    }

    next();
});

export default router;