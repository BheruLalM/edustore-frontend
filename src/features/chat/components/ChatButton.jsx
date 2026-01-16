import { MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ChatButton = ({ userId = null, userName = null, email = null, variant = 'button', targetIsStudent = true }) => {
    const navigate = useNavigate();
    const { isStudent, unreadCounts } = useSelector((state) => state.chat);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Only render if current user is authenticated
    if (!isAuthenticated) {
        return null;
    }

    // If targeting a specific user, only show if they are a student
    if (userId && !targetIsStudent) {
        return null;
    }

    // Calculate total unread count
    const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

    const handleClick = () => {
        if (!isStudent) {
            toast.error('Only students can access the chat. Please set up your student profile in the profile page.');
            return;
        }

        // Navigate to chat page with optional user params
        if (userId) {
            navigate(`/chat?userId=${userId}&userName=${encodeURIComponent(userName || '')}&email=${encodeURIComponent(email || '')}`);
        } else {
            navigate('/chat');
        }
    };

    // Desktop navbar icon variant
    if (variant === 'icon') {
        return (
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                aria-label="Chat"
            >
                <MessageCircle className="h-5 w-5" />
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                )}
            </motion.button>
        );
    }

    // Mobile bottom nav variant
    if (variant === 'mobile') {
        return (
            <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                aria-label="Chat"
            >
                <MessageCircle size={24} strokeWidth={2} />
                <span className="text-[10px] mt-1 font-semibold">Chat</span>
                {totalUnread > 0 && (
                    <span className="absolute top-0 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                        {totalUnread > 9 ? '9' : totalUnread}
                    </span>
                )}
            </motion.button>
        );
    }

    // Regular button variant (for profile pages - Message button)
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-indigo-500/30"
        >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
        </motion.button>
    );
};

export default ChatButton;


