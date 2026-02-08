import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Home } from 'lucide-react';
import { fetchChatUsers, setActiveChat, clearActiveChat, resolveTargetUser } from './chatSlice';
import UserListSidebar from './components/UserListSidebar';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Navbar from '../../components/Navbar';

const ChatPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { conversations, activeChat, chatToken } = useSelector((state) => state.chat);
    const [selectedUser, setSelectedUser] = useState(null);

    // Get initial user from URL params
    const initialUserId = searchParams.get('userId');
    const initialUserName = searchParams.get('userName');
    const initialUserEmail = searchParams.get('email');

    // Lock body scroll on mobile when component mounts
    useEffect(() => {
        // Only lock scroll on mobile when chat is selected
        if (selectedUser && window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }

        return () => {
            // Restore scroll when component unmounts or user deselected
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [selectedUser]);

    useEffect(() => {
        // Fetch users when token becomes available
        if (chatToken) {
            dispatch(fetchChatUsers());
        }

        return () => {
            dispatch(clearActiveChat());
        };
    }, [dispatch, chatToken]);

    useEffect(() => {
        const initializeChat = async () => {
            if (!initialUserId) return;

            // 1. Try to find in existing conversations
            const userInChat = conversations.find(u => String(u.postgresId) === String(initialUserId));

            if (userInChat) {
                setSelectedUser(userInChat);
                dispatch(setActiveChat(userInChat._id));
            } else if (initialUserName && initialUserEmail) {
                // 2. Not found, but we have details -> Resolve/Sync with Chat DB
                try {
                    const resolvedUser = await dispatch(resolveTargetUser({
                        postgresId: initialUserId,
                        fullName: initialUserName,
                        email: initialUserEmail
                    })).unwrap();

                    setSelectedUser(resolvedUser);
                    dispatch(setActiveChat(resolvedUser._id));
                } catch (error) {
                    console.error("Failed to resolve user:", error);
                }
            }
        };

        if (chatToken) {
            initializeChat();
        }
    }, [initialUserId, initialUserName, initialUserEmail, conversations.length, chatToken, dispatch]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        dispatch(setActiveChat(user._id));
    };

    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Navbar - Hidden on mobile when chat is selected */}
            <div className={selectedUser ? 'hidden md:block' : ''}>
                <Navbar />
            </div>

            {/* Chat Container */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* User List Sidebar - Desktop */}
                <div className={`absolute inset-0 z-20 md:relative md:inset-auto md:z-0 w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto ${selectedUser ? 'hidden md:block' : 'block'}`}>
                    <UserListSidebar
                        users={conversations}
                        selectedUser={selectedUser}
                        onUserSelect={handleUserSelect}
                    />
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            {/* Sticky Chat Header */}
                            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center space-x-3 flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors md:hidden"
                                >
                                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                </motion.button>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100 truncate">{selectedUser.fullName}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{selectedUser.email}</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate('/home')}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    aria-label="Home"
                                >
                                    <Home className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                </motion.button>
                            </div>

                            {/* Scrollable Messages Area */}
                            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 scroll-smooth">
                                <MessageList userId={selectedUser._id} />
                            </div>

                            {/* Sticky Message Input at Bottom */}
                            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <MessageInput userId={selectedUser._id} />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                                    <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                                </div>
                                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Select a conversation</p>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Choose a student from the list to start chatting</p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
