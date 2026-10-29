import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('hi') ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const isHindi = i18n.language?.startsWith('hi');

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      aria-label="Toggle Language"
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all duration-200 ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>{isHindi ? 'English' : 'हिन्दी'}</span>
    </button>
  );
}
