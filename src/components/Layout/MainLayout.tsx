import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import nancyAvatar from '../../assets/nancy.jpg';
import foxLogo from '../../assets/logo-fox.png';
import { Menu, X, Star, Heart, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Toaster } from 'sonner';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home', icon: Star },
        { path: '/create', label: 'Create CV', icon: Zap },
        { path: '/dashboard', label: 'My CVs', icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-bg-white text-black font-sans flex flex-col relative overflow-x-hidden">
            {/* Background Pattern */}
             <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }}></div>

            {/* Top Bar Marquee */}
            <div className="bg-brutal-yellow border-b-3 border-black py-2 overflow-hidden relative z-50">
                <div className="marquee-container font-mono font-bold uppercase text-sm">
                    <div className="marquee-content gap-8 flex" style={{ animationDuration: '60s' }}>
                        {[...Array(10)].map((_, i) => (
                            <span key={i}>★ Stop bothering Fox with your CV ★ Nancy please stop ★ Best CV Generator Ever ★</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-40 bg-white border-b-3 border-black px-4 py-4 md:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 border-black overflow-hidden brutal-shadow transition-transform group-hover:scale-105 group-hover:rotate-3">
                                <img src={nancyAvatar} alt="Nancy" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-brutal-pink text-white text-xs font-bold px-2 py-1 border-2 border-black -rotate-12">
                                For Nancy
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-4xl font-black leading-none uppercase tracking-tighter">
                                Nancy<span className="text-brutal-pink">CV</span>
                            </h1>
                            <span className="font-mono text-xs md:text-sm font-bold bg-brutal-lime border-2 border-black inline-block px-1 -rotate-2 w-max self-start mt-1">
                                No More Begging
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path}
                                    to={item.path} 
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 font-black uppercase text-lg border-3 border-black transition-all",
                                        isActive 
                                            ? "bg-brutal-pink text-white brutal-shadow transform -translate-y-1" 
                                            : "bg-white hover:bg-brutal-lime hover:brutal-shadow hover:-translate-y-1"
                                    )}
                                >
                                    <Icon size={20} strokeWidth={3} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 border-3 border-black bg-brutal-yellow brutal-shadow active:translate-y-1 active:shadow-none transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
                    </button>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-white pt-32 px-6">
                    <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center justify-center gap-3 px-6 py-4 font-black uppercase text-xl border-3 border-black transition-all",
                                    location.pathname === item.path 
                                        ? "bg-brutal-pink text-white brutal-shadow" 
                                        : "bg-white hover:bg-brutal-lime hover:brutal-shadow"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t-3 border-black bg-black text-white p-8 md:p-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="bg-white p-2 border-2 border-white rotate-3">
                             <img src={foxLogo} alt="By Fox" className="h-12 md:h-16" />
                        </div>
                        <p className="font-mono text-sm max-w-xs text-center md:text-left">
                            Built with ❤️ (and annoyance) by Fox, so Nancy stops asking for updates.
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <a href="#" className="p-3 bg-white text-black border-2 border-white hover:bg-brutal-lime hover:border-brutal-lime transition-colors">
                            <span className="sr-only">Initial GitHub</span>
                            Github
                        </a> 
                        <a href="#" className="p-3 bg-white text-black border-2 border-white hover:bg-brutal-pink hover:border-brutal-pink transition-colors">
                            <span className="sr-only">Twitter</span>
                            Twitter
                        </a>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center font-mono text-xs text-gray-400">
                    © {new Date().getFullYear()} NancyCV. All rights reserved. Do not copy without permission (except Nancy).
                </div>
            </footer>
            
            <Toaster position="bottom-right" toastOptions={{
                className: 'border-3 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono font-bold'
            }} />
        </div>
    );
};

export default MainLayout;
