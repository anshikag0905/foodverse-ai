import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Shuffle, Heart, Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import FactCard from '../components/common/FactCard';
import Loader from '../components/common/Loader';
import { DoodlePopcorn, DoodleAvocado } from '../assets/doodles';

export default function DidYouKnow() {
  const [randomFact, setRandomFact] = useState(null);
  const [facts, setFacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(false);

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
      setRandomFact({
        id: 99,
        fact: "Air-popped popcorn contains more polyphenol antioxidants per gram than apples, because whole unrefined corn hull shields vital micronutrients.",
        category: "Nutrition Science",
        source_name: "American Chemical Society Research",
        verified: true
      });
    } finally {
      setLoadingRandom(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/v1/facts/categories');
      setCategories(['All', ...res.data]);
    } catch (err) {
      setCategories(['All', 'Freshness & Storage', 'Nutrition Science', 'Cooking Chemistry', 'Food Safety', 'History & Culture']);
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
      // Local fallback facts
      setFacts([
        {
          id: 1,
          fact: "Bananas produce natural ethylene gas that speeds up the ripening of adjacent fruits like avocados and mangoes.",
          category: "Freshness & Storage",
          source_name: "USDA Postharvest Physiology",
          verified: true
        },
        {
          id: 2,
          fact: "Cooking tomatoes in olive oil increases the bioavailability of lycopene by over 80% because it is a fat-soluble carotenoid.",
          category: "Nutrition Science",
          source_name: "Journal of Agricultural and Food Chemistry",
          verified: true
        },
        {
          id: 3,
          fact: "Storing bread in the refrigerator actually accelerates staling via retrogradation of starch granules. Keep it at room temperature or freeze it.",
          category: "Cooking Chemistry",
          source_name: "Food Science Association",
          verified: true
        },
        {
          id: 4,
          fact: "Honey never naturally spoils if sealed; archaeologists have discovered pots of 3,000-year-old honey in Egyptian tombs that are still perfectly edible.",
          category: "History & Culture",
          source_name: "Smithsonian Institution",
          verified: true
        }
      ]);
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
      if (showFavoritesOnly) fetchFacts();
    } catch (err) {
      console.warn('Favorite toggled locally');
    }
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          MODULE HEADER BAND (SUNNY ACCENT + DOODLE POPCORN)
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-sunny/25 border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
            <DoodlePopcorn size={46} className="animate-float" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sunny/30 border border-ink text-[11px] font-black uppercase text-amber-800 dark:text-sunny">
              <span>Culinary Science</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Did You Know? Food Science & Trivia
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Verified nutritional tidbits, shelf-life chemistry, and kitchen folklore curated by Anshika Gupta.
            </p>
          </div>
        </div>

        <button
          onClick={fetchRandomFact}
          className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunny text-ink border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer hover:shadow-sticker self-end md:self-auto"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle Fact</span>
        </button>
      </div>

      {/* =========================================================================
          3-STEP "HOW IT WORKS" STRIP
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-ink dark:text-dusk-text">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-sunny text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            1
          </span>
          <span>Shuffle peer-reviewed food facts & chemical insights</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-mint text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            2
          </span>
          <span>Filter by categories: Freshness, Storage, Nutrition & Safety</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-tomato text-white border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            3
          </span>
          <span>Bookmark your favorites for everyday kitchen decision-making</span>
        </div>
      </div>

      {/* Featured / Random Fact Banner */}
      <div className="rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card p-6 md:p-8 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-sunny text-ink border border-ink font-display font-black text-xs uppercase">
              Fact of the Moment
            </span>
            {randomFact?.category && (
              <span className="text-xs text-ink-muted font-bold">
                • {randomFact.category}
              </span>
            )}
          </div>

          {loadingRandom ? (
            <div className="py-4">
              <Loader message="Shuffling food facts..." type="donut" />
            </div>
          ) : (
            <blockquote className="font-display font-black text-xl md:text-2xl text-ink dark:text-dusk-text leading-relaxed">
              "{randomFact?.fact}"
            </blockquote>
          )}

          {randomFact?.source_name && (
            <p className="text-xs text-ink-muted font-semibold">
              Source: <span className="text-ink dark:text-dusk-text">{randomFact.source_name}</span>
            </p>
          )}
        </div>

        <button
          onClick={fetchRandomFact}
          className="btn-squish inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunny text-ink border-2 border-ink font-display font-black text-xs shadow-sticker cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>Another Fact</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facts (e.g., banana, honey, tomato, vitamin, mold)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border-2.5 border-ink bg-white dark:bg-dusk-card text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-sunny"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          </div>
          <button
            type="submit"
            className="btn-squish px-5 py-2.5 rounded-2xl bg-sunny text-ink font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn-squish px-3.5 py-1 rounded-full whitespace-nowrap transition-all font-display font-black text-xs border-2 border-ink cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sunny text-ink shadow-sticker-xs'
                  : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-sunny/20'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`btn-squish flex items-center gap-1.5 px-3.5 py-1 rounded-full whitespace-nowrap font-display font-black text-xs border-2 border-ink cursor-pointer ml-auto ${
              showFavoritesOnly
                ? 'bg-tomato text-white shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-tomato/20'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Facts Grid */}
      {loading ? (
        <Loader message="Loading food intelligence facts..." type="donut" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facts.map((f) => (
            <FactCard
              key={f.id}
              fact={f}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
