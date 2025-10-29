// Load and display booking data on e-ticket
$(document).ready(function() {
    console.log('E-Ticket page loaded');
    
    // Check if bookingManager is available
    if (typeof window.bookingManager === 'undefined') {
        console.error('BookingManager not available');
        return;
    }
    
    // Try to get booking ID from URL parameter or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    let bookingId = urlParams.get('bookingId') || sessionStorage.getItem('currentBookingId');
    
    let booking = null;
    
    if (bookingId) {
        // Get specific booking by ID
        booking = window.bookingManager.getBookingById(bookingId);
        console.log('Loading booking by ID:', bookingId, booking);
    } else {
        // Get the most recent booking
        const recentBookings = window.bookingManager.getRecentBookings(1);
        if (recentBookings && recentBookings.length > 0) {
            booking = recentBookings[0];
            console.log('Loading most recent booking:', booking);
        }
    }
    
    if (booking) {
        updateTicketDisplay(booking);
    } else {
        console.warn('No booking found. Showing sample data.');
        // Keep default sample data if no booking found
    }
});

// Function to update ticket display with booking data
function updateTicketDisplay(booking) {
    console.log('Updating ticket with booking data:', booking);
    
    // Update movie name
    $('#ticket-movie-name').text(booking.movieName || 'Movie Name');
    
    // Update movie poster if available
    if (booking.moviePoster) {
        $('#ticket-movie-poster').attr('src', booking.moviePoster);
    }
    
    // Update screen (extract number from "Screen 1" format)
    const screenNumber = booking.screen ? booking.screen.replace('Screen ', '') : '1';
    $('#ticket-screen').text(screenNumber);
    
    // Update seat information
    if (booking.seats && booking.seats.length > 0) {
        const firstSeat = booking.seats[0];
        // Extract row (letter) and seat number
        const row = firstSeat.match(/[A-Z]+/)?.[0] || 'A';
        const seatNum = firstSeat.match(/\d+/)?.[0] || '1';
        $('#ticket-row').text(row);
        $('#ticket-seat').text(booking.seats.join(', '));
    }
    
    // Update price
    const price = booking.amount || 0;
    $('#ticket-price').text('₹' + price.toFixed(2));
    
    // Update date
    if (booking.date) {
        const date = new Date(booking.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'numeric', 
            day: 'numeric', 
            year: '2-digit' 
        });
        $('#ticket-date').text(formattedDate);
    }
    
    // Update time
    if (booking.time) {
        const [hour, minute] = booking.time.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const formattedTime = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
        $('#ticket-time').text(formattedTime);
    }
    
    // Update booking ID in barcode numbers
    if (booking.id) {
        // Extract last 22 digits from booking ID for display
        const idDigits = booking.id.replace(/\D/g, '').slice(-22).split('');
        const numberRow = $('#ticket-booking-id');
        numberRow.empty();
        
        idDigits.forEach(digit => {
            numberRow.append(`<td>${digit}</td>`);
        });
        
        // Pad with zeros if less than 22 digits
        while (numberRow.children().length < 22) {
            numberRow.append('<td>0</td>');
        }
    }
    
    console.log('Ticket display updated successfully');
}