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
  FileJson
} from 'lucide-react';
import Loader from '../components/common/Loader';

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
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scan record?')) return;
    try {
      await axios.delete(`/api/v1/history/${id}`);
      setHistoryItems(prev => prev.filter(it => it.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (err) {
      console.error('Failed to delete history item:', err);
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <HistoryIcon className="w-3.5 h-3.5" />
          Multimodal Scan Telemetry
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Analysis History & Archive
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Review past multimodal inferences, sensory cue logs, and confidence provenance records.
        </p>
      </div>

      {/* Controls: Type Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Scans ({historyItems.length})
          </button>
          <button
            onClick={() => setFilterType('food_scan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'food_scan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Food Recognition
          </button>
          <button
            onClick={() => setFilterType('freshness')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'freshness'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Freshness Checks
          </button>
          <button
            onClick={() => setFilterType('barcode')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'barcode'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Barcode Lookups
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader message="Loading historical scan records..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <HistoryIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No scans found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Run an analysis in Food Scan or Freshness Check to populate your archive.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Item & Type</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Provenance</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                          {item.analysis_type === 'freshness' ? (
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                          ) : item.analysis_type === 'barcode' ? (
                            <Barcode className="w-4 h-4 text-purple-500" />
                          ) : (
                            <Utensils className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <strong className="block font-bold text-slate-900 dark:text-white">
                            {item.item_name || 'Food Scan'}
                          </strong>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {item.analysis_type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {Math.round(item.confidence * 100)}%
                    </td>

                    <td className="px-6 py-4">
                      {item.score !== null ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                          {item.score}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] capitalize">
                        {item.data_source} • {item.model_provider}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Inspect Structured Data"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Telemetry Payload – {selectedRecord.item_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block mb-0.5">Confidence:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {Math.round(selectedRecord.confidence * 100)}%
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block mb-0.5">Model Provider:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {selectedRecord.model_provider}
                  </strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Structured Result Data:
                </span>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 text-[11px] font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(selectedRecord.result_data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
