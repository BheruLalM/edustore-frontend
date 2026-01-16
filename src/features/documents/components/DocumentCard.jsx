import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import Avatar from '../../../components/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { documentService } from '../../../services/documentService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);

    // Check if current user is the owner
    const isOwner = currentUser && (currentUser.id === document.owner_id || currentUser.id === document.user_id);

    // Determine icon based on type
    const isPdf = document.doc_type === 'pdf' || document.content_type?.includes('pdf');
    const isImage = document.doc_type === 'image' || document.content_type?.includes('image');

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    // Handle profile navigation without nested Link
    const handleProfileClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/profile/${document.owner_id || document.user_id || '#'}`);
    };

    // Handle comment navigation without nested Link
    const handleCommentClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/documents/${document.id}`);
    };

    // Handle delete
    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        try {
            await documentService.deleteDocument(document.id);
            toast.success('Document deleted successfully');
            if (onDelete) {
                onDelete(document.id);
            }
            window.location.reload();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.detail || 'Failed to delete document');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                to={`/documents/${document.id}`}
                className="block bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-indigo-400/50 transition-all duration-300 overflow-hidden group"
            >
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleProfileClick}
                            className="flex items-center space-x-3 group/author z-10 hover:opacity-80 transition-opacity"
                            type="button"
                        >
                            <Avatar
                                src={document.owner_avatar}
                                alt={document.owner_name}
                                size="md"
                            />
                            <div className="flex flex-col">
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {document.owner_name || document.owner_email}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        </button>

                        {/* Delete button for owners */}
                        {isOwner && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDelete}
                                disabled={deleting}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                                title="Delete document"
                                type="button"
                            >
                                <Trash2 className="h-4 w-4" />
                            </motion.button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="min-h-[120px]">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {document.title}
                        </h3>

                        {document.content && (
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                {document.content}
                            </p>
                        )}
                    </div>

                    {/* Meta Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${document.doc_type === 'text' || document.doc_type === 'post'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : isPdf
                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            }`}>
                            {document.doc_type === 'text' || document.doc_type === 'post'
                                ? <FileText className="h-3 w-3" />
                                : isPdf ? <FileText className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                            {(document.doc_type?.toUpperCase() === 'TEXT' ? 'POST' : document.doc_type?.toUpperCase()) || 'FILE'}
                        </span>

                        {document.doc_type !== 'text' && document.doc_type !== 'post' && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {formatFileSize(document.file_size)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Footer */}
                <div
                    className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between backdrop-blur-sm"
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="flex items-center space-x-6">
                        <LikeButton
                            documentId={document.id}
                            isLiked={document.is_liked}
                            likeCount={document.like_count || 0}
                        />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCommentClick}
                            className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            type="button"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm font-semibold tabular-nums">{document.comment_count || 0}</span>
                        </motion.button>
                    </div>

                    <BookmarkButton
                        documentId={document.id}
                        isBookmarked={document.is_bookmarked}
                    />
                </div>
            </Link>
        </motion.div>
    );
};

export default DocumentCard;

