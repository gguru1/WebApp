// login.js - Authentication Logic for UG HealthConnect

// API Configuration
const API_URL = 'http://localhost:5000/api'; // Update this when deploying

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const loginButtonSpinner = document.getElementById('loginButtonSpinner');
const alertContainer = document.getElementById('alertContainer');
const togglePassword = document.getElementById('togglePassword');

// Password visibility toggle
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Show alert message
function showAlert(message, type = 'danger') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHTML;
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
}

// Clear alerts
function clearAlerts() {
    alertContainer.innerHTML = '';
}

// Set loading state
function setLoading(isLoading) {
    if (isLoading) {
        loginButton.disabled = true;
        loginButtonText.classList.add('d-none');
        loginButtonSpinner.classList.remove('d-none');
    } else {
        loginButton.disabled = false;
        loginButtonText.classList.remove('d-none');
        loginButtonSpinner.classList.add('d-none');
    }
}

// Save user data to localStorage
function saveUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loginTime', new Date().toISOString());
}

// Redirect based on user role
function redirectToDashboard(role) {
    const dashboards = {
        'admin': 'admin-dashboard.html',
        'patient': 'patient-dashboard.html',
        'doctor': 'doctor-dashboard.html'
    };
    
    const dashboard = dashboards[role] || 'index.html';
    
    // Show success message before redirect
    showAlert(`Login successful! Redirecting to ${role} dashboard...`, 'success');
    
    // Redirect after 1.5 seconds
    setTimeout(() => {
        window.location.href = dashboard;
    }, 1500);
}

// Handle login form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous alerts
    clearAlerts();
    
    // Get form values
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Basic validation
    if (!username || !password) {
        showAlert('Please enter both username and password', 'warning');
        return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
        // Make API request
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            console.log('Login successful:', data);
            
            // Save token and user data
            saveUserData(data.token, data.user);
            
            // Redirect to appropriate dashboard
            redirectToDashboard(data.user.role);
            
        } else {
            // Login failed
            showAlert(data.message || 'Invalid credentials. Please try again.', 'danger');
            setLoading(false);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Check if it's a network error
        if (error.message === 'Failed to fetch') {
            showAlert('Unable to connect to server. Please ensure the backend is running.', 'danger');
        } else {
            showAlert('An error occurred during login. Please try again.', 'danger');
        }
        
        setLoading(false);
    }
});

// Check if user is already logged in
function checkExistingLogin() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            
            // Check if token is expired (optional - JWT expiry check)
            const loginTime = localStorage.getItem('loginTime');
            if (loginTime) {
                const loginDate = new Date(loginTime);
                const now = new Date();
                const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);
                
                // If logged in less than 24 hours ago, redirect to dashboard
                if (hoursSinceLogin < 24) {
                    showAlert('You are already logged in. Redirecting...', 'info');
                    setTimeout(() => {
                        redirectToDashboard(userData.role);
                    }, 1500);
                    return true;
                } else {
                    // Token expired, clear storage
                    localStorage.clear();
                }
            }
        } catch (error) {
            console.error('Error checking existing login:', error);
            localStorage.clear();
        }
    }
    return false;
}

// Auto-fill demo credentials (for testing - remove in production)
function addDemoCredentialsHelper() {
    const demoInfo = document.createElement('div');
    demoInfo.className = 'text-center mt-3 p-3 bg-light rounded';
    demoInfo.innerHTML = `
        <small class="text-muted">
            <strong>Demo Accounts (for testing):</strong><br>
            <button class="btn btn-sm btn-outline-primary mt-2 me-2" onclick="fillDemo('admin')">
                Admin Login
            </button>
        </small>
    `;
    document.querySelector('.login-body').appendChild(demoInfo);
}

// Fill demo credentials
window.fillDemo = function(role) {
    const credentials = {
        'admin': { username: 'admin', password: 'admin123' },
    };
    
    if (credentials[role]) {
        usernameInput.value = credentials[role].username;
        passwordInput.value = credentials[role].password;
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (!checkExistingLogin()) {
        // Add demo credentials helper (remove in production)
        addDemoCredentialsHelper();
    }
    
    // Focus on username input
    usernameInput.focus();
});

// Handle browser back button
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache (back button)
        setLoading(false);
        clearAlerts();
    }
});