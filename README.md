# EduStore Frontend

A modern, production-ready React frontend for the EduStore document sharing platform, built with Vite, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Email OTP-based login with HttpOnly cookie sessions
- **Document Management**: Upload, view, download, and manage documents
- **Social Features**: Like, bookmark, comment, and follow users
- **Feed System**: Public and following feeds with real-time updates
- **Responsive Design**: Mobile-first, clean UI with Tailwind CSS

## 📦 Tech Stack

- **Build Tool**: Vite
- **Framework**: React 18 (JavaScript)
- **State Management**: Redux Toolkit + React Redux
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with cookie support)
- **Styling**: Tailwind CSS
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 🛠️ Installation

```bash
cd frontend
npm install
```

## ⚙️ Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🏃 Running the App

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── app/
│   └── store.js                    # Redux store configuration
├── features/
│   ├── auth/
│   │   ├── authSlice.js           # Auth state management
│   │   ├── Login.jsx              # Login page
│   │   └── VerifyOTP.jsx          # OTP verification page
│   └── documents/
│       ├── documentSlice.js       # Document state management
│       ├── Dashboard.jsx          # Main feed page
│       ├── DocumentUpload.jsx     # Upload page
│       └── components/
│           └── DocumentCard.jsx   # Document card component
├── components/
│   ├── Navbar.jsx                 # Navigation bar
│   ├── ProtectedRoute.jsx         # Auth guard for protected routes
│   └── PublicRoute.jsx            # Guard for public routes
├── services/
│   ├── api.js                     # Axios instance with interceptors
│   ├── authService.js             # Auth API calls
│   ├── documentService.js         # Document API calls
│   └── profileService.js          # Profile API calls
├── App.jsx                        # Main app component with routing
├── main.jsx                       # Entry point
└── index.css                      # Global styles with Tailwind
```

## 🔐 Authentication Flow

1. User enters email on login page
2. Backend sends OTP to email
3. User enters 6-digit OTP
4. Backend sets HttpOnly cookies (access_token, refresh_token)
5. Frontend stores user data in Redux
6. Protected routes check auth state
7. Auto-refresh handles token expiration

## 📡 API Integration

### Cookie-Based Auth
All API requests include `withCredentials: true` to send HttpOnly cookies.

### Auto-Refresh
The Axios interceptor automatically refreshes tokens on 401 errors.

### File Upload Flow
1. Request upload URL: `POST /documents/upload-url`
2. Upload file directly to storage (S3/Supabase)
3. Commit upload with metadata: `POST /documents/commit`

## 🧪 Testing the Integration

1. Start the backend:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Test flow:
   - Go to `http://localhost:5173`
   - Enter email → Request OTP
   - Check email for OTP
   - Enter OTP → Login
   - View public feed
   - Upload a document
   - Like/bookmark documents

---

**Built with ❤️ using React + Vite + Redux Toolkit**
