import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Circle, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Avatar from '../../../components/Avatar';

const UserListSidebar = ({ users, selectedUser, onUserSelect }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { onlineUsers, unreadCounts } = useSelector((state) => state.chat);

    // Filter users based on search query
    let filteredUsers = users.filter((user) =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // If we have a selectedUser that isn't in the list (new conversation), prepend them
    if (selectedUser && !filteredUsers.find(u => u._id === selectedUser._id)) {
        filteredUsers = [selectedUser, ...filteredUsers];
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors">
            {/* Mobile Header with Home Button */}
            <div className="md:hidden sticky top-0 z-10 p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Messages</h2>
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

            {/* Search */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                        {searchQuery ? 'No students found' : 'No students available'}
                    </div>
                ) : (
                    filteredUsers.map((user) => {
                        const isOnline = onlineUsers.includes(user._id);
                        const unreadCount = unreadCounts[user._id] || 0;
                        const isSelected = selectedUser?._id === user._id;

                        return (
                            <button
                                key={user._id}
                                onClick={() => onUserSelect(user)}
                                className={`w-full p-3 flex items-center space-x-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-800 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600 dark:border-l-indigo-500' : ''
                                    }`}
                            >
                                <div className="relative">
                                    <Avatar
                                        src={user.profilePic}
                                        alt={user.fullName}
                                        size="md"
                                    />
                                    {isOnline && (
                                        <Circle
                                            className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-white dark:border-slate-900 rounded-full"
                                        />
                                    )}
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={`font-medium text-sm truncate ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'
                                            }`}>{user.fullName}</p>
                                        {unreadCount > 0 && (
                                            <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                    {user.bio && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.bio}</p>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default UserListSidebar;

