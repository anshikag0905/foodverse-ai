import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Mic, MicOff, FileText, CheckCircle2, AlertCircle, X, Sparkles, Send } from 'lucide-react';
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
      if (onFileSelect) onFileSelect(processed);
    } catch (e) {
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
        className={`relative border-3 border-dashed rounded-3xl p-6 md:p-8 text-center transition-all cursor-pointer shadow-sticker ${
          isDragging
            ? 'border-tomato bg-tomato/10 scale-[1.01]'
            : 'border-ink bg-white dark:bg-dusk-card hover:border-tomato hover:shadow-sticker-lg'
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
            <div className="relative inline-block max-w-sm mx-auto overflow-hidden rounded-2xl border-2.5 border-ink shadow-sticker-sm">
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
                <div className="p-8 flex items-center justify-center gap-3 bg-sky-100 dark:bg-dusk-surface">
                  <FileText className="w-8 h-8 text-tomato" />
                  <span className="font-bold text-sm text-ink">{selectedFile.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-dusk-card border-2 border-ink text-ink hover:bg-tomato hover:text-white transition-colors shadow-sticker-xs cursor-pointer"
                title="Remove selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-ink dark:text-dusk-text">
              <CheckCircle2 className="w-4 h-4 text-mint" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs mx-auto space-y-1.5">
                <div className="w-full bg-sky-100 dark:bg-dusk-surface rounded-full h-2.5 border border-ink overflow-hidden">
                  <div
                    className="bg-tomato h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs font-black text-ink dark:text-dusk-text">
                  {t('common.analyzing')} {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 dark:bg-dusk-surface border-2.5 border-ink flex items-center justify-center text-ink dark:text-dusk-text shadow-sticker-sm">
              {mediaType === "video" ? (
                <Video className="w-8 h-8 text-teal" />
              ) : (
                <UploadCloud className="w-8 h-8 text-tomato" />
              )}
            </div>

            <div>
              <p className="font-display font-black text-base text-ink dark:text-dusk-text">
                Click to browse or drop your {mediaType} here
              </p>
              <p className="text-xs font-semibold text-ink-muted mt-1">
                Supported: {accept} (Max {maxSizeMB} MB)
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tomato/20 border-2 border-tomato text-xs font-bold text-tomato">
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
              placeholder="Or type a dish name (e.g. Fresh Apple, Paneer Tikka, Oatmeal)..."
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border-2.5 border-ink bg-white dark:bg-dusk-card text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-tomato"
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl border border-ink transition-all ${
                isRecording
                  ? 'bg-tomato text-white animate-pulse'
                  : 'bg-sky-100 dark:bg-dusk-surface text-ink hover:bg-sunny'
              }`}
              title={isRecording ? "Listening... click to stop" : "Speak voice query"}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="btn-squish inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-display font-black bg-tomato hover:bg-tomato/90 disabled:opacity-50 text-white border-2 border-ink shadow-sticker-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      )}

      {/* Try a Sample Action */}
      {sampleOptions.length > 0 && onSampleSelect && (
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-ink-muted flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sunny" />
            <span>Try sample:</span>
          </span>
          {sampleOptions.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSampleSelect(sample)}
              className="btn-squish px-3 py-1 rounded-full text-xs font-bold border-2 border-ink bg-white dark:bg-dusk-surface hover:bg-sunny/30 text-ink dark:text-dusk-text shadow-sticker-xs cursor-pointer transition-all"
            >
              {sample.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
