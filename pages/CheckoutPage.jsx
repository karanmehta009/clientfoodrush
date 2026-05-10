import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { placeOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Icons 
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CODIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const UPIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const NoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

/* ── Skeleton ── */
function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[60%] space-y-6">
            <div className="w-full h-[250px] bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse"></div>
            <div className="w-full h-[200px] bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse"></div>
          </div>
          <div className="w-full lg:w-[40%] h-[500px] bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Option Card ── */
function PaymentCard({ value, current, onChange, icon, label, sub }) {
  const active = current === value;
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${active ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"}`}
      onClick={() => onChange(value)}
    >
      <span className={`w-12 h-12 flex items-center justify-center rounded-xl ${active ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-500"}`}>
        {icon}
      </span>
      <div className="flex-1">
        <span className={`block font-bold text-lg leading-tight ${active ? "text-gray-900" : "text-gray-700"}`}>{label}</span>
        <span className="block text-sm text-gray-500 mt-0.5">{sub}</span>
      </div>
      <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-300 ${active ? "bg-primary text-white scale-100" : "bg-gray-200 text-transparent scale-50"}`}>
        <CheckIcon />
      </div>
    </button>
  );
}

/* ── Main Component ── */
export default function CheckoutPage() {
  const { cart, loading, fetchCart, clear } = useCartStore();
  const [address,  setAddress]  = useState("");
  const [payment,  setPayment]  = useState("cod");
  const [note,     setNote]     = useState("");
  const [placing,  setPlacing]  = useState(false);
  const [addrErr,  setAddrErr]  = useState(false);

  const navigate = useNavigate();

  useEffect(() => { 
    if (!cart && !loading) fetchCart(); 
  }, [cart, fetchCart, loading]);

  /* loading */
  if (loading) return <CheckoutSkeleton />;

  /* guard */
  if (!cart) return <CheckoutSkeleton />;

  /* filter + totals */
  const validItems = cart.items.filter((item) => item.food) ?? [];

  const total = validItems.reduce(
    (acc, item) => acc + (item.food?.price || 0) * item.quantity, 0
  );

  const DELIVERY   = 0;
  const PLATFORM   = 3;
  const grandTotal = total + DELIVERY + PLATFORM;
  const totalQty   = validItems.reduce((a, i) => a + i.quantity, 0);

  const handleOrder = async () => {
    if (!address.trim()) {
      setAddrErr(true);
      toast.error("Please enter your delivery address");
      return;
    }

    if (placing) return;
    setPlacing(true);

    try {
      await placeOrder({ address, paymentMethod: payment, notes: note });
      toast.success("Order placed successfully! 🎉");
      clear(); 
      setTimeout(() => navigate("/orders"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-12 pb-24 font-sans selection:bg-primary/20">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 lg:px-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Checkout.<span className="text-primary"></span></h1>
            <p className="text-gray-500 font-medium text-lg">
              <span className="text-gray-900 font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">{totalQty} item{totalQty !== 1 ? "s" : ""}</span> ready to be delivered
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 px-4 py-2 rounded-2xl font-semibold border border-orange-100 shadow-[0_4px_14px_rgba(255,107,53,0.1)]">
            <ClockIcon />
            <span>Est. Arrival: 30–40 min</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ════════════════════
              LEFT COLUMN
          ════════════════════ */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">

            {/* ── Delivery Address ── */}
            <section className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary"><LocationIcon /></span>
                <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className={`relative rounded-2xl overflow-hidden border-2 transition-colors duration-300 ${addrErr ? "border-red-400 bg-red-50/30" : "border-gray-100 bg-gray-50/50 focus-within:border-primary/50 focus-within:bg-white"}`}>
                <textarea
                  className="w-full bg-transparent p-4 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                  rows={4}
                  placeholder="Enter your full delivery address — flat no., street, landmark, city…"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setAddrErr(false); }}
                />
              </div>

              {addrErr && (
                <p className="text-red-500 font-medium text-sm mt-2 ml-2">⚠ Delivery address is required</p>
              )}

              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {["Home", "Work", "Other"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="flex-shrink-0 px-5 py-2 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => setAddress(prev => prev ? prev : tag + " — ")}
                  >
                    {tag === "Home" ? "🏠" : tag === "Work" ? "💼" : "📍"} {tag}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Payment Method ── */}
            <section className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary"><UPIIcon /></span>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="flex flex-col gap-4">
                <PaymentCard
                  value="cod"
                  current={payment}
                  onChange={setPayment}
                  icon={<CODIcon />}
                  label="Cash on Delivery"
                  sub="Pay when your order arrives"
                />
                <PaymentCard
                  value="online"
                  current={payment}
                  onChange={setPayment}
                  icon={<UPIIcon />}
                  label="UPI / Card"
                  sub="GPay, PhonePe, Paytm, Debit/Credit"
                />
              </div>

              {payment === "online" && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 font-medium text-sm flex items-center gap-2">
                  <span>🔒</span> This is a demo — no real payment will be charged
                </div>
              )}
            </section>

            {/* ── Order Notes ── */}
            <section className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary"><NoteIcon /></span>
                <h2 className="text-2xl font-bold text-gray-900">Order Notes <span className="text-gray-400 font-medium text-lg ml-1">(Optional)</span></h2>
              </div>
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50/50 focus-within:border-primary/50 focus-within:bg-white transition-colors duration-300">
                <textarea
                  className="w-full bg-transparent p-4 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                  rows={2}
                  placeholder="Any special instructions? e.g. extra spicy, no onions…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </section>

          </div>

          {/* ════════════════════
              RIGHT — SUMMARY
          ════════════════════ */}
          <div className="w-full lg:w-[40%] sticky top-24">
            <div className="bg-white rounded-[2.5rem] p-8 mt-5 lg:mt-0 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Order Details</h3>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {validItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-900 font-bold text-sm">
                        {item.quantity}×
                      </span>
                      <span className="font-semibold text-gray-800 line-clamp-1">{item.food?.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{(item.food?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

              {/* Bill rows */}
              <div className="space-y-4 text-[1.05rem]">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Item Total</span>
                  <span className="text-gray-900 font-bold">₹{total}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Delivery Fee</span>
                  <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">FREE</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Platform Fee</span>
                  <span className="text-gray-900 font-bold">₹{PLATFORM}</span>
                </div>
              </div>

              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

              {/* Grand total */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="block text-gray-500 font-semibold mb-1">Total to Pay</span>
                  <span className="block text-3xl font-black text-gray-900">₹{grandTotal}</span>
                </div>
              </div>

              {/* Place order */}
              <button
                className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-primary to-[#ff8f5e] text-white text-lg font-bold rounded-[1.5rem] shadow-[0_8px_25px_rgba(255,107,53,0.3)] hover:shadow-[0_12px_30px_rgba(255,107,53,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                onClick={handleOrder}
                disabled={placing}
              >
                {placing ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order…</>
                ) : (
                  <>Place Order &nbsp;🚀</>
                )}
              </button>

              <p className="flex justify-center items-center gap-2 mt-6 text-sm font-medium text-gray-400">
                <ShieldIcon /> 100% secure &amp; encrypted payment
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
