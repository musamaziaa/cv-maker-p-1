// assets/js/auth.js

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Firebase
    async function initializeFirebase() {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

        const firebaseConfig = {
            apiKey: "AIzaSyDeBC_txgoWzX6QoHdcZJT37RpNZNZNi4g",
            authDomain: "auth-e8dd6.firebaseapp.com",
            projectId: "auth-e8dd6",
            storageBucket: "auth-e8dd6.firebasestorage.app",
            messagingSenderId: "879507667626",
            appId: "1:879507667626:web:9bcf4c47caba9cbbc9aed3",
            measurementId: "G-SD5LRH88ZD"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Make auth and db available globally
        window.auth = auth;
        window.db = db;

        return { auth, db };
    }

    // Helper to show error messages
    function showError(form, message) {
        let errorElem = form.querySelector('.auth-error');
        if (!errorElem) {
            errorElem = document.createElement('div');
            errorElem.className = 'auth-error';
            form.insertBefore(errorElem, form.firstChild.nextSibling);
        }
        errorElem.textContent = message;
    }

    // Helper to show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;

        // Play sound based on notification type
        try {
            const audio = new Audio();
            if (type === 'success') {
                audio.src = 'assets/sounds/success_sound.mp3';
            } else if (type === 'error') {
                audio.src = 'assets/sounds/error_sound.mp3';
            }
            audio.volume = 0.5; // Set volume to 50%
            audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (error) {
            console.log('Audio not available:', error);
        }

        // Set colors based on notification type
        let backgroundColor, borderColor;
        switch (type) {
            case 'success':
                backgroundColor = '#4CAF50';
                borderColor = '#45a049';
                break;
            case 'error':
                backgroundColor = '#f44336';
                borderColor = '#d32f2f';
                break;
            default:
                backgroundColor = '#2196F3';
                borderColor = '#1976D2';
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: -400px;
            background: ${backgroundColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 1.4rem;
            font-weight: 500;
            z-index: 9999;
            transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 350px;
            border-left: 4px solid ${borderColor};
        `;

        document.body.appendChild(notification);

        // Slide in from left
        setTimeout(() => {
            notification.style.left = '20px';
        }, 100);

        // Slide out after 4 seconds
        setTimeout(() => {
            notification.style.left = '-400px';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Initialize authentication handlers
    async function initAuth() {
        const { auth, db } = await initializeFirebase();

        // SIGN UP
        const signupForm = document.getElementById('signup-form') || document.querySelector('form.auth-form') || document.querySelector('form');
        if (signupForm) {
            signupForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const email = signupForm.querySelector('input[type="email"]').value.trim();
                const password = signupForm.querySelector('input[type="password"]').value;
                const name = signupForm.querySelector('input[name="name"]').value.trim();

                // Validate required fields
                if (!email || !password || !name) {
                    showError(signupForm, 'Please fill in all required fields.');
                    return;
                }

                if (password.length < 6) {
                    showError(signupForm, 'Password must be at least 6 characters long.');
                    return;
                }

                try {
                    // Import Firebase Auth functions
                    const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
                    const { doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                    // Save user info to Firestore
                    await setDoc(doc(db, 'users', userCredential.user.uid), {
                        name: name,
                        email: email,
                        createdAt: serverTimestamp()
                    });

                    // Send email verification
                    const { sendEmailVerification } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
                    await sendEmailVerification(userCredential.user);
                    showNotification('A verification email has been sent to ' + userCredential.user.email + '. Please check your inbox.');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } catch (err) {
                    showError(signupForm, err.message);
                }
            });
        }

        // LOG IN
        const loginForm = document.getElementById('login-form') || document.querySelector('form.auth-form') || document.querySelector('form');
        if (loginForm && window.location.pathname.includes('log-in.html')) {
            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const email = loginForm.querySelector('input[type="email"]').value.trim();
                const password = loginForm.querySelector('input[type="password"]').value;

                try {
                    // Import Firebase Auth functions
                    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');

                    await signInWithEmailAndPassword(auth, email, password);

                    showNotification('Logged in successfully!');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1200);
                } catch (err) {
                    showError(loginForm, err.message);
                }
            });
        }
    }

    // Start authentication
    initAuth();
}); 