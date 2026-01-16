import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, MessageCircle, Reply } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { documentService } from '../../services/documentService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const CommentItem = ({ comment, onReply, onDelete, depth = 0 }) => {
    const { user } = useSelector(state => state.auth);
    // Handle backend inconsistency: auth user has user_id, comment user has id
    const currentUserId = user?.user_id || user?.id;
    const isOwner = Number(currentUserId) === Number(comment.user.id);

    return (
        <div className={cn("flex space-x-3", depth > 0 && "mt-4")}>
            <Avatar
                src={comment.user.avatar_url}
                alt={comment.user.username}
                size={depth === 0 ? "md" : "sm"}
            />

            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link
                            to={`/profile/${comment.user.id}`}
                            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            {comment.user.name || comment.user.username || comment.user.email || 'User'}
                        </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                    </div>

                    {isOwner && !comment.is_deleted && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="text-sm text-gray-800 dark:text-gray-200 break-words">
                    {comment.is_deleted ? (
                        <span className="text-gray-500 dark:text-gray-500 italic">[This comment was deleted]</span>
                    ) : (
                        comment.content
                    )}
                </div>

                {!comment.is_deleted && (
                    <button
                        onClick={() => onReply(comment.id, comment.user.name || comment.user.username || comment.user.email)}
                        className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pt-1"
                    >
                        <Reply className="h-3 w-3" />
                        <span>Reply</span>
                    </button>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pt-2 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onDelete={onDelete}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
