import React, { useState } from 'react';
import { Github, Mail, Check, Heart } from 'lucide-react';
import { aboutConfig } from '../../config/about';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(aboutConfig.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span>{aboutConfig.footerText}</span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden md:inline">FoodVerse AI Multimodal Agent</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={aboutConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href={`mailto:${aboutConfig.links.email}`}
            className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>

          <button
            onClick={copyEmail}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all text-[11px]"
            title="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <span>Copy Email</span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
