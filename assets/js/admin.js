// Admin Panel JavaScript

console.log('Loading admin.js');

// Development mode flag
const DEVELOPMENT_MODE = true; // Set to false when AWS backend is ready

// AWS Amplify imports (commented out for now - uncomment when ready)
// import { Amplify } from 'aws-amplify';
// import { generateClient } from 'aws-amplify/data';
// import { getCurrentUser } from 'aws-amplify/auth';

// Global variables
let currentSection = 'dashboard';
let sidebarCollapsed = false;
let refreshInterval = null;
let amplifyClient = null;

// Real-time data cache
let dataCache = {
    movies: [],
    users: [],
    bookings: [],
    theaters: [],
    shows: [],
    statistics: {
        totalMovies: 0,
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0
    }
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Admin panel initialized');
    
    // Initialize AWS Amplify if in production mode
    if (!DEVELOPMENT_MODE) {
        await initializeAmplify();
    }
    
    initializeAdminPanel();
    setupEventListeners();
    await loadDashboardData();
    
    // Start auto-refresh for real-time updates
    startAutoRefresh();
});

// Initialize AWS Amplify
async function initializeAmplify() {
    try {
        // Configure Amplify (update with your actual config)
        Amplify.configure({
            Auth: {
                Cognito: {
                    userPoolId: 'ap-south-1_YOUR_POOL_ID',
                    userPoolClientId: 'YOUR_CLIENT_ID'
                }
            },
            API: {
                GraphQL: {
                    endpoint: 'YOUR_GRAPHQL_ENDPOINT',
                    region: 'ap-south-1',
                    defaultAuthMode: 'userPool'
                }
            }
        });
        
        amplifyClient = generateClient();
        console.log('AWS Amplify initialized successfully');
        
        // Verify admin authentication
        const user = await getCurrentUser();
        console.log('Admin user:', user.username);
    } catch (error) {
        console.error('Failed to initialize Amplify:', error);
        showAlert('error', 'Connection Error', 'Failed to connect to AWS backend');
    }
}

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
    
    // Add refresh button
    addRefreshButton();
}

// Add refresh button to header
function addRefreshButton() {
    const header = document.querySelector('.section-header');
    if (header && !document.getElementById('refreshBtn')) {
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'refreshBtn';
        refreshBtn.className = 'btn btn-outline-primary';
        refreshBtn.innerHTML = '<i class="fa fa-sync-alt"></i> Refresh';
        refreshBtn.onclick = () => refreshCurrentSection();
        header.appendChild(refreshBtn);
    }
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
async function loadDashboardData() {
    console.log('Loading dashboard data');
    showLoadingState('dashboard');
    
    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - use mock data
            await loadMockDashboardData();
        } else {
            // Production mode - fetch from AWS
            await fetchDashboardDataFromAWS();
        }
        
        // Update statistics
        updateStatistics();
        
        // Load recent bookings
        await loadRecentBookings();
        
        hideLoadingState('dashboard');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('error', 'Load Error', 'Failed to load dashboard data');
        hideLoadingState('dashboard');
    }
}

// Load mock data for development
async function loadMockDashboardData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check if bookingManager exists and has real bookings
            if (window.bookingManager) {
                const realBookings = window.bookingManager.getAllBookings();
                const stats = window.bookingManager.getStatistics();
                
                if (realBookings.length > 0) {
                    // Use real booking data
                    dataCache.bookings = realBookings.map(b => ({
                        id: b.id,
                        user: b.userName,
                        movie: b.movieName,
                        date: b.date,
                        time: b.time,
                        screen: b.screen,
                        seats: b.seats ? b.seats.join(', ') : '',
                        amount: b.amount,
                        status: b.status
                    }));
                    
                    dataCache.statistics = {
                        totalMovies: 24, // Static for now
                        totalUsers: 1234, // Static for now
                        totalBookings: stats.totalBookings,
                        totalRevenue: stats.totalRevenue
                    };
                    
                    console.log('Real booking data loaded:', dataCache);
                } else {
                    // Generate sample bookings if none exist
                    console.log('No bookings found, generating samples...');
                    window.bookingManager.generateSampleBookings(5);
                    
                    // Recursively call to load the generated data
                    return loadMockDashboardData().then(resolve);
                }
            } else {
                // Fallback to mock data if bookingManager not available
                console.warn('BookingManager not available, using fallback data');
                dataCache.statistics = {
                    totalMovies: Math.floor(Math.random() * 10) + 20,
                    totalUsers: Math.floor(Math.random() * 100) + 1200,
                    totalBookings: Math.floor(Math.random() * 200) + 5600,
                    totalRevenue: Math.floor(Math.random() * 50000) + 230000
                };
                
                dataCache.bookings = [
                    {
                        id: 'BK' + Date.now(),
                        user: 'John Doe',
                        movie: 'Avatar 2',
                        date: new Date().toISOString().split('T')[0],
                        amount: 500,
                        status: 'Confirmed'
                    }
                ];
            }
            
            resolve();
        }, 300);
    });
}

// Fetch real data from AWS
async function fetchDashboardDataFromAWS() {
    try {
        // Fetch statistics
        const [movies, users, bookings] = await Promise.all([
            amplifyClient.models.Movie.list(),
            amplifyClient.models.User.list(),
            amplifyClient.models.Booking.list()
        ]);
        
        dataCache.movies = movies.data || [];
        dataCache.users = users.data || [];
        dataCache.bookings = bookings.data || [];
        
        // Calculate statistics
        dataCache.statistics = {
            totalMovies: dataCache.movies.length,
            totalUsers: dataCache.users.length,
            totalBookings: dataCache.bookings.length,
            totalRevenue: dataCache.bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
        };
        
        console.log('AWS data loaded:', dataCache);
    } catch (error) {
        console.error('Error fetching from AWS:', error);
        throw error;
    }
}

function updateStatistics() {
    const stats = dataCache.statistics;
    
    // Update stat cards with animation
    const statCards = document.querySelectorAll('.stat-content h3');
    if (statCards[0]) animateValue(statCards[0], parseInt(statCards[0].textContent) || 0, stats.totalMovies, 500);
    if (statCards[1]) animateValue(statCards[1], parseInt(statCards[1].textContent.replace(/,/g, '')) || 0, stats.totalUsers, 500);
    if (statCards[2]) animateValue(statCards[2], parseInt(statCards[2].textContent.replace(/,/g, '')) || 0, stats.totalBookings, 500);
    if (statCards[3]) {
        const currentValue = parseInt(statCards[3].textContent.replace(/[₹,]/g, '')) || 0;
        animateValue(statCards[3], currentValue, stats.totalRevenue, 500, '₹');
    }
    
    // Add last updated timestamp
    updateLastRefreshTime();
}

// Animate number changes
function animateValue(element, start, end, duration, prefix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        const displayValue = Math.floor(current).toLocaleString();
        element.textContent = prefix + displayValue;
    }, 16);
}

// Update last refresh time
function updateLastRefreshTime() {
    let timeDisplay = document.getElementById('lastRefreshTime');
    if (!timeDisplay) {
        timeDisplay = document.createElement('small');
        timeDisplay.id = 'lastRefreshTime';
        timeDisplay.style.color = '#999';
        timeDisplay.style.marginLeft = '15px';
        const header = document.querySelector('.section-header p');
        if (header) {
            header.appendChild(timeDisplay);
        }
    }
    const now = new Date();
    timeDisplay.textContent = ` • Last updated: ${now.toLocaleTimeString()}`;
}

async function loadRecentBookings() {
    console.log('Loading recent bookings');
    
    const tbody = document.querySelector('#dashboard-section table tbody');
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get latest bookings (max 10)
    const recentBookings = dataCache.bookings.slice(0, 10);
    
    if (recentBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No bookings found. Bookings will appear here when customers make reservations.</td></tr>';
        return;
    }
    
    // Populate table with detailed booking information
    recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        const showTime = booking.time ? formatTime12Hour(booking.time) : 'N/A';
        const screenInfo = booking.screen || 'N/A';
        const seatInfo = booking.seats || 'N/A';
        
        row.innerHTML = `
            <td><strong>${booking.id}</strong></td>
            <td>${booking.user}</td>
            <td>${booking.movie}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${showTime}<br><small class="text-muted">${screenInfo}</small></td>
            <td><strong>₹${booking.amount.toLocaleString()}</strong></td>
            <td><span class="badge badge-${getStatusBadgeClass(booking.status)}">${booking.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Format time from 24-hour to 12-hour
function formatTime12Hour(time24) {
    if (!time24) return 'N/A';
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get badge class based on status
function getStatusBadgeClass(status) {
    const statusMap = {
        'Confirmed': 'success',
        'Pending': 'warning',
        'Cancelled': 'danger',
        'Completed': 'info'
    };
    return statusMap[status] || 'secondary';
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

// Auto-refresh functionality
function startAutoRefresh() {
    // Refresh every 30 seconds
    refreshInterval = setInterval(() => {
        console.log('Auto-refreshing data...');
        refreshCurrentSection();
    }, 30000);
    
    console.log('Auto-refresh started (every 30 seconds)');
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log('Auto-refresh stopped');
    }
}

async function refreshCurrentSection() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fa fa-sync-alt fa-spin"></i> Refreshing...';
    }
    
    await loadSectionData(currentSection);
    
    if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fa fa-sync-alt"></i> Refresh';
    }
    
    showAlert('success', 'Refreshed', 'Data updated successfully');
}

// Loading state functions
function showLoadingState(section) {
    const sectionElement = document.getElementById(section + '-section');
    if (sectionElement) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loading-' + section;
        overlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin fa-3x"></i>
                <p>Loading data...</p>
            </div>
        `;
        sectionElement.style.position = 'relative';
        sectionElement.appendChild(overlay);
    }
}

function hideLoadingState(section) {
    const overlay = document.getElementById('loading-' + section);
    if (overlay) {
        overlay.remove();
    }
}

// Real-time data subscription (for AWS)
function subscribeToRealtimeUpdates() {
    if (DEVELOPMENT_MODE || !amplifyClient) return;
    
    try {
        // Subscribe to booking updates
        amplifyClient.models.Booking.onCreate().subscribe({
            next: (data) => {
                console.log('New booking created:', data);
                dataCache.bookings.unshift(data);
                updateStatistics();
                loadRecentBookings();
                showAlert('info', 'New Booking', 'A new booking has been created');
            },
            error: (error) => console.error('Subscription error:', error)
        });
        
        // Subscribe to user updates
        amplifyClient.models.User.onCreate().subscribe({
            next: (data) => {
                console.log('New user registered:', data);
                dataCache.users.push(data);
                updateStatistics();
                showAlert('info', 'New User', 'A new user has registered');
            },
            error: (error) => console.error('Subscription error:', error)
        });
        
        console.log('Real-time subscriptions active');
    } catch (error) {
        console.error('Failed to setup subscriptions:', error);
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
window.refreshCurrentSection = refreshCurrentSection;
window.stopAutoRefresh = stopAutoRefresh;
window.startAutoRefresh = startAutoRefresh;

console.log('Admin panel functions loaded with real-time support');

