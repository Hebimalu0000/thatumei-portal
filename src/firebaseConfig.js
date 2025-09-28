// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// あなたのFirebaseプロジェクト設定に置き換えてください
const firebaseConfig = {
    apiKey: "AIzaSyC2lsyGPAsQnFpK7A1GQaT0qW6-DG3VwMw",
  authDomain: "thatumei-portals.firebaseapp.com",
  projectId: "thatumei-portals",
  storageBucket: "thatumei-portals.firebasestorage.app",
  messagingSenderId: "951780186243",
  appId: "1:951780186243:web:c165895d9a98030d3e63b6",
  measurementId: "G-T3GBLJH0MP"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// 各サービスへの参照を取得
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };