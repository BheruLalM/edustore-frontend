import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { requestOTP, clearError, googleLogin } from './authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector((state) => state.auth);

    // Clear errors on unmount
    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }

        setLocalLoading(true);
        try {
            await dispatch(requestOTP(email)).unwrap();
            toast.success('OTP sent to your email!');
            navigate('/verify-otp');
        } catch (err) {
            toast.error(err || 'Failed to send OTP');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await dispatch(googleLogin(credentialResponse.credential)).unwrap();
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error(err || 'Google login failed');
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
                        <span className="text-slate-900 dark:text-slate-100">Welcome to </span>
                        <span className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            EduStore
                        </span>
                    </h1>
                    <p className="mt-3 text-slate-600 dark:text-slate-400">
                        Sign in with your email to continue
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            error={error}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={localLoading}
                            className="w-full"
                        >
                            {localLoading ? 'Sending...' : 'Send OTP'}
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Login */}
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error('Google Sign In failed')}
                                useOneTap
                                theme="outline"
                                shape="rectangular"
                                width="100%"
                            />
                        </div>
                    </form>
                </motion.div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-center text-sm text-slate-600 dark:text-slate-400"
                >
                    By continuing, you agree to our{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                        Terms of Service
                    </span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;

