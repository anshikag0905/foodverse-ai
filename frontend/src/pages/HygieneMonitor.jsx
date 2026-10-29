import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, ShieldCheck, Download, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import apiClient from '../services/api';
import UploadDropzone from '../components/common/UploadDropzone';
import ScoreGauge from '../components/common/ScoreGauge';
import Timeline from '../components/common/Timeline';
import { Loader } from '../components/common/Loader';

export default function HygieneMonitor() {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [pollInterval, setPollInterval] = useState(null);
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleOptions = [
    { label: "Sample Kitchen Prep Video", filename: "kitchen_prep.mp4" }
  ];

  const handleVideoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setReport(null);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await apiClient.post('/hygiene/analyze-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setJobId(res.job_id);
      startPolling(res.job_id);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit video for inspection.');
      setIsUploading(false);
    }
  };

  const handleSampleSelect = async () => {
    // Generate a mock video file from demo assets
    setIsUploading(true);
    setReport(null);
    setErrorMsg('');

    const formData = new FormData();
    const blob = new Blob(["dummy video bytes"], { type: "video/mp4" });
    formData.append('video', blob, "kitchen_prep.mp4");

    try {
      const res = await apiClient.post('/hygiene/analyze-video', formData);
      setJobId(res.job_id);
      startPolling(res.job_id);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit demo video.');
      setIsUploading(false);
    }
  };

  const startPolling = (id) => {
    const interval = setInterval(async () => {
      try {
        const jobData = await apiClient.get(`/hygiene/job/${id}`);
        if (jobData.status === 'completed') {
          clearInterval(interval);
          setReport(jobData);
          setIsUploading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 1500);
    setPollInterval(interval);
  };

  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pollInterval]);

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kitchen_Hygiene_Report_${report.job_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>{t('nav.hygiene')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Automated food safety video auditing: hair nets, gloves, cross-contamination, and station sanitization.
          </p>
        </div>

        {report && (
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm transition-all self-end md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Compliance Report (JSON)</span>
          </button>
        )}
      </div>

      {/* Video Upload Area */}
      <UploadDropzone
        accept="video/mp4,video/webm"
        mediaType="video"
        onFileSelect={handleVideoUpload}
        onSampleSelect={handleSampleSelect}
        sampleOptions={sampleOptions}
        isUploading={isUploading}
      />

      {isUploading && (
        <Loader message="Sampling video frames & checking food safety regulatory compliance..." />
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Report Dashboard */}
      {report && !isUploading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreGauge
              score={report.overall_score}
              label="Hygiene Compliance Score"
              explanation={report.summary_report}
              className="md:col-span-1"
            />

            {/* Per-Indicator Grid */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Core Safety & PPE Indicators
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(report.indicators || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                      val
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-100'
                    }`}
                  >
                    <span className="font-semibold capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    {val ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" /> Hazard
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timestamped Timeline of Incidents */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
            <Timeline events={report.flagged_incidents || []} />
          </div>

          {/* Recommendations Card */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Operational Recommendations
              </h4>
              <ul className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100 dark:border-slate-800">
                * {report.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
