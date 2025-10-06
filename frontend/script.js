// script.js - Main Scripts for UG HealthConnect Homepage

// API Configuration
const API_URL = 'http://localhost:5000/api';

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Handle Login Modal Form Submission from Homepage
const modalLoginForm = document.getElementById('loginForm');
if (modalLoginForm) {
    modalLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // Redirect to dedicated login page
        // You can either redirect or handle login here
        // For better UX, let's redirect to the dedicated login page
        window.location.href = 'login.html';
        
        // Alternative: Handle login directly (uncomment to use)
        /*
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Save token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect based on role
                const dashboards = {
                    'admin': 'admin-dashboard.html',
                    'patient': 'patient-dashboard.html',
                    'doctor': 'doctor-dashboard.html'
                };
                window.location.href = dashboards[data.user.role];
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Unable to connect to server');
        }
        */
    });
}

// Check if user is already logged in
function checkUserLogin() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            
            // Update login button to show user info
            const loginButtons = document.querySelectorAll('[data-bs-target="#loginModal"]');
            loginButtons.forEach(button => {
                button.innerHTML = `<i class="fas fa-user me-1"></i>${userData.firstName || userData.username}`;
                button.onclick = function(e) {
                    e.preventDefault();
                    redirectToDashboard(userData.role);
                };
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
    const dashboards = {
        'admin': 'admin-dashboard.html',
        'patient': 'patient-dashboard.html',
        'doctor': 'doctor-dashboard.html'
    };
    window.location.href = dashboards[role] || 'login.html';
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe all feature cards and sections
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserLogin();
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.feature-card, .about-feature, .tech-item');
    animateElements.forEach(el => observer.observe(el));
    
    // Add fade-in animation class
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
});

// Handle contact form (if you add one later)
function handleContactForm(e) {
    e.preventDefault();
    alert('Contact form submitted! (Connect to backend later)');
}

// Logout function (can be called from anywhere)
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        window.location.href = 'index.html';
    }
};

// Utility: Check if token is valid (basic check)
function isTokenValid() {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!token || !loginTime) return false;
    
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);
    
    // Token valid for 24 hours
    return hoursSinceLogin < 24;
}

// Export for use in other files
window.UGHealthConnect = {
    API_URL,
    logout,
    isTokenValid,
    redirectToDashboard
};