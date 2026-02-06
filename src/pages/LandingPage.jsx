import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Users } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-3xl"
                />
            </div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center relative z-10 max-w-4xl"
            >
                {/* Project Name */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight mb-6"
                >
                    <span className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        EduStore
                    </span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto"
                >
                    Share, Discover, and Collaborate on Educational Resources
                </motion.p>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-6 mb-12 text-slate-500 dark:text-slate-500 text-sm md:text-base"
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Browse Documents</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Upload & Share</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Connect with Learners</span>
                    </div>
                </motion.div>

                {/* Buttons Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    {/* Get Started Button (Primary) */}
                    <button
                        onClick={handleNavigation}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Get Started
                    </button>

                    {/* Login Button (Secondary) */}
                    <button
                        onClick={handleNavigation}
                        className="w-full sm:w-auto px-10 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 dark:hover:bg-slate-800 transform hover:scale-105 transition-all duration-200"
                    >
                        Login
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
