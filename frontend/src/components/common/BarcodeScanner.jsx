import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Barcode, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const startScanning = async () => {
    setCameraError('');
    setIsScanning(true);

    // Prefer BarcodeDetector API if supported natively
    if ('BarcodeDetector' in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          const barcodeDetector = new window.BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code', 'code_128']
          });

          const detectInterval = setInterval(async () => {
            if (!videoRef.current || !isScanning) {
              clearInterval(detectInterval);
              return;
            }
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detected = barcodes[0].rawValue;
                clearInterval(detectInterval);
                stopScanning();
                if (onScanSuccess) onScanSuccess(detected);
              }
            } catch (err) {
              // Frame scan error
            }
          }, 300);
          return;
        }
      } catch (err) {
        console.warn('Native BarcodeDetector failed, falling back to ZXing', err);
      }
    }

    // ZXing Fallback
    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;

      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            stopScanning();
            if (onScanSuccess) onScanSuccess(result.getText());
          }
          if (err && !(err.name === 'NotFoundException')) {
            // Non-critical frame error
          }
        }
      );
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please allow camera permissions or type barcode below.');
      stopScanning();
      if (onScanError) onScanError(err);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {}
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim() && onScanSuccess) {
      onScanSuccess(manualCode.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Scanner Viewport */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 text-center">
        {isScanning ? (
          <div className="relative aspect-video max-w-md mx-auto overflow-hidden rounded-2xl bg-black">
            <video ref={videoRef} className="w-full h-full object-cover" />
            {/* Overlay target reticle */}
            <div className="absolute inset-0 border-2 border-emerald-500/50 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-28 border-2 border-emerald-400 rounded-lg shadow-glow-primary animate-pulse"></div>
            </div>
            <button
              onClick={stopScanning}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-600 transition-colors"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          </div>
        ) : (
          <div className="py-8 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center">
              <Barcode className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Scan Product Barcode</p>
              <p className="text-xs text-slate-400">Position the UPC / EAN barcode in the camera view</p>
            </div>
            <button
              onClick={startScanning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-900/40"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Barcode Scanner</span>
            </button>
          </div>
        )}

        {cameraError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      {/* Manual Barcode Input Fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Or enter 8, 12, or 13-digit barcode manually (e.g. 8901030383748)..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <button
          type="submit"
          disabled={!manualCode.trim()}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Lookup</span>
        </button>
      </form>
    </div>
  );
}
