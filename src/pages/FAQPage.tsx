import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Search, BrainCircuit, Laugh, PaintBucket, HelpCircle, Coffee, Heart } from 'lucide-react';

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
    {
        id: "faq-7",
        icon: <Heart size={24} />,
        category: "Utilisateurs",
        question: "Comment puis-je contribuer à NancyCV?",
        answer: "En utilisant l'app et en la partageant déjà! Sinon, tes retours sont précieux: si tu trouves un bug, si tu as une idée géniale ou même si tu veux juste dire que l'app est super cool, n'hésite pas à me contacter. Et si tu codes, le projet est open source, donc tu peux contribuer directement. La porte est grande ouverte!"
    }
];

const FaqPage: React.FC = () => {
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(faqItems);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Extraire les catégories uniques
    const categories = Array.from(new Set(faqItems.map(item => item.category)));

    // Gérer la recherche et le filtrage par catégorie
    React.useEffect(() => {
        const filtered = faqItems.filter(item => {
            const matchesSearch = searchQuery === "" ||
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === null || item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        setFilteredItems(filtered);
    }, [searchQuery, selectedCategory]);

    const toggleItem = (id: string) => {
        setOpenItem(openItem === id ? null : id);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
        if (searchRef.current) {
            searchRef.current.focus();
        }
    };

    const selectCategory = (category: string | null) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 relative overflow-hidden">
            {/* Background gradient circles */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-indigo-300 opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-500 to-purple-300 opacity-50 blur-3xl"></div>

            <div className="container mx-auto py-16 px-4 relative z-10">
                {/* Header avec bouton retour */}
                <div className="mb-12">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-6"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Retour à l'accueil
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent"
                    >
                        Questions Fréquentes
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-600 max-w-2xl"
                    >
                        Tout ce que tu as toujours voulu savoir sur NancyCV sans jamais oser le demander.
                        Des réponses franches, parfois drôles, toujours utiles!
                    </motion.p>
                </div>

                {/* Recherche et filtres */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Barre de recherche */}
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Rechercher une question..."
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Boutons de filtre par catégorie */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => selectCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === null
                                        ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Toutes
                            </button>

                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => selectCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Liste FAQ */}
                <div className="space-y-4">
                    {filteredItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-center mb-4">
                <span className="inline-block p-4 bg-indigo-100 text-indigo-600 rounded-full">
                  <HelpCircle size={40} />
                </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Aucune question trouvée</h3>
                            <p className="text-gray-600">
                                Essaie avec d'autres mots-clés ou supprime tes filtres.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory(null);
                                }}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Afficher toutes les questions
                            </button>
                        </motion.div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="hidden sm:flex h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-indigo-600 mb-1">{item.category}</div>
                                            <h3 className="text-lg font-semibold text-gray-800 pr-6">{item.question}</h3>
                                        </div>
                                    </div>
                                    <div className={`flex-shrink-0 transition-transform duration-300 ${openItem === item.id ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={20} className="text-gray-500" />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openItem === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pied de page */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-4">Une autre question? N'hésite pas à me contacter!</p>
                    <Link
                        to="/"
                        className="inline-block bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                        Retour à l'accueil
                    </Link>

                    <div className="mt-8 text-sm text-gray-500">
                        <p>NancyCV © {new Date().getFullYear()} - Créé avec beaucoup d'agacement pour Nancy par Fox</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;