// Main navigation and section management
let currentSection = 'home';
let currentLesson = null;
let navigationHistory = ['home']; // Track navigation history

// Theme management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.classList.toggle('dark-mode');
    
    // Update icon and save preference
    if (body.classList.contains('dark-mode')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        if (themeIcon) themeIcon.textContent = '🌙';
    }
}

function showSection(sectionId) {
    // Add current section to history if it's different
    if (currentSection !== sectionId && !navigationHistory.includes(sectionId)) {
        navigationHistory.push(currentSection);
    }
    
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Hide all lesson sections
    document.querySelectorAll('.lesson-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentSection = sectionId;
    currentLesson = null;
    
    // Update browser URL without refreshing
    const newUrl = sectionId === 'home' ? 'main.html' : `main.html#${sectionId}`;
    window.history.pushState({section: sectionId}, '', newUrl);
}

function showLesson(lessonId) {
    // Add current state to history
    if (currentLesson) {
        navigationHistory.push(`lesson-${currentLesson}`);
    } else {
        navigationHistory.push(currentSection);
    }
    
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Hide all lesson sections
    document.querySelectorAll('.lesson-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected lesson
    const lessonSection = document.getElementById(lessonId + '-lesson');
    if (lessonSection) {
        lessonSection.classList.add('active');
        currentLesson = lessonId;
        
        // Initialize the lesson if needed
        setTimeout(() => {
            if (lessonId === 'binary-search') {
                // Just initialize the visualization without performing search
                drawBinaryVisualization();
            } else if (lessonId === 'fonctions-reciproques') {
                updateInverseFunction();
            } else if (lessonId === 'continuite-fonction') {
                updateContinuityFunction();
            }
        }, 100);
        
        // Update browser URL
        window.history.pushState({lesson: lessonId}, '', `main.html#${lessonId}`);
    }
}

function goBack() {
    if (navigationHistory.length > 1) {
        // Remove current state from history
        navigationHistory.pop();
        
        // Get previous state
        const previousState = navigationHistory[navigationHistory.length - 1];
        
        if (previousState.startsWith('lesson-')) {
            // Go back to a lesson
            const lessonId = previousState.replace('lesson-', '');
            currentLesson = lessonId;
            showLesson(lessonId);
        } else {
            // Go back to a section
            showSection(previousState);
        }
    } else {
        // Default fallback to home
        showSection('home');
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state) {
        if (event.state.section) {
            showSection(event.state.section);
        } else if (event.state.lesson) {
            showLesson(event.state.lesson);
        }
    } else {
        // Parse URL hash to determine current page
        const hash = window.location.hash.substring(1);
        if (hash) {
            if (document.getElementById(hash + '-lesson')) {
                showLesson(hash);
            } else if (document.getElementById(hash)) {
                showSection(hash);
            }
        } else {
            showSection('home');
        }
    }
});

// Initialize the page based on URL
function initializePage() {
    const hash = window.location.hash.substring(1);
    
    if (hash) {
        // Check if it's a lesson
        if (document.getElementById(hash + '-lesson')) {
            showLesson(hash);
        } else if (document.getElementById(hash)) {
            showSection(hash);
        } else {
            showSection('home');
        }
    } else {
        showSection('home');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});
