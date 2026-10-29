import React, { useState } from 'react';
import {
  GraduationCap,
  Github,
  Mail,
  Cpu,
  Database,
  ShieldCheck,
  Code2,
  Check,
  Copy
} from 'lucide-react';
import { aboutConfig } from '../config/about';
import AnimatedGirlFace from '../components/common/AnimatedGirlFace';

export default function About() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(aboutConfig.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Creator Profile Hero Card */}
      <div className="card-base p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Animated Girl Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-[var(--border-color)] flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs">
            <AnimatedGirlFace size={88} />
          </div>

          {/* Profile Information */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                <GraduationCap className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{aboutConfig.education}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
                {aboutConfig.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {aboutConfig.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
              {aboutConfig.bio}
            </p>

            {/* Skills Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {aboutConfig.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Links and Contact Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
              <a
                href={aboutConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>GitHub Profile</span>
              </a>

              <a
                href={`mailto:${aboutConfig.links.email}`}
                className="pill-btn-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="pill-btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />}
                <span>{copied ? 'Copied' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Vision & Architecture */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
            About {aboutConfig.project.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {aboutConfig.project.tagline}
          </p>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {aboutConfig.project.description}
        </p>

        {/* 3 Architecture Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-base p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900">
              <Cpu className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Multimodal AI Engine
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Accepts meal photos, commercial kitchen videos, and food text queries through unified endpoints backed by Google Gemini Vision.
            </p>
          </div>

          <div className="card-base p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900">
              <Database className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Verified SQLite FTS5 Database
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Over 1,000 authentic Indian, Japanese, and global nutrition records with instant full-text search and alias resolution.
            </p>
          </div>

          <div className="card-base p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Safety & Explainability
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every inference provides transparent rubrics, visual bounding boxes, and portion scaling to maintain accuracy and reliability.
            </p>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="card-base p-5 space-y-3">
          <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            <span>Full-Stack Technology Stack</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {aboutConfig.project.techStack.map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="font-medium">{tech.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">({tech.category})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
