import React from 'react';
import { PersonalInfo } from '../../types/cv';

interface PreviewContactProps {
  personalInfo: PersonalInfo;
}

const PreviewContact: React.FC<PreviewContactProps> = ({ personalInfo }) => {
  const defaultPhone = '+237 6 12 34 56 78';
  const defaultEmail = 'email@example.com';
  const defaultAddress = '123 Rue de la République, awae';
  const accentColor = "#6366f1"; // Indigo

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-2 text-sm bg-gray-50 p-4 pt-2 rounded-lg">
      {/* Téléphone */}
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={accentColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
          <p className="text-gray-600 break-words">
            {personalInfo.phone || defaultPhone}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={accentColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
          <p className="text-gray-600 break-words">
            {personalInfo.email || defaultEmail}
          </p>
        </div>
      </div>

      {/* Adresse */}
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={accentColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">Adresse</h3>
          <p className="text-gray-600 break-words">
            {personalInfo.address || defaultAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewContact;