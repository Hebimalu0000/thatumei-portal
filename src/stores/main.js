// src/stores/main.js

import { defineStore } from 'pinia';

// 認証状態や、イベント情報などを一元管理するストア
export const useMainStore = defineStore('main', {
  state: () => ({
    // 認証状態
    isAdminLoggedIn: false,
    isStudentLoggedIn: false, // 生徒ログイン状態を追加
    adminUser: null, 
    studentUser: null, // 生徒情報も保持
    studentStatus: null,

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
      this.isStudentLoggedIn = false;
      this.adminUser = user;
      this.studentUser = null;
    },
    
    // 🔥 生徒ログインアクションを追加 🔥
    async loginStudent(user) {
      this.isStudentLoggedIn = true;
      this.isAdminLoggedIn = false;
      this.studentUser = user;
      this.studentStatus = status; // 🔥 ステータスを保存
      this.adminUser = null;
    },

    async logout() {
      // ログアウトは全状態をリセット
      this.isAdminLoggedIn = false;
      this.isStudentLoggedIn = false;
      this.adminUser = null;
      this.studentUser = null;
      this.studentStatus = null;
      this.error = null;
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