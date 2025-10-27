// Admin Panel JavaScript

console.log('Loading admin.js');

// Global variables
let currentSection = 'dashboard';
let sidebarCollapsed = false;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initialized');
    initializeAdminPanel();
    setupEventListeners();
    loadDashboardData();
});

// Initialize admin panel
function initializeAdminPanel() {
    // Set active section
    showSection('dashboard');
    
    // Initialize charts
    initializeCharts();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filters
    setupFilters();
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Quick action buttons
    const quickActions = document.querySelectorAll('.action-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    // Form submissions
    setupFormHandlers();
    
    // Modal handlers
    setupModalHandlers();
}

// Show section
function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
    }
    
    // Update sidebar active state
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    currentSection = sectionName;
    
    // Load section-specific data
    loadSectionData(sectionName);
}

// Load section-specific data
function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'movies':
            loadMoviesData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'theaters':
            loadTheatersData();
            break;
        case 'shows':
            loadShowsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Dashboard functions
function loadDashboardData() {
    console.log('Loading dashboard data');
    
    // Update statistics (in real app, this would be API calls)
    updateStatistics();
    
    // Load recent bookings
    loadRecentBookings();
}

function updateStatistics() {
    // In a real application, these would be API calls
    const stats = {
        movies: 24,
        users: 1234,
        bookings: 5678,
        revenue: 234567
    };
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-content h3');
    if (statCards[0]) statCards[0].textContent = stats.movies;
    if (statCards[1]) statCards[1].textContent = stats.users.toLocaleString();
    if (statCards[2]) statCards[2].textContent = stats.bookings.toLocaleString();
    if (statCards[3]) statCards[3].textContent = '₹' + stats.revenue.toLocaleString();
}

function loadRecentBookings() {
    // In a real application, this would be an API call
    console.log('Loading recent bookings');
}

// Movies functions
function loadMoviesData() {
    console.log('Loading movies data');
}

function editMovie(movieId) {
    console.log('Editing movie:', movieId);
    showAlert('info', 'Edit Movie', 'Edit movie functionality would be implemented here');
}

function deleteMovie(movieId) {
    console.log('Deleting movie:', movieId);
    if (confirm('Are you sure you want to delete this movie?')) {
        showAlert('success', 'Movie Deleted', 'Movie has been deleted successfully');
    }
}

function saveMovie() {
    console.log('Saving movie');
    const form = document.getElementById('addMovieForm');
    if (form) {
        const formData = new FormData(form);
        // In a real application, this would be an API call
        showAlert('success', 'Movie Added', 'Movie has been added successfully');
        $('#addMovieModal').modal('hide');
        form.reset();
    }
}

// Users functions
function loadUsersData() {
    console.log('Loading users data');
}

function editUser(userId) {
    console.log('Editing user:', userId);
    showAlert('info', 'Edit User', 'Edit user functionality would be implemented here');
}

function deleteUser(userId) {
    console.log('Deleting user:', userId);
    if (confirm('Are you sure you want to delete this user?')) {
        showAlert('success', 'User Deleted', 'User has been deleted successfully');
    }
}

// Bookings functions
function loadBookingsData() {
    console.log('Loading bookings data');
}

function viewBooking(bookingId) {
    console.log('Viewing booking:', bookingId);
    showAlert('info', 'View Booking', 'Booking details would be shown here');
}

function cancelBooking(bookingId) {
    console.log('Cancelling booking:', bookingId);
    if (confirm('Are you sure you want to cancel this booking?')) {
        showAlert('success', 'Booking Cancelled', 'Booking has been cancelled successfully');
    }
}

// Theaters functions
function loadTheatersData() {
    console.log('Loading theaters data');
}

function editTheater(theaterId) {
    console.log('Editing theater:', theaterId);
    showAlert('info', 'Edit Theater', 'Edit theater functionality would be implemented here');
}

function deleteTheater(theaterId) {
    console.log('Deleting theater:', theaterId);
    if (confirm('Are you sure you want to delete this theater?')) {
        showAlert('success', 'Theater Deleted', 'Theater has been deleted successfully');
    }
}

// Shows functions
function loadShowsData() {
    console.log('Loading shows data');
}

function editShow(showId) {
    console.log('Editing show:', showId);
    showAlert('info', 'Edit Show', 'Edit show functionality would be implemented here');
}

function deleteShow(showId) {
    console.log('Deleting show:', showId);
    if (confirm('Are you sure you want to delete this show?')) {
        showAlert('success', 'Show Deleted', 'Show has been deleted successfully');
    }
}

// Reports functions
function loadReportsData() {
    console.log('Loading reports data');
    // Charts are initialized in initializeCharts()
}

// Settings functions
function loadSettingsData() {
    console.log('Loading settings data');
}

// Search functionality
function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.card').querySelector('table tbody');
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Filter functionality
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterBookings(filter);
        });
    });
}

function filterBookings(filter) {
    console.log('Filtering bookings by:', filter);
    const table = document.querySelector('#bookings-section table tbody');
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else {
                const statusBadge = row.querySelector('.badge');
                if (statusBadge) {
                    const status = statusBadge.textContent.toLowerCase();
                    if (status === filter) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            }
        });
    }
}

// Charts initialization
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (₹)',
                    data: [12000, 19000, 30000, 50000, 20000, 30000],
                    borderColor: '#df0e62',
                    backgroundColor: 'rgba(223, 14, 98, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#0c0f0a'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#0c0f0a'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#0c0f0a'
                        }
                    }
                }
            }
        });
    }
    
    // Booking Chart
    const bookingCtx = document.getElementById('bookingChart');
    if (bookingCtx) {
        new Chart(bookingCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Bookings',
                    data: [12, 19, 3, 5, 2, 3, 8],
                    backgroundColor: '#df0e62',
                    borderColor: '#df0e62',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#0c0f0a'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#0c0f0a'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#0c0f0a'
                        }
                    }
                }
            }
        });
    }
}

// Form handlers
function setupFormHandlers() {
    // Settings forms
    const settingsForms = document.querySelectorAll('#settings-section form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings(this);
        });
    });
}

function saveSettings(form) {
    console.log('Saving settings');
    const formData = new FormData(form);
    // In a real application, this would be an API call
    showAlert('success', 'Settings Saved', 'Settings have been saved successfully');
}

// Modal handlers
function setupModalHandlers() {
    // Modal close handlers
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
            }
        });
    });
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const main = document.getElementById('admin-main');
    
    if (sidebarCollapsed) {
        sidebar.classList.remove('collapsed');
        main.classList.remove('sidebar-collapsed');
        sidebarCollapsed = false;
    } else {
        sidebar.classList.add('collapsed');
        main.classList.add('sidebar-collapsed');
        sidebarCollapsed = true;
    }
}

// Alert function
function showAlert(type, title, message) {
    if (typeof asAlertMsg === 'function') {
        asAlertMsg({
            type: type,
            title: title,
            message: message,
            button: {
                title: "Close",
                bg: "Close Button"
            }
        });
    } else {
        alert(`${title}: ${message}`);
    }
}

// Export functions for global access
window.showSection = showSection;
window.editMovie = editMovie;
window.deleteMovie = deleteMovie;
window.saveMovie = saveMovie;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.viewBooking = viewBooking;
window.cancelBooking = cancelBooking;
window.editTheater = editTheater;
window.deleteTheater = deleteTheater;
window.editShow = editShow;
window.deleteShow = deleteShow;
window.toggleSidebar = toggleSidebar;

console.log('Admin panel functions loaded');

