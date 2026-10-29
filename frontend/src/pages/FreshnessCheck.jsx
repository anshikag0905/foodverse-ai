import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  PackagePlus,
  Info,
  Check,
  Clock,
  Camera,
  Send,
  VideoOff,
  Plus
} from 'lucide-react';
import apiClient from '../services/api';
import UploadDropzone from '../components/common/UploadDropzone';
import ScoreGauge from '../components/common/ScoreGauge';
import { Loader, EmptyState } from '../components/common/Loader';

export default function FreshnessCheck() {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [addedToPantry, setAddedToPantry] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Live Camera
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Storage context
  const [storageCondition, setStorageCondition] = useState('refrigerated'); // 'refrigerated' | 'room_temp' | 'freezer'
  const [daysStored, setDaysStored] = useState('');

  // Ask AI Chat
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hi! I am your Food Spoilage & Safety Inspector. Ask me about safe consumption, freezing guidelines, or how to tell if produce has turned bad.'
    }
  ]);

  const sampleOptions = [
    { label: "Fresh Apple", hint: "apple_fresh.jpg" },
    { label: "Ripe Banana", hint: "banana_ripe.jpg" },
    { label: "Moldy Bread", hint: "bread_moldy.jpg" },
  ];

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `spoilage_snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleStopCamera();
        handleAnalyze(file, null);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleAnalyze = async (file, sampleHint = null) => {
    setIsAnalyzing(true);
    setResult(null);
    setAddedToPantry(false);

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (sampleHint) {
      formData.append('sample_name', sampleHint);
      setPreviewUrl(`/demo-assets/${sampleHint}`);
    }

    formData.append('storage_condition', storageCondition);
    if (daysStored) formData.append('days_stored', daysStored);

    try {
      const res = await apiClient.post('/freshness/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      setResult(res);
    } catch (err) {
      console.error('Freshness analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskAi = async (e) => {
    e?.preventDefault();
    if (!aiQuestion.trim() || isAskingAi) return;

    const userText = aiQuestion.trim();
    setAiChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiQuestion('');
    setIsAskingAi(true);

    try {
      const res = await apiClient.post('/ai/ask', {
        question: userText,
        context_type: 'freshness',
        context_data: result ? {
          item_name: result.item_name,
          freshness_score: result.freshness_score,
          status: result.status,
          shelf_life_range: result.shelf_life_range || result.estimated_days_left,
          storage_advice: result.storage_advice
        } : null
      });

      if (res && res.answer) {
        setAiChatHistory((prev) => [...prev, { sender: 'ai', text: res.answer }]);
      }
    } catch (err) {
      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'If there are visible signs of fuzzy mold or slime, discard immediately. Cooking does not eliminate heat-stable mold mycotoxins.'
        }
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleAddToPantry = () => {
    if (!result) return;
    try {
      const pantryItem = {
        id: `pantry_${Date.now()}`,
        name: result.item_name,
        category: 'Produce',
        added_date: new Date().toISOString().split('T')[0],
        expiry_date: result.suggested_expiry_date || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        status: result.status,
        quantity: '1 portion'
      };
      const existing = JSON.parse(localStorage.getItem('foodverse_pantry_items') || '[]');
      localStorage.setItem('foodverse_pantry_items', JSON.stringify([pantryItem, ...existing]));
      setAddedToPantry(true);
    } catch {
      setAddedToPantry(true);
    }
  };

  const statusStyles = {
    fresh: {
      badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      label: "Fresh & Optimal",
      dot: "bg-emerald-500"
    },
    moderately_fresh: {
      badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      label: "Use Soon (Peak Ripeness)",
      dot: "bg-amber-500"
    },
    spoiled: {
      badge: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      label: "Spoiled / Unsafe",
      dot: "bg-red-500"
    }
  };

  const curStyle = result ? statusStyles[result.status] || statusStyles.fresh : statusStyles.fresh;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <canvas ref={canvasRef} className="hidden" />

      {/* Module Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <ShieldAlert className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Spoilage Detector & Freshness Assessment
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Inspects mold, slime, browning, wrinkling, and package bloating with shelf-life range estimation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={isCameraActive ? handleStopCamera : handleStartCamera}
          className={`pill-btn-secondary text-xs py-1.5 px-3.5 cursor-pointer ${
            isCameraActive ? 'border-red-500 text-red-500' : ''
          }`}
        >
          <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{isCameraActive ? 'Close Camera' : 'Live Camera'}</span>
        </button>
      </div>

      {/* Live Camera View */}
      {isCameraActive && (
        <div className="card-base p-5 space-y-3 max-w-xl mx-auto text-center">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[var(--border-color)]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Camera Active</span>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={handleCaptureSnapshot}
              className="pill-btn-primary py-1.5 px-4 text-xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Snap & Inspect</span>
            </button>
            <button
              type="button"
              onClick={handleStopCamera}
              className="pill-btn-secondary py-1.5 px-3 text-xs cursor-pointer"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload & Context Section */}
      {!isCameraActive && (
        <div className="card-base p-6 space-y-4">
          <UploadDropzone
            onFileAccepted={(file) => handleAnalyze(file, null)}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
            maxSizeMB={15}
            title="Upload Food or Packaging Photo"
            subtitle="Capture fresh produce, leftovers, dairy, or printed expiration label (JPG, PNG up to 15MB)"
          />

          {/* Storage Context Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="text-[var(--text-muted)] font-medium">Storage Condition:</span>
            {['refrigerated', 'room_temp', 'freezer'].map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setStorageCondition(cond)}
                className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer capitalize ${
                  storageCondition === cond
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
                }`}
              >
                {cond.replace('_', ' ')}
              </button>
            ))}

            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[var(--text-muted)]">Days stored:</span>
              <input
                type="number"
                min="0"
                max="60"
                value={daysStored}
                onChange={(e) => setDaysStored(e.target.value)}
                placeholder="0"
                className="w-14 px-2 py-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-center text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Quick sample items */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-muted)] font-medium">Or try sample:</span>
            {sampleOptions.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnalyze(null, sample.hint)}
                className="pill-btn-secondary text-xs py-1 px-3 cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isAnalyzing && (
        <Loader
          message="Inspecting food biomarkers & surface texture..."
          subtext="Checking for mold spores, cellular breakdown, discoloration, and estimated shelf-life range"
        />
      )}

      {/* Empty State */}
      {!result && !isAnalyzing && (
        <EmptyState
          icon={ShieldAlert}
          title="No food item inspected yet"
          description="Upload a photo or capture from live camera to inspect produce, bread, or groceries for freshness."
          actionLabel="Try Sample Apple"
          onAction={() => handleAnalyze(null, 'apple_fresh.jpg')}
        />
      )}

      {/* Inspection Results */}
      {result && !isAnalyzing && (
        <div className="space-y-6">
          <div className="card-base p-6 space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3.5">
                {previewUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-color)] shrink-0">
                    <img src={previewUrl} alt={result.item_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                      {result.item_name}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${curStyle.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${curStyle.dot}`} />
                      <span>{curStyle.label}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Remaining Shelf Life: <strong className="text-[var(--text-primary)]">{result.shelf_life_range || `${result.estimated_days_left || 3} days`}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToPantry}
                disabled={addedToPantry || result.status === 'spoiled'}
                className="pill-btn-primary text-xs py-2 px-4 cursor-pointer disabled:opacity-50 self-end sm:self-auto"
              >
                {addedToPantry ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : <PackagePlus className="w-3.5 h-3.5" strokeWidth={1.5} />}
                <span>{addedToPantry ? 'Logged in Pantry' : 'Save to Pantry'}</span>
              </button>
            </div>

            {/* Score & Storage Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ScoreGauge
                score={result.freshness_score}
                label="Freshness Index"
                explanation={result.consumption_verdict}
              />

              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] space-y-2 text-xs">
                <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                  <span>Storage & Preservation Guidance</span>
                </h4>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {result.storage_advice}
                </p>
              </div>
            </div>

            {/* Visual Indicators Observed */}
            {result.visual_indicators && result.visual_indicators.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                  Visual Surface Indicators:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {result.visual_indicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] flex items-center gap-2 text-[var(--text-primary)]"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Q&A Chat */}
          <div className="card-base p-5 space-y-3">
            <h4 className="font-semibold text-xs text-[var(--text-primary)]">
              Ask AI About This Food Item
            </h4>

            <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
              {aiChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[var(--text-primary)] ml-4'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] mr-4 leading-relaxed'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAskAi} className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Can I freeze this? How to cook safely?..."
                className="flex-1 px-3.5 py-2 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isAskingAi || !aiQuestion.trim()}
                className="pill-btn-primary py-2 px-4 text-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
