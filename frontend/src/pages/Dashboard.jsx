import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Utensils,
  ShieldCheck,
  Video,
  Sparkles,
  Calendar,
  Package,
  Dumbbell,
  Lightbulb,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import Loader from '../components/common/Loader';
import ScoreGauge from '../components/common/ScoreGauge';
import ExpiryBadge from '../components/common/ExpiryBadge';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/dashboard/summary');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader message="Synthesizing multimodal food intelligence..." />
      </div>
    );
  }

  const stats = data?.stats || {};
  const alerts = data?.alerts || [];
  const trends = data?.nutrition_trends || [];
  const recent = data?.recent_analyses || [];
  const expiring = data?.expiring_items || [];
  const fact = data?.featured_fact;

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Nutrition & Hygiene Command Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            FoodVerse AI Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Real-time multisensory telemetry, kitchen safety audits, and predictive dietary insights.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/food-scan"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition"
          >
            <Utensils className="w-3.5 h-3.5" />
            Scan Meal
          </Link>
          <Link
            to="/freshness"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Check Freshness
          </Link>
          <Link
            to="/gym"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 transition"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Gym Mode
          </Link>
        </div>
      </div>

      {/* Active High-Priority Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                alert.severity === 'danger'
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                  : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">{alert.title}</h4>
                  <p className="text-xs opacity-90 mt-0.5">{alert.message}</p>
                </div>
              </div>
              {alert.link && (
                <Link
                  to={alert.link}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 text-xs font-bold shadow-2xs hover:opacity-90 whitespace-nowrap"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Multimodal Scans</span>
            <Utensils className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.total_scans || 0}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{stats.today_scans || 0} today
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Image, video, audio & barcode records</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pantry Inventory</span>
            <Package className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.active_pantry_items || 0}
            </span>
            {stats.expiring_pantry_count > 0 && (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {stats.expiring_pantry_count} urgent
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Tracked items in fridge, freezer & shelf</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Kitchen Waste Rate</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.food_waste_rate || 0}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Optimal &lt;15%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Pantry items discarded vs consumed</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gym Target Adherence</span>
            <Dumbbell className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.gym_calorie_adherence || 0}%
            </span>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              {stats.gym_protein_adherence || 0}% Prot
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Today's calorie & protein completion</p>
        </div>
      </div>

      {/* Main Analytics Row: 7-Day Trends & Featured Science Fact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Nutrition Trends Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                7-Day Calorie & Macro Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily nutritional volume logged across meals and athletic logs.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="proteinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#calorieGrad)" name="Calories (kcal)" />
                <Area type="monotone" dataKey="protein" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#proteinGrad)" name="Protein (g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Featured Food Science Card */}
        <div className="bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-3xl border border-amber-500/25 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950">
                <Lightbulb className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                Food Science Insight
              </span>
            </div>

            <blockquote className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              "{fact?.fact || "Bananas produce natural ethylene gas that speeds up the ripening of adjacent fruits."}"
            </blockquote>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Category: <strong className="text-slate-700 dark:text-slate-300">{fact?.category || "Freshness & Storage"}</strong>
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-amber-500/20 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Verified by FoodVerse AI</span>
            <Link
              to="/did-you-know"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline"
            >
              Explore Facts <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Row: Recent Multimodal Activity & Expiring Items Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Multimodal Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Multimodal Inferences
            </h3>
            <Link
              to="/history"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View Full History
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent scans recorded. Upload a food photo or scan a kitchen video to get started.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                      {rec.analysis_type === 'freshness' ? (
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Utensils className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {rec.item_name || 'Food Scan Item'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {rec.analysis_type} • Confidence {Math.round(rec.confidence * 100)}% • {new Date(rec.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rec.score !== null && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Score: {rec.score}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                      {rec.data_source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Pantry Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-500" />
                Urgent Expirations
              </h3>
              <Link to="/pantry" className="text-xs font-semibold text-emerald-600 hover:underline">
                Pantry
              </Link>
            </div>

            {expiring.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All pantry items are fresh! No items expiring within 3 days.
              </div>
            ) : (
              <div className="space-y-2">
                {expiring.map((it) => (
                  <div
                    key={it.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{it.name}</h5>
                      <span className="text-[10px] text-slate-500">{it.storage_location}</span>
                    </div>
                    <ExpiryBadge
                      expiryDate={it.expiry_date}
                      daysLeft={it.days_remaining}
                      status={it.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/pantry"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs text-center shadow-sm transition block"
          >
            Cook Expiring Items Now
          </Link>
        </div>
      </div>
    </div>
  );
}
