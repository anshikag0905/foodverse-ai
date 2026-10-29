import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Eye } from 'lucide-react';

export default function Timeline({
  events = [
    {
      timestamp: "00:03s",
      indicator: "Glove Compliance",
      status: "fail", // "pass" | "fail"
      description: "Direct bare hand contact observed near poultry preparation counter.",
      thumbnailUrl: null
    },
    {
      timestamp: "00:06s",
      indicator: "Hair-Cap & PPE",
      status: "pass",
      description: "Full hair net and apron compliance verified across prep team.",
      thumbnailUrl: null
    },
    {
      timestamp: "00:12s",
      indicator: "Surface Sanitization",
      status: "pass",
      description: "Stainless steel station wipe-down verified before vegetable chopping.",
      thumbnailUrl: null
    }
  ],
  onSeekTo,
  className = ""
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Clock className="w-4 h-4 text-emerald-500" />
        <span>Inspection Video Incident Timeline</span>
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {events.map((evt, idx) => {
          const isPass = evt.status === "pass";
          return (
            <div key={idx} className="relative group">
              {/* Dot Indicator */}
              <div
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                  isPass ? 'bg-emerald-500' : 'bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950/60'
                }`}
              >
                {isPass ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                ) : (
                  <AlertCircle className="w-2.5 h-2.5 text-white" />
                )}
              </div>

              {/* Event Card */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSeekTo && onSeekTo(evt.timestamp)}
                      type="button"
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition-colors"
                      title="Seek video to this moment"
                    >
                      {evt.timestamp}
                    </button>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {evt.indicator}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isPass
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {isPass ? 'Pass' : 'Flagged Incident'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {evt.description}
                </p>

                {evt.thumbnailUrl && (
                  <img
                    src={evt.thumbnailUrl}
                    alt={`Frame at ${evt.timestamp}`}
                    className="mt-2 w-32 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
