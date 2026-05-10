import { useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";
import { getFoods } from "../services/foodService";
import { getAllUsers } from "../services/userService";

/* ── Icons ── */
const OrdersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const FoodsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ManageOrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);
const ManageFoodsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const CategoriesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const UsersActionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

/* ── Status config ── */
const STATUS_MAP = {
  pending:   { cls: "bg-amber-100/50 text-amber-700 border-amber-200",   dot: "bg-amber-500", label: "Pending"   },
  preparing: { cls: "bg-blue-100/50 text-blue-700 border-blue-200",      dot: "bg-blue-500",  label: "Preparing" },
  delivered: { cls: "bg-green-100/50 text-green-700 border-green-200",   dot: "bg-green-500", label: "Delivered" },
  cancelled: { cls: "bg-red-100/50 text-red-700 border-red-200",         dot: "bg-red-500",   label: "Cancelled" },
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* ── Skeleton ── */
function DashSkeleton() {
  return (
    <div className="w-full">
      <div className="w-1/3 h-8 bg-gray-200 rounded-lg animate-pulse mb-2" />
      <div className="w-1/4 h-4 bg-gray-100 rounded-lg animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />)}
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, icon, colorCls, bgCls, textCls, index }) {
  return (
    <div className={`relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`} style={{ animationDelay: `${index * 0.08}s` }}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bgCls} blur-2xl opacity-40`} />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgCls} ${textCls} mb-6 shadow-sm`}>
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

/* ── Main Component ── */
export default function Dashboard() {
  const [orders,  setOrders]  = useState([]);
  const [foods,   setFoods]   = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log("Admin: Dashboard syncing telemetry...");
      
      const fetchOrders = getAllOrders()
        .then(res => setOrders(res.data.orders || []))
        .catch(err => console.error("Admin: Orders fetch failed", err));

      const fetchFoods = getFoods()
        .then(res => setFoods(res.data.foods || []))
        .catch(err => console.error("Admin: Foods fetch failed", err));

      const fetchUsers = getAllUsers()
        .then(res => setUsers(res.data.users || []))
        .catch(err => console.error("Admin: Users fetch failed", err));

      await Promise.allSettled([fetchOrders, fetchFoods, fetchUsers]);
      console.log("Admin: Sync complete.");
    } catch (err) {
      console.error("Admin: Critical dashboard failure", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  if (loading) return <DashSkeleton />;

  const pendingCount   = orders.filter(o => o.status === "pending").length;
  const deliveredCount = orders.filter(o => o.status === "delivered").length;
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-8 pb-24 font-sans selection:bg-primary/20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
              <span className="text-primary mr-3">⚡</span>Dashboard
            </h1>
            <p className="text-gray-500 font-medium text-lg">Welcome back — here's your tactical overview.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
            <ClockIcon />
            <span>{new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
          <StatCard index={0} label="Total Orders"   value={orders.length}       icon={<OrdersIcon />}  colorCls="red"    bgCls="bg-red-50"    textCls="text-red-500" />
          <StatCard index={1} label="Total Revenue"  value={`₹${totalRevenue.toLocaleString()}`} icon={<RevenueIcon />} colorCls="green"  bgCls="bg-green-50"  textCls="text-green-500" />
          <StatCard index={2} label="Food Items"     value={foods.length}        icon={<FoodsIcon />}   colorCls="orange" bgCls="bg-orange-50" textCls="text-orange-500" />
          <StatCard index={3} label="Registered Users" value={users.length}      icon={<UsersIcon />}   colorCls="purple" bgCls="bg-purple-50" textCls="text-purple-500" />
        </div>

        {/* ── Mini stats row ── */}
        <div className="flex flex-wrap items-center gap-6 bg-white px-8 py-5 rounded-[2rem] border border-gray-100 shadow-sm mb-12">
          <div className="flex items-center gap-4 flex-1">
            <span className="w-4 h-4 rounded-full bg-amber-400 shadow-sm shadow-amber-400/40" />
            <div className="flex flex-col">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</span>
               <span className="text-xl font-black text-gray-900">{pendingCount}</span>
            </div>
          </div>
          <div className="w-px h-12 bg-gray-100 hidden sm:block" />
          <div className="flex items-center gap-4 flex-1">
            <span className="w-4 h-4 rounded-full bg-green-400 shadow-sm shadow-green-400/40" />
            <div className="flex flex-col">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivered</span>
               <span className="text-xl font-black text-gray-900">{deliveredCount}</span>
            </div>
          </div>
          <div className="w-px h-12 bg-gray-100 hidden sm:block" />
          <div className="flex items-center gap-4 flex-1">
            <span className="w-4 h-4 rounded-full bg-blue-400 shadow-sm shadow-blue-400/40" />
            <div className="flex flex-col">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Order</span>
               <span className="text-xl font-black text-gray-900">₹{avgOrder}</span>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <section className="mb-12">
          <div className="flex justify-between items-end border-b border-gray-200/50 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rapid Access</h2>
              <p className="text-gray-500 font-medium text-sm mt-1">Manage global records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/admin/orders",     icon: <ManageOrdersIcon />,  label: "Manage Orders",  sub: "View & update orders",   color: "group-hover:text-red-500 group-hover:bg-red-50", text: "group-hover:border-red-200"    },
              { href: "/admin/foods",      icon: <ManageFoodsIcon />,   label: "Manage Foods",   sub: "Add, edit, delete items", color: "group-hover:text-orange-500 group-hover:bg-orange-50", text: "group-hover:border-orange-200" },
              { href: "/admin/categories", icon: <CategoriesIcon />,    label: "Categories",     sub: "Organize menus",          color: "group-hover:text-blue-500 group-hover:bg-blue-50", text: "group-hover:border-blue-200"   },
              { href: "/admin/users",      icon: <UsersActionIcon />,   label: "Users",          sub: "Inspect user accounts",   color:"group-hover:text-purple-500 group-hover:bg-purple-50", text: "group-hover:border-purple-200"  },
            ].map(({ href, icon, label, sub, color, text }) => (
              <a key={href} href={href} className={`group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block ${text}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-5 transition-colors ${color}`}>
                   {icon}
                </div>
                <span className="block text-lg font-bold text-gray-900 mb-1 tracking-tight group-hover:text-primary transition-colors">{label}</span>
                <span className="block text-sm font-medium text-gray-500">{sub}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Recent Orders ── */}
        <section>
          <div className="flex justify-between items-end border-b border-gray-200/50 pb-4 mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Orders Tracker</h2>
            <a href="/admin/orders" className="text-primary font-bold text-sm tracking-wide hover:underline uppercase">View All →</a>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            {orders.length === 0 ? (
               <div className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">No orders recorded yet.</div>
            ) : orders.slice(0, 5).map((order, i) => {
              const cfg = STATUS_MAP[order.status] || STATUS_MAP.pending;
              return (
                <div key={order._id} className="flex items-center gap-4 p-5 md:p-6 border-b border-gray-100/60 transition-colors hover:bg-gray-50/50 last:border-0 cursor-pointer" onClick={() => window.location.href="/admin/orders"}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-black text-gray-600 shadow-sm border border-white">
                    {order.user?.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-xs">{order.user?.name ?? "Unknown User"}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-1 uppercase tracking-widest">
                      <span>#{order._id.slice(-6).toUpperCase()}</span>
                      {order.createdAt && <><span className="text-gray-300">•</span><span>{fmtDate(order.createdAt)}</span></>}
                    </div>
                  </div>

                  <p className="font-black text-gray-900 text-lg mr-4 drop-shadow-sm">₹{order.totalPrice}</p>

                  <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-white ${cfg.cls}`}>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}