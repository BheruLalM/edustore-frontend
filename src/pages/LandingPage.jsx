import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import FeatureCards from '../components/landing/FeatureCards';
import HowItWorks from '../components/landing/HowItWorks';
import Screenshots from '../components/landing/Screenshots';
import Benefits from '../components/landing/Benefits';
import Testimonials from '../components/landing/Testimonials';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <LandingNavbar />
            <Hero />
            <FeatureCards />
            <HowItWorks />
            <Screenshots />
            <Benefits />
            <Testimonials />
            <CTASection />
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
