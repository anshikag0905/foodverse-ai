import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Shuffle, Heart, Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import FactCard from '../components/common/FactCard';
import Loader from '../components/common/Loader';

export default function DidYouKnow() {
  const [randomFact, setRandomFact] = useState(null);
  const [facts, setFacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(false);

  // Hardcoded current user_id for demo session
  const userId = 1;

  useEffect(() => {
    fetchRandomFact();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFacts();
  }, [selectedCategory, showFavoritesOnly]);

  const fetchRandomFact = async () => {
    setLoadingRandom(true);
    try {
      const res = await axios.get('/api/v1/facts/random', { params: { user_id: userId } });
      setRandomFact(res.data);
    } catch (err) {
      console.error('Failed to fetch random fact:', err);
    } finally {
      setLoadingRandom(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/v1/facts/categories');
      setCategories(['All', ...res.data]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchFacts = async () => {
    setLoading(true);
    try {
      const params = {
        user_id: userId,
        limit: 60,
      };
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (showFavoritesOnly) {
        params.favorites_only = true;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const res = await axios.get('/api/v1/facts', { params });
      setFacts(res.data);
    } catch (err) {
      console.error('Failed to fetch facts list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFacts();
  };

  const handleFavoriteToggle = async (factId) => {
    try {
      await axios.post(`/api/v1/facts/${factId}/favorite`, null, { params: { user_id: userId } });
      // If we are on favorites only tab, refresh list
      if (showFavoritesOnly) {
        fetchFacts();
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Culinary Science & Nutrition Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Did You Know?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Explore curated, scientifically validated food science facts, storage wisdom, and hygiene principles.
        </p>
      </div>

      {/* Featured / Random Fact Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wide">
                Food Fact of the Moment
              </span>
              {randomFact?.category && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  • {randomFact.category}
                </span>
              )}
            </div>

            {loadingRandom ? (
              <div className="h-16 flex items-center">
                <Loader message="Shuffling food facts..." />
              </div>
            ) : (
              <blockquote className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                "{randomFact?.fact}"
              </blockquote>
            )}

            {randomFact?.source_name && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Source: <span className="font-semibold text-slate-700 dark:text-slate-300">{randomFact.source_name}</span>
              </p>
            )}
          </div>

          <button
            onClick={fetchRandomFact}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 whitespace-nowrap transition"
          >
            <Shuffle className="w-4 h-4" />
            Another Fact
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowFavoritesOnly(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat && !showFavoritesOnly
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              showFavoritesOnly
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : 'text-rose-500'}`} />
            Saved Favorites
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food science..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Facts Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader message="Loading scientific insights..." />
        </div>
      ) : facts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No food facts found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your category filter or search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facts.map((f) => (
            <FactCard
              key={f.id}
              fact={f}
              onFavoriteToggle={() => handleFavoriteToggle(f.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
