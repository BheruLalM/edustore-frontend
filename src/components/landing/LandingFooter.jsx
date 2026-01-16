import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'How It Works', href: '#how-it-works' },
            { name: 'Pricing', href: '#' },
            { name: 'FAQ', href: '#' },
        ],
        company: [
            { name: 'About Us', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Contact', href: '#' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'Guidelines', href: '#' },
        ],
        social: [
            { name: 'Twitter', icon: Twitter, href: '#' },
            { name: 'LinkedIn', icon: Linkedin, href: '#' },
            { name: 'GitHub', icon: Github, href: '#' },
            { name: 'Email', icon: Mail, href: 'mailto:hello@edustore.com' },
        ],
    };

    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4">
                            EduStore
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Your ultimate platform for sharing knowledge and connecting with fellow students.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {footerLinks.social.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm hover:text-indigo-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm hover:text-indigo-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm hover:text-indigo-400 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} EduStore. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-400 flex items-center space-x-1">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>for students</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
