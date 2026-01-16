import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth, resetAuth } from './features/auth/authSlice';
import { syncToChat } from './features/chat/chatSlice';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoadingFallback from './components/LoadingFallback';

// Lazy load all pages for code splitting
const Login = lazy(() => import('./features/auth/Login'));
const VerifyOTP = lazy(() => import('./features/auth/VerifyOTP'));
const Dashboard = lazy(() => import('./features/documents/Dashboard'));
const DocumentUpload = lazy(() => import('./features/documents/DocumentUpload'));
const DocumentView = lazy(() => import('./features/documents/DocumentView'));
const BookmarksPage = lazy(() => import('./features/documents/BookmarksPage'));
const Profile = lazy(() => import('./features/profile/Profile'));
const SearchPage = lazy(() => import('./features/search/SearchPage'));
const ChatPage = lazy(() => import('./features/chat/ChatPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Socket provider - will lazy load socket.io internally
import { SocketProvider } from './features/chat/SocketContext';

function App() {
  const dispatch = useDispatch();
  const { isInitialized, isAuthenticated } = useSelector((state) => state.auth);
  const { chatToken, chatUserData } = useSelector((state) => state.chat);

  useEffect(() => {
    // Check auth status on app load
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    // Sync chat if authenticated and chat data is missing
    if (isAuthenticated && (!chatToken || !chatUserData)) {
      dispatch(syncToChat());
    }
  }, [isAuthenticated, chatToken, chatUserData, dispatch]);

  useEffect(() => {
    // Listen for unauthorized events from the API interceptor
    const handleUnauthorized = () => {
      dispatch(resetAuth());
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          className: 'text-sm font-medium',
          duration: 3000,
        }} />

        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/upload" element={<DocumentUpload />} />
              <Route path="/documents/:id" element={<DocumentView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
