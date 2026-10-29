import React, { useState } from 'react';
import { Github, Mail, Check } from 'lucide-react';
import { aboutConfig } from '../../config/about';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(aboutConfig.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-auto border-t border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md py-5 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Creator Attribution */}
        <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Built by Anshika Gupta, AIML, LNCT College</span>
          <span className="hidden md:inline text-[var(--text-faint)]">•</span>
          <span className="hidden md:inline text-[var(--text-muted)]">
            FoodVerse AI Multimodal Platform
          </span>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2.5">
          <a
            href={aboutConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-blue-400 font-medium text-xs transition-colors"
            title="View GitHub Profile"
          >
            <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>GitHub</span>
          </a>

          <a
            href={`mailto:${aboutConfig.links.email}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Email</span>
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium text-[11px] transition-colors cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" strokeWidth={1.5} />
                <span>Copied</span>
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
