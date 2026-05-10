import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ── Icons ──
const PackageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const ReorderIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
    <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ── Status Config ──
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    glass: "bg-amber-500/10 border-amber-400/30 text-amber-600",
    dot: "bg-amber-400", color: "text-amber-600",
    bar: "bg-gradient-to-r from-amber-300 to-amber-400",
    stepDone: "bg-amber-400 border-amber-400",
    stepActive: "border-amber-400 bg-white", pulse: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    glass: "bg-blue-500/10 border-blue-400/30 text-blue-600",
    dot: "bg-blue-400", color: "text-blue-600",
    bar: "bg-gradient-to-r from-blue-300 to-blue-500",
    stepDone: "bg-blue-400 border-blue-400",
    stepActive: "border-blue-500 bg-white", pulse: "bg-blue-400",
  },
  preparing: {
    label: "Preparing",
    glass: "bg-violet-500/10 border-violet-400/30 text-violet-600",
    dot: "bg-violet-400", color: "text-violet-600",
    bar: "bg-gradient-to-r from-violet-300 to-violet-500",
    stepDone: "bg-violet-400 border-violet-400",
    stepActive: "border-violet-500 bg-white", pulse: "bg-violet-400",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    glass: "bg-orange-500/10 border-orange-400/30 text-orange-600",
    dot: "bg-orange-400", color: "text-orange-600",
    bar: "bg-gradient-to-r from-orange-300 to-orange-500",
    stepDone: "bg-orange-400 border-orange-400",
    stepActive: "border-orange-400 bg-white", pulse: "bg-orange-400",
  },
  delivered: {
    label: "Delivered",
    glass: "bg-emerald-500/10 border-emerald-400/30 text-emerald-600",
    dot: "bg-emerald-400", color: "text-emerald-600",
    bar: "bg-gradient-to-r from-emerald-300 to-emerald-500",
    stepDone: "bg-emerald-400 border-emerald-400",
    stepActive: "border-emerald-500 bg-white", pulse: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    glass: "bg-red-500/10 border-red-400/30 text-red-600",
    dot: "bg-red-400", color: "text-red-600",
    bar: "bg-gradient-to-r from-red-300 to-red-400",
    stepDone: "bg-red-400 border-red-400",
    stepActive: "border-red-400 bg-white", pulse: "bg-red-400",
  },
};

const STATUS_ORDER = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

// ── Helpers ──
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const formatTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const AVATAR_GRADIENTS = [
  "from-violet-400 to-indigo-500", "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500", "from-orange-400 to-amber-500", "from-pink-400 to-rose-500",
];
const getGradient = (str = "") => AVATAR_GRADIENTS[(str.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

// ── Skeleton ──
function OrderSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl p-4 bg-white/60 backdrop-blur-xl border border-white/90 shadow-sm animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gray-100" />
              <div>
                <div className="h-3.5 w-24 bg-gray-100 rounded-full mb-1.5" />
                <div className="h-2.5 w-32 bg-gray-50 rounded-full" />
              </div>
            </div>
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="h-9 w-full bg-gray-50 rounded-xl my-4" />
          <div className="space-y-2 mb-4">
            <div className="h-2.5 w-full bg-gray-50 rounded-full" />
            <div className="h-2.5 w-3/4 bg-gray-50 rounded-full" />
          </div>
          <div className="h-px bg-gray-100 my-3" />
          <div className="flex justify-between items-center">
            <div className="h-6 w-16 bg-gray-100 rounded-lg" />
            <div className="h-8 w-28 bg-gray-50 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty State ──
function EmptyOrders({ onBrowse }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28">
      <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 shadow-md flex items-center justify-center mb-5 text-gray-300">
        <PackageIcon />
      </div>
      <p className="text-gray-800 font-extrabold text-xl tracking-tight mb-1">No orders yet</p>
      <p className="text-gray-400 text-sm font-medium mt-1 mb-6">You haven't placed any orders. Time to explore!</p>
      <button
        onClick={onBrowse}
        className="px-7 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-full text-sm shadow-lg shadow-gray-900/10 active:scale-95 transition-all duration-200"
      >
        Browse Menu
      </button>
    </div>
  );
}

// ── Stepper ──
function StatusStepper({ status }) {
  if (status === "cancelled") return (
    <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50/80 border border-red-200/60">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Order Cancelled</span>
    </div>
  );

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div>
      <div className="relative flex items-center">
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-[2px] bg-gray-100 rounded-full" />
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-[2px] rounded-full left-3 transition-all duration-700 ease-in-out ${cfg.bar}`}
          style={{ width: currentIdx === 0 ? "0%" : `calc(${(currentIdx / (STATUS_ORDER.length - 1)) * 100}% - 0px)` }}
        />
        <div className="relative flex justify-between w-full">
          {STATUS_ORDER.map((s, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const sCfg = STATUS_CONFIG[s];
            return (
              <div key={s} title={sCfg.label}
                className={`relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
                  ${isDone ? `w-5 h-5 ${sCfg.stepDone} shadow-sm`
                    : isCurrent ? `w-6 h-6 ${sCfg.stepActive} border-2 shadow-md`
                    : "w-4 h-4 bg-white border-gray-200"}`}
              >
                {isDone && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isCurrent && <span className={`w-2 h-2 rounded-full ${sCfg.pulse}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        {STATUS_ORDER.map((s, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const sCfg = STATUS_CONFIG[s];
          return (
            <div key={s} style={{ maxWidth: 44 }}
              className={`text-[9px] font-bold uppercase tracking-wide text-center leading-tight w-10 transition-colors
                ${isCurrent ? sCfg.color : isDone ? "text-gray-300" : "text-gray-200"}`}
            >
              {sCfg.label.split(" ").map((w, i) => <div key={i}>{w}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Order Card ──
function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const foods = (order.foods || []).filter((f) => f.food);
  const preview = foods.slice(0, 2);
  const extra = foods.length - 2;
  const gradient = getGradient(order._id);
  const shortId = order._id.slice(-6).toUpperCase();

  return (
    <div className="group relative rounded-2xl overflow-hidden
      bg-white/70 backdrop-blur-2xl border border-white/90
      shadow-[0_2px_16px_-4px_rgba(0,0,0,0.07)]
      hover:shadow-[0_10px_36px_-8px_rgba(0,0,0,0.12)]
      hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent pointer-events-none rounded-2xl" />

      <div className="relative p-4 lg:p-5 flex flex-col gap-3 flex-1">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md`}>
              #{shortId.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-gray-800 text-sm leading-tight tracking-tight">
                Order #{shortId}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5 font-medium">
                <ClockIcon />
                {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
              </p>
            </div>
          </div>

          <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border backdrop-blur-md ${cfg.glass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {cfg.label}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

        {/* Stepper */}
        <StatusStepper status={order.status} />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

        {/* Items */}
        <div className="bg-gray-50/60 backdrop-blur-sm border border-gray-100 rounded-xl p-3 space-y-2">
          {preview.map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-gray-500 font-bold text-xs">{item.quantity}×</span>
                <span className="text-gray-700 font-semibold text-xs truncate">{item.food?.name}</span>
              </div>
              <span className="font-bold text-gray-800 flex-shrink-0 bg-white border border-gray-100 px-2 py-0.5 rounded-lg text-xs">
                ₹{(item.food?.price || 0) * item.quantity}
              </span>
            </div>
          ))}

          <div className={`overflow-hidden transition-all duration-300 ease-in-out space-y-2 ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
            {foods.slice(2).map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100/60">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  <span className="text-gray-500 font-bold text-xs">{item.quantity}×</span>
                  <span className="text-gray-700 font-semibold text-xs truncate">{item.food?.name}</span>
                </div>
                <span className="font-bold text-gray-800 flex-shrink-0 bg-white border border-gray-100 px-2 py-0.5 rounded-lg text-xs">
                  ₹{(item.food?.price || 0) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {extra > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center justify-center gap-1 w-full pt-2 border-t border-gray-100 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
            >
              {expanded ? "Show Less" : `+${extra} More Item${extra > 1 ? "s" : ""}`}
              <ChevronIcon open={expanded} />
            </button>
          )}
        </div>

        {/* Total row */}
        <div className="flex items-center justify-between bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl px-3 py-2">
          <span className="text-xs text-gray-400 font-semibold">Total Paid</span>
          <span className="text-base font-extrabold text-gray-900 tracking-tight">₹{order.totalPrice}</span>
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          {order.status === "pending" ? (
            <button
              onClick={() => onCancel(order._id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border
                bg-red-500/10 hover:bg-red-500/20 border-red-400/30 text-red-600
                transition-all duration-200 active:scale-[0.98]"
            >
              Cancel Order
            </button>
          ) : order.status === "delivered" ? (
            <button
              onClick={() => toast("Reorder unavailable in demo.")}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border
                bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/30 text-emerald-700
                transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <ReorderIcon /> Reorder
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
              <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Progress…</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Main ──
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .orders-scroll::-webkit-scrollbar { width: 4px; }
        .orders-scroll::-webkit-scrollbar-track { background: transparent; }
        .orders-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .orders-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#ffffff 0%,#f8faff 40%,#f0f4ff 70%,#faf8ff 100%)" }}>

        {/* Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-pink-50/30 rounded-full blur-3xl" />
        </div>

        {/* Navbar */}
        <div className="sticky top-0 z-30 backdrop-blur-2xl bg-white/70 border-b border-gray-100/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-none">
                My Orders.
              </h1>
              <p className="text-gray-500 font-medium text-base mt-2">
                {loading ? "Loading…" : (
                  <>
                    You have placed{" "}
                    <span className="text-gray-900 font-bold bg-white px-3 py-0.5 rounded-full shadow-sm border border-gray-100">
                      {orders.length}
                    </span>{" "}
                    order{orders.length !== 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
              {["pending", "preparing", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                <div key={s}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-wide ${STATUS_CONFIG[s].glass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
                  {STATUS_CONFIG[s].label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto orders-scroll"
          style={{ maxHeight: "calc(100vh - 88px)" }}
        >
          {loading ? (
            <OrderSkeleton />
          ) : orders.length === 0 ? (
            <EmptyOrders onBrowse={() => navigate("/home")} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}