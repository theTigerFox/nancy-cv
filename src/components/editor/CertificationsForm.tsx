// ============================================================================
// NANCY CV - Certifications Form
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, Building, Link2, X, Eye, EyeOff, Shield } from 'lucide-react';
import { Certification } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';
import { cn } from '../../lib/utils';

const CERTIFICATION_SUGGESTIONS = [
    { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services' },
    { name: 'Google Cloud Professional', issuer: 'Google' },
    { name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft' },
    { name: 'Certified Kubernetes Administrator', issuer: 'CNCF' },
    { name: 'Scrum Master (PSM I)', issuer: 'Scrum.org' },
    { name: 'PMP', issuer: 'PMI' },
    { name: 'TOEIC', issuer: 'ETS' },
    { name: 'Google Analytics', issuer: 'Google' },
];

interface CertificationItemProps {
    certification: Certification;
    index: number;
}

const CertificationItem: React.FC<CertificationItemProps> = ({ certification, index }) => {
    const updateCertification = useCVStore((state) => state.updateCertification);
    const removeCertification = useCVStore((state) => state.removeCertification);
    
    const isExpired = certification.expiryDate && new Date(certification.expiryDate) < new Date();
    const isExpiringSoon = certification.expiryDate && !isExpired && 
        new Date(certification.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border-3 border-black bg-white p-4",
                !certification.visible && "opacity-60",
                isExpired && "border-red-400 bg-red-50/50",
                isExpiringSoon && !isExpired && "border-orange-400 bg-orange-50/50"
            )}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                    "w-12 h-12 border-2 border-black flex items-center justify-center shrink-0",
                    isExpired ? "bg-red-100" : isExpiringSoon ? "bg-orange-100" : "bg-brutal-lime"
                )}>
                    <Award size={24} />
                </div>
                
                {/* Form */}
                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BrutalInput
                            label="Nom de la certification"
                            value={certification.name}
                            onChange={(v) => updateCertification(certification.id, { name: v })}
                            placeholder="AWS Solutions Architect"
                            required
                        />
                        <BrutalInput
                            label="Organisme"
                            value={certification.issuer}
                            onChange={(v) => updateCertification(certification.id, { issuer: v })}
                            placeholder="Amazon Web Services"
                            icon={Building}
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <BrutalInput
                            label="Date d'obtention"
                            value={certification.date}
                            onChange={(v) => updateCertification(certification.id, { date: v })}
                            type="month"
                            icon={Calendar}
                            required
                        />
                        <BrutalInput
                            label="Date d'expiration"
                            value={certification.expiryDate || ''}
                            onChange={(v) => updateCertification(certification.id, { expiryDate: v || undefined })}
                            type="month"
                        />
                        <BrutalInput
                            label="ID / Numéro"
                            value={certification.credentialId || ''}
                            onChange={(v) => updateCertification(certification.id, { credentialId: v || undefined })}
                            placeholder="ABC123..."
                            icon={Shield}
                        />
                        <BrutalInput
                            label="Score"
                            value={certification.score || ''}
                            onChange={(v) => updateCertification(certification.id, { score: v || undefined })}
                            placeholder="945/990"
                        />
                    </div>
                    
                    <BrutalInput
                        label="Lien de vérification"
                        value={certification.credentialUrl || ''}
                        onChange={(v) => updateCertification(certification.id, { credentialUrl: v || undefined })}
                        placeholder="https://verify.certification.com/..."
                        icon={Link2}
                        type="url"
                    />
                    
                    <BrutalTextarea
                        label="Description (optionnel)"
                        value={certification.description || ''}
                        onChange={(v) => updateCertification(certification.id, { description: v || undefined })}
                        placeholder="Compétences validées, contexte..."
                        rows={2}
                    />
                    
                    {/* Warnings */}
                    {isExpired && (
                        <div className="p-2 bg-red-100 border-2 border-red-300 text-red-700 text-xs font-bold">
                            ⚠️ Cette certification a expiré
                        </div>
                    )}
                    {isExpiringSoon && !isExpired && (
                        <div className="p-2 bg-orange-100 border-2 border-orange-300 text-orange-700 text-xs font-bold">
                            ⏰ Cette certification expire bientôt
                        </div>
                    )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => updateCertification(certification.id, { visible: !certification.visible })}
                        className={cn(
                            "p-2 border-2 border-black transition-colors",
                            certification.visible ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                        )}
                        title={certification.visible ? "Masquer" : "Afficher"}
                    >
                        {certification.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                        type="button"
                        onClick={() => removeCertification(certification.id)}
                        className="p-2 border-2 border-black text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const CertificationsForm: React.FC = () => {
    const certifications = useCVStore((state) => state.cv.certifications);
    const addCertification = useCVStore((state) => state.addCertification);
    const updateCertification = useCVStore((state) => state.updateCertification);
    
    const quickAddCertification = (suggestion: typeof CERTIFICATION_SUGGESTIONS[0]) => {
        addCertification();
        setTimeout(() => {
            const state = useCVStore.getState();
            const lastCert = state.cv.certifications[state.cv.certifications.length - 1];
            if (lastCert) {
                state.updateCertification(lastCert.id, {
                    name: suggestion.name,
                    issuer: suggestion.issuer,
                });
            }
        }, 0);
    };
    
    const existingNames = certifications.map(c => c.name.toLowerCase());
    const availableSuggestions = CERTIFICATION_SUGGESTIONS.filter(
        s => !existingNames.includes(s.name.toLowerCase())
    );
    
    const expiredCount = certifications.filter(c => 
        c.expiryDate && new Date(c.expiryDate) < new Date()
    ).length;
    
    return (
        <div className="space-y-6">
            <TipBox type="info">
                Les certifications valident officiellement vos compétences.
                Pensez à inclure le lien de vérification pour plus de crédibilité.
            </TipBox>
            
            {/* Quick Add */}
            {availableSuggestions.length > 0 && (
                <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-gray-500">
                        Suggestions populaires:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {availableSuggestions.slice(0, 4).map(suggestion => (
                            <button
                                key={suggestion.name}
                                type="button"
                                onClick={() => quickAddCertification(suggestion)}
                                className="px-3 py-2 border-2 border-dashed border-gray-300 text-xs font-bold hover:border-black hover:bg-white transition-all"
                            >
                                <span className="text-gray-400">+</span>{' '}
                                {suggestion.name}
                                <span className="text-gray-400 ml-1">({suggestion.issuer})</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Stats */}
            {certifications.length > 0 && (
                <div className="flex gap-4 text-xs">
                    <div className="px-3 py-1 bg-gray-100 border-2 border-gray-200 font-bold">
                        {certifications.length} certification{certifications.length > 1 ? 's' : ''}
                    </div>
                    {expiredCount > 0 && (
                        <div className="px-3 py-1 bg-red-100 border-2 border-red-300 font-bold text-red-700">
                            {expiredCount} expirée{expiredCount > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}
            
            {/* Certifications List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {certifications.map((certification, index) => (
                        <CertificationItem
                            key={certification.id}
                            certification={certification}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
            
            <BrutalAddButton
                label="Ajouter une certification"
                onClick={addCertification}
            />
            
            {certifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Award size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune certification ajoutée</p>
                    <p className="text-xs mt-1">
                        Ajoutez vos certifications professionnelles
                    </p>
                </div>
            )}
        </div>
    );
};
