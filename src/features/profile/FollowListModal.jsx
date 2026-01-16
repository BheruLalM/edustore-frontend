import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { fetchFollowers, fetchFollowing, loadMoreFollowers, loadMoreFollowing } from './profileSlice';

const FollowListModal = ({ userId, type, onClose }) => {
    const dispatch = useDispatch();
    const {
        followers,
        following,
        listLoading,
        loadingMore,
        followersPagination,
        followingPagination
    } = useSelector(state => state.profile);
    const fetchedRef = useRef(false);

    // Reset fetchedRef when userId or type changes
    useEffect(() => {
        fetchedRef.current = false;
    }, [userId, type]);

    useEffect(() => {
        // Prevent duplicate fetches on mount/remount
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        if (type === 'followers') {
            dispatch(fetchFollowers({ userId, limit: 20, offset: 0 }));
        } else {
            dispatch(fetchFollowing({ userId, limit: 20, offset: 0 }));
        }
    }, [dispatch, userId, type]);

    const list = type === 'followers' ? followers : following;
    const pagination = type === 'followers' ? followersPagination : followingPagination;

    const handleLoadMore = () => {
        if (type === 'followers') {
            dispatch(loadMoreFollowers(userId));
        } else {
            dispatch(loadMoreFollowing(userId));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[80vh] flex flex-col transition-colors">
                {/* Header */}
                <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 capitalize">{type}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-4 space-y-4 flex-1">
                    {listLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {list.length > 0 ? (
                                list.map(user => (
                                    <div key={user.user_id} className="flex items-center justify-between">
                                        <Link
                                            to={`/profile/${user.user_id}`}
                                            onClick={onClose}
                                            className="flex items-center space-x-3 group"
                                        >
                                            <Avatar src={user.profile_url} alt={user.name || user.email} />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {user.name || user.email.split('@')[0]}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    No users found.
                                </div>
                            )}

                            {/* Load More Button */}
                            {pagination.hasMore && list.length > 0 && (
                                <div className="flex justify-center pt-2 pb-4">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                                    >
                                        {loadingMore ? 'Loading...' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;
