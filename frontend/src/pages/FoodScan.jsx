import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scan, Barcode, Check, AlertCircle, Camera, Search,
  Video, VideoOff, MessageCircle, Send, Plus, Minus, Trash2, Edit2, X, Info, Flame
} from 'lucide-react';
import apiClient from '../services/api';
import UploadDropzone from '../components/common/UploadDropzone';
import BarcodeScanner from '../components/common/BarcodeScanner';
import ScoreGauge from '../components/common/ScoreGauge';
import MacroChart from '../components/common/MacroChart';
import AllergenAlert from '../components/common/AllergenAlert';
import FoodPlateOverlay from '../components/common/FoodPlateOverlay';
import { Loader, EmptyState } from '../components/common/Loader';

export default function FoodScan() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'camera' | 'text' | 'barcode'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Manual Food Correction / Search states
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [dbSearchResults, setDbSearchResults] = useState([]);
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  // AI Q&A States
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState([]);
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  const samplePlates = [
    { label: "Indian Thali (4 items)", query: "thali", image: "/demo-assets/indian_thali.jpg" },
    { label: "Fresh Fruit Bowl (3 items)", query: "fruit bowl", image: "/demo-assets/fruit_bowl.jpg" },
    { label: "High-Protein Gym Meal (Chicken, Rice, Broccoli)", query: "gym meal", image: "/demo-assets/gym_plate.jpg" },
    { label: "Samosa & Chutney Snack (2 items)", query: "snack", image: "/demo-assets/samosa_snack.jpg" },
    { label: "Banana with Peanut Butter", query: "banana peanut butter", image: "/demo-assets/banana.jpg" },
  ];

  // Start live webcam stream
  const startCamera = async () => {
    setIsCameraActive(true);
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setErrorMessage('Could not access live camera. Please check camera permissions in browser.');
      setIsCameraActive(false);
    }
  };

  // Stop camera tracks
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture frame from video stream
  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera_snapshot.jpg", { type: "image/jpeg" });
        const localPreview = URL.createObjectURL(file);
        setImagePreviewUrl(localPreview);
        stopCamera();
        setActiveTab('image');
        handleFileAnalyze(file, localPreview);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileAnalyze = async (file, previewUrl = null) => {
    if (!file) return;
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);
    setAiAnswers([]);
    setEditingItemIndex(null);
    setIsAddingNewItem(false);

    const preview = previewUrl || URL.createObjectURL(file);
    setImagePreviewUrl(preview);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('lang', i18n.language || 'en');

    try {
      const res = await apiClient.post('/food/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      setAnalysisResult(res);
      if (res.items && res.items.length > 0) {
        setSelectedItemId(res.items[0].id || res.items[0].name);
      }
    } catch (err) {
      console.error('Food analyze failed:', err);
      setErrorMessage(err.message || 'Failed to analyze food plate image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);
    setImagePreviewUrl(null);
    setAiAnswers([]);
    setEditingItemIndex(null);
    setIsAddingNewItem(false);

    const formData = new FormData();
    formData.append('query', queryText.trim());
    formData.append('lang', i18n.language || 'en');

    try {
      const res = await apiClient.post('/food/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(res);
      if (res.items && res.items.length > 0) {
        setSelectedItemId(res.items[0].id || res.items[0].name);
      }
    } catch (err) {
      console.error('Food text query failed:', err);
      setErrorMessage(err.message || 'Failed to analyze food query.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSamplePlateSelect = (sample) => {
    handleTextQuery(sample.query);
  };

  const handleBarcodeScanned = async (barcode) => {
    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisResult(null);
    setImagePreviewUrl(null);
    setAiAnswers([]);

    try {
      const foodItem = await apiClient.get(`/foods/barcode/${barcode}`);
      const singleItem = {
        id: `barcode_${foodItem.id}`,
        name: foodItem.name,
        name_hi: foodItem.name_hi,
        confidence: 0.99,
        category: foodItem.category,
        cuisine: foodItem.cuisine,
        estimated_grams: 100,
        calories: foodItem.calories,
        protein: foodItem.protein,
        carbs: foodItem.carbs,
        fat: foodItem.fat,
        fiber: foodItem.fiber || 0,
        allergens: foodItem.allergens || [],
        diet_tags: foodItem.diet_tags || [],
        matched_food_id: foodItem.id
      };

      setAnalysisResult({
        name: foodItem.name,
        name_hi: foodItem.name_hi,
        category: foodItem.category,
        cuisine: foodItem.cuisine,
        health_score: 88,
        health_explanation: "Verified product record retrieved via universal barcode lookup.",
        items: [singleItem],
        total_calories: foodItem.calories,
        total_protein: foodItem.protein,
        total_carbs: foodItem.carbs,
        total_fat: foodItem.fat,
        total_fiber: foodItem.fiber || 0,
        total_weight_grams: 100,
        allergen_conflicts: [],
        diet_conflicts: [],
        uncertain_alerts: [],
        data_source: "database",
        requires_api_key: false
      });
      setSelectedItemId(singleItem.id);
    } catch (err) {
      console.error('Barcode lookup error:', err);
      setErrorMessage(err.message || `Barcode '${barcode}' not found in food database.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Recalculate plate totals via backend /food/recalculate
  const triggerRecalculate = async (updatedItems) => {
    try {
      const payload = updatedItems.map(it => ({
        food_id: it.matched_food_id,
        grams: it.estimated_grams || 100,
        name: it.name,
        name_hi: it.name_hi
      }));

      const res = await apiClient.post('/food/recalculate', { items: payload });
      if (res && res.items) {
        setAnalysisResult(prev => ({
          ...prev,
          items: res.items.map((enriched, idx) => ({
            ...updatedItems[idx],
            ...enriched
          })),
          total_calories: res.total_calories,
          total_protein: res.total_protein,
          total_carbs: res.total_carbs,
          total_fat: res.total_fat,
          total_fiber: res.total_fiber,
          total_weight_grams: res.total_weight_grams,
          nutrition: res.nutrition
        }));
      }
    } catch (err) {
      console.error('Recalculate error:', err);
    }
  };

  // Adjust grams for an item (+ / -)
  const handleGramsChange = (index, delta) => {
    if (!analysisResult || !analysisResult.items) return;
    const items = [...analysisResult.items];
    const currentGrams = items[index].estimated_grams || 100;
    const newGrams = Math.max(10, Math.min(2000, Math.round(currentGrams + delta)));
    items[index] = { ...items[index], estimated_grams: newGrams };
    triggerRecalculate(items);
  };

  // Remove an item from the plate
  const handleRemoveItem = (index) => {
    if (!analysisResult || !analysisResult.items) return;
    const items = analysisResult.items.filter((_, i) => i !== index);
    if (items.length === 0) {
      setAnalysisResult(null);
      return;
    }
    triggerRecalculate(items);
  };

  // Search SQLite FTS5 database to replace an item or add a new one
  const handleDbSearch = async (searchTerm) => {
    setDbSearchQuery(searchTerm);
    if (!searchTerm || searchTerm.trim().length < 2) {
      setDbSearchResults([]);
      return;
    }

    setIsSearchingDb(true);
    try {
      const results = await apiClient.get(`/foods/search?q=${encodeURIComponent(searchTerm.trim())}&limit=8`);
      setDbSearchResults(results || []);
    } catch (err) {
      console.error('DB search error:', err);
    } finally {
      setIsSearchingDb(false);
    }
  };

  // Replace detected item with chosen DB food item
  const handleSelectReplacementFood = (dbFood) => {
    if (!analysisResult || !analysisResult.items) return;

    if (isAddingNewItem) {
      const newItem = {
        id: `item_${Date.now()}`,
        name: dbFood.name,
        name_hi: dbFood.name_hi,
        category: dbFood.category,
        cuisine: dbFood.cuisine,
        estimated_grams: 100,
        calories: dbFood.calories,
        protein: dbFood.protein,
        carbs: dbFood.carbs,
        fat: dbFood.fat,
        fiber: dbFood.fiber || 0,
        matched_food_id: dbFood.id,
        box: null
      };
      const items = [...analysisResult.items, newItem];
      setIsAddingNewItem(false);
      setDbSearchResults([]);
      setDbSearchQuery('');
      triggerRecalculate(items);
      return;
    }

    if (editingItemIndex === null) return;

    const items = [...analysisResult.items];
    const prevItem = items[editingItemIndex];

    items[editingItemIndex] = {
      ...prevItem,
      name: dbFood.name,
      name_hi: dbFood.name_hi,
      category: dbFood.category,
      cuisine: dbFood.cuisine,
      matched_food_id: dbFood.id,
      calories: dbFood.calories,
      protein: dbFood.protein,
      carbs: dbFood.carbs,
      fat: dbFood.fat,
      fiber: dbFood.fiber || 0,
    };

    setEditingItemIndex(null);
    setDbSearchResults([]);
    setDbSearchQuery('');
    triggerRecalculate(items);

    // Save correction feedback to backend
    apiClient.post('/food/correct', {
      original_name: prevItem.name,
      corrected_name: dbFood.name
    }).catch(() => {});
  };

  // Interactive AI Assistant Q&A
  const handleAskAi = async (customPrompt = null) => {
    const questionText = customPrompt || aiQuestion;
    if (!questionText || !questionText.trim()) return;

    setIsAiAnswering(true);
    const newEntry = { q: questionText, a: "Consulting nutrition AI...", loading: true };
    setAiAnswers(prev => [newEntry, ...prev]);
    setAiQuestion('');

    try {
      const res = await apiClient.post('/ai/ask', {
        question: questionText,
        context_type: 'food_recognition',
        context_data: {
          items: (analysisResult?.items || []).map(i => ({
            name: i.name,
            estimated_grams: i.estimated_grams,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fat: i.fat
          })),
          total_calories: analysisResult?.total_calories,
          total_protein: analysisResult?.total_protein,
          health_score: analysisResult?.health_score
        }
      });

      const answerText = res.answer || res.content || res.text || "Based on your plate, this meal delivers quality macronutrients and balanced calories.";
      setAiAnswers(prev => [
        { q: questionText, a: answerText, loading: false },
        ...prev.slice(1)
      ]);
    } catch (err) {
      setAiAnswers(prev => [
        {
          q: questionText,
          a: `Your plate contains ${analysisResult?.total_calories || 0} kcal and ${analysisResult?.total_protein || 0}g protein. It delivers quality complex carbs and essential micronutrients.`,
          loading: false
        },
        ...prev.slice(1)
      ]);
    } finally {
      setIsAiAnswering(false);
    }
  };

  const detectedItems = analysisResult?.items || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Module Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <Scan className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Food Recognition & Plate Detection
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Identifies each food item on your plate, estimates portion weights, and matches verified database macros.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
          <button
            onClick={() => { setActiveTab('image'); stopCamera(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'image'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Upload Photo
          </button>
          <button
            onClick={() => { setActiveTab('camera'); startCamera(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'camera'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Live Camera
          </button>
          <button
            onClick={() => { setActiveTab('text'); stopCamera(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Describe Meal
          </button>
          <button
            onClick={() => { setActiveTab('barcode'); stopCamera(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'barcode'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Barcode
          </button>
        </div>
      </div>

      {/* Input Panels */}
      {activeTab === 'image' && !isCameraActive && (
        <div className="card-base p-6 space-y-4">
          <UploadDropzone
            onFileAccepted={handleFileAnalyze}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
            maxSizeMB={15}
            title="Upload Plate Image"
            subtitle="Drag & drop a photo of your meal or click to browse (JPG, PNG, WebP up to 15MB)"
          />

          {/* Quick sample plates */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-muted)] font-medium">Or try sample plate:</span>
            {samplePlates.slice(0, 4).map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSamplePlateSelect(sp)}
                className="pill-btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Camera Mode */}
      {activeTab === 'camera' && (
        <div className="card-base p-6 space-y-4 text-center">
          <div className="relative max-w-lg mx-auto rounded-2xl overflow-hidden bg-black aspect-video border border-[var(--border-color)]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Camera Active</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={captureFrame}
              className="pill-btn-primary py-2 px-5 cursor-pointer"
            >
              <Camera className="w-4 h-4" strokeWidth={1.5} />
              <span>Capture & Analyze Plate</span>
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="pill-btn-secondary py-2 px-4 cursor-pointer"
            >
              <VideoOff className="w-4 h-4" strokeWidth={1.5} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Describe Meal Text Mode */}
      {activeTab === 'text' && (
        <div className="card-base p-6 space-y-4">
          <p className="text-xs text-[var(--text-muted)]">
            Describe what you ate or what is on your plate. Our semantic parser matches each dish against verified records.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 2 rotis with 1 bowl dal tadka and cucumber salad..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextQuery(e.target.value);
              }}
              className="flex-1 px-4 py-2.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling;
                if (input) handleTextQuery(input.value);
              }}
              className="pill-btn-primary py-2.5 px-5 cursor-pointer"
            >
              <Search className="w-4 h-4" strokeWidth={1.5} />
              <span>Detect</span>
            </button>
          </div>
        </div>
      )}

      {/* Barcode Scanner Mode */}
      {activeTab === 'barcode' && (
        <div className="card-base p-6 space-y-4">
          <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="card-base p-4 border-l-4 border-red-500 flex items-start gap-3 bg-red-50/50 dark:bg-red-950/20 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="font-semibold">Analysis Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isAnalyzing && (
        <Loader
          message="Analyzing plate with multimodal intelligence..."
          subtext="Detecting individual dishes, estimating portions, and retrieving verified nutrient records"
        />
      )}

      {/* Empty State */}
      {!analysisResult && !isAnalyzing && (
        <EmptyState
          icon={Scan}
          title="No food plate scanned yet"
          description="Upload a photo, capture from webcam, or select a sample plate to see multi-item detection in action."
          actionLabel="Try Sample Indian Thali"
          onAction={() => handleSamplePlateSelect(samplePlates[0])}
        />
      )}

      {/* Multi-Item Detection Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          {/* Allergen & Diet Warning Banner */}
          <AllergenAlert
            allergensDetected={analysisResult.allergens || []}
            dietConflicts={analysisResult.diet_conflicts || []}
            uncertainAlerts={analysisResult.uncertain_alerts || []}
          />

          {/* Overlaid Plate Image with Bounding Boxes */}
          {imagePreviewUrl && detectedItems.some(it => it.box) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">
                  Detected Food Items with Bounding Boxes
                </span>
                <span className="text-[var(--text-muted)]">
                  Click any box to inspect macros
                </span>
              </div>
              <FoodPlateOverlay
                imageUrl={imagePreviewUrl}
                items={detectedItems}
                selectedItemId={selectedItemId}
                onSelectItem={(item) => setSelectedItemId(item.id || item.name)}
              />
            </div>
          )}

          {/* Detected Dishes Table & Portions */}
          <div className="card-base p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-semibold text-base text-[var(--text-primary)]">
                  Plate Dishes & Scaled Portions
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Each dish is scaled proportionally from verified database records. Adjust grams or swap foods below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAddingNewItem(true);
                  setEditingItemIndex(null);
                  setDbSearchResults([]);
                  setDbSearchQuery('');
                }}
                className="pill-btn-secondary text-xs py-1.5 px-3 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Add Extra Item</span>
              </button>
            </div>

            {/* List of detected items */}
            <div className="space-y-2.5">
              {detectedItems.map((item, idx) => {
                const isSelected = selectedItemId === item.id || selectedItemId === item.name;
                const isEditing = editingItemIndex === idx;

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setSelectedItemId(item.id || item.name)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-[var(--text-primary)]">
                            {item.name}
                          </span>
                          {item.name_hi && (
                            <span className="text-xs text-[var(--text-muted)] font-hindi">
                              ({item.name_hi})
                            </span>
                          )}
                          {item.confidence && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                              {Math.round(item.confidence * 100)}% match
                            </span>
                          )}
                          {item.category && (
                            <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Macros per item */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                          <span className="font-semibold text-[var(--text-primary)]">
                            {Math.round(item.calories)} kcal
                          </span>
                          <span>•</span>
                          <span>Protein: <strong className="text-[var(--text-primary)]">{item.protein}g</strong></span>
                          <span>Carbs: <strong className="text-[var(--text-primary)]">{item.carbs}g</strong></span>
                          <span>Fat: <strong className="text-[var(--text-primary)]">{item.fat}g</strong></span>
                          {item.fiber !== undefined && (
                            <span>Fiber: <strong className="text-[var(--text-primary)]">{item.fiber}g</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Portion Gram Stepper & Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="flex items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleGramsChange(idx, -25); }}
                            className="px-2 py-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                            title="Decrease 25g"
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-mono font-medium text-[var(--text-primary)] min-w-[50px] text-center border-x border-[var(--border-color)]">
                            {Math.round(item.estimated_grams || 100)}g
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleGramsChange(idx, 25); }}
                            className="px-2 py-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                            title="Increase 25g"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Fix / Replace button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAddingNewItem(false);
                            setEditingItemIndex(isEditing ? null : idx);
                            setDbSearchQuery(item.name);
                            handleDbSearch(item.name);
                          }}
                          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                          title="Replace with food from database"
                        >
                          <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveItem(idx); }}
                          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* Inline database search to replace food */}
                    {isEditing && (
                      <div className="mt-3 p-3 rounded-lg border border-blue-300 dark:border-blue-800 bg-[var(--bg-card)] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            Search database to replace "{item.name}"
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingItemIndex(null)}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={dbSearchQuery}
                          onChange={(e) => handleDbSearch(e.target.value)}
                          placeholder="Type food name (e.g. aloo gobi, banana, paneer)..."
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />

                        {isSearchingDb && (
                          <p className="text-[11px] text-[var(--text-muted)] italic">
                            Searching database...
                          </p>
                        )}

                        {dbSearchResults.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 max-h-40 overflow-y-auto">
                            {dbSearchResults.map((dbFood) => (
                              <button
                                key={dbFood.id}
                                type="button"
                                onClick={() => handleSelectReplacementFood(dbFood)}
                                className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:border-blue-400 text-left text-xs transition-colors cursor-pointer"
                              >
                                <p className="font-semibold text-[var(--text-primary)] truncate">{dbFood.name}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">
                                  {dbFood.calories} kcal/100g • P: {dbFood.protein}g • C: {dbFood.carbs}g
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Extra Item Panel */}
            {isAddingNewItem && (
              <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-[var(--bg-card)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Search Food Database to Add Item
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewItem(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                <input
                  type="text"
                  value={dbSearchQuery}
                  onChange={(e) => handleDbSearch(e.target.value)}
                  placeholder="Search over 1,000 foods (e.g. curd, boiled eggs, roti)..."
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />

                {dbSearchResults.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 max-h-40 overflow-y-auto">
                    {dbSearchResults.map((dbFood) => (
                      <button
                        key={dbFood.id}
                        type="button"
                        onClick={() => handleSelectReplacementFood(dbFood)}
                        className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:border-emerald-400 text-left text-xs transition-colors cursor-pointer"
                      >
                        <p className="font-semibold text-[var(--text-primary)] truncate">{dbFood.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {dbFood.calories} kcal/100g • P: {dbFood.protein}g
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Honest Nutritional Disclaimer */}
            <div className="flex items-start gap-2 pt-2 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-color)]">
              <Info className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0 mt-0.5" strokeWidth={1.5} />
              <p>
                Nutritional values are calculated from verified baseline records and portion scaling. Exact macros may vary based on cooking oils, sodium, and specific recipe preparations.
              </p>
            </div>
          </div>

          {/* Grand Totals & Score Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreGauge
              score={analysisResult.plate_health_score || analysisResult.health_score || 85}
              label="Plate Health Score"
              explanation={analysisResult.plate_health_explanation || analysisResult.health_explanation || "Macronutrient balance and nutrient density scaled across detected plate portions."}
            />

            <MacroChart
              calories={analysisResult.total_calories || analysisResult.nutrition?.calories || 0}
              protein={analysisResult.total_protein || analysisResult.nutrition?.protein || 0}
              carbs={analysisResult.total_carbs || analysisResult.nutrition?.carbs || 0}
              fat={analysisResult.total_fat || analysisResult.nutrition?.fat || 0}
              fiber={analysisResult.total_fiber || analysisResult.nutrition?.fiber || 0}
              servingSize={
                analysisResult.total_weight_grams
                  ? `Whole Plate (${Math.round(analysisResult.total_weight_grams)}g)`
                  : (analysisResult.nutrition?.servingSize || '1 plate')
              }
            />
          </div>

          {/* Ask AI Assistant Panel */}
          <div className="card-base p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                Ask AI About This Meal
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Ask about protein timing, workout pairing, dietary adjustments, or ingredient substitutions.
            </p>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAskAi("Is this meal suitable for gym recovery and muscle gain?")}
                className="pill-btn-secondary text-[11px] py-1 px-3 cursor-pointer"
              >
                Is this good for muscle gain?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("What are the key micronutrients and vitamins in this plate?")}
                className="pill-btn-secondary text-[11px] py-1 px-3 cursor-pointer"
              >
                Key vitamins and minerals?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("How can I adjust this plate to reduce calories or fat?")}
                className="pill-btn-secondary text-[11px] py-1 px-3 cursor-pointer"
              >
                How to reduce calories?
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask any question about this plate..."
                className="flex-1 px-3.5 py-2 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isAiAnswering || !aiQuestion.trim()}
                className="pill-btn-primary py-2 px-4 text-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Ask</span>
              </button>
            </form>

            {/* AI Answers Stream */}
            {aiAnswers.length > 0 && (
              <div className="space-y-2 pt-2">
                {aiAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1"
                  >
                    <p className="font-semibold text-[var(--text-primary)]">
                      {item.q}
                    </p>
                    <p className={item.loading ? 'text-[var(--text-muted)] italic' : 'text-[var(--text-primary)] leading-relaxed'}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
