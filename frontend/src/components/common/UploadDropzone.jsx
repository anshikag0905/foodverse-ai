import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Mic, MicOff, FileText, CheckCircle2, AlertCircle, X, Sparkles, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UploadDropzone({
  accept = "image/*",
  mediaType = "image", // "image", "video", "audio", "all"
  onFileSelect,
  onFileAccepted,
  onTextQuery,
  onSampleSelect,
  sampleOptions = [],
  isUploading = false,
  uploadProgress = 0,
  maxSizeMB = 50,
  title,
  subtitle,
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

  // Normalize accept attribute if passed as an object (e.g. { 'image/*': ['.jpg', ...] })
  const normalizedAccept = React.useMemo(() => {
    if (!accept) return "image/*";
    if (typeof accept === 'string') return accept;
    if (typeof accept === 'object') {
      const parts = [];
      Object.entries(accept).forEach(([key, exts]) => {
        parts.push(key);
        if (Array.isArray(exts)) {
          parts.push(...exts);
        }
      });
      return parts.join(',');
    }
    return "image/*";
  }, [accept]);

  const compressImageIfNeeded = async (file) => {
    if (!file.type.startsWith("image/") || file.type.includes("svg") || file.size < 1024 * 1024) {
      return file;
    }
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        const maxDim = 1600;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob && blob.size < file.size) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, "image/jpeg", 0.85);
      };
      img.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const validateAndProcessFile = async (file) => {
    setErrorMessage("");
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File exceeds max size limit of ${maxSizeMB} MB`);
      return;
    }

    try {
      const processed = await compressImageIfNeeded(file);
      setSelectedFile(processed);
      const url = URL.createObjectURL(processed);
      setPreviewUrl(url);

      if (onFileAccepted) {
        onFileAccepted(processed);
      }
      if (onFileSelect) {
        onFileSelect(processed);
      }
    } catch (e) {
      console.error("Error processing file in dropzone:", e);
      setErrorMessage("Error processing media file.");
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
    if (onFileAccepted) onFileAccepted(null);
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

  const displayTitle = title || (mediaType === "video" ? "Upload Kitchen Video" : "Upload Food or Plate Photo");
  const displaySubtitle = subtitle || `Drag & drop your ${mediaType} or click to browse (Max ${maxSizeMB}MB)`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.005]'
            : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-blue-500/60 hover:bg-[var(--bg-card-subtle)]'
        } ${selectedFile ? 'cursor-default' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={normalizedAccept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && validateAndProcessFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="relative inline-block max-w-sm mx-auto overflow-hidden rounded-xl border border-[var(--border-color)] bg-black/5">
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="w-full max-h-64 object-contain"
                />
              ) : selectedFile.type.startsWith("video/") ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-64 object-contain"
                />
              ) : (
                <div className="p-8 flex items-center justify-center gap-3 bg-[var(--bg-card-subtle)]">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="font-medium text-sm text-[var(--text-primary)]">{selectedFile.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                title="Remove selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs mx-auto space-y-1.5">
                <div className="w-full bg-[var(--bg-card-subtle)] rounded-full h-2 border border-[var(--border-color)] overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs font-medium text-[var(--text-muted)]">
                  Analyzing {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
              {mediaType === "video" ? (
                <Video className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <UploadCloud className="w-6 h-6" strokeWidth={1.5} />
              )}
            </div>

            <div>
              <p className="font-semibold text-sm text-[var(--text-primary)]">
                {displayTitle}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
                {displaySubtitle}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-400">
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
              placeholder="Or type a meal (e.g. 2 Bananas, Paneer Butter Masala with Roti, Dal Khichdi)..."
              className="w-full pl-4 pr-10 py-2 rounded-xl text-xs sm:text-sm border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-[var(--text-muted)] hover:text-blue-600'
              }`}
              title={isRecording ? "Listening... click to stop" : "Speak voice query"}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="pill-btn-primary py-2 px-4 text-xs cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>
      )}

      {/* Try a Sample Action */}
      {sampleOptions.length > 0 && onSampleSelect && (
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
            <span>Try sample:</span>
          </span>
          {sampleOptions.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSampleSelect(sample)}
              className="pill-btn-secondary py-1 px-3 text-xs cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
