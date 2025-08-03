// Firebase Configuration
// This file contains Firebase configuration that is safe to be public
// Firebase API keys are designed to be exposed in frontend code

// You can also use environment variables if needed
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDeBC_txgoWzX6QoHdcZJT37RpNZNi4g",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "auth-e8dd6.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "auth-e8dd6",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "auth-e8dd6.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "879507667626",
    appId: process.env.FIREBASE_APP_ID || "1:879507667626:web:9bcf4c47caba9cbbc9aed3",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-SD5LRH88ZD"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Make Firebase available globally
    window.auth = auth;
    window.db = db;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig };
} 