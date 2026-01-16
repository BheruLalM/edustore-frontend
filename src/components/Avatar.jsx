import { useState } from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Avatar = ({ src, alt, size = 'md', className, online = false, showOnlineStatus = false }) => {
    const [error, setError] = useState(false);

    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-16 w-16 text-base',
        xl: 'h-24 w-24 text-xl',
    };

    const initials = alt
        ? alt.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    return (
        <div className="relative inline-flex">
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "relative inline-flex shrink-0 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
                    sizes[size],
                    className
                )}
            >
                {!error && src ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={() => setError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold">
                        {initials}
                    </div>
                )}
            </motion.div>

            {showOnlineStatus && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white dark:border-slate-900",
                        online ? "bg-green-500 animate-pulse-glow" : "bg-slate-400"
                    )}
                />
            )}
        </div>
    );
};

export default Avatar;

