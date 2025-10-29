// Booking Manager - Centralized booking data management
// This module handles storing and retrieving booking data

console.log('Booking Manager loaded');

// Booking data structure
class BookingManager {
    constructor() {
        this.storageKey = 'myshowz_bookings';
        this.initializeStorage();
    }

    // Initialize storage if it doesn't exist
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Generate unique booking ID
    generateBookingId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `BK${timestamp}${random}`;
    }

    // Create a new booking
    createBooking(bookingData) {
        const booking = {
            id: this.generateBookingId(),
            userId: bookingData.userId || 'Guest',
            userName: bookingData.userName || 'Guest User',
            userEmail: bookingData.userEmail || 'guest@example.com',
            movieName: bookingData.movieName || 'Movie Title',
            moviePoster: bookingData.moviePoster || '',
            screen: bookingData.screen,
            date: bookingData.date,
            time: bookingData.time,
            seats: bookingData.seats || [],
            seatCount: bookingData.seatCount || 0,
            amount: bookingData.amount || 0,
            paymentMethod: bookingData.paymentMethod || 'Card',
            status: bookingData.status || 'Confirmed',
            bookingDate: new Date().toISOString(),
            timestamp: Date.now()
        };

        // Get existing bookings
        const bookings = this.getAllBookings();
        
        // Add new booking
        bookings.unshift(booking); // Add to beginning
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(bookings));
        
        console.log('Booking created:', booking);
        return booking;
    }

    // Get all bookings
    getAllBookings() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading bookings:', error);
            return [];
        }
    }

    // Get booking by ID
    getBookingById(bookingId) {
        const bookings = this.getAllBookings();
        return bookings.find(b => b.id === bookingId);
    }

    // Get bookings by user
    getBookingsByUser(userId) {
        const bookings = this.getAllBookings();
        return bookings.filter(b => b.userId === userId);
    }

    // Get bookings by status
    getBookingsByStatus(status) {
        const bookings = this.getAllBookings();
        return bookings.filter(b => b.status === status);
    }

    // Get bookings by date
    getBookingsByDate(date) {
        const bookings = this.getAllBookings();
        return bookings.filter(b => b.date === date);
    }

    // Update booking status
    updateBookingStatus(bookingId, newStatus) {
        const bookings = this.getAllBookings();
        const index = bookings.findIndex(b => b.id === bookingId);
        
        if (index !== -1) {
            bookings[index].status = newStatus;
            bookings[index].updatedAt = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(bookings));
            console.log('Booking status updated:', bookingId, newStatus);
            return true;
        }
        return false;
    }

    // Cancel booking
    cancelBooking(bookingId) {
        return this.updateBookingStatus(bookingId, 'Cancelled');
    }

    // Delete booking
    deleteBooking(bookingId) {
        const bookings = this.getAllBookings();
        const filtered = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        console.log('Booking deleted:', bookingId);
        return true;
    }

    // Get statistics
    getStatistics() {
        const bookings = this.getAllBookings();
        
        return {
            totalBookings: bookings.length,
            confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
            pendingBookings: bookings.filter(b => b.status === 'Pending').length,
            cancelledBookings: bookings.filter(b => b.status === 'Cancelled').length,
            totalRevenue: bookings
                .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
                .reduce((sum, b) => sum + (b.amount || 0), 0),
            todayBookings: bookings.filter(b => {
                const bookingDate = new Date(b.bookingDate).toDateString();
                const today = new Date().toDateString();
                return bookingDate === today;
            }).length
        };
    }

    // Get recent bookings
    getRecentBookings(limit = 10) {
        const bookings = this.getAllBookings();
        return bookings.slice(0, limit);
    }

    // Clear all bookings (admin only)
    clearAllBookings() {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
        console.log('All bookings cleared');
    }

    // Generate sample bookings for testing
    generateSampleBookings(count = 5) {
        const movies = ['Avatar 2', 'Spider-Man', 'Black Panther', 'Avengers', 'Inception'];
        const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown'];
        const statuses = ['Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Cancelled'];
        const screens = ['Screen 1', 'Screen 2', 'Screen 3', 'Screen 4', 'Screen 5'];
        
        for (let i = 0; i < count; i++) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomScreen = screens[Math.floor(Math.random() * screens.length)];
            
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 7));
            
            this.createBooking({
                userName: randomUser,
                userEmail: randomUser.toLowerCase().replace(' ', '.') + '@example.com',
                movieName: randomMovie,
                screen: randomScreen,
                date: date.toISOString().split('T')[0],
                time: ['09:00', '13:00', '16:00', '19:00', '22:00'][Math.floor(Math.random() * 5)],
                seats: ['A1', 'A2', 'A3'].slice(0, Math.floor(Math.random() * 3) + 1),
                seatCount: Math.floor(Math.random() * 3) + 1,
                amount: (Math.floor(Math.random() * 3) + 1) * 200,
                status: randomStatus
            });
        }
        
        console.log(`Generated ${count} sample bookings`);
    }
}

// Create global instance
window.bookingManager = new BookingManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingManager;
}
