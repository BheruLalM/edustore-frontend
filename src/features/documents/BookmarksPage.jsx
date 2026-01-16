import { useEffect, useState } from 'react';
import { Bookmark, LayoutGrid } from 'lucide-react';
import Navbar from '../../components/Navbar';
import DocumentCard from '../documents/components/DocumentCard';
import { Skeleton } from '../../components/Skeleton';
import { documentService } from '../../services/documentService';

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const response = await documentService.getBookmarks();
            // Assuming response.data is the list or response.data.items
            setBookmarks(response.data.items || response.data);
        } catch (error) {
            console.error('Failed to fetch bookmarks');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Bookmark className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Documents</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 h-64">
                                <Skeleton className="h-4 w-3/4 mb-4" />
                                <Skeleton className="h-32 w-full rounded-md mb-4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map(doc => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                            <Bookmark className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No bookmarks yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            Documents you save will appear here for quick access.
                            Browse the feed to find interesting content.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookmarksPage;
