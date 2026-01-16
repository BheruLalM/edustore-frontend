import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Badge = ({
    children,
    variant = 'default',
    pulse = false,
    className,
    ...props
}) => {
    const variants = {
        default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
        primary: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        danger: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    return (
        <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
                "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                variants[variant],
                pulse && "animate-pulse-glow",
                className
            )}
            {...props}
        >
            {children}
        </motion.span>
    );
};

export default Badge;
