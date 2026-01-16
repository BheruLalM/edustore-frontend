import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchChatUsers, setActiveChat, clearActiveChat } from '../chatSlice';
import UserListSidebar from './UserListSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatModal = ({ onClose, initialUserId = null, initialUserName = null, initialUserEmail = null }) => {
    const dispatch = useDispatch();
    const { conversations, activeChat } = useSelector((state) => state.chat);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Fetch users when modal opens
        dispatch(fetchChatUsers());

        return () => {
            dispatch(clearActiveChat());
        };
    }, [dispatch]);

    useEffect(() => {
        // If initial user is provided, find them in conversations
        if (initialUserId && conversations.length > 0) {
            const userInChat = conversations.find(u => String(u.postgresId) === String(initialUserId));
            if (userInChat) {
                setSelectedUser(userInChat);
                dispatch(setActiveChat(userInChat._id));
            } else if (!selectedUser) {
                // Handle case where user is not in conversations yet
                setSelectedUser({ _id: initialUserId, postgresId: initialUserId, fullName: initialUserName, email: initialUserEmail });
                dispatch(setActiveChat(initialUserId));
            }
        }
    }, [initialUserId, initialUserName, initialUserEmail, conversations, dispatch, selectedUser]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        dispatch(setActiveChat(user._id));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] sm:h-[600px] md:h-[700px] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                        <h2 className="text-xl sm:text-2xl font-bold">Messages</h2>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </motion.button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex flex-1 overflow-hidden relative">
                        {/* User List Sidebar */}
                        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto ${selectedUser ? 'hidden md:block' : ''}`}>
                            <UserListSidebar
                                users={conversations}
                                selectedUser={selectedUser}
                                onUserSelect={handleUserSelect}
                            />
                        </div>

                        {/* Message Area */}
                        <div className={`flex-1 flex flex-col w-full bg-white dark:bg-slate-900 ${!selectedUser ? 'hidden md:flex' : ''}`}>
                            {selectedUser ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSelectedUser(null)}
                                            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                        </motion.button>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100 truncate">{selectedUser.fullName}</h3>
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                                        <MessageList userId={selectedUser._id} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                        <MessageInput userId={selectedUser._id} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center p-4 sm:p-8"
                                    >
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                                            <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                                        </div>
                                        <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Select a conversation</p>
                                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Choose a student from the list to start chatting</p>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatModal;

