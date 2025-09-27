// src/stores/main.js

import { defineStore } from 'pinia';

// 認証状態や、イベント情報などを一元管理するストア
export const useMainStore = defineStore('main', {
  state: () => ({
    // 認証状態
    isAdminLoggedIn: false,
    adminUser: null, // ログイン中の管理者情報

    // アプリケーションデータ
    students: [],    // 学生名簿データ
    activeEvents: [], // 現在アクティブな授業イベントリスト
    isLoading: false, // データロード中フラグ
    error: null,      // エラーメッセージ
  }),
  
  getters: {
    // ログイン状態を取得
    isLoggedIn: (state) => state.isAdminLoggedIn,
    // 名簿がロードされているか確認
    hasStudents: (state) => state.students.length > 0,
  },

  actions: {
    /**
     * 管理者ログイン処理（ダミー）
     * 実際の処理はFirebase Authenticationを使用します
     * @param {object} user - 認証済みのユーザー情報
     */
    async loginAdmin(user) {
      this.isAdminLoggedIn = true;
      this.adminUser = user;
      // ログイン成功後のリダイレクト処理を呼び出し元で行う
    },

    /**
     * 管理者ログアウト処理
     */
    async logoutAdmin() {
      this.isAdminLoggedIn = false;
      this.adminUser = null;
      // Firebaseログアウト処理をここに追加
    },
    
    /**
     * 学生名簿とアクティブなイベントをFirestoreから読み込む処理
     * @param {function} fetchStudents - Firestoreから名簿を取得する非同期関数
     * @param {function} fetchEvents - Firestoreからイベントを取得する非同期関数
     */
    async fetchInitialData(fetchStudents, fetchEvents) {
      this.isLoading = true;
      this.error = null;
      try {
        // 例: Firestoreからデータを取得する処理（引数として渡された関数を実行）
        this.students = await fetchStudents();
        this.activeEvents = await fetchEvents();
      } catch (err) {
        this.error = 'データの読み込みに失敗しました。';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
});