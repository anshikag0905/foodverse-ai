import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Mic, MicOff, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UploadDropzone({
  accept = "image/*",
  mediaType = "image", // "image", "video", "audio", "all"
  onFileSelect,
  onTextQuery,
  onSampleSelect,
  sampleOptions = [],
  isUploading = false,
  uploadProgress = 0,
  maxSizeMB = 50,
  className = ""
}) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage("");
    if (!file) return;

    // Size validation
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setErrorMessage(`File exceeds ${maxSizeMB} MB limit.`);
      return;
    }

    setSelectedFile(file);

    // Create preview for images and videos
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onFileSelect) onFileSelect(null);
  };

  // Speech-to-Text handler
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        if (onTextQuery) onTextQuery(transcript);
        setIsRecording(false);
      };
      recognition.onerror = (err) => {
        console.error("Speech error", err);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() && onTextQuery) {
      onTextQuery(textInput.trim());
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 md:p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-emerald-400 dark:hover:border-emerald-500/70'
        } ${selectedFile ? 'cursor-default' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && validateAndProcessFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="relative inline-block max-w-sm mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="w-full max-h-64 object-cover"
                />
              ) : selectedFile.type.startsWith("video/") ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-64 object-cover"
                />
              ) : (
                <div className="p-8 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800">
                  <FileText className="w-8 h-8 text-emerald-600" />
                  <span className="font-semibold text-sm">{selectedFile.name}</span>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-lg"
                title="Remove selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs mx-auto space-y-1.5">
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('common.analyzing')} {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              {mediaType === "video" ? (
                <Video className="w-8 h-8" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div>
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Click to browse or drag and drop your {mediaType}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Supported formats: {accept} (Max {maxSizeMB} MB)
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-rose-500 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Multimodal Alternatives: Text query / Voice speech input */}
      {onTextQuery && (
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a dish name, ingredient query, or recipe request..."
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
              title={isRecording ? "Listening... click to stop" : "Speak voice query"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-5 py-2.5 rounded-2xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition-all"
          >
            Ask
          </button>
        </form>
      )}

      {/* Try a Sample Action (Demo Mode) */}
      {sampleOptions.length > 0 && onSampleSelect && (
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('common.try_sample')}:</span>
          </span>
          {sampleOptions.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSampleSelect(sample)}
              className="px-3 py-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300 transition-all shadow-xs"
            >
              {sample.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
