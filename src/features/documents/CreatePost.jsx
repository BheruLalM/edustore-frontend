import { useState } from 'react';
import { Send, FileText, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar'; // Import Avatar
import { useSelector } from 'react-redux';
import api from '../../services/api'; // Import api to use post call directly or move to service
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            // According to post.py, endpoint is /documents/post
            // Payload: CreateTextPostSchema { title, content, visibility }
            // For simple posts, we can use content as title or truncated content.
            const title = content.length > 30 ? content.substring(0, 30) + '...' : content;

            await api.post('/documents/post', {
                title: title,
                content: content,
                visibility: 'public' // Default public
            });

            setContent('');
            toast.success('Post shared successfully');
            if (onPostCreated) onPostCreated();

        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 mb-6">
            <div className="flex items-start space-x-3">
                <Avatar src={user?.profile_url} alt={user?.name} />
                <div className="flex-1">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full border-none focus:ring-0 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg min-h-[60px] bg-transparent"
                            placeholder="Share your thoughts, resource, or question..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
                                <FileText className="h-5 w-5 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors" />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!content.trim() || loading}
                                isLoading={loading}
                            >
                                Post
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
