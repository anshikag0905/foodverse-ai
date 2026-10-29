import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Eye } from 'lucide-react';
import { getAssetUrl } from '../../services/api';

export default function Timeline({
  events = [],
  onSeekTo,
  className = ""
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-display font-black text-base text-ink dark:text-dusk-text flex items-center gap-2">
        <Clock className="w-4 h-4 text-teal" />
        <span>Inspection Video Incident Timeline & Verified Moments</span>
      </h4>

      {(!events || events.length === 0) ? (
        <p className="text-xs font-semibold text-ink-muted italic">
          No critical hygiene incidents flagged during frame inspection.
        </p>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-ink/20 dark:before:bg-dusk-border">
          {events.map((evt, idx) => {
            const isPass = evt.status === "pass" || evt.severity === "low" || !evt.severity;
            const thumbSrc = getAssetUrl(evt.thumbnail_path || evt.thumbnailUrl);
            const indicatorName = evt.indicator || evt.type || "Safety Indicator";

            return (
              <div key={idx} className="relative group">
                {/* Dot Indicator */}
                <div
                  className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-dusk-card flex items-center justify-center ${
                    isPass ? 'bg-mint' : 'bg-tomato ring-4 ring-tomato/20'
                  }`}
                >
                  {isPass ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-ink" />
                  ) : (
                    <AlertCircle className="w-2.5 h-2.5 text-white" />
                  )}
                </div>

                {/* Event Card */}
                <div className="p-3.5 rounded-2xl border-2 border-ink bg-white dark:bg-dusk-card shadow-sticker-xs hover:border-ink transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSeekTo && onSeekTo(evt.timestamp)}
                        type="button"
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-100 dark:bg-dusk-surface text-ink dark:text-dusk-text border border-ink/40 hover:bg-teal hover:text-white transition-colors cursor-pointer"
                        title="Seek video to this moment"
                      >
                        {evt.timestamp}
                      </button>
                      <span className="text-xs font-display font-black text-ink dark:text-dusk-text">
                        {indicatorName}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-ink ${
                        isPass
                          ? 'bg-mint/30 text-emerald-900 dark:text-mint'
                          : 'bg-tomato/20 text-tomato dark:text-red-300'
                      }`}
                    >
                      {isPass ? 'Verified Pass' : 'Flagged Incident'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-ink-muted">
                    {evt.description}
                  </p>

                  {thumbSrc && (
                    <div className="mt-2.5">
                      <img
                        src={thumbSrc}
                        alt={`Inspection frame at ${evt.timestamp}`}
                        className="w-44 h-28 object-cover rounded-xl border-2 border-ink shadow-sticker-xs bg-slate-900"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}