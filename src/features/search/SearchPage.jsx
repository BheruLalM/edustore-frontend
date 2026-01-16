import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, Users, FileText, Home } from 'lucide-react';
import debounce from 'lodash.debounce';
import searchService from '../../services/searchService';
import DocumentCard from '../documents/components/DocumentCard';
import Avatar from '../../components/Avatar';
import toast from 'react-hot-toast';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get initial query from URL or empty string
    const initialQuery = searchParams.get('query') || '';

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [docResults, setDocResults] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'documents', 'users'

    // Create the debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setDocResults([]);
                setUserResults([]);
                return;
            }

            setLoading(true);
            try {
                // Execute searches in parallel
                const [docsData, usersData] = await Promise.all([
                    searchService.searchDocuments(query),
                    searchService.searchUsers(query)
                ]);

                setDocResults(docsData.results || []);
                setUserResults(usersData.results || []);

                // Update URL without reloading page
                setSearchParams({ query }, { replace: true });
            } catch (error) {
                console.error('Search failed:', error);
                // toast.error('Failed to search'); // Optional: suppressing toast for auto-search to avoid spam
            } finally {
                setLoading(false);
            }
        }, 500), // 500ms delay
        []
    );

    // Effect to trigger search when searchTerm changes
    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        } else {
            setDocResults([]);
            setUserResults([]);
            setSearchParams({});
        }

        // Cleanup debounce on unmount
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch, setSearchParams]);

    // Handle manual input change
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const hasResults = docResults.length > 0 || userResults.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header with Back Button and Search Input */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Go back"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>

                <Link
                    to="/"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                    title="Go Home"
                >
                    <Home className="h-6 w-6" />
                </Link>

                <div className="relative flex-1 max-w-2xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search for documents, users, posts..."
                        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        autoFocus
                    />
                    <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    {loading && (
                        <div className="absolute right-4 top-3.5">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            {searchTerm && !loading && !hasResults ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Filter Tabs (Optional - can be added if results are dense) */}

                    {/* Users Section */}
                    {userResults.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                People
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userResults.map(user => (
                                    <Link
                                        key={user.id}
                                        to={`/profile/${user.id}`}
                                        className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow"
                                    >
                                        <Avatar src={user.profile_url} alt={user.name} size="md" />
                                        <div className="ml-3 overflow-hidden">
                                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.college || 'No college info'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Documents Section */}
                    {docResults.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Documents & Posts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {docResults.map((doc) => (
                                    <DocumentCard key={doc.id} document={doc} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
