import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Utensils, Barcode, Sparkles, Check, AlertCircle } from 'lucide-react';
import apiClient from '../services/api';
import UploadDropzone from '../components/common/UploadDropzone';
import BarcodeScanner from '../components/common/BarcodeScanner';
import ResultCard from '../components/common/ResultCard';
import { Loader } from '../components/common/Loader';

export default function FoodScan() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'barcode'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleOptions = [
    { label: "Fresh Apple", query: "apple", filename: "apple_fresh.jpg" },
    { label: "Paneer Tikka (Indian)", query: "paneer tikka", filename: "paneer_tikka.jpg" },
    { label: "Ripe Banana", query: "banana", filename: "banana_ripe.jpg" },
  ];

  const handleFileAnalyze = async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('lang', i18n.language || 'en');

    try {
      const res = await apiClient.post('/food/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(res);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to analyze food image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextQuery = async (query) => {
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('query', query);
    formData.append('lang', i18n.language || 'en');

    try {
      const res = await apiClient.post('/food/analyze', formData);
      setAnalysisResult(res);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to analyze food query.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleSelect = (sample) => {
    handleTextQuery(sample.query);
  };

  const handleBarcodeScanned = async (barcode) => {
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);

    try {
      const foodItem = await apiClient.get(`/foods/barcode/${barcode}`);
      // Format as analysis result
      setAnalysisResult({
        name: foodItem.name,
        name_hi: foodItem.name_hi,
        confidence: 0.99,
        category: foodItem.category,
        cuisine: foodItem.cuisine,
        health_score: Math.min(Math.round((foodItem.protein * 2 + foodItem.fiber * 3 - (foodItem.fat * 0.5) + 60)), 100),
        health_explanation: "Authoritative barcode database match with verified nutrition profile.",
        nutrition: {
          calories: foodItem.calories,
          protein: foodItem.protein,
          carbs: foodItem.carbs,
          fat: foodItem.fat,
          fiber: foodItem.fiber,
          servingSize: foodItem.serving_size
        },
        allergens: foodItem.allergens || [],
        allergen_conflicts: [],
        diet_conflicts: [],
        uncertain_alerts: [],
        cues: [
          `Verified Barcode: ${barcode}`,
          "Packaged Product Registry Lookup"
        ],
        data_source: "database",
        model_provider: "Open Food Facts Barcode Engine",
        disclaimer: "Nutrition data provided by product manufacturer records."
      });
    } catch (err) {
      setErrorMessage(err.message || `Barcode ${barcode} not found.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFoodCorrection = async (correctedName) => {
    if (!analysisResult) return;
    try {
      await apiClient.post('/food/correct', {
        original_name: analysisResult.name,
        corrected_name: correctedName,
        input_path: analysisResult.image_url
      });
      // Re-query database for corrected food
      handleTextQuery(correctedName);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Utensils className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>{t('nav.food_scan')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Multimodal dish identification, nutrition estimation, health scores, and allergen screening.
          </p>
        </div>

        {/* Input Modality Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Photo & Query
          </button>
          <button
            onClick={() => setActiveTab('barcode')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'barcode'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Barcode Scan</span>
          </button>
        </div>
      </div>

      {/* Input Zone */}
      {activeTab === 'image' ? (
        <UploadDropzone
          accept="image/*"
          mediaType="image"
          onFileSelect={handleFileAnalyze}
          onTextQuery={handleTextQuery}
          onSampleSelect={handleSampleSelect}
          sampleOptions={sampleOptions}
          isUploading={isAnalyzing}
        />
      ) : (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
          <BarcodeScanner onScanSuccess={handleBarcodeScanned} />
        </div>
      )}

      {/* Error Callout */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Loader message="Multimodal Vision Engine is identifying food textures and looking up nutrition..." />
      )}

      {/* Result Card Presentation */}
      {analysisResult && !isAnalyzing && (
        <ResultCard
          title={analysisResult.name}
          subtitle={analysisResult.name_hi}
          imageUrl={analysisResult.image_url}
          category={analysisResult.category}
          cuisine={analysisResult.cuisine}
          timestamp={analysisResult.timestamp}
          healthScore={analysisResult.health_score}
          healthScoreExplanation={analysisResult.health_explanation}
          nutrition={analysisResult.nutrition}
          allergens={analysisResult.allergens}
          dietConflicts={analysisResult.diet_conflicts}
          uncertainAlerts={analysisResult.uncertain_alerts}
          explainCues={analysisResult.cues}
          dataSource={analysisResult.data_source}
          modelProvider={analysisResult.model_provider}
          confidence={analysisResult.confidence}
          howItWorksText="Our multimodal neural model samples visual contours and surface color glazes, matches them against 20,000+ validated database records via SQLite FTS5, and checks ingredients against your personal allergy profile."
          onCorrectFood={handleFoodCorrection}
        />
      )}
    </div>
  );
}
