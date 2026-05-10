import React, { useEffect, useState, useCallback, useRef, useDeferredValue } from "react";
import { useNavigate } from "react-router-dom";
import { getFoods } from "../services/foodService";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

/* ── ICONS ── */
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
  </svg>
);
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const FlameIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-2-1-4-2-5-1 2-2 3-3 3s-2-1-2-3c0-1 1-3 2-4z"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

/* ── EXCLUSIVE OFFERS & COUPONS ── */
const COUPONS = [
  { id: 1, title: "50% OFF", sub: "Up to ₹100 on your first order", code: "WELCOME50", bg: "bg-gradient-to-br from-blue-500 to-indigo-600", icon: "🎉" },
  { id: 2, title: "Free Delivery", sub: "On all orders above ₹199", code: "FREEDEL", bg: "bg-gradient-to-br from-emerald-500 to-teal-600", icon: "🛵" },
  { id: 3, title: "Buy 1 Get 1", sub: "On select premium pizzas", code: "BOGOPIZZA", bg: "bg-gradient-to-br from-orange-500 to-red-600", icon: "🍕" },
  { id: 4, title: "Flat ₹50 OFF", sub: "On orders from Healthy Picks", code: "HEALTHY50", bg: "bg-gradient-to-br from-violet-500 to-purple-600", icon: "🥗" },
];

function OffersSection() {
  return (
    <div className="w-full px-4 lg:px-8 pb-1 pt-1">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-1.5 uppercase">
          Offers 🎁
        </h2>
      </div>
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x px-1">
        {COUPONS.map(offer => (
          <div key={offer.id} className="shrink-0 flex items-center gap-3 bg-white border border-gray-200 border-dashed rounded-xl p-2.5 snap-start hover:border-primary/50 transition-colors cursor-pointer w-[220px] group shadow-sm hover:shadow-md">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-inner ${offer.bg}`}>
              {offer.icon}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-[12px] font-black text-gray-900 truncate">{offer.title}</h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">{offer.code}</p>
            </div>
            <button className="px-2.5 py-1.5 bg-gray-900 text-white text-[9px] font-black rounded-md uppercase tracking-wider group-hover:bg-primary transition-colors"
               onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(offer.code); alert("Code copied: " + offer.code); }}>
               Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── WHAT'S TRENDING FOODS ── */
function WhatsTrending({ foods, onAddToCart, addingIds, isAdmin }) {
  const navigate = useNavigate();
  if (!foods || foods.length === 0) return null;
  // Get 5 random/top foods for the trending section
  const trendingFoods = [...foods].sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <div className="w-full px-4 lg:px-8 pb-1 pt-1">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-1.5 uppercase">
          Trending <span className="text-orange-500"><FlameIcon /></span>
        </h2>
      </div>
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x px-1">
        {trendingFoods.map((food, index) => (
          <div key={food._id} onClick={() => navigate(`/food/${food._id}`)} className="shrink-0 flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-gray-100 shadow-sm snap-start hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer w-[210px]">
            <div className="relative w-10 h-10 shrink-0">
               <img src={food.image} alt={food.name} className="w-full h-full object-cover rounded-full" />
               {/* #1 Trending Badge */}
               <div className="absolute -top-1 -left-1 w-[18px] h-[18px] bg-gradient-to-br from-orange-500 to-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white shadow-sm z-10 group-hover:scale-110 transition-transform">
                 #{index + 1}
               </div>
            </div>
            <div className="flex-1 overflow-hidden">
               <h4 className="text-[11px] font-black text-gray-900 truncate group-hover:text-primary transition-colors">{food.name}</h4>
               <p className="text-[9px] font-bold text-gray-500">₹{food.price}</p>
            </div>
            {!isAdmin && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(food._id); }} 
                disabled={addingIds.has(food._id)} 
                className="w-7 h-7 rounded-full bg-orange-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shrink-0 font-black text-base active:scale-90"
              >
                 {addingIds.has(food._id) ? "…" : "+"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SLIDER DATA ── */
const SLIDES = [
  { id: 1, bg: "/Slider/Slider1.png", tag: "🔥 Today's Special", headline: "Craving Something\nAmazing Tonight?", sub: "Fresh ingredients, bold flavours. Delivered hot in under 30 minutes.", cta: "Order Now", accent: "from-orange-500 to-red-500", badge: { val: "30 min", label: "Fast Delivery" }, stats: [{ icon: "⭐", val: "4.9" }, { icon: "🛵", val: "30m" }, { icon: "🍽", val: "500+" }] },
  { id: 2, bg: "/Slider/Slider2.png", tag: "🍔 Bestseller", headline: "Burgers That Break\nAll The Rules",   sub: "Double-stacked, sauce-drenched perfection. Made fresh, never frozen.", cta: "Explore Menu", accent: "from-amber-500 to-orange-600", badge: { val: "4.9 ★", label: "Top Rated" }, stats: [{ icon: "🔥", val: "#1" }, { icon: "❤️", val: "12K+" }, { icon: "🏆", val: "Best" }] },
  { id: 3, bg: "/Slider/Slider3.png", tag: "🌿 Healthy Picks", headline: "Eat Well,\nFeel Incredible", sub: "Nutritionist-approved meals packed with goodness. Taste the difference.", cta: "See Healthy Options", accent: "from-emerald-500 to-teal-600", badge: { val: "500+", label: "Menu Items" }, stats: [{ icon: "🥗", val: "120+" }, { icon: "💚", val: "Organic" }, { icon: "📊", val: "<400cal" }] },
  { id: 4, bg: "/Slider/Slider4.png", tag: "✨ Premium", headline: "Fine Dining,\nDelivered Home", sub: "Restaurant-quality experiences without the reservation. Elevate your evening.", cta: "Discover More", accent: "from-violet-500 to-indigo-600", badge: { val: "₹0", label: "Delivery Fee" }, stats: [{ icon: "👨‍🍳", val: "50+" }, { icon: "🌟", val: "Premium" }, { icon: "🎁", val: "Free" }] },
];

/* ── Countdown Hook ── */
function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const eod = new Date(now); eod.setHours(23, 59, 59, 999);
      const diff = Math.max(0, eod - now);
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── SCROLL REVEAL HOOK ── */
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/* ── LIVE ORDERS HOOK (Fake Social Proof) ── */
function useLiveOrders() {
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const NAMES = ["Alex", "Sarah", "Mike", "Emily", "David", "Jessica"];
    const ITEMS = ["Truffle Burger", "Spicy Pepperoni Pizza", "Vegan Salad Bowl", "Sushi Platter", "Butter Chicken", "Chocolate Lava Cake"];
    
    const showOrder = () => {
      setOrder({
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
        id: Date.now() // to force re-render key if needed
      });
      setTimeout(() => setOrder(null), 5000);
    };

    const interval = setInterval(showOrder, 15000);
    setTimeout(showOrder, 4000);
    return () => clearInterval(interval);
  }, []);
  return order;
}

/* ── INFINITE MARQUEE ── */
function FeatureMarquee() {
  const features = ["🚀 Lightning Fast Delivery", "⭐ 4.9/5 Average Rating", "🥗 Fresh Ingredients Daily", "💳 Secure Payments", "🔥 Exclusive Flash Deals", "👨‍🍳 Top Rated Chefs", "🌿 Vegan Options Available"];
  return (
    <div className="w-full bg-gray-900 text-white overflow-hidden py-3 mb-10 rotate-1 scale-105 shadow-2xl z-20 relative border-y border-white/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...features, ...features, ...features, ...features].map((f, i) => (
          <div key={i} className="flex items-center gap-6 mx-6 text-[11px] font-black uppercase tracking-widest text-white/90">
            <span>{f}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,107,53,0.8)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── HERO SLIDER ── */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const sliderRef = useRef(null);
  const total = SLIDES.length;
  const countdown = useCountdown();

  const goTo = useCallback((idx) => setCurrent(((idx % total) + total) % total), [total]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000); // Increased to 6s for better reading
    return () => clearInterval(id);
  }, [next, paused]);

  /* Keyboard nav */
  useEffect(() => {
    const handler = (e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const getSlideStyles = (i) => {
    let offset = i - current;
    // Handle wrap around for smooth infinite feel
    if (offset === total - 1) offset = -1;
    if (offset === -(total - 1)) offset = 1;
    // Hide slides that are further away
    if (offset < -1) offset = -2;
    if (offset > 1) offset = 2;

    return {
      zIndex: offset === 0 ? 10 : 5,
      opacity: Math.abs(offset) <= 1 ? 1 : 0,
      pointerEvents: offset === 0 ? "auto" : "none",
      transform: `translateX(${offset * 100}%)`,
      transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease"
    };
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="w-full px-4 lg:px-8 py-6 overflow-hidden">
      <div
        className="relative w-full h-[360px] md:h-[440px] lg:h-[520px] rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl"
        onMouseEnter={() => setPaused(true)} 
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      >
          {SLIDES.map((slide, i) => {
          const isActive = i === current;
          return (
            <div key={slide.id} className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ ...getSlideStyles(i) }}
            >
              {/* Premium Image Zoom Reveal */}
              <div className={`absolute inset-0 bg-center bg-cover transition-transform duration-[1200ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${isActive ? "scale-100" : "scale-[1.2]"}`} 
                   style={{ backgroundImage: `url(${slide.bg})`, animation: isActive ? "kenBurns 12s ease-in-out infinite alternate" : "none" }} />
              
              {/* Curtain Wipe Effect */}
              <div className={`absolute inset-0 bg-gray-900 z-0 origin-left transition-transform duration-700 ease-out ${isActive ? "scale-x-0" : "scale-x-100"}`} />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              <div className={`absolute inset-0 bg-gradient-to-t ${slide.accent} opacity-10 mix-blend-overlay z-10`} />

              {/* Top-right badge + countdown */}
              <div className={`absolute top-6 right-6 hidden md:flex flex-col gap-3 z-20 transition-all duration-1000 delay-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-[1.5rem] text-right shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <span className="block text-white font-black text-3xl tracking-tighter leading-none">{slide.badge.val}</span>
                  <span className="block text-white/70 font-bold text-[11px] uppercase tracking-widest mt-1.5">{slide.badge.label}</span>
                </div>
                {i === 0 && (
                  <div className="bg-gradient-to-br from-red-500/90 to-red-600/90 backdrop-blur-2xl border border-red-400/30 px-5 py-4 rounded-[1.5rem] text-center shadow-[0_8px_32px_rgba(239,68,68,0.3)]">
                    <span className="block text-white text-[10px] font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Deal Ends In
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((v, vi) => (
                        <React.Fragment key={vi}>
                          <span className="bg-black/20 text-white font-black text-xl px-2.5 py-1 rounded-xl min-w-[38px] text-center shadow-inner border border-white/10">{v}</span>
                          {vi < 2 && <span className="text-white/50 font-black text-lg">:</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-14 max-w-3xl">
                <div className="overflow-hidden">
                  <span className={`inline-flex items-center self-start px-4 py-1.5 rounded-full bg-gradient-to-r ${slide.accent} text-white text-[11px] font-black uppercase tracking-widest mb-5 shadow-lg transition-transform duration-700 ease-out delay-100 ${isActive ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    {slide.tag}
                  </span>
                </div>
                <div className="overflow-hidden mb-5">
                  <h2 className={`text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight whitespace-pre-line drop-shadow-2xl transition-transform duration-700 ease-out delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"}`}>
                    {slide.headline}
                  </h2>
                </div>
                <div className="overflow-hidden mb-8">
                  <p className={`text-white/80 text-base md:text-lg font-medium max-w-md leading-relaxed transition-transform duration-700 ease-out delay-500 ${isActive ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    {slide.sub}
                  </p>
                </div>

                {/* Mini stats */}
                <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ease-out delay-700 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
                  {slide.stats.map((s, si) => (
                    <div key={si} className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-inner hover:bg-black/30 transition-colors">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-white font-black text-xs uppercase tracking-wide">{s.val}</span>
                    </div>
                  ))}
                </div>

                <div className={`flex items-center gap-4 transition-all duration-700 ease-out delay-1000 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <button className={`relative overflow-hidden flex items-center gap-2 bg-gradient-to-r ${slide.accent} text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] hover:-translate-y-1 active:scale-95 group`}>
                    <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <span>{slide.cta}</span>
                    <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>
                  </button>
                  <button className="hidden sm:flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all uppercase tracking-widest hover:-translate-y-1 active:scale-95">
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Nav arrows */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg"><ChevronLeft /></button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg"><ChevronRight /></button>

        {/* Slide counter */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full">
          <span className="text-white font-black text-sm">{pad(current + 1)}</span>
          <span className="text-white/40 font-bold text-xs">/</span>
          <span className="text-white/60 font-bold text-xs">{pad(total)}</span>
        </div>
      </div>

      {/* ── STORY-STYLE CIRCULAR NAVIGATION BAR ── */}
      <div className="max-w-3xl mx-auto mt-6 mb-2">
        <div className="flex justify-center items-center gap-6 px-4 overflow-x-auto scrollbar-hide py-4">
          {SLIDES.map((slide, i) => {
            const isActive = i === current;
            return (
              <button 
                key={i} 
                onClick={() => goTo(i)}
                className="relative flex flex-col items-center gap-2.5 group outline-none"
              >
                {/* Avatar container */}
                <div className={`relative w-[4.5rem] h-[4.5rem] rounded-full p-1 transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_8px_16px_rgba(255,107,53,0.3)]' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}>
                  
                  {/* SVG Circular Progress */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <defs>
                      <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff6b35" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                    <circle 
                      cx="50" cy="50" r="48" fill="none" stroke={`url(#grad-${i})`} strokeWidth="4" strokeLinecap="round"
                      strokeDasharray="301.59"
                      strokeDashoffset={isActive ? 0 : 301.59}
                      style={{ transition: isActive && !paused ? "stroke-dashoffset 6s linear" : "stroke-dashoffset 0.4s ease" }}
                    />
                  </svg>
                  
                  <img src={slide.bg} alt={slide.tag} className="w-full h-full object-cover rounded-full shadow-inner border-[3px] border-white" />
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-700'}`}>
                  {slide.tag.replace(/[^a-zA-Z\s]/g, '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Social proof bar */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["🧑", "👩", "👨", "👧"].map((e, i) => (
                <span key={i} className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs shadow-sm">{e}</span>
              ))}
            </div>
            <span className="text-xs font-bold text-gray-600"><span className="text-gray-900">10,000+</span> happy customers</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-gray-200" />
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">⭐ <span className="text-gray-900">4.9</span> avg rating</span>
          <span className="hidden sm:block w-px h-4 bg-gray-200" />
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">🚀 <span className="text-gray-900">2M+</span> orders delivered</span>
        </div>

      <style>{`
        @keyframes progressBar { from { width: 0% } to { width: 100% } }
        @keyframes kenBurns { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.08) translate(-1%,-1%); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}

/* ── FOOD CARD ── */
function FoodCard({ food, onAddToCart, isAdding, isAdmin, index }) {
  const [imgError, setImgError] = useState(false);
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div 
      ref={ref}
      className={`group flex flex-col bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-700 ease-out h-full
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${(index % 4) * 75}ms` }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        {!imgError && food.image ? (
          <img src={food.image} alt={food.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-orange-50 to-amber-50">🍽️</div>
        )}
        {food.category?.name && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-primary text-xs font-bold rounded-full uppercase tracking-wider shadow-sm z-10">{food.category.name}</span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 lg:p-5">
        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1 line-clamp-2 min-h-[2.75rem] group-hover:text-primary transition-colors">{food.name}</h3>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 border-dashed">
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">₹{food.price}</span>
          {!isAdmin && (
            <button onClick={onAddToCart} disabled={isAdding}
              className="flex items-center justify-center gap-1.5 min-w-[5rem] px-4 py-2 bg-primary text-white font-bold text-sm rounded-full shadow-md shadow-primary/20 hover:bg-orange-600 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none transition-all duration-300">
              {isAdding ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "+ Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ search }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center w-full">
      <div className="text-5xl mb-6">🔍</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
      <p className="text-gray-500">{search ? `We couldn't find "${search}"` : "Our menu is updating"}</p>
    </div>
  );
}

/* ── ANIMATED PLACEHOLDER HOOK ── */
function useTypingPlaceholder(items, interval = 2500) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);
  return items[index];
}

/* ── MAIN PAGE ── */
export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [category, setCategory] = useState("All");
  const [addingIds, setAddingIds] = useState(new Set());
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);

  const { cart, fetchCart, addItem } = useCartStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const liveOrder = useLiveOrders();

  const cartCount = cart?.items?.reduce((a, i) => a + i.quantity, 0) || 0;

  const SEARCH_HINTS = ["Try \"Butter Chicken\"…", "Try \"Paneer Pizza\"…", "Try \"Veg Burger\"…", "Try \"Biryani\"…", "Try \"Pasta\"…"];
  const placeholder = useTypingPlaceholder(SEARCH_HINTS);

  useEffect(() => {
    fetchFoods();
    if (user && user.role !== "admin") fetchCart();
  }, [fetchCart, user]);

  useEffect(() => { filterFoods(); }, [deferredSearch, category, foods]);

  const fetchFoods = async () => {
    try {
      const res = await getFoods();
      setFoods(res.data.foods || []);
      setFilteredFoods(res.data.foods || []);
    } catch { } finally { setLoading(false); }
  };

  const filterFoods = () => {
    let temp = [...foods];
    if (category !== "All") temp = temp.filter((f) => f.category?.name === category);
    if (deferredSearch) temp = temp.filter((f) => f.name.toLowerCase().includes(deferredSearch.toLowerCase()));
    setFilteredFoods(temp);
  };

  const handleAddToCart = async (id) => {
    if (user?.role === "admin") { alert("Admins cannot place orders."); return; }
    setAddingIds((prev) => new Set(prev).add(id));
    try { await addItem(id, 1); }
    catch { console.log("Error"); }
    finally { setAddingIds((prev) => { const n = new Set(prev); n.delete(id); return n; }); }
  };

  const categories = ["All", ...new Set(foods.map((f) => f.category?.name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans selection:bg-primary/20 flex flex-col relative overflow-hidden">
      
      {/* ── BACKGROUND ORBS ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40rem] h-[40rem] bg-orange-500/5 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[80px] mix-blend-screen" style={{ animation: "pulse 8s infinite alternate" }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50rem] h-[50rem] bg-emerald-500/5 rounded-full blur-[100px] mix-blend-screen" style={{ animation: "pulse 12s infinite alternate-reverse" }} />
      </div>

      {/* ── LIVE ORDER NOTIFICATION (FAKE SOCIAL PROOF) ── */}
      <div className={`fixed bottom-24 left-6 lg:bottom-10 lg:left-10 z-[100] transition-all duration-700 ease-out pointer-events-none
        ${liveOrder ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}>
        {liveOrder && (
          <div className="bg-white/90 backdrop-blur-xl border border-gray-100 p-3 pr-6 rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center gap-4 max-w-sm pointer-events-auto cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-inner">
              🛍️
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">
                <span className="text-gray-900">{liveOrder.name}</span> just ordered
              </p>
              <p className="text-sm font-black text-primary truncate max-w-[200px] leading-tight">{liveOrder.item}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING CART ── */}
      {user?.role !== "admin" && (
        <button onClick={() => navigate("/cart")}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-16 h-16 bg-gradient-to-br from-primary to-[#ff5d24] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(255,107,53,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 border-[3px] border-white group"
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
          <div className="relative z-10 transition-transform group-hover:-rotate-12"><CartIcon /></div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 flex items-center justify-center bg-gray-900 text-white font-black text-[10px] rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* ══════════════════════════════════════════
          SEARCH & FILTERS
      ══════════════════════════════════════════ */}
      <div className="relative z-50 w-full max-w-[1600px] mx-auto px-4 lg:px-8 pt-2">

        {/* ── SEARCH ROW ── */}
        <div className="flex items-center justify-between gap-3 mb-2">

          {/* STATS PILLS — desktop only */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
              <span className="text-primary scale-75"><FlameIcon /></span>
              <span className="text-[9px] font-black text-orange-600">500+ dishes</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 border border-yellow-100">
              <span className="text-yellow-500 text-[10px]">⭐</span>
              <span className="text-[9px] font-black text-yellow-700">4.9 rated</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-500 scale-75"><ZapIcon /></span>
              <span className="text-[9px] font-black text-emerald-700">30 min delivery</span>
            </div>
          </div>

          {/* UNIQUE EXPANDING SEARCH BAR */}
          <div className={`relative group transition-all duration-500 ease-out ${searchFocused || search ? "flex-1 max-w-[400px]" : "w-9 h-9"}`} onClick={() => inputRef.current?.focus()}>
            {/* Animated background glow */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary via-orange-400 to-primary rounded-full blur-sm opacity-20 transition-all duration-700 group-hover:opacity-40 ${(searchFocused || search) ? "opacity-50 blur-md animate-pulse" : ""}`} />
            
            <div className={`relative flex items-center h-9 rounded-full transition-all duration-500 cursor-text overflow-hidden border
              ${(searchFocused || search)
                ? "bg-white border-primary/50 shadow-md w-full"
                : "bg-white border-gray-200 hover:border-primary/30 hover:bg-gray-50 shadow-sm w-9"
              }`}
            >
              <div className={`flex items-center justify-center w-9 h-9 shrink-0 transition-colors duration-500 ${(searchFocused || search) ? "text-primary" : "text-gray-500"}`}>
                <div className="relative flex items-center justify-center scale-90">
                  <SearchIcon />
                  {(searchFocused || search) && (
                    <>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-75" />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full" />
                    </>
                  )}
                </div>
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`flex-1 bg-transparent text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium py-1 outline-none text-xs min-w-0 transition-opacity duration-300 ${(searchFocused || search) ? "opacity-100" : "opacity-0"}`}
              />

              {/* Smart Search Tag */}
              {(!search && searchFocused) && (
                <div className="hidden sm:flex items-center pr-2 shrink-0">
                   <div className="px-2 py-0.5 bg-gradient-to-br from-primary/10 to-orange-400/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                     Smart Search
                   </div>
                </div>
              )}

              {search && (
                <button onClick={(e) => { e.stopPropagation(); setSearch(""); inputRef.current?.focus(); }}
                  className="mr-2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 text-[10px] font-black transition-colors shrink-0">
                  ✕
                </button>
              )}
            </div>

            {/* Floating search results count */}
            {search && (
              <div className="absolute top-[calc(100%+6px)] right-0 flex items-center gap-2 z-20 bg-gray-900 px-3 py-1.5 rounded-lg shadow-xl border border-white/10 animate-fade-in-up whitespace-nowrap">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{filteredFoods.length} result{filteredFoods.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── ULTRA-COMPACT CATEGORY FILTERS ── */}
        <div className="pb-2 pt-0 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 min-w-max px-2">
            {["All", ...categories.filter(c => c !== "All")].map((cat) => {
              const isCatActive = category === cat;
              const CAT_ICONS = { "All": "🍽️", "Burger": "🍔", "Pizza": "🍕", "Salad": "🥗", "Sushi": "🍣", "Dessert": "🍰", "Drinks": "🥤", "Chicken": "🍗", "Pasta": "🍝" };
              const icon = CAT_ICONS[cat] || "🍲";
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-300 active:scale-95 border group
                    ${isCatActive 
                      ? "bg-gray-900 border-gray-900 text-white shadow-sm" 
                      : "bg-white border-gray-100 hover:border-gray-300 shadow-sm hover:bg-gray-50"}`}
                >
                  <span className={`text-[11px] transition-transform duration-300 ${isCatActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {icon}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isCatActive ? "text-white" : "text-gray-500 group-hover:text-gray-800"}`}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto flex flex-col gap-y-8">
        
        {/* HERO SLIDER SECTION */}
        <section className="w-full z-10 relative">
          <HeroSlider />
        </section>

        {/* INFINITE MARQUEE SECTION */}
        <FeatureMarquee />

        {/* WHAT'S TRENDING FOODS */}
        {!search && category === "All" && (
          <WhatsTrending foods={foods} onAddToCart={handleAddToCart} addingIds={addingIds} isAdmin={isAdmin} />
        )}

        {/* EXCLUSIVE OFFERS & COUPONS */}
        {!search && category === "All" && (
          <OffersSection />
        )}

        {/* ── FLASH DEALS BANNER ── */}
        {!search && category === "All" && (
          <div className="w-full px-4 lg:px-8 pb-2 pt-1">
            <div className="w-full bg-gradient-to-r from-gray-900 to-black rounded-2xl p-4 lg:p-5 relative overflow-hidden shadow-lg flex items-center justify-between gap-4">
              {/* Abstract lights */}
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/20 rounded-full blur-[50px]" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-[50px]" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,107,53,0.4)] animate-pulse shrink-0">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-black text-white tracking-tight leading-tight">Flash Deal Hour</h3>
                  <p className="text-white/60 font-medium text-[10px] md:text-[11px]">Unlock premium meals at half the price. Valid for 1 hour only.</p>
                </div>
              </div>

              <div className="relative z-10 shrink-0">
                <button className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                  Claim Deal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOD GRID SECTION */}
        <section className="px-4 lg:px-8 pb-12">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              {search ? "Search Results" : (category === "All" ? "Explore Menu" : `${category} Items`)}
            </h2>
            {filteredFoods.length > 0 && !loading && (
              <span className="text-gray-500 font-medium text-sm bg-gray-100 px-3 py-1 rounded-full">{filteredFoods.length} items</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex flex-col bg-white rounded-[1.5rem] p-3 shadow-sm border border-gray-50 animate-pulse h-64">
                  <div className="w-full h-32 bg-gray-200 rounded-xl mb-4" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded mt-auto" />
                </div>
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredFoods.map((food, index) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onAddToCart={() => handleAddToCart(food._id)}
                  isAdding={addingIds.has(food._id)}
                  isAdmin={isAdmin}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

