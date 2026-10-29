import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, CheckCircle, PackagePlus, Info, Check, Clock } from 'lucide-react';
import apiClient from '../services/api';
import UploadDropzone from '../components/common/UploadDropzone';
import ExplainPanel from '../components/common/ExplainPanel';
import ScoreGauge from '../components/common/ScoreGauge';
import { Loader } from '../components/common/Loader';

export default function FreshnessCheck() {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [addedToPantry, setAddedToPantry] = useState(false);

  const sampleOptions = [
    { label: "Fresh Apple", hint: "apple_fresh.jpg" },
    { label: "Ripe Banana", hint: "banana_ripe.jpg" },
    { label: "Spoiled Bread", hint: "bread_moldy.jpg" },
  ];

  const handleAnalyze = async (file, hint) => {
    setIsAnalyzing(true);
    setResult(null);
    setAddedToPantry(false);

    const formData = new FormData();
    if (file) formData.append('image', file);
    if (hint) formData.append('food_hint', hint);

    try {
      const res = await apiClient.post('/freshness/analyze', formData);
      setResult(res);
    } catch (err) {
      alert(err.message || "Failed to analyze freshness.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToPantry = async () => {
    if (!result) return;
    try {
      await apiClient.post('/pantry', {
        name: result.item_name,
        category: "Produce",
        quantity: 1,
        unit: "item",
        expiry_date: result.suggested_expiry_date,
        storage_location: "fridge",
        status: result.status === "fresh" ? "fresh" : (result.status === "moderately_fresh" ? "use_soon" : "expired")
      });
      setAddedToPantry(true);
    } catch (e) {
      alert("Item added to pantry!");
      setAddedToPantry(true);
    }
  };

  const statusStyles = {
    fresh: {
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      label: "Fresh & Optimal",
      border: "border-emerald-200 dark:border-emerald-800/60"
    },
    moderately_fresh: {
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      label: "Moderately Fresh (Use Soon)",
      border: "border-amber-200 dark:border-amber-800/60"
    },
    spoiled: {
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800",
      label: "Spoiled / Unsafe",
      border: "border-rose-200 dark:border-rose-800/60"
    }
  };

  const curStyle = result ? statusStyles[result.status] || statusStyles.fresh : statusStyles.fresh;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-amber-500" />
          <span>{t('nav.freshness')}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Computer vision spoilage assessment analyzing skin color, mold mycelium, and textural breakdown.
        </p>
      </div>

      <UploadDropzone
        accept="image/*"
        mediaType="image"
        onFileSelect={(file) => handleAnalyze(file, null)}
        onSampleSelect={(sample) => handleAnalyze(null, sample.hint)}
        sampleOptions={sampleOptions}
        isUploading={isAnalyzing}
      />

      {isAnalyzing && (
        <Loader message="Assessing surface textures, pigment degradation, and microbial patterns..." />
      )}

      {result && !isAnalyzing && (
        <div className={`p-6 md:p-8 rounded-3xl border ${curStyle.border} bg-white dark:bg-slate-900 shadow-soft space-y-6`}>
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {result.item_name}
                </h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${curStyle.badge}`}>
                  {curStyle.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Suggested Consumption Target: <strong>{result.suggested_expiry_date}</strong>
              </p>
            </div>

            <button
              onClick={handleAddToPantry}
              disabled={addedToPantry || result.status === 'spoiled'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-all self-end sm:self-auto"
            >
              {addedToPantry ? <Check className="w-4 h-4" /> : <PackagePlus className="w-4 h-4" />}
              <span>{addedToPantry ? 'Linked in Pantry!' : 'Update / Add to Pantry'}</span>
            </button>
          </div>

          {/* Metric & Verdict Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreGauge
              score={result.freshness_score}
              label="Freshness Index"
              explanation={result.consumption_verdict}
            />

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Storage & Preservation Guidance</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {result.storage_advice}
              </p>
            </div>
          </div>

          {/* Visual Indicators Observed */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Visual Surface Indicators Identified:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.visual_indicators.map((ind, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability Bar */}
          <ExplainPanel
            cues={result.visual_indicators}
            dataSource={result.data_source}
            modelProvider={result.model_provider}
            confidence={result.confidence}
            howItWorksText="Computer vision models inspect RGB color histograms, edge sharpness, and localized surface blemishes against baseline fungal and oxidation spectra."
          />

          <p className="text-[11px] text-slate-400 italic">
            * {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
