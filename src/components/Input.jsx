import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className,
    type = 'text',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={18} />
                    </div>
                )}
                <motion.input
                    ref={ref}
                    type={type}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300",
                        "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
                        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                        isFocused
                            ? "border-indigo-500 shadow-glow-sm"
                            : "border-slate-200 dark:border-slate-700",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        Icon && "pl-10",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
