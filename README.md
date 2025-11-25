# 📝 Feedback Collection Tool

A modern, full-stack MERN application for collecting and managing user feedback with real-time updates and interactive analytics dashboard.

![Project Banner](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🌐 Live Demo

- **Frontend (User)**: [https://feedbacksystem-blue.vercel.app](https://feedbacksystem-blue.vercel.app)
- **Admin Panel**: [https://feedbacksystem-blue.vercel.app/admin/login](https://feedbacksystem-blue.vercel.app/admin/login)
- **Backend API**: [https://feedback-backend-horw.onrender.com](https://feedback-backend-horw.onrender.com)

## 📹 Demo Video

**YouTube**: [Watch Demo Video](YOUR_YOUTUBE_LINK_HERE)

## ✨ Features

### User Features
- ✅ **Anonymous Feedback Submission** - No login required
- ✅ **Star Rating System** - Interactive 1-5 star rating
- ✅ **Product-Based Feedback** - Organize feedback by products
- ✅ **Form Validation** - Real-time validation with error messages
- ✅ **Responsive Design** - Works on all devices
- ✅ **Success Notifications** - Instant feedback confirmation

### Admin Features
- ✅ **Secure JWT Authentication** - Protected admin routes
- ✅ **Real-Time Dashboard** - Live updates with Socket.IO
- ✅ **Interactive Charts** - Visualize data with Recharts
- ✅ **Advanced Filtering** - Filter by product, rating, and date
- ✅ **Statistics Overview** - Total feedbacks, average rating, product stats
- ✅ **Feedback Management** - View, sort, and delete feedbacks
- ✅ **Rating Distribution** - Pie chart showing rating breakdown
- ✅ **Product Performance** - Bar charts comparing products

### Technical Features
- ✅ **Real-Time Updates** - Socket.IO for instant synchronization
- ✅ **RESTful API** - Clean and documented endpoints
- ✅ **MongoDB Database** - Scalable NoSQL database
- ✅ **Secure Password Hashing** - bcrypt for password security
- ✅ **Token-Based Auth** - JWT for secure authentication
- ✅ **Error Handling** - Comprehensive error management
- ✅ **CORS Enabled** - Cross-origin resource sharing
- ✅ **Environment Variables** - Secure configuration management

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts 2.10
- **Icons**: Lucide React 0.294
- **HTTP Client**: Axios 1.6
- **Routing**: React Router DOM 6.20
- **Real-Time**: Socket.IO Client 4.6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **Database**: MongoDB 8.0
- **ODM**: Mongoose 8.0
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Password Hashing**: bcryptjs 2.4
- **Real-Time**: Socket.IO 4.6
- **CORS**: cors 2.8

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📁 Project Structure
```
feedback-collection-tool/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── Admin.js              # Admin user model
│   │   └── Feedback.js           # Feedback model
│   ├── routes/
│   │   ├── feedback.js           # Feedback routes
│   │   └── admin.js              # Admin routes
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server setup
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FeedbackForm.jsx      # User feedback form
    │   │   ├── StarRating.jsx        # Star rating component
    │   │   ├── AdminLogin.jsx        # Admin authentication
    │   │   ├── AdminDashboard.jsx    # Admin dashboard
    │   │   └── FeedbackStats.jsx     # Statistics & charts
    │   ├── context/
    │   │   └── AuthContext.jsx       # Authentication context
    │   ├── config/
    │   │   └── api.js                # Axios configuration
    │   ├── App.jsx                   # Main app component
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/feedback-collection-tool.git
cd feedback-collection-tool
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your values:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secure_jwt_secret
# PORT=5000
# NODE_ENV=development

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Update .env:
# VITE_API_URL=http://localhost:5000

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Create Admin Account

Visit `http://localhost:5173/admin/login` and register your first admin account.

## 📡 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback` | Submit new feedback |
| GET | `/api/feedback` | Get recent feedbacks (limited) |
| GET | `/api/feedback/products` | Get list of products |

### Admin Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/register` | Register new admin |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/feedback` | Get all feedbacks with filters |
| GET | `/api/admin/stats` | Get statistics |
| DELETE | `/api/admin/feedback/:id` | Delete feedback |

### Request Examples

**Submit Feedback**
```bash
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "feedback": "Great product! Very satisfied.",
  "rating": 5,
  "productName": "Product A"
}
```

**Admin Login**
```bash
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Get Feedbacks with Filters**
```bash
GET /api/admin/feedback?productName=Product%20A&sortBy=rating&minRating=4
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback-tool
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🌟 Key Features Explanation

### Real-Time Updates
- Socket.IO connection between frontend and backend
- Dashboard automatically updates when new feedback is submitted
- No page refresh needed

### Secure Authentication
- JWT tokens for stateless authentication
- bcrypt hashing for password security
- Protected routes with middleware

### Interactive Charts
- Recharts for beautiful visualizations
- Pie chart for rating distribution
- Bar chart for product performance
- Real-time data updates

### Responsive Design
- Tailwind CSS utility classes
- Mobile-first approach
- Works on all screen sizes

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution**: Verify MONGO_URI in .env and ensure MongoDB is running

### Issue: CORS Errors
**Solution**: Check that FRONTEND_URL is set correctly in backend environment variables

### Issue: Socket.IO Not Connecting
**Solution**: Ensure both backend and frontend are running and URLs are correct

### Issue: JWT Token Invalid
**Solution**: Logout and login again to get a fresh token

## 📝 Development Approach

1. **Planning Phase**
   - Analyzed requirements
   - Designed database schema
   - Planned API endpoints

2. **Backend Development**
   - Set up Express server
   - Created MongoDB models
   - Implemented authentication
   - Built RESTful API
   - Added Socket.IO

3. **Frontend Development**
   - Set up React with Vite
   - Implemented component structure
   - Added Tailwind styling
   - Integrated charts
   - Connected to backend API

4. **Testing & Debugging**
   - Tested all API endpoints
   - Fixed CORS issues
   - Verified real-time updates
   - Tested on multiple devices

5. **Deployment**
   - Deployed backend to Render
   - Deployed frontend to Vercel
   - Set up MongoDB Atlas
   - Configured environment variables

## 🎯 Challenges Faced & Solutions

### Challenge 1: CORS Configuration
**Problem**: Frontend couldn't communicate with backend
**Solution**: Configured CORS with proper allowed origins and credentials

### Challenge 2: Real-Time Updates
**Problem**: Socket.IO connection failing in production
**Solution**: Added proper transports configuration and CORS settings

### Challenge 3: Environment Variables
**Problem**: Different URLs for development and production
**Solution**: Used environment variables with fallbacks

### Challenge 4: JWT Authentication
**Problem**: Token expiration handling
**Solution**: Implemented interceptors and automatic logout on 401 errors

## 📚 Learnings

- Implemented full-stack MERN application from scratch
- Learned Socket.IO for real-time communication
- Mastered JWT authentication flow
- Gained experience with Recharts for data visualization
- Deployed applications to modern cloud platforms
- Configured CORS for cross-origin requests
- Implemented responsive design with Tailwind CSS
- Created RESTful API with proper error handling

## 🚀 Future Enhancements

- [ ] Email notifications for new feedback
- [ ] Export feedback to CSV/PDF
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Feedback sentiment analysis
- [ ] Reply to feedback feature
- [ ] User feedback tracking
- [ ] Mobile app version

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Shelfex for the internship opportunity
- MongoDB for excellent documentation
- React team for amazing framework
- Tailwind CSS for utility-first styling
- Recharts for beautiful charts

## 📞 Support

For support or queries:
- Email: hr@shelfexexecution.com
- Create an issue on GitHub

---

**Built with ❤️ for Shelfex Full-Stack Internship Task**
