import React, { useState } from 'react';
import { Github, Mail, Check, Sparkles } from 'lucide-react';
import { aboutConfig } from '../../config/about';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(aboutConfig.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-auto border-t-3 border-ink bg-card/90 dark:bg-dusk-card/90 backdrop-blur-md py-6 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-display">
        {/* Creator Attribution */}
        <div className="flex items-center gap-2 text-ink dark:text-dusk-text font-extrabold text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-mint" />
          <span>Built by Anshika Gupta, AIML, LNCT College</span>
          <span className="hidden md:inline text-ink-muted/50">•</span>
          <span className="hidden md:inline text-ink-muted dark:text-dusk-muted font-body font-semibold">
            FoodVerse AI Multimodal Agent
          </span>
        </div>

        {/* Action Pills: GitHub & Email */}
        <div className="flex items-center gap-3">
          <a
            href={aboutConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-ink dark:text-dusk-text shadow-sticker-sm btn-squish font-extrabold text-xs cursor-pointer"
            title="View GitHub Profile"
          >
            <Github className="w-3.5 h-3.5 text-ink dark:text-dusk-text" />
            <span>GitHub</span>
          </a>

          <a
            href={`mailto:${aboutConfig.links.email}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tomato text-white border-2 border-ink shadow-sticker-sm btn-squish font-extrabold text-xs cursor-pointer"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-sky-200 dark:bg-dusk-surface border-2 border-ink text-ink dark:text-dusk-text shadow-sticker-sm btn-squish font-bold text-[11px] cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <span>Copy</span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}