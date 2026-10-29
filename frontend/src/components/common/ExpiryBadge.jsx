import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ExpiryBadge({
  expiryDate,
  daysLeft = null,
  status = "fresh", // "fresh", "use_soon", "expired"
  className = ""
}) {
  let calculatedDays = daysLeft;
  if (calculatedDays === null && expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);
    const diffTime = exp.getTime() - today.getTime();
    calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  let finalStatus = status;
  if (calculatedDays !== null) {
    if (calculatedDays < 0) finalStatus = "expired";
    else if (calculatedDays <= 3) finalStatus = "use_soon";
    else finalStatus = "fresh";
  }

  let config = {
    bg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    icon: CheckCircle,
    label: calculatedDays !== null ? `${calculatedDays}d left` : "Fresh",
  };

  if (finalStatus === "expired") {
    config = {
      bg: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800",
      icon: AlertCircle,
      label: calculatedDays !== null ? `Expired (${Math.abs(calculatedDays)}d ago)` : "Expired",
    };
  } else if (finalStatus === "use_soon") {
    config = {
      bg: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      icon: Clock,
      label: calculatedDays !== null ? `Use Soon (${calculatedDays}d left)` : "Use Soon",
    };
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.bg} ${className}`}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
