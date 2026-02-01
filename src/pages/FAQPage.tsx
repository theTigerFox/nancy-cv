import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BrainCircuit, Laugh, PaintBucket, HelpCircle, Coffee, Heart, Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import MainLayout from '../components/Layout/MainLayout';

// Données des FAQ
const faqItems = [
    {
        id: "faq-1",
        icon: <HelpCircle size={24} />,
        category: "Général",
        question: "Pourquoi cette app existe-t-elle?",
        answer: "Parce que ma Nancy me faisait chier pour l'aider à faire tout le temps son putain de CV et les outils en lignes sont payants. Puis je me suis dit « Pourquoi pas aider les autres aussi pendant qu'on y est? » Donc voilà, NancyCV est né! 🎉 Et aussi parce que, soyons honnêtes, faire un CV c'est barbant et tout le monde déteste ça."
    },
    {
        id: "faq-2",
        icon: <BrainCircuit size={24} />,
        category: "IA",
        question: "Comment se servir de l'outil IA?",
        answer: "C'est ultra simple! Tu cliques sur le joli bouton \"Utiliser l'IA\" sur la page d'accueil, tu racontes ta vie (études, jobs, compétences...) comme si tu parlais à un pote, et pouf! L'IA fait sa magie et remplit ton CV automagiquement. Même mon grand-père qui galère avec son téléphone pourrait le faire, c'est dire!"
    },
    {
        id: "faq-3",
        icon: <BrainCircuit size={24} />,
        category: "IA",
        question: "Pourquoi utiliser l'outil IA?",
        answer: "Parce que (1) remplir des formulaires c'est chiant, (2) parfois t'as juste pas d'inspi pour décrire tes compétences sans dire 'je suis motivé et dynamique' pour la 100ème fois, et (3) sur mobile, remplir 50 champs c'est l'enfer. L'IA c'est comme avoir un pote qui fait ton CV à ta place, mais sans devoir lui payer un café en échange!"
    },
    {
        id: "faq-4",
        icon: <PaintBucket size={24} />,
        category: "Design",
        question: "Pourquoi n'y a-t-il qu'un seul modèle de CV?",
        answer: "MDR! Estime-toi déjà heureux que tu puisses au moins changer la couleur! ...Non je déconne 😄 D'autres templates arrivent bientôt, c'est juste que je suis seul à coder tout ça dans mon coin en buvant trop de café. Rome ne s'est pas faite en un jour, et les 50 templates de CV non plus!"
    },
    {
        id: "faq-5",
        icon: <Coffee size={24} />,
        category: "Personnel",
        question: "C'est qui ce fameux développeur de génie?",
        answer: "C'est moi, Fox! Développeur web, amateur de café et créateur de NancyCV. Si t'as aimé l'app, tu peux me remercier en m'envoyant virtuellement un café via le bouton en bas de page. Si t'as pas aimé l'app, tu peux quand même m'envoyer un café, je risque d'en avoir besoin pour l'améliorer!"
    },
    {
        id: "faq-6",
        icon: <Laugh size={24} />,
        category: "Fun",
        question: "Est-ce que quelqu'un lit vraiment les FAQ?",
        answer: "Félicitations, tu fais partie des 0.01% qui lisent les FAQ! Si jamais tu lis cette réponse jusqu'au bout, sache que tu viens de gagner le droit de te vanter d'être plus curieux que 99.99% des utilisateurs. Bravo! 🏆 (Malheureusement, ce titre n'est pas monnayable et ne donne droit à aucun avantage particulier, à part ma reconnaissance éternelle.)"
    },
];

const FAQPage = () => {
    const [openId, setOpenId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleFaq = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    const filteredFaq = faqItems.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-5xl md:text-7xl font-black uppercase text-center mb-12 stroke-text">
                But Why?
            </h1>

            {/* Search Bar */}
            <div className="mb-16 relative">
                 <input 
                    type="text" 
                    placeholder="WHAT ARE YOU LOOKING FOR?" 
                    className="brutal-input text-2xl uppercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <HelpCircle size={32} />
                 </div>
            </div>

            <div className="space-y-6">
                {filteredFaq.map((item) => (
                    <div key={item.id} className="brutal-card p-0 overflow-hidden bg-white hover:bg-gray-50 transition-all">
                        <button 
                            className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 focus:outline-none"
                            onClick={() => toggleFaq(item.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                    openId === item.id ? "bg-brutal-pink text-white" : "bg-white"
                                )}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black uppercase leading-tight">
                                    {item.question}
                                </h3>
                            </div>
                            <div className="flex-shrink-0">
                                {openId === item.id ? 
                                    <Minus size={32} strokeWidth={3} /> : 
                                    <Plus size={32} strokeWidth={3} />
                                }
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {openId === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="border-t-3 border-black bg-brutal-yellow/20"
                                >
                                    <div className="p-6 md:p-8 font-mono font-medium text-lg leading-relaxed border-l-8 border-brutal-pink mx-6 my-6 bg-white border-2 border-t-2 border-b-2 border-r-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {filteredFaq.length === 0 && (
                    <div className="text-center py-12 border-3 border-black border-dashed">
                        <h3 className="text-2xl font-bold uppercase">No results found usedr</h3>
                        <p className="font-mono">Maybe try askiing Nancy?</p>
                    </div>
                )}
            </div>

            <div className="mt-20 text-center">
                <p className="font-bold uppercase text-2xl mb-8">Still confused?</p>
                <a href="mailto:fox@example.com" className="brutal-btn-pink inline-flex items-center gap-3 text-xl">
                    <Heart className="animate-pulse" /> Bug Fox Directly
                </a>
            </div>
        </div>
    );
};

export default FAQPage;
