document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

function updateNavbar() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const userId = localStorage.getItem('userId');

    if (userId) {
        // User is logged in - show profile icon/dashboard link
        navLinks.innerHTML = `
            <a href="profile.html" class="profile-link">
                <div class="profile-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                    </svg>
                    <span>Profile</span>
                </div>
            </a>
            <button onclick="logout()" class="logout-btn">Logout</button>
        `;
    } else {
        // User is not logged in - show Sign In/Up
        navLinks.innerHTML = `
            <a href="auth.html?mode=signin" id="signin-btn">Sign In</a>
            <a href="auth.html?mode=signup" id="signup-btn" class="btn-primary">Sign Up</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}
