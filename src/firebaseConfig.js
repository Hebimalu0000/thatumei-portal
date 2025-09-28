// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// あなたのFirebaseプロジェクト設定に置き換えてください
const firebaseConfig = {
    apiKey: "AIzaSyB4Vcbc2mSsWiiETj_TgmM9WXawi8AzUDQ",
    authDomain: "thatumei-portal.firebaseapp.com",
    projectId: "thatumei-portal",
    storageBucket: "thatumei-portal.firebasestorage.app",
    messagingSenderId: "637926976955",
    appId: "1:637926976955:web:39071a369d05cc07c4289e",
    measurementId: "G-V62SQ4NL7V"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// 各サービスへの参照を取得
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };