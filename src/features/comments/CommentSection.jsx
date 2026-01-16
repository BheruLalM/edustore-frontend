import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { documentService } from '../../services/documentService';
import CommentItem from './CommentItem';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const CommentSection = ({ documentId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState(null); // { id, username }
    const [submitting, setSubmitting] = useState(false);

    // ✅ FIXED: Proper useEffect with cleanup to prevent duplicate fetches
    useEffect(() => {
        let cancelled = false;

        const loadComments = async () => {
            try {
                setLoading(true);
                const response = await documentService.getComments(documentId);
                if (!cancelled) {
                    setComments(response.data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to load comments');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadComments();

        return () => {
            cancelled = true;
        };
    }, [documentId]); // ✅ Only documentId dependency

    const fetchComments = async () => {
        try {
            const response = await documentService.getComments(documentId);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to load comments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const parentId = replyTo ? replyTo.id : null;
            await documentService.addComment(documentId, content, parentId);
            setContent('');
            setReplyTo(null);
            await fetchComments(); // Refresh to see new comment
            toast.success('Comment posted');
        } catch (error) {
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            const response = await documentService.deleteComment(commentId);
            if (response.data && response.data.success === false) {
                toast.error('Failed to delete comment: Unauthorized or not found');
                return;
            }
            await fetchComments();
            toast.success('Comment deleted');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to delete comment');
        }
    };

    const handleReply = (commentId, username) => {
        setReplyTo({ id: commentId, username });
        document.getElementById('comment-input')?.focus();
    };

    if (loading) return <div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                Comments <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">({comments.length})</span>
            </h3>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mb-8">
                {replyTo && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-t-md text-sm text-blue-800 dark:text-blue-200 mb-0 border border-b-0 border-blue-100 dark:border-blue-800">
                        <span>Replying to <b>@{replyTo.username}</b></span>
                        <button
                            type="button"
                            onClick={() => setReplyTo(null)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                <div className="relative">
                    <textarea
                        id="comment-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md p-3 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400 min-h-[80px]"
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting || !content.trim()}
                        className="absolute bottom-3 right-3 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
