import { useEffect, useState, useMemo } from "react";
import { getAllOrders, updateOrderStatus, cancelOrder } from "../services/orderService";

// ── Status Config ──
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-600",
    glass: "bg-amber-500/10 border-amber-400/30 text-amber-600",
    dot: "bg-amber-400",
    glow: "shadow-amber-100",
    bar: "bg-gradient-to-r from-amber-300 to-amber-400",
    stepDone: "bg-amber-400 border-amber-400",
    stepActive: "border-amber-400 bg-white",
    pulse: "bg-amber-400",
    btn: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/30 text-amber-700",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-600",
    glass: "bg-blue-500/10 border-blue-400/30 text-blue-600",
    dot: "bg-blue-400",
    glow: "shadow-blue-100",
    bar: "bg-gradient-to-r from-blue-300 to-blue-500",
    stepDone: "bg-blue-400 border-blue-400",
    stepActive: "border-blue-500 bg-white",
    pulse: "bg-blue-400",
    btn: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/30 text-blue-700",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  preparing: {
    label: "Preparing",
    color: "text-violet-600",
    glass: "bg-violet-500/10 border-violet-400/30 text-violet-600",
    dot: "bg-violet-400",
    glow: "shadow-violet-100",
    bar: "bg-gradient-to-r from-violet-300 to-violet-500",
    stepDone: "bg-violet-400 border-violet-400",
    stepActive: "border-violet-500 bg-white",
    pulse: "bg-violet-400",
    btn: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-400/30 text-violet-700",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2a10 10 0 0 1 10 10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "text-orange-600",
    glass: "bg-orange-500/10 border-orange-400/30 text-orange-600",
    dot: "bg-orange-400",
    glow: "shadow-orange-100",
    bar: "bg-gradient-to-r from-orange-300 to-orange-500",
    stepDone: "bg-orange-400 border-orange-400",
    stepActive: "border-orange-400 bg-white",
    pulse: "bg-orange-400",
    btn: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-400/30 text-orange-700",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="8" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
        <path d="M1 1h4l2 10h14l2-4h-6" />
      </svg>
    ),
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    glass: "bg-emerald-500/10 border-emerald-400/30 text-emerald-600",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-100",
    bar: "bg-gradient-to-r from-emerald-300 to-emerald-500",
    stepDone: "bg-emerald-400 border-emerald-400",
    stepActive: "border-emerald-500 bg-white",
    pulse: "bg-emerald-400",
    btn: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/30 text-emerald-700",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    glass: "bg-red-500/10 border-red-400/30 text-red-600",
    dot: "bg-red-400",
    glow: "shadow-red-100",
    bar: "bg-gradient-to-r from-red-300 to-red-400",
    stepDone: "bg-red-400 border-red-400",
    stepActive: "border-red-400 bg-white",
    pulse: "bg-red-400",
    btn: "bg-red-500/10 hover:bg-red-500/20 border-red-400/30 text-red-700",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
};

const STATUS_ORDER = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const NEXT_STATUS = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
  delivered: null,
};

// ── Toast ──
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, success: (m) => push(m), error: (m) => push(m, "error"), remove };
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold
            backdrop-blur-2xl border shadow-lg transition-all duration-300 animate-toast-in
            ${t.type === "success"
              ? "bg-white/80 border-emerald-200/70 text-emerald-700 shadow-emerald-100/80"
              : "bg-white/80 border-red-200/70 text-red-700 shadow-red-100/80"
            }`}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
          {t.msg}
          <button onClick={() => removeToast(t.id)} className="ml-1 opacity-40 hover:opacity-80 transition-opacity">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton ──
function SkeletonCard() {
  return (
    <div className="rounded-3xl p-5 lg:p-6 bg-white/60 backdrop-blur-xl border border-gray-100/80 shadow-sm animate-pulse flex flex-col lg:flex-row gap-6 items-center">
      <div className="w-full lg:w-1/4 flex items-center gap-3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0">
        <div className="w-12 h-12 rounded-2xl bg-gray-100" />
        <div>
          <div className="h-3 w-24 bg-gray-100 rounded-full mb-2" />
          <div className="h-2.5 w-32 bg-gray-50 rounded-full" />
        </div>
      </div>
      <div className="w-full lg:w-2/4">
        <div className="h-2 w-full bg-gray-50 rounded-full mb-2" />
        <div className="flex justify-between">
          <div className="h-2 w-10 bg-gray-50 rounded-full" />
          <div className="h-2 w-10 bg-gray-50 rounded-full" />
          <div className="h-2 w-10 bg-gray-50 rounded-full" />
          <div className="h-2 w-10 bg-gray-50 rounded-full" />
        </div>
      </div>
      <div className="w-full lg:w-1/4 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 pl-0 lg:pl-6">
        <div className="h-6 w-20 bg-gray-100 rounded-full mb-2" />
        <div className="h-10 bg-gray-50 rounded-2xl" />
      </div>
    </div>
  );
}

// ── Empty State ──
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 bg-white/40 rounded-3xl backdrop-blur-md border border-gray-100 mt-6 shadow-sm">
      <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 shadow-md flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      </div>
      <p className="text-gray-700 font-bold text-lg">No orders found</p>
      <p className="text-gray-400 text-sm mt-1">Try changing your filters or wait for new orders.</p>
    </div>
  );
}

// ── Stepper ──
function StatusStepper({ currentStatus, orderId, onStatusChange, updating }) {
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50/80 border border-red-200/60 w-full">
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const cfg = STATUS_CONFIG[currentStatus];

  return (
    <div className="w-full px-4">
      <div className="relative flex items-center">
        {/* Track */}
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-[3px] bg-gray-100 rounded-full" />

        {/* Progress */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full left-3 transition-all duration-700 ease-in-out ${cfg.bar}`}
          style={{
            width: currentIdx === 0
              ? "0%"
              : `calc(${(currentIdx / (STATUS_ORDER.length - 1)) * 100}% - 0px)`,
          }}
        />

        {/* Dots */}
        <div className="relative flex justify-between w-full">
          {STATUS_ORDER.map((status, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isNext = status === NEXT_STATUS[currentStatus];
            const stepCfg = STATUS_CONFIG[status];

            return (
              <button
                key={status}
                disabled={!isNext || updating}
                onClick={() => isNext && !updating && onStatusChange(orderId, status)}
                title={stepCfg.label}
                className={`relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
                  ${isDone
                    ? `w-7 h-7 ${stepCfg.stepDone} shadow-sm`
                    : isCurrent
                    ? `w-8 h-8 ${stepCfg.stepActive} border-2 shadow-md scale-110`
                    : "w-6 h-6 bg-white border-gray-200"
                  }
                  ${isNext ? "cursor-pointer hover:scale-125 hover:shadow-lg" : "cursor-default"}
                  ${updating ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isCurrent && (
                  <span className={`w-3 h-3 rounded-full ${stepCfg.pulse}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        {STATUS_ORDER.map((status, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const stepCfg = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              style={{ maxWidth: 60 }}
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-center leading-tight transition-colors
                ${isCurrent ? stepCfg.color : isDone ? "text-gray-400" : "text-gray-300"}`}
            >
              {stepCfg.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Avatar gradients ──
const AVATAR_GRADIENTS = [
  "from-violet-400 to-indigo-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-amber-500",
  "from-pink-400 to-rose-500",
];
const getGradient = (name = "") =>
  AVATAR_GRADIENTS[(name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

// ── Horizontal Order Card ──
function OrderCard({ order, updating, onStatusChange, onCancel }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const nextStatus = NEXT_STATUS[order.status];
  const nextCfg = nextStatus ? STATUS_CONFIG[nextStatus] : null;
  const gradient = getGradient(order.user?.name);
  const shortId = order._id.slice(-6).toUpperCase();

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden
        bg-white/80 backdrop-blur-2xl
        border border-gray-100
        shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]
        hover:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.08)]
        hover:-translate-y-1
        transition-all duration-300 ease-out
        flex flex-col lg:flex-row items-center p-5 lg:p-6 gap-6`}
    >
      {/* Top sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      {/* ── Left: User & Order Info ── */}
      <div className="w-full lg:w-[28%] flex flex-col gap-3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">#{shortId}</span>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border backdrop-blur-md ${cfg.glass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {cfg.label}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md`}>
            {order.user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm truncate leading-tight">
              {order.user?.name || "Unknown Customer"}
            </p>
            <p className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">
              {order.user?.email || "No email provided"}
            </p>
          </div>
        </div>

        <div className="mt-1">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items ({order.foods?.length || 0})</p>
           <div className="flex flex-wrap gap-1.5">
             {order.foods?.slice(0, 3).map((f, i) => (
               <span key={i} className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 truncate max-w-[120px]">
                 {f.quantity}x {f.food?.name || "Item"}
               </span>
             ))}
             {(order.foods?.length || 0) > 3 && (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                  +{(order.foods?.length || 0) - 3} more
                </span>
             )}
           </div>
        </div>
      </div>

      {/* ── Middle: Stepper ── */}
      <div className="w-full lg:w-[48%] py-2 lg:py-0">
        <StatusStepper
          currentStatus={order.status}
          orderId={order._id}
          onStatusChange={onStatusChange}
          updating={updating[order._id]}
        />
      </div>

      {/* ── Right: Total & CTA ── */}
      <div className="w-full lg:w-[24%] flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-5 lg:pt-0 lg:pl-6 h-full min-h-[120px]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order Total</span>
          <span className="text-xl font-black text-gray-900 tracking-tight">₹{order.totalPrice}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          {nextStatus && nextCfg ? (
            <button
              disabled={updating[order._id]}
              onClick={() => onStatusChange(order._id, nextStatus)}
              className={`flex-1 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest
                transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 border backdrop-blur-sm ${nextCfg.btn}`}
            >
              {updating[order._id] ? (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <>{nextCfg.icon} Mark {nextCfg.label}</>
              )}
            </button>
          ) : order.status === "cancelled" ? (
             <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50/80 border border-red-200/60">
               <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
               <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Cancelled</span>
             </div>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Delivered</span>
            </div>
          )}

          {["pending", "confirmed", "preparing"].includes(order.status) && (
            <button
              disabled={updating[order._id]}
              onClick={() => onCancel(order._id)}
              title="Cancel Order"
              className="flex-shrink-0 w-12 flex items-center justify-center rounded-2xl border bg-red-50/50 hover:bg-red-500/10 border-red-200/50 text-red-500 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ title, value, color, icon }) {
  const gradients = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    amber: "from-amber-400 to-orange-500 shadow-orange-500/20",
    emerald: "from-emerald-400 to-teal-500 shadow-emerald-500/20",
    red: "from-rose-400 to-red-500 shadow-red-500/20",
    violet: "from-violet-500 to-purple-600 shadow-purple-500/20",
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  );
}

// ── Main ──
export default function ManageOrders() {
  const [orders, setOrders] = useState(null);
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState("all");
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data.orders);
      } catch {
        setOrders([]);
        toast.error("Failed to load orders.");
      }
    })();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
      toast.success(`Marked as ${STATUS_CONFIG[status]?.label}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed.");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await cancelOrder(id);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel order.");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Stats
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const activeOrders = orders?.filter((o) => ["confirmed", "preparing", "out_for_delivery"].includes(o.status)).length || 0;
  const totalRevenue = orders?.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.totalPrice, 0) || 0;

  const filteredOrders = useMemo(() => {
    if (!orders) return null;
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(16px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-toast-in { animation: toast-in 0.2s ease-out both; }
        .orders-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .orders-scroll::-webkit-scrollbar-track { background: transparent; }
        .orders-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .orders-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <ToastContainer toasts={toast.toasts} removeToast={toast.remove} />

      <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, #ffffff 0%, #f8faff 40%, #f0f4ff 70%, #faf8ff 100%)" }}>
        {/* Decorative background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-30 backdrop-blur-3xl bg-white/70 border-b border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Order Desk</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Manage and track all customer orders seamlessly.</p>
            </div>
            
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-lg shadow-gray-900/20 transition-all active:scale-95">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" /><polyline points="21 3 21 9 15 9" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* ── Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Revenue" value={`₹${totalRevenue}`} color="emerald" icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            }/>
            <StatCard title="Total Orders" value={totalOrders} color="blue" icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            }/>
            <StatCard title="Action Needed" value={pendingOrders} color="red" icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }/>
            <StatCard title="In Progress" value={activeOrders} color="amber" icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            }/>
          </div>

          {/* ── Filters ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6 border-b border-gray-200/60">
            <button
              onClick={() => setFilter("all")}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === "all" ? "bg-gray-900 text-white shadow-md shadow-gray-900/20" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900"}`}
            >
              All Orders
            </button>
            {[...STATUS_ORDER, "cancelled"].map((s) => {
              const cfg = STATUS_CONFIG[s];
              const isActive = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${isActive ? cfg.glass + " ring-2 ring-offset-2 ring-" + cfg.color.split("-")[1] + "-400 shadow-md scale-105" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? cfg.dot + " animate-pulse" : "bg-gray-300"}`} />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* ── List ── */}
          <div className="flex flex-col gap-5">
            {orders === null ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filteredOrders.length === 0 ? (
              <EmptyState />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  updating={updating}
                  onStatusChange={handleStatusChange}
                  onCancel={handleCancelOrder}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}