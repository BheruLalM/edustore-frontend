import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, Users, TrendingUp, Heart } from 'lucide-react';

const benefits = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Optimized performance for quick access to all your study materials.',
        color: 'text-yellow-500'
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Your data is encrypted and protected with industry-standard security.',
        color: 'text-green-500'
    },
    {
        icon: Sparkles,
        title: 'Clean Interface',
        description: 'Beautiful, intuitive design that makes studying a pleasure.',
        color: 'text-purple-500'
    },
    {
        icon: Users,
        title: 'Community Powered',
        description: 'Join thousands of students sharing knowledge and helping each other.',
        color: 'text-blue-500'
    },
    {
        icon: TrendingUp,
        title: 'Smart Organization',
        description: 'AI-powered search and categorization keeps everything organized.',
        color: 'text-indigo-500'
    },
    {
        icon: Heart,
        title: 'Built for Students',
        description: 'Every feature designed with student needs and workflows in mind.',
        color: 'text-pink-500'
    },
];

const Benefits = () => {
    return (
        <section className="py-20 sm:py-32 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950">
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
                        Why Choose
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            {' '}EduStore?
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Built by students, for students. Experience the difference.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="h-full p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                {/* Icon */}
                                <div className="mb-6">
                                    <benefit.icon className={`h-12 w-12 ${benefit.color} group-hover:scale-110 transition-transform`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
