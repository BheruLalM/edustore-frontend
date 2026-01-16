import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { verifyOTP, clearError } from './authSlice';
import { syncToChat } from '../chat/chatSlice';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpEmail } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!otpEmail) {
            navigate('/login');
        }
    }, [otpEmail, navigate]);

    useEffect(() => {
        // Auto-focus first input
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            await dispatch(verifyOTP({ email: otpEmail, otp: otpString })).unwrap();

            // Show success animation
            setSuccess(true);

            // Try to sync to chat (only works for students)
            try {
                await dispatch(syncToChat()).unwrap();
            } catch (chatError) {
                console.log('Chat sync skipped:', chatError);
            }

            toast.success('Login successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            toast.error(err || 'Invalid OTP');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full space-y-8 relative z-10"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Verify OTP
                        </span>
                    </h1>
                    <p className="mt-3 text-slate-600 dark:text-slate-400">
                        Enter the 6-digit code sent to
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {otpEmail}
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8"
                >
                    {success ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-center justify-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4"
                            >
                                <Check size={40} className="text-white" />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-semibold text-slate-900 dark:text-slate-100"
                            >
                                Verification Successful!
                            </motion.p>
                        </motion.div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* OTP Input Boxes */}
                            <div className="flex justify-center gap-2 md:gap-3">
                                {otp.map((digit, index) => (
                                    <motion.input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:shadow-glow-sm border-slate-200 dark:border-slate-700"
                                    />
                                ))}
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={loading}
                                className="w-full"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>

                            <div className="text-center">
                                <motion.button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    whileHover={{ x: -4 }}
                                    className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to login
                                </motion.button>
                            </div>
                        </form>
                    )}
                </motion.div>

                {/* Resend OTP */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-center text-sm text-slate-600 dark:text-slate-400"
                >
                    Didn't receive the code?{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-semibold">
                        Resend OTP
                    </span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;

