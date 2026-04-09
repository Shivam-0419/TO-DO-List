const API_URL = `${window.location.origin}/api`;
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const submitBtn = document.getElementById('submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const toggleArea = document.getElementById('toggle-area');

const nameGroup = document.getElementById('name-group');
const emailGroup = document.getElementById('email-group');

let isSignUp = false;

// Check URL parameters for mode
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'signup') {
    setSignUpMode();
}

function setSignUpMode() {
    isSignUp = true;
    authTitle.innerText = 'Sign Up';
    submitBtn.innerText = 'Sign Up';
    if (nameGroup) nameGroup.style.display = 'block';
    if (emailGroup) emailGroup.style.display = 'block';
    toggleArea.innerHTML = 'Already have an account? <a href="#" id="toggle-auth">Sign In</a>';
    attachToggleListener();
}

function setSignInMode() {
    isSignUp = false;
    authTitle.innerText = 'Sign In';
    submitBtn.innerText = 'Sign In';
    if (nameGroup) nameGroup.style.display = 'none';
    if (emailGroup) emailGroup.style.display = 'none';
    toggleArea.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-auth">Sign Up</a>';
    attachToggleListener();
}

function attachToggleListener() {
    document.getElementById('toggle-auth').addEventListener('click', (e) => {
        e.preventDefault();
        if (isSignUp) setSignInMode();
        else setSignUpMode();
    });
}

attachToggleListener();

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    let body = { username, password };
    
    if (isSignUp) {
        body.fullName = document.getElementById('fullName').value;
        body.email = document.getElementById('email').value;
    }

    const endpoint = isSignUp ? '/signup' : '/signin';
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            if (isSignUp) {
                alert('Account created successfully! Please sign in.');
                setSignInMode();
            } else {
                localStorage.setItem('userId', data.userId);
                alert('Signed in successfully!');
                window.location.href = 'index.html';
            }
        } else {
            alert(data.error || 'Authentication failed');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Could not connect to the server');
    }
});
