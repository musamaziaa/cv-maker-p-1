// assets/js/navbar-auth.js

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Import Firebase functions
        const { getAuth, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');

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
        const navbarLinks = document.querySelector('.navbar-auth-links');
        if (!navbarLinks) return;

        function renderLoggedIn(user) {
            navbarLinks.innerHTML = `
                <span style="color:#1A91F0; font-weight:600;">Logged in as ${user.email}</span>
                <a href="resume.html" class="btn btn-primary">Create My CV</a>
                <a href="dashboard.html" class="btn btn-secondary">Dashboard</a>
                <button id="logout-btn" class="btn btn-primary">Log out</button>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.onclick = async function () {
                    try {
                        await signOut(auth);
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error('Error signing out:', error);
                    }
                };
            }
        }

        function renderLoggedOut() {
            navbarLinks.innerHTML = `
                <a href="log-in.html" class="btn btn-secondary">Log in</a>
                <a href="sign-up.html" class="btn btn-primary">Sign up</a>
            `;
        }

        onAuthStateChanged(auth, function (user) {
            if (user) {
                renderLoggedIn(user);
            } else {
                renderLoggedOut();
            }
        });
    } catch (error) {
        console.error('Error initializing navbar auth:', error);
    }
}); 