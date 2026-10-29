import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Utensils,
  ShieldCheck,
  Barcode,
  Calendar,
  CheckCircle2,
  Eye,
  FileJson,
  Sparkles
} from 'lucide-react';
import Loader, { DoodleEmptyState } from '../components/common/Loader';
import { DoodleDonut, DoodlePizza } from '../assets/doodles';

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [filterType]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.analysis_type = filterType;
      const res = await axios.get('/api/v1/history', { params });
      setHistoryItems(res.data);
    } catch (err) {
      // Local fallback history
      setHistoryItems([
        {
          id: 1,
          analysis_type: 'food_scan',
          item_name: 'Steamed Edamame & Brown Rice',
          confidence: 0.96,
          score: 92,
          data_source: 'database',
          model_provider: 'mock',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          analysis_type: 'freshness',
          item_name: 'Fresh Honeycrisp Apple',
          confidence: 0.94,
          score: 88,
          data_source: 'database',
          model_provider: 'mock',
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          analysis_type: 'food_scan',
          item_name: 'Grilled Paneer Tikka',
          confidence: 0.98,
          score: 84,
          data_source: 'database',
          model_provider: 'mock',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scan record?')) return;
    try {
      await axios.delete(`/api/v1/history/${id}`);
      setHistoryItems(prev => prev.filter(it => it.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (err) {
      setHistoryItems(prev => prev.filter(it => it.id !== id));
    }
  };

  const filteredItems = historyItems.filter(it => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (it.item_name && it.item_name.toLowerCase().includes(q)) ||
      (it.analysis_type && it.analysis_type.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* =========================================================================
          MODULE HEADER BAND (DOODLE DONUT)
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-dusk-surface border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
            <DoodleDonut size={46} className="animate-float" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200 dark:bg-dusk-surface border border-ink text-[11px] font-black uppercase text-ink dark:text-dusk-text">
              <span>Audit Trail</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Analysis History & Archive
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Review past food classifications, freshness scores, and sensory cue records.
            </p>
          </div>
        </div>
      </div>

      {/* Controls: Type Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`btn-squish px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-ink text-white dark:bg-white dark:text-ink shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-sky-100'
            }`}
          >
            All Scans ({historyItems.length})
          </button>
          <button
            onClick={() => setFilterType('food_scan')}
            className={`btn-squish px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
              filterType === 'food_scan'
                ? 'bg-tomato text-white shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-tomato/15'
            }`}
          >
            Food Scans
          </button>
          <button
            onClick={() => setFilterType('freshness')}
            className={`btn-squish px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
              filterType === 'freshness'
                ? 'bg-mint text-ink shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-mint/20'
            }`}
          >
            Freshness Checks
          </button>
          <button
            onClick={() => setFilterType('barcode')}
            className={`btn-squish px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
              filterType === 'barcode'
                ? 'bg-grape text-white shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-grape/15'
            }`}
          >
            Barcodes
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl text-xs font-bold border-2 border-ink bg-white dark:bg-dusk-card text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-tomato"
          />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <Loader message="Loading historical scan records..." type="donut" />
      ) : filteredItems.length === 0 ? (
        <DoodleEmptyState
          Doodle={DoodleDonut}
          title="No scan records found"
          description="Scan a meal or run a freshness check to build your nutritional history."
          actionLabel="Scan a Meal"
          onAction={() => window.location.href = '/food-scan'}
        />
      ) : (
        <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink shadow-sticker overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-100 dark:bg-dusk-surface text-ink dark:text-dusk-text uppercase tracking-wider font-display font-black border-b-2 border-ink">
                <tr>
                  <th className="px-6 py-4">Item & Type</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50 dark:hover:bg-dusk-surface/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-sky-100 dark:bg-dusk-surface border border-ink">
                          {item.analysis_type === 'freshness' ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          ) : item.analysis_type === 'barcode' ? (
                            <Barcode className="w-4 h-4 text-grape" />
                          ) : (
                            <Utensils className="w-4 h-4 text-tomato" />
                          )}
                        </div>
                        <div>
                          <strong className="block font-display font-black text-sm text-ink dark:text-dusk-text">
                            {item.item_name || 'Food Scan'}
                          </strong>
                          <span className="text-[10px] font-bold text-ink-muted uppercase">
                            {item.analysis_type?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-ink dark:text-dusk-text">
                      {item.confidence ? `${(item.confidence * 100).toFixed(0)}%` : '95%'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-mint/25 border border-ink font-black text-emerald-800 dark:text-mint">
                        {item.score || 90}/100
                      </span>
                    </td>

                    <td className="px-6 py-4 text-ink-muted font-bold capitalize">
                      {item.data_source || 'Database'}
                    </td>

                    <td className="px-6 py-4 text-ink-muted font-semibold">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-squish p-2 rounded-xl text-ink-muted hover:text-tomato hover:bg-tomato/15 transition cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
