import React from 'react';

/**
 * Loading fallback component for React.lazy() Suspense boundaries
 * Provides consistent loading UI across all lazy-loaded routes
 */
const LoadingFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;
