import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../features/auth/authSlice';
import { LogOut, Upload, Home, User, Bookmark, Search, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import ChatButton from '../features/chat/components/ChatButton';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    if (!isAuthenticated) return null;

    const navLinks = [
        { to: '/search', icon: Search, label: 'Search' },
        { to: '/bookmarks', icon: Bookmark, label: 'Saved' },
        { to: '/upload', icon: Upload, label: 'Upload' },
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <>
            {/* Top Navigation Bar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/home" className="flex items-center space-x-2">
                                <img src="/edustore.svg" alt="EduStore" className="h-8 sm:h-10 md:h-12 w-auto" />
                            </Link>
                        </div>

                        {/* Mobile Top Actions (Theme + Logout) */}
                        <div className="flex items-center space-x-2 md:hidden">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleLogout}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                    >
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <link.icon size={18} />
                                            <span>{link.label}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}

                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                className="p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>

                            <ChatButton variant="icon" />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Bottom Navigation - Hidden on chat page */}
            {location.pathname !== '/chat' && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 pb-safe shadow-2xl"
                >
                    <div className="flex justify-around items-center px-2 py-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            const isUpload = link.label === 'Upload';

                            if (isUpload) {
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="flex flex-col items-center justify-center -mt-6"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`p-3.5 rounded-full shadow-2xl ${isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/50'
                                                : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                                                }`}
                                        >
                                            <link.icon size={24} />
                                        </motion.div>
                                        <span className="text-xs mt-1 font-semibold text-slate-600 dark:text-slate-400">{link.label}</span>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                >
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        <link.icon
                                            size={24}
                                            className={isActive ? 'fill-current' : ''}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        <span className="text-[10px] mt-1 font-semibold">{link.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}

                        {/* Chat Button */}
                        <div className="flex flex-col items-center justify-center">
                            <ChatButton variant="mobile" />
                        </div>
                    </div>
                </motion.div>
            )}

        </>
    );
};

export default Navbar;
