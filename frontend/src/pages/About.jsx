import React from 'react';
import {
  User,
  GraduationCap,
  Github,
  Mail,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Code2,
  Heart
} from 'lucide-react';
import { aboutConfig } from '../config/about';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* CREATOR PROFILE HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-transparent border border-emerald-500/25 p-8 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar / Visual Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-xl shadow-emerald-600/20">
              <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center p-3">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  AG
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  AI & ML Lead
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-600 text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                {aboutConfig.education}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {aboutConfig.name}
              </h1>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {aboutConfig.role}
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {aboutConfig.bio}
            </p>

            {/* Skills Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {aboutConfig.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Links and Contact Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-3">
              <a
                href={aboutConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-90 transition"
              >
                <Github className="w-4 h-4" />
                GitHub Profile
              </a>

              <a
                href={`mailto:${aboutConfig.links.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT VISION & ARCHITECTURE */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            About {aboutConfig.project.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {aboutConfig.project.tagline}
          </p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {aboutConfig.project.description}
        </p>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Multimodal AI Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Accepts meal photos, commercial kitchen videos, voice queries, and barcodes through unified routers backed by pluggable provider interfaces (Gemini & Deterministic Mock).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 w-fit">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              SQLite FTS5 Global Database
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Over 20,000 international and regional foods indexed with full-text fuzzy search, macro compositions, and allergen tags under a strict sub-5MB storage footprint.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Explainability & Safety
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every inference reveals confidence metrics, sensory cues, and provenance ("Database" vs "AI estimate"). Calorie floor rules safeguard metabolic health.
            </p>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Full-Stack Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {aboutConfig.project.techStack.map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {tech.name}
                <span className="text-[10px] text-slate-400 font-normal">({tech.category})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Attribution & Open Science */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Open Data Attribution & Compliance
          </h4>
          <p>
            FoodVerse AI relies on openly licensed foundational nutrition and hygiene corpora:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>USDA FoodData Central</strong> (Foundation, SR Legacy, FNDDS) – Public Domain</li>
            <li><strong>Open Food Facts</strong> – Open Database License (ODbL 1.0) with database attribution</li>
            <li><strong>Indian Food Composition Tables (IFCT)</strong> & regional cuisine taxonomy files</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
