import { motion } from 'framer-motion';
import { Upload, Lock, MessageCircle, Users, Search, Bookmark } from 'lucide-react';

const features = [
    {
        icon: Upload,
        title: 'Upload & Share',
        description: 'Upload your study materials and share them with the community or keep them private.',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Lock,
        title: 'Privacy Control',
        description: 'Choose who can see your documents with flexible privacy settings.',
        gradient: 'from-indigo-500 to-purple-500'
    },
    {
        icon: MessageCircle,
        title: 'Real-time Chat',
        description: 'Connect and collaborate with fellow students through instant messaging.',
        gradient: 'from-violet-500 to-pink-500'
    },
    {
        icon: Users,
        title: 'Follow Students',
        description: 'Build your network by following students and staying updated with their content.',
        gradient: 'from-purple-500 to-indigo-500'
    },
    {
        icon: Search,
        title: 'Smart Search',
        description: 'Find exactly what you need with powerful search across documents and users.',
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        icon: Bookmark,
        title: 'Save & Organize',
        description: 'Bookmark important documents and organize your study materials efficiently.',
        gradient: 'from-pink-500 to-rose-500'
    },
];

const FeatureCards = () => {
    return (
        <section id="features" className="py-20 sm:py-32 bg-white dark:bg-slate-900">
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
                        Everything You Need to
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            {' '}Excel
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Powerful features designed to make studying easier, more collaborative, and more effective.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative"
                        >
                            <div className="relative h-full p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                {/* Icon */}
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    {feature.description}
                                </p>

                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureCards;
