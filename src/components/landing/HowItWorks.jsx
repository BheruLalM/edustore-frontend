import { motion } from 'framer-motion';
import { UserPlus, Upload, MessageSquare, GraduationCap, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: UserPlus,
        title: 'Create Account',
        description: 'Sign up in seconds with your email or Google account.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        number: '02',
        icon: Upload,
        title: 'Upload or Browse',
        description: 'Share your notes or explore thousands of study materials.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        number: '03',
        icon: MessageSquare,
        title: 'Connect & Chat',
        description: 'Follow students, join discussions, and collaborate in real-time.',
        color: 'from-violet-500 to-pink-500'
    },
    {
        number: '04',
        icon: GraduationCap,
        title: 'Study Smarter',
        description: 'Access organized resources and ace your exams with confidence.',
        color: 'from-purple-500 to-indigo-500'
    },
];

const HowItWorks = () => {
    return (
        <section className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        How It
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            {' '}Works
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Get started in four simple steps and join a thriving community of learners.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line (hidden on mobile) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200 dark:from-indigo-900 dark:via-violet-900 dark:to-indigo-900 transform -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="relative z-10 text-center">
                                    {/* Number Badge */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 mb-6">
                                        <span className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.color} mb-6`}>
                                        <step.icon className="h-8 w-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow (hidden on mobile and last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                                        <ArrowRight className="h-6 w-6 text-indigo-400 dark:text-indigo-600" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
