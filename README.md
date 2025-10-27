# 🎬 MyShowz - Movie Ticket Booking Website

A comprehensive movie ticket booking platform built with modern web technologies, featuring a complete booking flow from movie selection to seat reservation and payment processing.

## ✨ Features

### 🎯 Core Functionality
- **Movie Discovery**: Browse popular movies, new releases, and featured content
- **Interactive Seat Selection**: Real-time seat booking with visual seat map
- **Ticket Booking Flow**: Complete booking process with progress tracking
- **User Authentication**: Secure sign-in/sign-up with AWS Amplify integration
- **Admin Panel**: Comprehensive admin dashboard for movie and user management
- **E-ticket Generation**: Digital ticket generation with barcode support

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Search Functionality**: Search movies by title, genre, or keywords
- **Movie Trailers**: Embedded video trailers for movie previews

### 🔧 Technical Features
- **AWS Amplify Backend**: Scalable cloud infrastructure
- **Real-time Updates**: Live seat availability and booking status
- **Payment Integration**: Secure payment processing (ready for integration)
- **Progress Tracking**: Step-by-step booking progress indicator
- **Form Validation**: Client-side and server-side validation

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- AWS Account
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MyShowz-Movie-ticket-booking-website.git
   cd MyShowz-Movie-ticket-booking-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up AWS Amplify** (Optional - for authentication)
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   amplify init
   ```

4. **Run the application**
   ```bash
   # For development
   npm run dev
   
   # For production build
   npm run build
   ```

## 📁 Project Structure

```
MyShowz-Movie-ticket-booking-website/
├── assets/
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── images/              # Images and media
├── seat_selection/          # Seat selection module
├── amplify/                 # AWS Amplify configuration
├── *.html                   # Main application pages
└── package.json            # Dependencies and scripts
```

## 🎬 Pages Overview

### Public Pages
- **Home** (`index.html`) - Landing page with featured movies and trailers
- **Movies** (`movies.html`) - Complete movie catalog with filtering
- **About** (`about.html`) - Company information and team details
- **Contact** (`Contact_Us.html`) - Contact form and information

### User Pages
- **Sign In** (`sign_in.html`) - User authentication
- **Ticket Booking** (`ticket-booking.html`) - Booking flow with progress tracking
- **Seat Selection** (`seat_selection/seat_sel.html`) - Interactive seat map
- **E-ticket** (`e-ticket.html`) - Digital ticket display

### Admin Pages
- **Admin Login** (`admin-login.html`) - Admin authentication
- **Admin Dashboard** (`admin.html`) - Movie and user management

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Bootstrap 4** - Responsive framework
- **jQuery** - DOM manipulation and AJAX
- **Owl Carousel** - Image sliders
- **Font Awesome** - Icons

### Backend & Cloud
- **AWS Amplify** - Authentication and backend services
- **AWS Cognito** - User management
- **AWS Lambda** - Serverless functions
- **AWS DynamoDB** - Database (configured)

### Development Tools
- **Node.js** - Runtime environment
- **npm** - Package management
- **TypeScript** - Type safety (Amplify backend)

## 🎨 Design Features

### Theme System
- **Dark Mode**: Modern dark theme with high contrast
- **Light Mode**: Clean light theme with soft colors
- **Smooth Transitions**: CSS animations for theme switching

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layout for tablets
- **Desktop Experience**: Full-featured desktop interface

## 🔐 Authentication & Security

- **AWS Cognito Integration**: Secure user authentication
- **JWT Tokens**: Stateless authentication
- **Password Security**: Encrypted password storage
- **Session Management**: Secure session handling

## 📱 Mobile Experience

- **Touch-Friendly**: Optimized for touch interactions
- **Fast Loading**: Optimized assets and lazy loading
- **Offline Support**: Basic offline functionality
- **PWA Ready**: Progressive Web App capabilities

## 🚀 Deployment

### AWS Amplify Hosting
1. Connect your GitHub repository to AWS Amplify
2. Configure build settings
3. Deploy automatically on push to main branch

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your domain and SSL certificate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

This project was developed as part of an HCI (Human-Computer Interaction) course project, focusing on creating an intuitive and user-friendly movie ticket booking experience.

## 📞 Support

For support, email support@myshowz.com or create an issue in the repository.

---

**MyShowz** - Your Gateway to the Ultimate Movie Experience! 🎬✨ 
