import React, { useState } from 'react';
import {
  GraduationCap,
  Github,
  Mail,
  Sparkles,
  Cpu,
  Database,
  ShieldCheck,
  Code2,
  Heart,
  Check,
  Copy
} from 'lucide-react';
import { aboutConfig } from '../config/about';
import { DoodleAvocado, DoodlePancakes } from '../assets/doodles';

export default function About() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(aboutConfig.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* =========================================================================
          CREATOR PROFILE HERO CARD (ANSHIKA GUPTA, AIML, LNCT COLLEGE)
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 sm:p-8 md:p-10 shadow-sticker relative overflow-hidden">
        {/* Subtle background doodle */}
        <div className="absolute -top-4 -right-4 opacity-15 pointer-events-none rotate-12">
          <DoodlePancakes size={120} />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
          {/* Avatar Pill */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-sunny border-3 border-ink flex flex-col items-center justify-center p-3 shadow-sticker-sm">
              <span className="font-display font-black text-4xl text-ink">
                AG
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-ink/80 mt-1">
                AI / ML Lead
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-tomato text-white border-2 border-ink shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-dusk-surface border-2 border-ink text-xs font-black text-ink dark:text-dusk-text shadow-sticker-xs mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-tomato" />
                <span>{aboutConfig.education}</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-ink dark:text-dusk-text tracking-tight">
                {aboutConfig.name}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-tomato mt-0.5">
                {aboutConfig.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-ink-muted leading-relaxed max-w-2xl">
              {aboutConfig.bio}
            </p>

            {/* Colorful Skills Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {aboutConfig.skills.map((skill, idx) => {
                const colors = [
                  'bg-tomato/15 text-tomato border-tomato',
                  'bg-mint/25 text-emerald-800 dark:text-mint border-mint',
                  'bg-sunny/30 text-amber-900 dark:text-sunny border-sunny',
                  'bg-grape/15 text-grape border-grape',
                  'bg-peach/25 text-orange-800 dark:text-peach border-peach'
                ];
                const colorClass = colors[idx % colors.length];
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-black border-1.5 shadow-xs ${colorClass}`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>

            {/* Links and Contact Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a
                href={aboutConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white dark:bg-white dark:text-ink font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>

              <a
                href={`mailto:${aboutConfig.links.email}`}
                className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-tomato text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="btn-squish inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4 text-ink-muted" />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PROJECT VISION & ARCHITECTURE (FRIENDLY & SCANNABLE)
          ========================================================================= */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mint/25 border border-ink text-[11px] font-black uppercase text-emerald-800 dark:text-mint">
            <span>Project Overview</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
            About {aboutConfig.project.title}
          </h2>
          <p className="text-xs font-semibold text-ink-muted mt-0.5">
            {aboutConfig.project.tagline}
          </p>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-ink-muted leading-relaxed">
          {aboutConfig.project.description}
        </p>

        {/* 3 Architecture Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-tomato/20 border-2 border-ink flex items-center justify-center text-tomato shadow-xs">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
              Multimodal AI Engine
            </h3>
            <p className="text-xs font-semibold text-ink-muted leading-relaxed">
              Accepts meal photos, commercial kitchen videos, voice queries, and barcodes through unified routers backed by pluggable provider interfaces.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sunny/30 border-2 border-ink flex items-center justify-center text-amber-600 shadow-xs">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
              FTS5 Food Database
            </h3>
            <p className="text-xs font-semibold text-ink-muted leading-relaxed">
              Over 20,000 international and Indian foods indexed with full-text search, calibrated macro compositions, and allergen safety guardrails.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-mint/25 border-2 border-ink flex items-center justify-center text-emerald-700 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
              Safety & Explainability
            </h3>
            <p className="text-xs font-semibold text-ink-muted leading-relaxed">
              Every inference reveals confidence metrics, sensory cues, and provenance ("Database" vs "AI estimate") to keep nutrition clear and actionable.
            </p>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="p-6 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker space-y-3">
          <h3 className="font-display font-black text-base text-ink dark:text-dusk-text flex items-center gap-2">
            <Code2 className="w-5 h-5 text-tomato" />
            <span>Full-Stack Technology Stack</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {aboutConfig.project.techStack.map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-dusk-surface border-2 border-ink text-xs font-bold text-ink dark:text-dusk-text shadow-sticker-xs"
              >
                <span className="w-2 h-2 rounded-full bg-mint border border-ink" />
                <span>{tech.name}</span>
                <span className="text-[10px] text-ink-muted">({tech.category})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
