import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

/* ── Icons ── */
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const CartEmptyIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
  </svg>
);

/* ── Skeleton ── */
function CartSkeleton() {
  return (
    <div className="w-full space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm animate-pulse">
          <div className="w-28 h-28 bg-gray-200 rounded-2xl"></div>
          <div className="flex-1 space-y-4 py-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Empty State ── */
function EmptyCart({ onBrowse }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
      <div className="bg-gray-50 p-8 rounded-full mb-6">
        <CartEmptyIcon />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Your cart is feeling lonely</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Looks like you haven't added anything yet. Let's find you some delicious food!</p>
      <button
        className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-primary/40 transition-all duration-300"
        onClick={onBrowse}
      >
        Browse Menu &rarr;
      </button>
    </div>
  );
}

/* ── Cart Item Card ── */
function CartItemCard({ item, onRemove, onIncrease, onDecrease, removing }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    
    <div className={`relative group flex flex-col sm:flex-row gap-5 p-5 rounded-[2rem] bg-white border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${removing ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}>
      {/* Image */}
      <div className="w-full sm:w-32 h-32 relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-gray-50 to-gray-100">
        {!imgErr && item.food?.image ? (
          <img
            src={item.food.image}
            alt={item.food.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
         
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
              {item.food?.name}
            </h3>
          </div>
          {item.food?.category?.name && (
            <span className="inline-block mt-1.5 px-3 py-1 bg-gradient-to-r from-orange-50 to-amber-50 text-primary text-xs font-bold rounded-full tracking-wide uppercase">
              {item.food.category.name}
            </span>
          )}
          <p className="text-gray-500 text-sm mt-3 font-medium">₹{item.food?.price} per item</p>
        </div>

        <div className="flex items-center justify-between mt-5">
          {/* Qty controls */}
          <div className="flex items-center bg-gray-50/80 rounded-2xl border border-gray-100 p-1">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-gray-600 font-medium hover:bg-gray-100 hover:text-black transition-colors shadow-sm"
              onClick={() => onDecrease(item)}
              aria-label="Decrease"
            >−</button>
            <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-primary font-bold hover:bg-primary/10 transition-colors shadow-sm"
              onClick={() => onIncrease(item)}
              aria-label="Increase"
            >+</button>
          </div>

          <p className="text-2xl font-extrabold text-gray-900">
            ₹{(item.food?.price || 0) * item.quantity}
          </p>
        </div>
      </div>

      
      <button
        className="absolute top-4 right-4 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        onClick={() => onRemove(item)}
        aria-label="Remove item"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

/* ── Main Component ── */
export default function CartPage() {
  const { cart, loading, fetchCart, removeItem, updateItem } = useCartStore();
  const [removingId, setRemovingId] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const validItems = cart?.items?.filter((item) => item.food) ?? [];

  const totalAmount = validItems.reduce(
    (acc, item) => acc + (item.food?.price || 0) * item.quantity, 0
  );

  const discount = couponApplied ? Math.round(totalAmount * 0.1) : 0;
  const finalAmount = totalAmount - discount;

  const handleRemove = async (item) => {
    setRemovingId(item.food._id);
    try {
      await removeItem(item.food._id);
    } catch (e) {
      console.log(e);
    } finally {
      setRemovingId(null);
    }
  };

  const handleIncrease = async (item) => {
    try {
      await updateItem(item.food._id, item.quantity + 1);
    } catch (e) { console.log(e); }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) { handleRemove(item); return; }
    try {
      await updateItem(item.food._id, item.quantity - 1);
    } catch (e) { console.log(e); }
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "FOODRUSH10") setCouponApplied(true);
    else alert("Invalid coupon code");
  };

  /* ── Loading ── */
  if (loading && (!cart || validItems.length === 0)) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-10 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Your Cart</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[65%]"><CartSkeleton /></div>
            <div className="w-full lg:w-[35%] h-[400px] bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (!cart || validItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <EmptyCart onBrowse={() => navigate("/home")} />
      </div>
    );
  }

  const totalQty = validItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-12 pb-24 font-sans selection:bg-primary/20">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Review Cart.</h1>
            <p className="text-gray-500 font-medium text-lg">
              <span className="text-gray-900 font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">{totalQty} item{totalQty !== 1 ? "s" : ""}</span> ready to satisfy your cravings
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 px-4 py-2 rounded-2xl font-semibold border border-orange-100 shadow-[0_4px_14px_rgba(255,107,53,0.1)]">
            <ClockIcon />
            <span>Delivery in 30–40 min</span>
          </div>
        </div>

        {/* ── Layout ── */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* LEFT — Items */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5 relative z-10">
            {validItems.map((item) => (
              <CartItemCard
                key={item._id}
                item={item}
                onRemove={handleRemove}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                removing={removingId === item.food._id}
              />
            ))}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 mt-6 px-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm"><ShieldIcon /> 100% Secure Checkout</span>
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">🚀 Instant Processing</span>
            </div>
          </div>

          {/* RIGHT — Summary */}
          <div className="w-full lg:w-[38%] sticky top-24">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">

              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">Order Summary</h3>

              {/* Coupon Row */}
              <div className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 group transition-colors rounded-2xl border border-gray-200/60 mb-8 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 outline-none">
                <div className="pl-3 text-primary"><TagIcon /></div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 font-semibold placeholder:font-medium placeholder:text-gray-400 uppercase tracking-wide"
                  placeholder="Code FOODRUSH10"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={couponApplied}
                />
                <button
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all ${couponApplied ? "bg-green-100 text-green-700" : "bg-gray-900 text-white hover:bg-gray-800 shadow-md"}`}
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied ? "Applied ✓" : "Apply"}
                </button>
              </div>

              {/* Bill Details */}
              <div className="space-y-5 text-[1.05rem]">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Item Total</span>
                  <span className="text-gray-900 font-bold">₹{totalAmount}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between items-center text-green-600 font-bold bg-green-50 p-3 rounded-2xl">
                    <span>Coupon Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Delivery Fee</span>
                  <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">FREE</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Platform Fee</span>
                  <span className="text-gray-900 font-bold">₹3</span>
                </div>
              </div>

              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />

              {/* Grand Total */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="block text-gray-500 font-semibold mb-1">To Pay</span>
                  <span className="block text-3xl font-black text-gray-900">₹{finalAmount + 3}</span>
                </div>
                <div className="text-right">
                  {couponApplied ? (
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl">Saved ₹{discount}! 🎉</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">Incl. of all taxes</span>
                  )}
                </div>
              </div>

              {/* Place order */}
              <button
                className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-primary to-[#ff8f5e] text-white text-lg font-bold rounded-[1.5rem] shadow-[0_8px_25px_rgba(255,107,53,0.3)] hover:shadow-[0_12px_30px_rgba(255,107,53,0.4)] hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}