import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import your assets
import nancyAvatar from '../assets/nancy.jpg';
import foxLogo from '../assets/logo-fox-dark.png';

const IntroPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animated background effect (NO CHANGES HERE)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const particles: Array<{
            x: number; y: number; radius: number; color: string;
            velocity: { x: number; y: number }; opacity: number;
        }> = [];
        const colors = ['#EC4899', '#D946EF', '#A855F7', '#8B5CF6', '#6366F1', '#4F46E5'];

        const createParticles = () => {
            particles.length = 0; // Clear existing particles on resize potentially
            const numParticles = Math.floor((canvas.width * canvas.height) / 20000); // Adjust density based on screen size
            for (let i = 0; i < Math.max(30, numParticles); i++) { // Ensure minimum 30 particles
                const radius = Math.random() * 3 + 1; // Slightly smaller max radius
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    velocity: { x: (Math.random() - 0.5) * 0.25, y: (Math.random() - 0.5) * 0.25 }, // Slightly slower
                    opacity: Math.random() * 0.4 + 0.1 // Slightly less opaque
                });
            }
        };
        createParticles(); // Create initial particles

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;

                if (particle.x + particle.radius < 0) particle.x = canvas.width + particle.radius;
                if (particle.x - particle.radius > canvas.width) particle.x = -particle.radius;
                if (particle.y + particle.radius < 0) particle.y = canvas.height + particle.radius;
                if (particle.y - particle.radius > canvas.height) particle.y = -particle.radius;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            });
            ctx.globalAlpha = 1; // Reset global alpha

            // Reduced distance for connecting lines for performance and visual clarity
            const connectDistance = 80;
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = particle.color;
                        // Fade out lines more quickly
                        ctx.globalAlpha = 0.15 * (1 - distance / connectDistance);
                        ctx.lineWidth = 0.4; // Thinner lines
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            ctx.globalAlpha = 1; // Reset global alpha
        };

        animate();

        // Recreate particles on resize for better distribution
        const handleResize = () => {
            setCanvasSize();
            createParticles();
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        // Use min-h-screen instead of h-screen and remove overflow-hidden to allow scrolling if needed
        <div className="relative min-h-screen text-gray-800 bg-white flex flex-col">
            {/* Animated background */}
            <canvas ref={canvasRef} className="absolute w-full inset-0 z-0 m-0 "></canvas>

            {/*/!* Gradient circles (kept the same) *!/*/}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 opacity-20 blur-3xl pointer-events-none"></div>
            {/*<div className="absolute top-2/3 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 opacity-20 blur-3xl pointer-events-none"></div>*/}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-96 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 opacity-10 blur-3xl pointer-events-none"></div>

            {/*/!* Gradient overlays (kept the same) *!/*/}
            {/*<div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white to-transparent z-10 opacity-90 pointer-events-none"></div>*/}
            {/*<div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white to-transparent z-10 opacity-90 pointer-events-none"></div>*/}

            {/* Content container: Removed h-full, added flex-grow to push footer */}
            {/* Added some padding top/bottom here */}
            <div className="relative z-20 container mx-auto px-4 py-6 sm:py-8 flex flex-col items-center flex-grow w-full">

                {/* Header: Reduced logo size and margins */}
                <header className="w-full flex flex-col items-center mb-4 md:mb-6">
                    {/* Reduced logo height */}
                    <div className="h-12 mb-2">
                        <img src={foxLogo} alt="Fox" className="h-full w-auto object-contain" />
                    </div>
                    {/* Reduced avatar size slightly */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-7 w-7 rounded-full overflow-hidden border border-pink-200 shadow-md">
                            <img src={nancyAvatar} alt="Nancy" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            {/* Slightly smaller title */}
                            <h1 className="text-xl font-semibold text-gray-800">
                                Nan<span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">CV</span>
                            </h1>
                            <p className="text-xs text-gray-500">For Nancy</p>
                        </div>
                    </div>
                </header>

                {/* Main content: Use flex-grow to take available space, adjust padding/margins */}
                <main className="flex-grow flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center px-4 py-4 md:py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full" // Ensure motion div takes width
                    >
                        {/* Slightly smaller heading, reduced bottom margin */}
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-5 bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                            Create your CV quickly
                        </h2>

                        {/* Slightly smaller text, reduced bottom margin, adjusted max-width */}
                        <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
                            So you'll finally stop bothering me about making your CV every day 😒... and others can enjoy it too!

                        </p>

                        {/* App mockup: Reduced max-width and bottom margin */}
                        <div className="relative w-full max-w-xs mx-auto mb-8">
                            {/* Adjusted inner mockup element sizes slightly */}
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform transition-transform hover:scale-[1.02]">
                                <div className="bg-gradient-to-r from-pink-500 to-indigo-600 h-3"></div>
                                <div className="p-4 space-y-2">
                                    <div className="bg-gray-100 rounded h-6 w-2/3 mx-auto"></div>
                                    <div className="flex justify-between gap-2">
                                        <div className="bg-gray-100 rounded h-16 w-1/3"></div>
                                        <div className="bg-gray-100 rounded h-16 w-2/3"></div>
                                    </div>
                                    <div className="bg-gray-100 rounded h-10 w-full"></div>
                                    <div className="bg-gray-100 rounded h-10 w-full"></div>
                                </div>
                            </div>
                            {/* Floating elements adjusted slightly */}
                            <div className="absolute -top-2 -right-2 bg-white rounded-md shadow-md p-1 transform rotate-6">
                                <div className="w-8 h-2 bg-pink-100 rounded-sm"></div>
                            </div>
                            <div className="absolute -bottom-1 -left-1 bg-white rounded-md shadow-md p-1 transform -rotate-3">
                                <div className="w-6 h-1.5 bg-indigo-100 rounded-sm"></div>
                            </div>
                        </div>

                        {/* CTA Button: Reduced padding and text size slightly */}
                        <Link to="/create" className="group inline-block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                <button className="relative bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white py-3 px-8 md:py-3.5 md:px-10 rounded-full font-semibold text-base shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                                    Create Your CV
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </Link>

                        {/* Feature list: Reduced icon size, spacing, and text size */}
                        {/* Changed to sm:grid-cols-4 for earlier transition, reduced max-width */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-xl mx-auto">
                            {[
                                { icon: <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />, text: "Modern Templates", color: "text-pink-500" },
                                { icon: <><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></>, text: "Live Preview", color: "text-indigo-600" },
                                { icon: <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />, text: "PDF Export", color: "text-pink-500" },
                                { icon: <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />, text: "Auto-Save", color: "text-indigo-600" }
                            ].map((feature, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    {/* Reduced icon container size and margin */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500/10 to-indigo-600/10 flex items-center justify-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${feature.color}`} viewBox="0 0 20 20" fill="currentColor">
                                            {feature.icon}
                                        </svg>
                                    </div>
                                    {/* Smaller text, centered */}
                                    <p className="text-gray-600 text-xs text-center">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </main>

                {/* Footer: Added padding top */}
                <footer className="w-full text-center mt-auto pt-6 pb-4 border-t border-gray-100/80">
                    <p className="text-gray-500 text-xs sm:text-sm">
                        NanCV © {new Date().getFullYear()} - Created by <a href="https://the-fox.tech" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-indigo-600 transition-colors font-medium">Fox</a>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default IntroPage;