import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 sm:py-32 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600" />

            {/* Animated Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [180, 0, 180],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-8">
                        <Sparkles className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium text-white">
                            Join 10,000+ Students
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to Transform Your
                        <br />
                        Study Experience?
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join EduStore today and discover a better way to learn, share, and succeed together.
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="group inline-flex items-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-2xl hover:shadow-white/20 transition-all"
                    >
                        <span>Get Started for Free</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* Subtext */}
                    <p className="mt-6 text-sm text-white/70">
                        No credit card required • Free forever • Join in seconds
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
