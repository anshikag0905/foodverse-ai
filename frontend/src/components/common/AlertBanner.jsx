import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function AlertBanner({
  type = "info", // "info", "success", "warning", "error"
  title,
  message,
  onDismiss,
  className = ""
}) {
  const configs = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100",
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100",
      icon: CheckCircle,
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100",
      icon: AlertTriangle,
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    error: {
      bg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100",
      icon: AlertCircle,
      iconColor: "text-rose-600 dark:text-rose-400"
    }
  };

  const current = configs[type] || configs.info;
  const Icon = current.icon;

  return (
    <div className={`p-4 rounded-2xl border ${current.bg} flex items-start gap-3 shadow-xs ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1">
        {title && <h5 className="text-xs font-bold uppercase tracking-wider mb-0.5">{title}</h5>}
        <p className="text-xs leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 transition-colors"
          title="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
