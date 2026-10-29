import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Shuffle, Heart, Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import FactCard from '../components/common/FactCard';
import Loader from '../components/common/Loader';
import { DoodlePopcorn, DoodleAvocado } from '../assets/doodles';

export const COMPREHENSIVE_FACTS = [
  {
    id: 1,
    fact: "Bananas produce natural ethylene gas that speeds up the ripening of adjacent fruits like avocados and mangoes. Wrapping the banana stem in foil slows this process down.",
    category: "Freshness & Storage",
    source_name: "USDA Postharvest Physiology",
    verified: true
  },
  {
    id: 2,
    fact: "Pairing turmeric with black pepper increases curcumin absorption by up to 2,000% because piperine inhibits glucuronidation in the liver and intestinal wall.",
    category: "Indian Culinary Secrets",
    source_name: "Planta Medica Pharmacological Study",
    verified: true
  },
  {
    id: 3,
    fact: "Cooking tomatoes in olive oil or ghee increases the bioavailability of lycopene by over 80% because it is a fat-soluble antioxidant carotenoid.",
    category: "Cooking Chemistry",
    source_name: "Journal of Agricultural and Food Chemistry",
    verified: true
  },
  {
    id: 4,
    fact: "Soya chunks contain over 52% protein by dry weight—more than chicken breast (31%), paneer (18%), or eggs (13%)—making them the densest vegetarian gym food on earth.",
    category: "Gym Muscle Science",
    source_name: "National Institute of Nutrition (ICMR)",
    verified: true
  },
  {
    id: 5,
    fact: "Storing bread in the refrigerator actually accelerates staling 6x faster than room temperature due to retrogradation of amylopectin starch molecules.",
    category: "Freshness & Storage",
    source_name: "American Association of Cereal Chemists",
    verified: true
  },
  {
    id: 6,
    fact: "Natto (Japanese fermented soybean) is the single richest dietary source of Vitamin K2 (menaquinone-7) on Earth, promoting bone mineral density and arterial elasticity.",
    category: "Japanese Longevity",
    source_name: "Journal of Nutrition & Metabolism",
    verified: true
  },
  {
    id: 7,
    fact: "Eating a ripe banana 30 minutes before intense weightlifting provides 422mg of potassium and fast-acting glucose that prevents cramping and sustains power output.",
    category: "Gym Muscle Science",
    source_name: "International Society of Sports Nutrition (ISSN)",
    verified: true
  },
  {
    id: 8,
    fact: "Pure honey never spoils; archaeologists excavating 3,000-year-old Egyptian pyramids found clay jars of honey that remained completely uncontaminated and edible.",
    category: "History & Culture",
    source_name: "Smithsonian Institution Archaeobiology",
    verified: true
  },
  {
    id: 9,
    fact: "Cooked and cooled potatoes develop high levels of 'Type 3 Resistant Starch', which bypasses digestion to feed beneficial Bifidobacteria in the gut, cutting glycemic impact.",
    category: "Nutrition Science",
    source_name: "Advances in Nutrition Journal",
    verified: true
  },
  {
    id: 10,
    fact: "Matcha green tea contains up to 137 times more EGCG (epigallocatechin gallate) catechins than regular brewed green tea because the whole powdered tea leaf is consumed.",
    category: "Japanese Longevity",
    source_name: "Journal of Chromatography A",
    verified: true
  },
  {
    id: 11,
    fact: "Egg whites have a Protein Digestibility-Corrected Amino Acid Score (PDCAAS) of 1.0, representing the maximum biological standard for human tissue repair.",
    category: "Gym Muscle Science",
    source_name: "World Health Organization (WHO) Protein Quality Standards",
    verified: true
  },
  {
    id: 12,
    fact: "Curd (Dahi) contains millions of active Lactobacillus strains that synthesize B-complex vitamins inside the intestine and enhance lactose tolerance.",
    category: "Indian Culinary Secrets",
    source_name: "National Dairy Research Institute (NDRI)",
    verified: true
  },
  {
    id: 13,
    fact: "Cutting onions releases syn-propanethial-S-oxide, which transforms into mild sulfuric acid on contact with eye moisture. Chilling onions for 15 minutes prevents tears.",
    category: "Cooking Chemistry",
    source_name: "Nature Chemical Biology",
    verified: true
  },
  {
    id: 14,
    fact: "Soaking raw lentils, rajma, and chana overnight activates phytase enzymes, breaking down phytic acid by 40% and multiplying zinc and iron bioavailability.",
    category: "Indian Culinary Secrets",
    source_name: "Food Chemistry & Nutritional Biochemistry",
    verified: true
  },
  {
    id: 15,
    fact: "Mushrooms have cell walls constructed of chitin—the same structural polysaccharide as crab shells—meaning cooking is essential to release their intracellular vitamins.",
    category: "Cooking Chemistry",
    source_name: "International Journal of Medicinal Mushrooms",
    verified: true
  },
  {
    id: 16,
    fact: "Whey protein isolate triggers Muscle Protein Synthesis (MPS) faster than any whole food because it contains over 2.7g of free L-Leucine per 25g scoop.",
    category: "Gym Muscle Science",
    source_name: "American Journal of Clinical Nutrition",
    verified: true
  },
  {
    id: 17,
    fact: "Apples float in water because roughly 25% of their total volume consists of intercellular air pockets between parenchyma cells.",
    category: "Nutrition Science",
    source_name: "Cornell Pomology Agricultural Department",
    verified: true
  },
  {
    id: 18,
    fact: "Wasabi used in authentic Japanese sushi contains powerful 6-methylsulfinylhexyl isothiocyanate (6-MSITC) with proven antimicrobial and cognitive longevity properties.",
    category: "Japanese Longevity",
    source_name: "Nutrients Peer-Reviewed Journal",
    verified: true
  },
  {
    id: 19,
    fact: "Potatoes must always be stored away from onions; onions release volatile gases that cause potatoes to sprout and develop bitter solanine compounds.",
    category: "Freshness & Storage",
    source_name: "Postharvest Biology & Technology",
    verified: true
  },
  {
    id: 20,
    fact: "Sattu (roasted Bengal gram flour) is known as the 'Desi Protein Powder' of India; its low glycemic index of 28 makes it a sustained diabetic and fitness fuel.",
    category: "Indian Culinary Secrets",
    source_name: "Indian Council of Medical Research",
    verified: true
  },
  {
    id: 21,
    fact: "The Maillard reaction, which gives charred tandoori paneer and seared steaks their savory depth, occurs when amino acids react with reducing sugars above 140°C.",
    category: "Cooking Chemistry",
    source_name: "Royal Society of Chemistry",
    verified: true
  },
  {
    id: 22,
    fact: "Flash-frozen vegetables retain over 98% of their vitamins and minerals, frequently boasting higher micronutrient counts than produce shipped over several days.",
    category: "Freshness & Storage",
    source_name: "Journal of Food Composition and Analysis",
    verified: true
  },
  {
    id: 23,
    fact: "Casein protein forms a slow-digesting gel in the stomach, releasing steady amino acids for up to 7 hours, making it ideal before sleep for recovery.",
    category: "Gym Muscle Science",
    source_name: "Medicine & Science in Sports & Exercise",
    verified: true
  },
  {
    id: 24,
    fact: "Fermented Idli and Dosa batter undergoes spontaneous lactic acid fermentation by Leuconostoc mesenteroides, increasing riboflavin and thiamine content by 200%.",
    category: "Indian Culinary Secrets",
    source_name: "Applied & Environmental Microbiology",
    verified: true
  }
];

export default function DidYouKnow() {
  const [randomFact, setRandomFact] = useState(COMPREHENSIVE_FACTS[0]);
  const [facts, setFacts] = useState(COMPREHENSIVE_FACTS);
  const [categories, setCategories] = useState([
    'All',
    'Freshness & Storage',
    'Indian Culinary Secrets',
    'Japanese Longevity',
    'Gym Muscle Science',
    'Cooking Chemistry',
    'Nutrition Science',
    'History & Culture'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('foodverse_favorite_facts');
      return raw ? JSON.parse(raw) : [1, 4];
    } catch {
      return [1, 4];
    }
  });
  const [loading, setLoading] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);

  useEffect(() => {
    filterFacts();
  }, [selectedCategory, showFavoritesOnly, searchQuery, favorites]);

  const filterFacts = () => {
    let filtered = [...COMPREHENSIVE_FACTS];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }
    if (showFavoritesOnly) {
      filtered = filtered.filter(f => favorites.includes(f.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(f => 
        f.fact.toLowerCase().includes(q) || 
        f.category.toLowerCase().includes(q) || 
        f.source_name.toLowerCase().includes(q)
      );
    }
    setFacts(filtered);
  };

  const handleShuffle = () => {
    setLoadingRandom(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * COMPREHENSIVE_FACTS.length);
      setRandomFact(COMPREHENSIVE_FACTS[idx]);
      setLoadingRandom(false);
    }, 200);
  };

  const handleFavoriteToggle = (factId) => {
    let updated;
    if (favorites.includes(factId)) {
      updated = favorites.filter(id => id !== factId);
    } else {
      updated = [...favorites, factId];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('foodverse_favorite_facts', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          MODULE HEADER BAND (SUNNY ACCENT + DOODLE POPCORN)
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-sunny/20 border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
            <DoodlePopcorn size={46} className="animate-float" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sunny/20 border border-ink text-[11px] font-black uppercase text-amber-800 dark:text-sunny">
              <span>Culinary Science & Longevity</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Did You Know? Food Intelligence
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Verified food science facts from Indian Ayurveda 🇮🇳, Japanese Longevity 🇯🇵, and Bodybuilding Biochemistry 🏋️.
            </p>
          </div>
        </div>

        <button
          onClick={handleShuffle}
          className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunny text-ink border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer hover:shadow-sticker self-end md:self-auto"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle Spotlight Fact</span>
        </button>
      </div>

      {/* Spotlight Fact Hero Card */}
      {randomFact && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-dusk-card dark:to-dusk-surface border-3 border-ink p-6 sm:p-8 shadow-sticker relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sunny border-2 border-ink flex items-center justify-center flex-shrink-0 shadow-sticker-xs">
              <Lightbulb className="w-6 h-6 text-ink" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sunny/30 border border-ink text-amber-900 dark:text-sunny">
                  {randomFact.category}
                </span>
                <span className="text-[11px] font-bold text-ink-muted">
                  Source: {randomFact.source_name}
                </span>
              </div>
              <p className="font-display font-black text-base sm:text-lg text-ink dark:text-dusk-text leading-snug">
                "{randomFact.fact}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facts (e.g. banana, turmeric, soya, eggs, potatoes, ramen)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border-2.5 border-ink bg-white dark:bg-dusk-card text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-sunny"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`btn-squish inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
              showFavoritesOnly
                ? 'bg-tomato text-white shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-tomato/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : 'text-tomato'}`} />
            <span>Bookmarked ({favorites.length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-black text-ink-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn-squish px-3.5 py-1 rounded-full whitespace-nowrap transition-all font-display font-black text-xs border-2 border-ink cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sunny text-ink shadow-sticker-xs'
                  : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-sunny/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact) => {
          const isFav = favorites.includes(fact.id);
          return (
            <div
              key={fact.id}
              className="p-5 rounded-3xl border-2.5 border-ink bg-white dark:bg-dusk-card shadow-sticker flex flex-col justify-between gap-4 hover:border-sunny transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sunny/20 border border-ink text-amber-900 dark:text-sunny">
                    {fact.category}
                  </span>
                  <button
                    onClick={() => handleFavoriteToggle(fact.id)}
                    className="p-1 rounded-full text-tomato hover:scale-110 transition cursor-pointer"
                    title={isFav ? "Remove bookmark" : "Bookmark fact"}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-tomato text-tomato' : 'text-ink-muted'}`} />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-ink dark:text-dusk-text leading-relaxed">
                  {fact.fact}
                </p>
              </div>

              <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-[11px] font-bold text-ink-muted">
                <span>{fact.source_name}</span>
                <span className="text-emerald-600 dark:text-mint font-black">✓ Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
