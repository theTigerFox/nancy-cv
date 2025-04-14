import React, { useState } from 'react';
import { Camera, Trash, Upload, User } from 'lucide-react';
import { PersonalInfo } from '../../types/cv';
import { motion } from 'framer-motion';

interface PersonalInfoFormProps {
    personalInfo: PersonalInfo;
    onInfoChange: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
    onPhotoChange: (file: File | null) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
    personalInfo, 
    onInfoChange, 
    onPhotoChange 
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        onPhotoChange(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onPhotoChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Informations Personnelles</h2>
            </div>
            
            <div className="p-6">
                {/* Photo Upload */}
                <div className="mb-8">
                    <label className="block text-gray-700 mb-2 font-medium">Photo de profil</label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div 
                            className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden relative cursor-pointer border-2 ${isDragging ? 'border-blue-500 border-dashed bg-blue-50' : personalInfo.photo ? 'border-green-500' : 'border-gray-300'}`}
                            onClick={() => document.getElementById('photo')?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {personalInfo.photo ? (
                                <>
                                    <img 
                                        src={personalInfo.photo} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                        <Camera className="text-white opacity-0 hover:opacity-100 transition-opacity" size={24} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <User size={36} />
                                    <span className="text-xs mt-2 text-center">
                                        {isDragging ? 'Déposez ici' : 'Ajouter une photo'}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => document.getElementById('photo')?.click()}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Upload size={16} />
                                Choisir une photo
                            </motion.button>
                            
                            {personalInfo.photo && (
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => onPhotoChange(null)}
                                    className="text-red-500 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors duration-200"
                                >
                                    <Trash size={16} />
                                    Supprimer
                                </motion.button>
                            )}
                            
                            <p className="text-gray-500 text-xs mt-1">
                                Format recommandé: JPG, PNG. Taille max: 2MB
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Identity Section */}
                <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-gray-700 font-medium">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                value={personalInfo.firstName}
                                onChange={(e) => onInfoChange('firstName', e.target.value)}
                                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                                placeholder="Votre prénom"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-gray-700 font-medium">Nom</label>
                            <input
                                type="text"
                                id="lastName"
                                value={personalInfo.lastName}
                                onChange={(e) => onInfoChange('lastName', e.target.value)}
                                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                                placeholder="Votre nom"
                            />
                        </div>
                    </div>
                    
                    {/* Job Title */}
                    <div className="space-y-2">
                        <label htmlFor="jobTitle" className="block text-gray-700 font-medium">Titre professionnel</label>
                        <input
                            type="text"
                            id="jobTitle"
                            value={personalInfo.jobTitle}
                            onChange={(e) => onInfoChange('jobTitle', e.target.value)}
                            className="w-full px-4  text-gray-700 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                            placeholder="Ex: Développeur Full Stack, Designer UX/UI..."
                        />
                    </div>
                    
                    {/* Address */}
                    <div className="space-y-2">
                        <label htmlFor="address" className="block text-gray-700 font-medium">Adresse</label>
                        <input
                            type="text"
                            id="address"
                            value={personalInfo.address}
                            onChange={(e) => onInfoChange('address', e.target.value)}
                            className="w-full px-4 py-3  text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                            placeholder="Ville, Pays"
                        />
                    </div>
                    
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-gray-700 font-medium">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                value={personalInfo.phone}
                                onChange={(e) => onInfoChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border  text-gray-700  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                                placeholder="+33 6 12 34 56 78"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={personalInfo.email}
                                onChange={(e) => onInfoChange('email', e.target.value)}
                                className="w-full px-4 py-3 border text-gray-700  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200"
                                placeholder="votre.email@exemple.com"
                            />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-gray-700 font-medium">
                            Présentation professionnelle
                            <span className="ml-1 text-sm font-normal text-gray-500">(résumé de votre profil)</span>
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={personalInfo.description}
                            onChange={(e) => onInfoChange('description', e.target.value)}
                            className="w-full px-4 py-3 border text-gray-700  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200 resize-none"
                            placeholder="Présentez-vous en quelques phrases. Quelles sont vos compétences clés et vos principales réalisations?"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Cette présentation sera mise en valeur en haut de votre CV. Soyez concis et percutant.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PersonalInfoForm;