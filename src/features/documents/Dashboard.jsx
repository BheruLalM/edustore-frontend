import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicFeed, fetchFollowingFeed, setCurrentFeed, loadMorePublicFeed, loadMoreFollowingFeed } from './documentSlice';
import DocumentCard from './components/DocumentCard';
import Navbar from '../../components/Navbar';
import CreatePost from './CreatePost';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '../../components/Skeleton';


const Dashboard = () => {
    const dispatch = useDispatch();
    const {
        publicFeed,
        followingFeed,
        loading,
        currentFeed,
        publicPagination,
        followingPagination,
        loadingMore
    } = useSelector((state) => state.documents);

    // ✅ FIXED: Removed dispatch from dependencies to prevent duplicate API calls
    useEffect(() => {
        if (currentFeed === 'public') {
            dispatch(fetchPublicFeed({ limit: 20, offset: 0 }));
        } else {
            dispatch(fetchFollowingFeed({ limit: 20, offset: 0 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFeed]); // Only re-run when feed type changes

    const handleFeedChange = (feedType) => {
        dispatch(setCurrentFeed(feedType));
    };

    const handlePostCreated = () => {
        // Refresh the current feed
        if (currentFeed === 'public') {
            dispatch(fetchPublicFeed({ limit: 20, offset: 0 }));
        } else {
            dispatch(fetchFollowingFeed({ limit: 20, offset: 0 }));
        }
    };

    // ✅ NEW: Load More handler for pagination
    const handleLoadMore = () => {
        if (currentFeed === 'public') {
            dispatch(loadMorePublicFeed());
        } else {
            dispatch(loadMoreFollowingFeed());
        }
    };

    const feed = currentFeed === 'public' ? publicFeed : followingFeed;
    const pagination = currentFeed === 'public' ? publicPagination : followingPagination;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Create Post Widget */}
                <div className="mb-6">
                    <CreatePost onPostCreated={handlePostCreated} />
                </div>

                <div className="mb-6">
                    <div className="flex space-x-4 border-b dark:border-gray-800">
                        <button
                            onClick={() => handleFeedChange('public')}
                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${currentFeed === 'public'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Public Feed
                        </button>
                        <button
                            onClick={() => handleFeedChange('following')}
                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${currentFeed === 'following'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Following
                        </button>
                    </div>
                </div>

                {/* Feed Content */}
                {loading && feed.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 h-48 flex flex-col justify-between">
                                <div>
                                    <Skeleton className="h-6 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700" />
                                    <Skeleton className="h-20 w-full mb-4 bg-gray-200 dark:bg-gray-700" />
                                </div>
                                <div className="flex space-x-2">
                                    <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
                                    <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : feed.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            {currentFeed === 'public'
                                ? 'No public documents found.'
                                : 'No documents from people you follow.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {feed.map((doc) => (
                                <DocumentCard key={doc.id} document={doc} />
                            ))}
                        </div>

                        {/* ✅ NEW: Load More Button */}
                        {pagination.hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                >
                                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>{loadingMore ? 'Loading...' : 'Load More'}</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
};

export default Dashboard;

