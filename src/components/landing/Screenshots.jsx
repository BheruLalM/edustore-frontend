import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';

const Screenshots = () => {
    const screenshots = [
        {
            title: 'Document Feed',
            description: 'Browse and discover study materials',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Document Viewer',
            description: 'Read and interact with documents',
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            title: 'Real-time Chat',
            description: 'Connect with fellow students',
            gradient: 'from-violet-500 to-pink-500'
        },
    ];

    return (
        <section className="py-20 sm:py-32 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        See It In
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            {' '}Action
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Experience the intuitive interface designed for seamless studying and collaboration.
                    </p>
                </motion.div>

                {/* Screenshot Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {screenshots.map((screenshot, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group"
                        >
                            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                {/* Mock Screenshot */}
                                <div className={`aspect-[4/3] bg-gradient-to-br ${screenshot.gradient} p-8 flex items-center justify-center`}>
                                    <Monitor className="h-24 w-24 text-white/20" />
                                </div>

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {screenshot.title}
                                        </h3>
                                        <p className="text-slate-200 text-sm">
                                            {screenshot.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Screenshots;
