import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMessages, markAsRead } from '../chatSlice';
import { Check, CheckCheck } from 'lucide-react';

const MessageList = ({ userId }) => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const { messages, chatToken, chatUserData } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);

    const currentUserId = chatUserData?._id || user?.user_id || user?.id;

    useEffect(() => {
        if (userId && chatToken) {
            dispatch(fetchMessages(userId));
            dispatch(markAsRead(userId));
        }
    }, [userId, chatToken, dispatch]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No messages yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Start the conversation!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-end min-h-full p-4 space-y-3">
            {messages.map((message, index) => {
                const isSent = String(message.senderId) === String(currentUserId);

                return (
                    <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] sm:max-w-[70%] rounded-2xl p-3 shadow-sm ${isSent
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Shared image"
                                    className="rounded-xl mb-2 max-w-full h-auto"
                                />
                            )}
                            {message.text && (
                                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                    {message.text}
                                </p>
                            )}
                            <div
                                className={`flex items-center justify-end mt-1.5 space-x-1 text-xs ${isSent ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                <span>
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                                {isSent && (
                                    message.seen ? (
                                        <CheckCheck className="h-3.5 w-3.5" />
                                    ) : (
                                        <Check className="h-3.5 w-3.5" />
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;

