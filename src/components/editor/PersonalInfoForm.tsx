// ============================================================================
// NANCY CV - Personal Info Form
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, Globe, Linkedin, Github, 
    Twitter, Briefcase, Plus, X, Link2
} from 'lucide-react';
import type { SocialLink } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';
import {
    BrutalInput,
    BrutalTextarea,
    BrutalSelect,
    PhotoUpload,
    BrutalAddButton,
    TipBox,
} from './BrutalUI';

const SOCIAL_PLATFORMS = [
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'twitter', label: 'Twitter / X', icon: Twitter },
    { value: 'portfolio', label: 'Portfolio', icon: Globe },
    { value: 'behance', label: 'Behance', icon: Link2 },
    { value: 'dribbble', label: 'Dribbble', icon: Link2 },
    { value: 'stackoverflow', label: 'Stack Overflow', icon: Link2 },
    { value: 'youtube', label: 'YouTube', icon: Link2 },
    { value: 'medium', label: 'Medium', icon: Link2 },
    { value: 'other', label: 'Autre', icon: Link2 },
];

const getPlatformIcon = (platform: string) => {
    const found = SOCIAL_PLATFORMS.find(p => p.value === platform);
    return found?.icon || Link2;
};

export const PersonalInfoForm: React.FC = () => {
    const personalInfo = useCVStore((state) => state.cv.personalInfo);
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const updatePhoto = useCVStore((state) => state.updatePhoto);
    const addSocialLink = useCVStore((state) => state.addSocialLink);
    const updateSocialLink = useCVStore((state) => state.updateSocialLink);
    const removeSocialLink = useCVStore((state) => state.removeSocialLink);
    
    return (
        <div className="space-y-8">
            {/* Photo Section */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Photo de profil
                </h3>
                <div className="flex items-start gap-6">
                    <PhotoUpload
                        photo={personalInfo.photo}
                        onPhotoChange={updatePhoto}
                        shape="square"
                        size="lg"
                    />
                    <TipBox type="info">
                        Une photo professionnelle augmente vos chances d'être contacté de 40%.
                        Utilisez un fond neutre et un cadrage serré.
                    </TipBox>
                </div>
            </section>
            
            {/* Identity */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Identité
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <BrutalInput
                        label="Prénom"
                        value={personalInfo.firstName}
                        onChange={(v) => updatePersonalInfo('firstName', v)}
                        placeholder="Marie"
                        icon={User}
                        required
                    />
                    <BrutalInput
                        label="Nom"
                        value={personalInfo.lastName}
                        onChange={(v) => updatePersonalInfo('lastName', v)}
                        placeholder="Dubois"
                        required
                    />
                </div>
                <BrutalInput
                    label="Titre professionnel"
                    value={personalInfo.jobTitle}
                    onChange={(v) => updatePersonalInfo('jobTitle', v)}
                    placeholder="Développeuse Full Stack"
                    icon={Briefcase}
                    hint="Le poste que vous recherchez ou votre métier actuel"
                />
                <BrutalInput
                    label="Phrase d'accroche"
                    value={personalInfo.headline || ''}
                    onChange={(v) => updatePersonalInfo('headline', v)}
                    placeholder="Passionnée par le code propre et l'UX"
                    hint="Une phrase courte qui vous définit (optionnel)"
                />
            </section>
            
            {/* Contact */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Coordonnées
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <BrutalInput
                        label="Email"
                        value={personalInfo.email}
                        onChange={(v) => updatePersonalInfo('email', v)}
                        placeholder="marie@email.com"
                        type="email"
                        icon={Mail}
                        required
                    />
                    <BrutalInput
                        label="Téléphone"
                        value={personalInfo.phone}
                        onChange={(v) => updatePersonalInfo('phone', v)}
                        placeholder="+33 6 12 34 56 78"
                        type="tel"
                        icon={Phone}
                    />
                </div>
            </section>
            
            {/* Address */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Adresse
                </h3>
                <BrutalInput
                    label="Adresse"
                    value={personalInfo.address}
                    onChange={(v) => updatePersonalInfo('address', v)}
                    placeholder="15 Rue de la République"
                    icon={MapPin}
                />
                <div className="grid grid-cols-3 gap-4">
                    <BrutalInput
                        label="Ville"
                        value={personalInfo.city}
                        onChange={(v) => updatePersonalInfo('city', v)}
                        placeholder="Paris"
                    />
                    <BrutalInput
                        label="Code postal"
                        value={personalInfo.postalCode}
                        onChange={(v) => updatePersonalInfo('postalCode', v)}
                        placeholder="75001"
                    />
                    <BrutalInput
                        label="Pays"
                        value={personalInfo.country}
                        onChange={(v) => updatePersonalInfo('country', v)}
                        placeholder="France"
                    />
                </div>
            </section>
            
            {/* Web Presence */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Présence en ligne
                </h3>
                <BrutalInput
                    label="Site web personnel"
                    value={personalInfo.website || ''}
                    onChange={(v) => updatePersonalInfo('website', v)}
                    placeholder="www.votresite.com"
                    icon={Globe}
                />
                
                {/* Social Links */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider">
                        Réseaux sociaux
                    </label>
                    {personalInfo.socialLinks.map((link, index) => (
                        <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-36">
                                <BrutalSelect
                                    label=""
                                    options={SOCIAL_PLATFORMS.map(p => ({ value: p.value, label: p.label }))}
                                    value={link.platform}
                                    onChange={(v) => updateSocialLink(link.id, { platform: v as SocialLink['platform'] })}
                                />
                            </div>
                            <div className="flex-1">
                                <BrutalInput
                                    label=""
                                    value={link.url}
                                    onChange={(v) => updateSocialLink(link.id, { url: v })}
                                    placeholder="URL du profil"
                                    icon={getPlatformIcon(link.platform)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSocialLink(link.id)}
                                className="p-3 border-3 border-black bg-white text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>
                        </motion.div>
                    ))}
                    <BrutalAddButton
                        label="Ajouter un réseau"
                        onClick={() => addSocialLink('linkedin')}
                        icon={Plus}
                    />
                </div>
            </section>
            
            {/* Summary */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    À propos
                </h3>
                <BrutalTextarea
                    label="Résumé professionnel"
                    value={personalInfo.summary}
                    onChange={(v) => updatePersonalInfo('summary', v)}
                    placeholder="Décrivez votre parcours, vos compétences clés et ce qui vous motive..."
                    rows={6}
                    maxLength={500}
                    showCount
                    hint="2-4 phrases qui résument votre profil et vos objectifs professionnels"
                />
            </section>
            
            {/* Additional Info */}
            <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2">
                    Informations complémentaires
                    <span className="ml-2 text-gray-400 font-normal text-xs">(optionnel)</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <BrutalInput
                        label="Nationalité"
                        value={personalInfo.nationality || ''}
                        onChange={(v) => updatePersonalInfo('nationality', v)}
                        placeholder="Française"
                    />
                    <BrutalInput
                        label="Date de naissance"
                        value={personalInfo.dateOfBirth || ''}
                        onChange={(v) => updatePersonalInfo('dateOfBirth', v)}
                        type="date"
                    />
                </div>
                <TipBox type="warning">
                    Dans certains pays, il est déconseillé d'inclure la date de naissance ou la nationalité 
                    pour éviter les discriminations. Adaptez selon le contexte.
                </TipBox>
            </section>
        </div>
    );
};
