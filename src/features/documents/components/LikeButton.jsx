import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleLike } from '../documentSlice';
import { cn } from '../../../utils/cn';
import toast from 'react-hot-toast';

const LikeButton = ({ documentId, isLiked, likeCount, className }) => {
    const dispatch = useDispatch();
    const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
    const [optimisticCount, setOptimisticCount] = useState(likeCount || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    // Sync state with props when backend data arrives
    useEffect(() => {
        setOptimisticLiked(isLiked);
        setOptimisticCount(likeCount || 0);
    }, [isLiked, likeCount]);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const newLikedState = !optimisticLiked;
        setOptimisticLiked(newLikedState);
        setOptimisticCount(prev => newLikedState ? prev + 1 : prev - 1);
        setIsAnimating(true);

        // Show particles on like
        if (newLikedState) {
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 600);
        }

        try {
            const result = await dispatch(toggleLike({ documentId, isLiked: optimisticLiked })).unwrap();

            // Sync with authoritative backend count
            if (result.like_count !== undefined) {
                setOptimisticCount(result.like_count);
            }
        } catch (error) {
            // Rollback
            setOptimisticLiked(!newLikedState);
            setOptimisticCount(prev => !newLikedState ? prev + 1 : prev - 1);
            toast.error('Failed to update like');
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={cn(
                    "flex items-center space-x-2 transition-all duration-300 group px-3 py-1.5 rounded-lg",
                    optimisticLiked
                        ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                        : "text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
                    className
                )}
            >
                <motion.div
                    animate={isAnimating && optimisticLiked ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <Heart
                        className={cn(
                            "h-5 w-5 transition-all duration-300",
                            optimisticLiked && "fill-current"
                        )}
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.span
                        key={optimisticCount}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-sm font-semibold tabular-nums"
                    >
                        {optimisticCount > 0 ? optimisticCount : ''}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            {/* Particle burst effect */}
            <AnimatePresence>
                {showParticles && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    scale: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    opacity: 0,
                                    scale: 1,
                                    x: Math.cos((i * 60) * Math.PI / 180) * 30,
                                    y: Math.sin((i * 60) * Math.PI / 180) * 30
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LikeButton;

