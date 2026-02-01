import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import nancyAvatar from '../assets/nancy.jpg';
import foxLogoDark from '../assets/logo-fox-dark.png';
import { ArrowRight, Star, Zap, Layout, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import MainLayout from '../components/Layout/MainLayout';

const HomePage = () => {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col justify-center items-center text-center gap-8 py-20 relative">
                
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-block"
                >
                    <span className="bg-brutal-yellow border-3 border-black px-4 py-2 font-black uppercase text-xl md:text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] inline-block mb-8">
                        For Nancy & Everyone Else
                    </span>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0, rotate: 2 }}
                    animate={{ y: 0, opacity: 1, rotate: -2 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                    className="relative"
                >
                    <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-5">
                        <img
                            src={foxLogoDark}
                            alt="By Fox"
                            className="h-12 md:h-16 w-auto"
                            loading="eager"
                        />
                    </div>
                    <div className="absolute -top-3 -right-5 bg-brutal-lime border-2 border-black px-2 py-1 font-black uppercase text-xs rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        By
                    </div>
                </motion.div>

                <motion.h1 
                    className="text-6xl md:text-9xl font-black uppercase leading-none tracking-tighter"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Stop Making <br/>
                    <span className="text-brutal-pink drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] text-transparent bg-clip-text bg-gradient-to-r from-brutal-pink to-purple-600" style={{ WebkitTextStroke: '3px black' }}>Ugly CVs</span>
                </motion.h1>

                <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mt-6 bg-white border-3 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
                    The only CV generator approved by Nancy (after 500 requests). 
                    It's brutal, it's fast, and it stops me from complaining.
                </p>

                <motion.div 
                    className="flex flex-col md:flex-row gap-6 mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link to="/create" className="brutal-btn-pink text-2xl px-12 py-6 flex items-center gap-3 group">
                        Start Building <ArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={4} />
                    </Link>
                    <Link to="#features" className="brutal-btn text-2xl px-12 py-6">
                        Why Tho?
                    </Link>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 md:left-20 animate-bounce hidden md:block">
                    <Star size={48} className="text-brutal-yellow fill-brutal-yellow drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" strokeWidth={3} />
                </div>
                <div className="absolute bottom-20 right-10 md:right-20 animate-pulse hidden md:block">
                    <div className="w-16 h-16 rounded-full bg-brutal-lime border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"></div>
                </div>
            </section>

            {/* Nancy's Approval Section */}
            <section className="py-20 bg-brutal-lime border-y-3 border-black -mx-4 md:-mx-8 px-4 md:px-8 mt-12 mb-20 transform -rotate-1">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                         <div className="absolute inset-0 bg-brutal-pink rounded-full border-3 border-black translate-x-4 translate-y-4"></div>
                        <img src={nancyAvatar} alt="Nancy" className="w-full h-full object-cover rounded-full border-3 border-black relative z-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <div className="absolute -top-4 -right-12 bg-white border-3 border-black p-2 font-black uppercase rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
                            Approved!
                        </div>
                    </div>
                    
                    <div className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                         <div className="absolute -top-6 left-8 text-6xl text-brutal-pink">"</div>
                        <h2 className="text-3xl font-black uppercase mb-4">Finally, Fox made something useful.</h2>
                        <p className="text-xl font-bold font-mono">
                            "I kept asking him to fix my CV alignment. He got annoyed and built this entire app just to shut me up. Honestly? It's kind of a vibe. 10/10 would pester him again."
                        </p>
                        <p className="mt-4 font-black text-right">- Nancy</p>
                    </div>
                </div>
            </section>

            {/* Features (Brutalist Grid) */}
            <section id="features" className="py-20 max-w-7xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-black text-center mb-16 uppercase stroke-text">
                    Why use this?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="brutal-card bg-brutal-pink/20 hover:bg-brutal-pink/40 transition-colors">
                        <div className="w-16 h-16 bg-white border-3 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Layout size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Brutal Templates</h3>
                        <p className="font-mono text-sm">
                            Forget boring corporate templates. Use layouts that scream "HIRE ME OR REGRET IT".
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="brutal-card bg-brutal-yellow/20 hover:bg-brutal-yellow/40 transition-colors">
                        <div className="w-16 h-16 bg-white border-3 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Zap size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Lazy Mode</h3>
                        <p className="font-mono text-sm">
                            Don't know what to write? Just mash the keyboard and let us format it nicely. (AI coming soon maybe).
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="brutal-card bg-brutal-lime/20 hover:bg-brutal-lime/40 transition-colors">
                        <div className="w-16 h-16 bg-white border-3 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Download size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Instant PDF</h3>
                        <p className="font-mono text-sm">
                            Export to PDF faster than Nancy changes her mind about font sizes.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <div className="inline-block relative group">
                    <div className="absolute inset-0 bg-brutal-yellow border-3 border-black translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform"></div>
                    <div className="bg-white border-3 border-black p-12 relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
                            Ready to stop Suffering?
                        </h2>
                        <Link to="/create" className="brutal-btn-pink text-xl md:text-3xl px-16 py-6 inline-flex items-center gap-4 animate-shake">
                            BUILD MY CV NOW <Zap fill="white" />
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default HomePage;
