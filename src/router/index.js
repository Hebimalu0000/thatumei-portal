// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useMainStore } from '@/stores/main';

// コンポーネントの読み込みは、パフォーマンス向上のため遅延ロード(lazy loading)を使用
const AttendanceView = () => import('../views/AttendanceView.vue');
const AdminLoginView = () => import('../views/AdminLoginView.vue');
const AdminDashboardView = () => import('../views/AdminDashboardView.vue');
const PortalLoginView = () => import('../views/PortalLoginView.vue')
const PortalHomeView = () => import('../views/PortalHomeView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'attendance',
      component: AttendanceView,
      meta: { title: '出席登録' }
    },
    {
      path: '/login',
      name: 'login',
      component: PortalLoginView,
      meta: { title: 'ログイン' }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { title: '管理者ログイン' }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { 
        title: '管理ダッシュボード',
        requiresAuth: true // 認証が必要なルートであることを示す
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: PortalHomeView,
      meta: { 
        title: 'ダッシュボード',
        //requiresAuth: true // 認証が必要なルートであることを示す
      }
    },
  ]
});

// グローバルナビゲーションガード（認証チェック）
router.beforeEach((to, from, next) => {
  const mainStore = useMainStore(); // ストアインスタンスを取得

  // 認証チェック
  if (to.meta.requiresAuth && !mainStore.isAdminLoggedIn) {
    console.log("Access denied: Redirecting to login.");
    // 認証が必要で、ログインしていない場合
    next({ name: 'admin-login' });
  } else {
    // 認証が不要、またはログインしている場合
    next();
  }
});

export default router;