import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Upload,
  ShieldCheck,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Video,
  VideoOff,
  Send,
  Info,
  RotateCcw
} from 'lucide-react';
import apiClient from '../services/api';
import UploadDropzone from '../components/common/UploadDropzone';
import ScoreGauge from '../components/common/ScoreGauge';
import { Loader, EmptyState } from '../components/common/Loader';

export default function HygieneMonitor() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'video' | 'camera'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Live Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // AI Assistant Chat State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your kitchen food safety inspector. Ask me about sanitation protocols, cross-contamination prevention, or HACCP guidelines.'
    }
  ]);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Video Audit State
  const [videoJobId, setVideoJobId] = useState(null);
  const [videoProgressPct, setVideoProgressPct] = useState(0);
  const [videoProgressMsg, setVideoProgressMsg] = useState('');
  const [pollInterval, setPollInterval] = useState(null);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [cameraStream, pollInterval]);

  // Start live webcam
  const handleStartCamera = async () => {
    setErrorMsg('');
    setActiveTab('camera');
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
      console.error('Camera access error:', err);
      setErrorMsg('Could not open camera. Please grant camera permission or upload a photo instead.');
      setIsCameraActive(false);
    }
  };

  // Stop camera
  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture snapshot from live camera
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
        const file = new File([blob], `kitchen_snapshot_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleStopCamera();
        setActiveTab('photo');
        handlePhotoUpload(file);
      }
    }, 'image/jpeg', 0.9);
  };

  // Upload and analyze kitchen photo
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setReport(null);
    setErrorMsg('');

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await apiClient.post('/hygiene/analyze-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 40000
      });

      if (res && res.overall_score !== undefined) {
        setReport(res);
      } else {
        setErrorMsg('Could not analyze kitchen photo. Please retry.');
      }
    } catch (err) {
      console.error('Photo hygiene scan failed:', err);
      setErrorMsg(err.message || 'Error communicating with vision hygiene inspector.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Preset sample photo
  const handleSelectSamplePhoto = async (sampleType) => {
    const filename = sampleType === 'clean'
      ? 'clean_commercial_prep.jpg'
      : (sampleType === 'cross' ? 'cross_contamination_hazard.jpg' : 'street_food_stall.jpg');

    const dummyBlob = new Blob([`SAMPLE_HYGIENE_${sampleType.toUpperCase()}`], { type: 'image/jpeg' });
    const file = new File([dummyBlob], filename, { type: 'image/jpeg' });
    handlePhotoUpload(file);
  };

  // Video Analysis Flow
  const handleVideoUpload = async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setReport(null);
    setErrorMsg('');
    setVideoProgressPct(10);
    setVideoProgressMsg('Uploading video for frame analysis...');

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await apiClient.post('/hygiene/analyze-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000
      });

      if (res && res.job_id) {
        setVideoJobId(res.job_id);
        startPollingVideo(res.job_id);
      } else {
        setErrorMsg('Failed to queue video audit. Please try photo mode.');
        setIsAnalyzing(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Video upload failed.');
      setIsAnalyzing(false);
    }
  };

  const startPollingVideo = (id) => {
    if (pollInterval) clearInterval(pollInterval);
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      try {
        const job = await apiClient.get(`/hygiene/job/${id}`);
        if (!job) return;
        if (job.progress_pct !== undefined) setVideoProgressPct(job.progress_pct);
        if (job.progress_message) setVideoProgressMsg(job.progress_message);

        if (job.status === 'completed' || job.status === 'requires_api_key') {
          clearInterval(interval);
          setPollInterval(null);
          setReport(job);
          setIsAnalyzing(false);
          return;
        }
        if (job.status === 'failed') {
          clearInterval(interval);
          setPollInterval(null);
          setErrorMsg(job.error_message || 'Video audit failed.');
          setIsAnalyzing(false);
          return;
        }
        if (count > 50) {
          clearInterval(interval);
          setPollInterval(null);
          setErrorMsg('Video inspection timed out.');
          setIsAnalyzing(false);
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 1500);
    setPollInterval(interval);
  };

  // Ask AI Assistant Question
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
        context_type: 'hygiene',
        context_data: report ? {
          overall_score: report.overall_score,
          hygiene_grade: report.hygiene_grade,
          indicators: report.indicators,
          flagged_incidents: report.flagged_incidents
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
          text: 'To maintain spotless kitchen hygiene: sanitize prep counters with food-contact disinfectant, use separate color-coded cutting boards for raw poultry (yellow) and vegetables (green), and ensure trash bins are sealed.'
        }
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleCopyHash = () => {
    if (report?.file_hash) {
      navigator.clipboard.writeText(report.file_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hygiene_Inspection_Report_${report.file_hash_short || report.job_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden canvas for webcam snap */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Module Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <Video className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Hygiene Detector & Inspection
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Automated food-safety audit analyzing personal protective equipment, cross-contamination, and station sanitation.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
          <button
            onClick={() => { setActiveTab('photo'); handleStopCamera(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'photo'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Photo Audit
          </button>
          <button
            onClick={() => { setActiveTab('video'); handleStopCamera(); }}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'video'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Video Audit
          </button>
          <button
            onClick={handleStartCamera}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'camera'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Live Camera
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Live Camera / AI Assistant */}
        <div className="lg:col-span-5 space-y-4">
          {/* Photo Dropzone */}
          {activeTab === 'photo' && (
            <div className="card-base p-5 space-y-4">
              <UploadDropzone
                onFileAccepted={handlePhotoUpload}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                maxSizeMB={20}
                title="Upload Kitchen Photo"
                subtitle="Station prep counter, cutting board, sink, or food handler photo"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)] font-medium">Or try sample:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSamplePhoto('clean')}
                  className="pill-btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
                >
                  Clean Prep Station
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSamplePhoto('cross')}
                  className="pill-btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
                >
                  Cross-Contamination
                </button>
              </div>
            </div>
          )}

          {/* Video Dropzone */}
          {activeTab === 'video' && (
            <div className="card-base p-5 space-y-3">
              <UploadDropzone
                onFileAccepted={handleVideoUpload}
                accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
                maxSizeMB={100}
                title="Upload Kitchen Video"
                subtitle="Audit footage (MP4, MOV, WebM up to 100MB). Analyzes ~1 frame every 2s."
              />
            </div>
          )}

          {/* Live Camera View */}
          {activeTab === 'camera' && (
            <div className="card-base p-5 space-y-3 text-center">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[var(--border-color)]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Live Feed</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="pill-btn-primary py-1.5 px-4 text-xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Capture & Audit</span>
                </button>
                <button
                  type="button"
                  onClick={() => { handleStopCamera(); setActiveTab('photo'); }}
                  className="pill-btn-secondary py-1.5 px-3 text-xs cursor-pointer"
                >
                  <VideoOff className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* Transparent Rubric Card */}
          <div className="card-base p-4 space-y-2 text-xs">
            <h4 className="font-semibold text-[var(--text-primary)]">
              Transparent Evaluation Rubric
            </h4>
            <div className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
              <div className="py-1 flex justify-between">
                <span>Gloves worn during ready-to-eat prep</span>
                <span className="font-medium text-[var(--text-primary)]">15 pts</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>Hair cap / hairnet in food zones</span>
                <span className="font-medium text-[var(--text-primary)]">15 pts</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>No bare-hand ready food contact</span>
                <span className="font-medium text-[var(--text-primary)]">20 pts</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>Raw vs cooked cross-contamination</span>
                <span className="font-medium text-[var(--text-primary)]">20 pts</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>Surface & cutting board cleanliness</span>
                <span className="font-medium text-[var(--text-primary)]">15 pts</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>No pests / trash bins covered</span>
                <span className="font-medium text-[var(--text-primary)]">10 pts</span>
              </div>
              <div className="py-1 flex justify-between">
                <span>General attire & handwash station</span>
                <span className="font-medium text-[var(--text-primary)]">5 pts</span>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-faint)] pt-1">
              * Note: Critical violations (e.g. cross-contact with raw meat) cap the maximum grade to Grade C or Fail regardless of other scores.
            </p>
          </div>

          {/* AI Safety Consultant Chat */}
          <div className="card-base p-4 space-y-3">
            <h4 className="font-semibold text-xs text-[var(--text-primary)]">
              Ask Food Safety Consultant
            </h4>

            <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
              {aiChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[var(--text-primary)] ml-4'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] mr-4'
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
                placeholder="Ask about HACCP, sanitization, cutting boards..."
                className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isAskingAi || !aiQuestion.trim()}
                className="pill-btn-primary py-1.5 px-3 text-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Inspection Results */}
        <div className="lg:col-span-7 space-y-4">
          {isAnalyzing && (
            <Loader
              message={activeTab === 'video' ? 'Analyzing video frames...' : 'Inspecting kitchen sanitation...'}
              subtext={videoProgressMsg || 'Auditing personal gear, surface cleanliness, and cross-contamination risks'}
              progress={activeTab === 'video' ? videoProgressPct : null}
            />
          )}

          {errorMsg && (
            <div className="card-base p-4 border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20 text-xs text-red-700 dark:text-red-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" strokeWidth={1.5} />
              <div>
                <p className="font-semibold">Inspection Alert</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {!isAnalyzing && !report && !errorMsg && (
            <EmptyState
              icon={Video}
              title="Ready for Kitchen Inspection"
              description="Upload a photo or video of your prep station, cutting board, sink, or food handler to audit sanitation standards."
              actionLabel="Try Clean Station Sample"
              onAction={() => handleSelectSamplePhoto('clean')}
            />
          )}

          {/* Full Report */}
          {report && (
            <div className="space-y-4">
              {/* Score & Summary Card */}
              <div className="card-base p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <ScoreGauge
                      score={report.overall_score || 0}
                      label="Hygiene Score"
                      size={110}
                      color={
                        report.overall_score >= 80 ? '#10B981' : (report.overall_score >= 65 ? '#F59E0B' : '#EF4444')
                      }
                    />
                    <div>
                      <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                        Compliance Grade
                      </span>
                      <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mt-0.5">
                        {report.hygiene_grade || (report.overall_score >= 80 ? 'Grade A (Compliant)' : 'Grade B (Minor Deficiencies)')}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-[var(--border-color)] bg-[var(--bg-card-subtle)]">
                        {report.compliance_status === 'pass' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.5} />
                        )}
                        <span className="uppercase text-[11px] font-semibold text-[var(--text-primary)]">
                          {report.compliance_status || 'Audited'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {previewUrl && (
                    <div className="w-28 h-20 rounded-xl overflow-hidden border border-[var(--border-color)] shrink-0">
                      <img src={previewUrl} alt="Station" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Indicators Checkpoints */}
                <div className="pt-3 border-t border-[var(--border-color)]">
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2.5">
                    Sanitation Checkpoints
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(report.indicators || {}).map(([key, val]) => (
                      <div
                        key={key}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          val
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        {val ? (
                          <span className="text-[11px] font-semibold flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            PASS
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold flex items-center gap-1 text-rose-700 dark:text-rose-400">
                            <XCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                            ATTN
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary & SHA Verification */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">Evaluation Summary</span>
                    {report.file_hash && (
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                        title="Copy cryptographic file hash"
                      >
                        {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>SHA: {report.file_hash_short || report.file_hash.slice(0, 8)}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {report.summary_report}
                  </p>
                </div>
              </div>

              {/* Actionable Recommendations */}
              {report.recommendations && report.recommendations.length > 0 && (
                <div className="card-base p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                      <span>Actionable Sanitation Checklist</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="pill-btn-secondary text-xs py-1 px-3 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" strokeWidth={1.5} />
                      <span>Export JSON</span>
                    </button>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {report.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[var(--text-primary)]">
                        <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Permanent Disclaimer */}
              <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 text-[var(--text-faint)] mt-0.5" strokeWidth={1.5} />
                <p>
                  <strong>Disclaimer:</strong> This automated report provides AI decision support based on visible camera footage and optical inspection algorithms. It does not replace formal municipal, FSSAI, or FDA regulatory inspections.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
