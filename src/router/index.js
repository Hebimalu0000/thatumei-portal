// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// コンポーネントの読み込みは、パフォーマンス向上のため遅延ロード(lazy loading)を使用
const AttendanceView = () => import('../views/AttendanceView.vue');
const AdminLoginView = () => import('../views/AdminLoginView.vue');
const AdminDashboardView = () => import('../views/AdminDashboardView.vue');

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
    }
  ]
});

// グローバルナビゲーションガード（認証チェックのダミー）
router.beforeEach((to, from, next) => {
  // 実際のロジックでは、Piniaストアを使ってログイン状態をチェックします
  const isAdminLoggedIn = false; // <<< ここを実際の認証ステータスに置き換える

  if (to.meta.requiresAuth && !isAdminLoggedIn) {
    // 認証が必要なのにログインしていない場合、ログインページへリダイレクト
    next({ name: 'admin-login' });
  } else {
    // それ以外は通常通り遷移
    next();
  }
});

export default router;