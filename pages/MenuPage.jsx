import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { getFoods } from "../services/foodService";
import { useCartStore } from "../store/useCartStore";
import { getCategories } from "../services/categoryService";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

/* ── Offer Cards Data ── */
const OFFERS = [
  { id: 1, title: "First Order Free Delivery", code: "WELCOME", discount: "Free Delivery", bg: "from-violet-500 to-indigo-600", emoji: "🚀" },
  { id: 2, title: "Flat 10% Off", code: "FOODRUSH10", discount: "10% OFF", bg: "from-orange-500 to-red-500", emoji: "🔥" },
  { id: 3, title: "Weekend Special", code: "WEEKEND20", discount: "20% OFF", bg: "from-emerald-500 to-teal-600", emoji: "🎉" },
  { id: 4, title: "Combo Saver", code: "COMBO50", discount: "₹50 OFF", bg: "from-pink-500 to-rose-600", emoji: "🍱" },
];

// ── Icons
const HeartIcon = ({ solid }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={solid ? "text-red-500" : "text-gray-400 group-hover:text-red-400"}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const FireIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 3.5-7.5 .67 2.17 1.5 3.5 3 4.5 2 1.34 2.5 3.5 2.5 5 0 3.5-2.5 6.5-6 7"/></svg>
);
const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// ── Offer Card ──
const OfferCard = ({ offer }) => {
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(offer.code);
    toast.success(`Code "${offer.code}" copied!`, { icon: "📋" });
  };
  return (
    <div className={`flex-shrink-0 w-[260px] sm:w-[280px] p-5 rounded-2xl bg-gradient-to-br ${offer.bg} text-white relative overflow-hidden group cursor-pointer hover:scale-[1.03] transition-transform duration-300`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-0 right-2 text-5xl opacity-20 group-hover:opacity-30 transition-opacity">{offer.emoji}</div>
      <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Limited Offer</p>
      <p className="text-xl font-black leading-tight mb-1">{offer.title}</p>
      <p className="text-2xl font-black mb-3">{offer.discount}</p>
      <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg text-[11px] font-bold transition-colors">
        <CopyIcon /> {offer.code}
      </button>
    </div>
  );
};

// ── FoodCard Component
const FoodCard = ({ food, index, isAdding, isFavorite, onAddToCart, onToggleFavorite, onQuickView, isAdmin }) => {
  const rating = ((food.name?.charCodeAt(0) || 65) % 10) / 10 + 4;
  const reviews = ((food.name?.charCodeAt(1) || 65) % 200) + 50;
  const isTrending = index < 4;

  return (
    <div className="group relative bg-white flex flex-col rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer" onClick={() => onQuickView(food)}>
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        <img src={food.image} alt={food.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => (e.target.src = "https://dummyimage.com/300x300/f3f4f6/a1a1aa&text=No+Image")} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Category + Trending */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {food.category?.name && (
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-primary text-[0.65rem] font-bold rounded-full uppercase tracking-widest shadow-sm">{food.category.name}</span>
          )}
          {isTrending && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider shadow-md w-fit">
              <FireIcon /> Trending
            </span>
          )}
        </div>

        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform" onClick={(e) => { e.stopPropagation(); onToggleFavorite(food._id); }}>
          <HeartIcon solid={isFavorite} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-full text-center text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md bg-white/10 border border-white/20 py-2 rounded-xl">Quick View</div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6 bg-white z-10 relative">
        <h3 className="text-[1.15rem] font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">{food.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-auto">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
          </div>
          <span className="text-xs font-bold text-gray-800">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-gray-400 font-semibold">({reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 border-dashed">
          <div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">₹{food.price}</span>
            {food.price > 150 && <span className="ml-2 text-xs line-through text-gray-400 font-semibold">₹{Math.round(food.price * 1.2)}</span>}
          </div>
          {!isAdmin && (
            <button className="flex items-center justify-center gap-1.5 w-12 h-12 bg-gray-50 hover:bg-primary border border-gray-100 hover:border-primary text-gray-700 hover:text-white font-bold rounded-2xl shadow-sm hover:shadow-lg hover:shadow-primary/30 active:scale-90 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none" onClick={(e) => { e.stopPropagation(); onAddToCart(food._id); }} disabled={isAdding}>
              {isAdding ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PlusIcon />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── CategoryChips
// ✅ Fix: pulled out of the padded container so sticky works across full width
const CategoryChips = ({ categories, selected, onSelect, loading }) => (
  <div className="sticky top-0 z-30 bg-[#f8f9fa]/95 backdrop-blur-2xl border-b border-gray-200/50 py-3 mb-8">
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x">
      <button
        className={`snap-center shrink-0 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${selected === "all" ? "bg-gray-900 text-white shadow-md scale-105" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"}`}
        onClick={() => onSelect("all")}
      >
        <span className="mr-2">🍽</span> All Menu
      </button>
      {loading ? (
        [1, 2, 3, 4, 5].map((i) => <div key={i} className="shrink-0 w-28 h-10 bg-gray-200 animate-pulse rounded-full" />)
      ) : (
        categories.map((cat) => (
          <button
            key={cat._id}
            className={`snap-center shrink-0 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${selected === cat._id ? "bg-primary text-white shadow-md shadow-primary/30 scale-105" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"}`}
            onClick={() => onSelect(cat._id)}
          >
            {cat.name}
          </button>
        ))
      )}
    </div>
  </div>
);

// ── Skeleton Loader
const SkeletonLoader = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm animate-pulse h-80 flex flex-col">
        <div className="w-full h-40 bg-gray-200 rounded-2xl mb-4" />
        <div className="w-3/4 h-5 bg-gray-200 rounded-lg mb-2" />
        <div className="w-1/2 h-4 bg-gray-100 rounded-lg mt-auto" />
      </div>
    ))}
  </div>
);

// ── MenuPage
export default function MenuPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [addingIds, setAddingIds] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [quickViewFood, setQuickViewFood] = useState(null);
  const debounceTimer = useRef(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  const fetchFoods = async () => {
    try {
      const res = await getFoods();
      setFoods(res.data.foods || []);
    } catch (err) {
      toast.error("Failed to load menu.");
    } finally {
      setLoadingFoods(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddToCart = useCallback(async (id) => {
    if (addingIds.has(id)) return;
    setAddingIds((prev) => new Set(prev).add(id));
    try {
      await addItem(id, 1);
      toast.success("Added to cart! 🛒");
    } catch {
      toast.error("Failed to add to cart.");
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [addingIds, addItem]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast("Removed from favorites", { icon: "💔" }); }
      else { next.add(id); toast("Saved to favorites!", { icon: "❤️" }); }
      return next;
    });
  }, []);

  const filteredFoods = useMemo(() =>
    foods.filter((food) => {
      const name = food?.name || "";
      const matchSearch = name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = selectedCategory === "all" || food?.category?._id === selectedCategory;
      return matchSearch && matchCategory;
    }),
    [foods, debouncedSearch, selectedCategory]
  );

  const clearFilters = () => { setSearch(""); setDebouncedSearch(""); setSelectedCategory("all"); };

  return (
    // ✅ Fix: removed pt-8 from here, header/filter now control their own spacing
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans selection:bg-primary/20">
      <Toaster position="top-right" />

      {/* ✅ Fix: CategoryChips is OUTSIDE the padded container so it spans full width and sticky works */}
      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        loading={loadingCategories}
      />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-8 pb-4">

        {/* ── Header ── */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Our Menu.</h1>
              <span className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Live</span>
              </span>
            </div>
            <p className="text-gray-500 font-medium text-lg">Discover your next favorite meal — {foods.length}+ dishes available</p>
          </div>

          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-primary transition-colors"><SearchIcon /></div>
            <input type="text" placeholder="Search for pizza, burgers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border-2 border-gray-100 focus:border-primary/50 text-gray-900 font-medium placeholder:text-gray-400 px-12 py-3.5 rounded-[1.5rem] outline-none shadow-sm transition-all duration-300" />
            {search && <button onClick={() => setSearch("")} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-900 transition-colors">✕</button>}
          </div>
        </header>

        {/* ── Offers Carousel ── */}
        {!search && selectedCategory === "all" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">🎁 Today's Offers</h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scroll →</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {OFFERS.map(o => <OfferCard key={o.id} offer={o} />)}
            </div>
          </div>
        )}

        {/* ── Stats Bar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700">
            <span className="text-amber-500">⭐</span>
            <span className="text-[11px] font-black">4.9 Rated</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
            <span>⚡</span>
            <span className="text-[11px] font-black">30 Min Delivery</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700">
            <span>🚚</span>
            <span className="text-[11px] font-black">Free Delivery</span>
          </div>
          {filteredFoods.length !== foods.length && (
            <div className="ml-auto px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-[11px] font-black text-primary">{filteredFoods.length} of {foods.length} shown</span>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        <main>
          {loadingFoods ? (
            <SkeletonLoader count={8} />
          ) : filteredFoods.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm mt-8">
              <div className="text-5xl mb-6">🍽️</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No food found</h3>
              <p className="text-gray-500 font-medium mb-6">We couldn't find any items matching your filters.</p>
              <button
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-full transition-colors"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {filteredFoods.map((food, idx) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  index={idx}
                  isAdding={addingIds.has(food._id)}
                  isFavorite={favorites.has(food._id)}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                  onQuickView={setQuickViewFood}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Quick View Modal ── */}
      {quickViewFood && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setQuickViewFood(null)} />
          <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:scale-110 transition-all font-black border border-gray-200/50"
              onClick={() => setQuickViewFood(null)}
            >
              <CloseIcon />
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-64 md:h-auto bg-gray-100 relative">
              <img
                src={quickViewFood.image}
                alt={quickViewFood.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "https://dummyimage.com/400x400/f3f4f6/a1a1aa&text=No+Image")}
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
              <div className="mt-auto mb-auto">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[0.65rem] font-bold rounded-full uppercase tracking-widest mb-4">
                  {quickViewFood.category?.name}
                </span>
                <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight mb-4">{quickViewFood.name}</h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  {quickViewFood.description || "A delicious dish crafted with the finest ingredients to satisfy your cravings and bring absolute joy to your taste buds."}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                    <span className="text-3xl font-black text-gray-900 tracking-tight">₹{quickViewFood.price}</span>
                  </div>
                  {!isAdmin && (
                    <button
                      className="flex flex-1 ml-6 items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-[1.25rem] shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-70"
                      disabled={addingIds.has(quickViewFood._id)}
                      onClick={() => { handleAddToCart(quickViewFood._id); setQuickViewFood(null); }}
                    >
                      {addingIds.has(quickViewFood._id) ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add to Cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}