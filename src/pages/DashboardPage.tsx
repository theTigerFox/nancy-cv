// ============================================================================
// NANCY CV - Dashboard Page
// ============================================================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Plus, 
    Trash2, 
    Clock, 
    Loader2,
    FolderOpen,
    Edit3
} from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, savedCVs, loadingCVs, deleteCV } = useAuth();

    const handleCreateNew = () => {
        navigate('/create');
    };

    const handleEditCV = (cvId: string) => {
        navigate(`/create?cv=${cvId}`);
    };

    const handleDeleteCV = async (cvId: string, cvName: string) => {
        if (confirm(`Supprimer "${cvName}" définitivement ?`)) {
            await deleteCV(cvId);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate?.() || new Date(timestamp);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto py-8 md:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase">
                            Mes CV
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Bienvenue, {user?.displayName?.split(' ')[0] || 'Utilisateur'}
                        </p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3",
                            "bg-brutal-lime border-3 border-black font-black uppercase",
                            "hover:shadow-brutal hover:-translate-y-1 transition-all"
                        )}
                    >
                        <Plus size={20} strokeWidth={3} /> Nouveau CV
                    </button>
                </div>

                {/* Content */}
                {loadingCVs ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-gray-400 mb-4" />
                        <p className="font-bold text-gray-500">Chargement de vos CV...</p>
                    </div>
                ) : savedCVs.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-3 border-black border-dashed p-12 md:p-16 flex flex-col items-center justify-center bg-gray-50"
                    >
                        <div className="w-20 h-20 bg-white border-3 border-black flex items-center justify-center mb-6">
                            <FolderOpen size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase mb-2 text-center">
                            Aucun CV pour l'instant
                        </h2>
                        <p className="font-mono mb-8 text-gray-500 text-center max-w-md">
                            Créez votre premier CV professionnel et impressionnez les recruteurs.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className={cn(
                                "flex items-center gap-2 px-8 py-4",
                                "bg-brutal-lime border-3 border-black font-black uppercase text-lg",
                                "hover:shadow-brutal hover:-translate-y-1 transition-all"
                            )}
                        >
                            <Plus size={24} strokeWidth={3} />
                            Créer mon premier CV
                        </button>
                    </motion.div>
                ) : (
                    /* CVs Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedCVs.map((cv, index) => (
                            <motion.div
                                key={cv.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white border-3 border-black overflow-hidden hover:shadow-brutal transition-all"
                            >
                                {/* CV Preview Header */}
                                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 border-b-3 border-black flex items-center justify-center relative">
                                    <FileText size={64} className="text-gray-300" />
                                    {cv.isDefault && (
                                        <span className="absolute top-2 right-2 bg-brutal-pink text-white text-xs font-bold px-2 py-1 border-2 border-black">
                                            Par défaut
                                        </span>
                                    )}
                                </div>
                                
                                {/* CV Info */}
                                <div className="p-4">
                                    <h3 className="font-black text-lg truncate mb-1">
                                        {cv.name || 'CV Sans Nom'}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                                        <Clock size={14} />
                                        Modifié le {formatDate(cv.updatedAt)}
                                    </p>
                                    
                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditCV(cv.id)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-2",
                                                "bg-brutal-lime border-2 border-black font-bold text-sm",
                                                "hover:shadow-brutal transition-all"
                                            )}
                                        >
                                            <Edit3 size={16} />
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCV(cv.id, cv.name)}
                                            className={cn(
                                                "p-2 border-2 border-black",
                                                "hover:bg-red-50 hover:border-red-500 hover:text-red-500",
                                                "transition-all"
                                            )}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                        {/* New CV Card */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: savedCVs.length * 0.1 }}
                            onClick={handleCreateNew}
                            className={cn(
                                "min-h-[280px] border-3 border-black border-dashed",
                                "flex flex-col items-center justify-center gap-4",
                                "bg-gray-50 hover:bg-brutal-lime/20 hover:border-solid",
                                "transition-all group cursor-pointer"
                            )}
                        >
                            <div className="w-16 h-16 border-3 border-black bg-white flex items-center justify-center group-hover:bg-brutal-lime transition-colors">
                                <Plus size={32} strokeWidth={3} />
                            </div>
                            <span className="font-black uppercase">Nouveau CV</span>
                        </motion.button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
