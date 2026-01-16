import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleBookmark } from '../documentSlice';
import { cn } from '../../../utils/cn';
import toast from 'react-hot-toast';

const BookmarkButton = ({ documentId, isBookmarked, className }) => {
    const dispatch = useDispatch();
    const [optimisticBookmarked, setOptimisticBookmarked] = useState(isBookmarked);
    const [isAnimating, setIsAnimating] = useState(false);

    // Sync state with props when backend data arrives
    useEffect(() => {
        setOptimisticBookmarked(isBookmarked);
    }, [isBookmarked]);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const newBookmarkedState = !optimisticBookmarked;
        setOptimisticBookmarked(newBookmarkedState);
        setIsAnimating(true);

        try {
            await dispatch(toggleBookmark({ documentId, isBookmarked: optimisticBookmarked })).unwrap();
            if (newBookmarkedState) {
                toast.success('Document saved');
            }
        } catch (error) {
            // Rollback
            setOptimisticBookmarked(!newBookmarkedState);
            toast.error('Failed to update bookmark');
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
            className={cn(
                "flex items-center transition-all duration-300 p-2 rounded-lg",
                optimisticBookmarked
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                className
            )}
        >
            <motion.div
                animate={isAnimating && optimisticBookmarked ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0]
                } : {}}
                transition={{ duration: 0.3 }}
            >
                <Bookmark
                    className={cn(
                        "h-5 w-5 transition-all duration-300",
                        optimisticBookmarked && "fill-current"
                    )}
                />
            </motion.div>
        </motion.button>
    );
};

export default BookmarkButton;

