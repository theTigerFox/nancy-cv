import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import nancyAvatar from '../assets/nancy.jpg';
import foxLogoDark from '../assets/logo-fox-dark.png';
import { ArrowRight, Zap, Layout, CheckCircle, XCircle, Skull, Heart, Trophy, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import MainLayout from '../components/Layout/MainLayout';
import { useRef } from 'react';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 100 }
    }
};

const HomePage = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 25]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    return (
        <MainLayout>
            <div ref={targetRef} className="relative overflow-hidden bg-white">
                
                {/* HERO SECTION REDESIGNED */}
                <section className="min-h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-12 gap-0 relative border-b-4 border-black">
                    
                    {/* Left Heavy Text Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7 bg-white p-6 md:p-12 flex flex-col justify-center relative z-20"
                    >
                        
                        {/* Interactive Badge */}
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            className="inline-flex items-center gap-3 border-3 border-black bg-brutal-lime px-3 py-1 font-mono font-bold uppercase w-fit mb-6 shadow-brutal-sm rotate-2 cursor-help text-sm"
                        >
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"/>
                            V 2.0 (Nancy Approved)
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6 relative">
                            <span className="block hover:text-brutal-pink transition-colors duration-300">Make a CV</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brutal-pink to-purple-600" style={{ WebkitTextStroke: '2px black' }}>THAT DOESN'T</span>
                            <span className="relative inline-block mt-1">
                                <span className="relative z-10">SUCK.</span>
                                <motion.div 
                                    className="absolute -bottom-1 lg:-bottom-4 left-0 w-full h-3 lg:h-6 bg-brutal-yellow -z-10"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                />
                            </span>
                        </h1>

                        <p className="font-medium text-lg md:text-xl max-w-xl leading-relaxed border-l-4 border-brutal-pink pl-4 py-2 mb-8 bg-gray-50">
                            The only CV builder designed to stop Nancy from asking me for edits every 5 minutes. It's fast, it's brutal, and it works.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/create" className="group relative">
                                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
                                <button className="relative bg-brutal-pink text-white border-3 border-black px-8 py-4 font-black text-xl uppercase flex items-center gap-3 hover:-translate-y-1 hover:-translate-x-1 transition-transform cursor-pointer w-full sm:w-auto justify-center">
                                    Start Building <Zap className="fill-white animate-pulse" size={20} />
                                </button>
                            </Link>

                            <Link to="#demo" className="group relative">
                                <button className="relative w-full sm:w-auto bg-white text-black border-3 border-black px-8 py-4 font-black text-xl uppercase hover:bg-brutal-yellow transition-colors shadow-brutal hover:shadow-brutal-hover cursor-pointer flex items-center justify-center gap-2">
                                    <Skull size={20} /> See Example
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Visual Area - Parallax */}
                    <div className="lg:col-span-5 bg-brutal-yellow border-t-4 lg:border-t-0 lg:border-l-4 border-black relative flex items-center justify-center p-8 lg:p-12 overflow-hidden h-[400px] lg:h-auto">
                        
                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                             style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
                        </div>

                        <motion.div style={{ y, rotate, scale }} className="relative z-10 w-full max-w-sm">
                            <div className="aspect-[3/4] bg-white border-4 border-black shadow-[16px_16px_0px_0px_black] p-6 flex flex-col gap-4 relative md:hover:scale-105 transition-transform duration-500">
                                <div className="absolute -top-6 -right-6 z-20">
                                    <motion.div 
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4 }}
                                        className="w-20 h-20 bg-brutal-lime rounded-full border-3 border-black flex items-center justify-center font-black text-xl shadow-brutal-sm"
                                    >
                                        HIRED!
                                    </motion.div>
                                </div>

                                <div className="w-24 h-24 bg-gray-200 border-2 border-black rounded-full self-center mb-4 overflow-hidden relative">
                                    <img src={nancyAvatar} className="w-full h-full object-cover grayscale contrast-125" />
                                </div>
                                <div className="h-6 bg-black w-3/4 self-center skew-x-[-10deg]"></div>
                                <div className="h-3 bg-brutal-pink w-1/2 self-center"></div>
                                <div className="space-y-3 mt-8 opacity-50">
                                    <div className="h-3 bg-black w-full"></div>
                                    <div className="h-3 bg-black w-5/6"></div>
                                    <div className="h-3 bg-black w-4/6"></div>
                                    <div className="h-3 bg-black w-full"></div>
                                </div>
                                
                                {/* Fox Logo Sticker */}
                                <motion.div 
                                    className="absolute -bottom-8 -left-8 bg-white border-3 border-black p-3 shadow-brutal-sm rotate-6 z-30"
                                    whileHover={{ scale: 1.2, rotate: 0 }}
                                > 
                                     <img src={foxLogoDark} className="w-16 h-auto" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div 
                            className="hidden lg:block absolute top-10 left-10 text-6xl"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        >
                            💥
                        </motion.div>
                        
                        <motion.div 
                            className="hidden lg:block absolute bottom-20 right-10 text-6xl"
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            🚀
                        </motion.div>
                    </div>
                </section>

                {/* SCROLLING MARQUEE IMPROVED */}
                <div className="bg-black text-white py-8 border-y-4 border-white overflow-hidden -rotate-1 scale-105 z-20 relative shadow-2xl">
                     <div className="marquee-container font-black text-4xl md:text-6xl uppercase italic tracking-tighter">
                        <div className="marquee-content flex gap-16" style={{ animationDuration: '30s' }}>
                             {[...Array(8)].map((_, i) => (
                                <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                                    <span className="text-brutal-lime drop-shadow-[4px_4px_0px_rgba(255,105,180,1)]">DEATH TO DOCX</span>
                                    <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>RIP TIMES NEW ROMAN</span>
                                    <span className="text-brutal-pink flex items-center gap-4">HELLO FUTURE <Heart className="fill-brutal-pink" /></span>
                                    <span className="text-brutal-yellow" style={{ WebkitTextStroke: '2px black' }}>FOX APPROVED</span>
                                </span>
                             ))}
                        </div>
                     </div>
                </div>

                {/* COMPARISON SECTION */}
                <section className="py-24 px-4 bg-white relative">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-5xl md:text-8xl font-black mb-6 uppercase leading-none">
                                Why your current CV <br/>
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-white mix-blend-difference">SUCKS</span>
                                    <span className="absolute inset-0 bg-black -rotate-2 scale-110 z-0"></span>
                                </span>
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative">
                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-24 h-24 bg-brutal-yellow border-4 border-black rounded-full font-black text-3xl shadow-brutal animate-bounce">
                                VS
                            </div>

                            {/* Bad CV */}
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="group border-4 border-red-500 bg-red-50 p-8 relative grayscale hover:grayscale-0 transition-all duration-300 hover:rotate-1"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white font-black px-6 py-2 uppercase tracking-widest border-3 border-black shadow-sm">
                                    The "Classic"
                                </div>
                                <ul className="space-y-6 mt-8 font-mono font-bold text-red-900/80 group-hover:text-red-900 text-lg">
                                    <li className="flex items-center gap-4"><XCircle size={32} /> MS Word 97 Vibes</li>
                                    <li className="flex items-center gap-4"><XCircle size={32} /> Zero Personality</li>
                                    <li className="flex items-center gap-4"><XCircle size={32} /> "Motivated team player"</li>
                                    <li className="flex items-center gap-4"><XCircle size={32} /> Straight to trash bin</li>
                                </ul>
                            </motion.div>

                            {/* Good CV */}
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                transition={{ delay: 0.2 }}
                                className="border-4 border-black bg-brutal-lime p-8 relative shadow-[16px_16px_0px_0px_black] hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-brutal-lime font-black px-6 py-2 uppercase tracking-widest border-3 border-white">
                                    The Nancy Way
                                </div>
                                <ul className="space-y-6 mt-8 font-bold text-black text-xl">
                                    <li className="flex items-center gap-4"><CheckCircle size={32} strokeWidth={3} /> Brutally Efficient</li>
                                    <li className="flex items-center gap-4"><CheckCircle size={32} strokeWidth={3} /> Perfect Grid System</li>
                                    <li className="flex items-center gap-4"><CheckCircle size={32} strokeWidth={3} /> Actually Gets Read</li>
                                    <li className="flex items-center gap-4"><CheckCircle size={32} strokeWidth={3} /> Nancy Approved™</li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* STEPS SECTION */}
                <section className="py-24 bg-gray-100 border-t-4 border-black border-b-4">
                     <div className="max-w-7xl mx-auto px-4">
                        <motion.h2 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-4xl md:text-6xl font-black uppercase text-center mb-16"
                        >
                            How Magic Happens
                        </motion.h2>
                        
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {[
                                { num: '01', title: 'Pick Design', desc: 'Choose a template that screams "Hire Me".', icon: Layout, color: 'bg-brutal-pink' },
                                { num: '02', title: 'Fill Info', desc: 'Use AI if you are lazy. We will not tell anyone.', icon: Sparkles, color: 'bg-brutal-yellow' },
                                { num: '03', title: 'Get Hired', desc: 'Download PDF. Send applied. Profit.', icon: Trophy, color: 'bg-brutal-lime' },
                            ].map((step, idx) => (
                                <motion.div variants={itemVariants} key={idx} className="relative group cursor-default">
                                    <div className={cn("absolute inset-0 border-3 border-black translate-x-3 translate-y-3 transition-transform duration-200 group-hover:translate-x-5 group-hover:translate-y-5", step.color)}></div>
                                    <div className="relative bg-white border-3 border-black p-8 h-full flex flex-col justify-between group-hover:-translate-y-1 transition-transform duration-200">
                                        <div>
                                            <span className="text-8xl font-black text-green-400 absolute -top-4 -right-4 z-0 group-hover:text-black/8 transition-colors">{step.num}</span>
                                            <div className="relative z-10">
                                                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-6 border-3 border-transparent group-hover:bg-transparent group-hover:text-black group-hover:border-black transition-colors">
                                                    <step.icon size={32} strokeWidth={2.5} />
                                                </div>
                                                <h3 className="text-3xl font-black uppercase mb-4">{step.title}</h3>
                                                <p className="font-medium text-lg text-gray-600 border-t-4 border-black pt-4">{step.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                     </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-32 bg-black text-white text-center px-4 relative overflow-hidden group">
                    {/* Animated Glitch Background Effect */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 10px)',
                        backgroundSize: '20px 20px'
                    }}></div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.h2 
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl md:text-8xl font-black uppercase mb-8 leading-none"
                        >
                            Ready to <span className="text-brutal-pink inline-block hover:animate-shake cursor-pointer">Dominate?</span>
                        </motion.h2>
                        
                        <Link to="/create" className="inline-block relative">
                             <div className="absolute inset-0 bg-brutal-lime translate-y-2 translate-x-2 border-4 border-white"></div>
                             <button className="relative bg-white text-black border-4 border-black px-12 py-6 font-black text-3xl uppercase hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-transform cursor-pointer flex items-center gap-4">
                                START NOW <ArrowRight size={36} strokeWidth={3} />
                            </button>
                        </Link>
                        
                        <div className="mt-12 flex justify-center gap-4">
                            <span className="bg-gray-800 text-gray-400 px-3 py-1 text-xs font-mono uppercase rounded">No SignUp</span>
                            <span className="bg-gray-800 text-gray-400 px-3 py-1 text-xs font-mono uppercase rounded">Free Forever</span>
                            <span className="bg-gray-800 text-gray-400 px-3 py-1 text-xs font-mono uppercase rounded">Fox Like</span>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default HomePage;
