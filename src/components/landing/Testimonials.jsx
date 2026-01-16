import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Computer Science Student',
        avatar: 'SJ',
        content: 'EduStore has completely transformed how I study. The ability to share notes and collaborate with classmates is incredible!',
        rating: 5,
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        name: 'Michael Chen',
        role: 'Engineering Student',
        avatar: 'MC',
        content: 'Finding study materials has never been easier. The search feature is powerful and the community is super helpful.',
        rating: 5,
        gradient: 'from-indigo-500 to-purple-500'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Medical Student',
        avatar: 'ER',
        content: 'The chat feature lets me connect with students from different universities. It\'s like having study buddies everywhere!',
        rating: 5,
        gradient: 'from-violet-500 to-pink-500'
    },
];

const Testimonials = () => {
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
                        Loved by
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            {' '}Students
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        See what students are saying about their experience with EduStore.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group"
                        >
                            <div className="relative h-full p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                {/* Quote Icon */}
                                <Quote className="absolute top-6 right-6 h-8 w-8 text-indigo-200 dark:text-indigo-900" />

                                {/* Rating */}
                                <div className="flex space-x-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center space-x-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {testimonial.role}
                                        </div>
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

export default Testimonials;
