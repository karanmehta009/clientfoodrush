import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { updateProfile } from "../services/userService";

/* ── Icons ── */
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const OrderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
  </svg>
);
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ── Toast ── */
function Toast({ toasts }) {
  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl shadow-gray-900/10 backdrop-blur-xl border border-white max-w-sm animate-[fadeIn_0.3s_ease-out] font-bold text-sm tracking-wide ${t.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-white/90 text-gray-900"}`}>
          <span className="text-xl drop-shadow-sm">{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [toasts, setToasts] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastId = useRef(0);

  const pushToast = (message, type = "success") => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      pushToast("Name cannot be empty", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await updateProfile({ name: editName });
      if (res.data.success) {
        updateUser(res.data.user);
        setEditMode(false);
        pushToast("Profile updated successfully!", "success");
      }
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || "");
    setEditMode(false);
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? "U";
  const isAdmin      = user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-12 pb-24 font-sans selection:bg-primary/20 relative overflow-hidden">
      <Toast toasts={toasts} />

      {/* Background blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* ── PROFILE CARD ── */}
        <div className="w-full lg:w-[65%] bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-10 pb-10 border-b border-gray-100/60">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-5xl font-black text-white shadow-lg shadow-primary/20 transform transition-transform group-hover:scale-105">
                {avatarLetter}
              </div>
              <button className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-700 shadow-xl border border-gray-100 hover:text-primary hover:scale-110 active:scale-95 transition-all">
                <CameraIcon />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">{user?.name}</h1>
              <p className="text-gray-500 font-medium mb-3">{user?.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-primary/10 text-primary"}`}>
                <ShieldIcon /> {isAdmin ? "Administrator" : "Member"}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-6 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 sm:w-1/3 uppercase tracking-widest">
                <span className="text-gray-400"><UserIcon /></span> Full Name
              </div>
              <div className="flex-1">
                {editMode ? (
                  <input
                    className="w-full bg-gray-50/50 border-2 border-primary/50 focus:bg-white focus:border-primary text-gray-900 px-4 py-3 rounded-2xl outline-none font-semibold transition-colors shadow-sm shadow-primary/10"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p className="font-bold text-gray-900 text-lg px-4 py-3 bg-gray-50/50 rounded-2xl border border-transparent">{user?.name}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 sm:w-1/3 uppercase tracking-widest">
                <span className="text-gray-400"><MailIcon /></span> Email Address
              </div>
              <div className="flex-1 relative">
                <p className="font-semibold text-gray-500 text-lg px-4 py-3 bg-gray-50/50 rounded-2xl border border-transparent">{user?.email}</p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-200 text-gray-500 text-[0.65rem] font-bold uppercase tracking-widest rounded-md">Read-only</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100/60">
            {editMode ? (
              <>
                <button className="px-6 py-3 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors" onClick={handleCancelEdit}>Cancel</button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-primary hover:bg-orange-600 text-white shadow-lg shadow-primary/20 active:scale-95 transition-all" onClick={handleSave}>
                  <SaveIcon /> Save Changes
                </button>
              </>
            ) : (
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary transition-colors shadow-sm" onClick={() => { setEditMode(true); setEditName(user.name); }}>
                <EditIcon /> Edit Profile
              </button>
            )}
          </div>

        </div>

        {/* ── SIDE COLUMN ── */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6">

          {/* QUICK ACTIONS CARD */}
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight">Quick Actions</h3>

            <div className="flex flex-col gap-4">
              {isAdmin ? (
                <>
                  {/* Admin Quick Actions */}
                  <button className="group flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 transition-all text-left w-full cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </div>
                    <div className="flex-1">
                      <span className="block font-bold text-gray-900 group-hover:text-purple-900">Dashboard</span>
                      <span className="block text-xs font-semibold text-gray-500 mt-0.5">View admin dashboard</span>
                    </div>
                    <div className="text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"><ChevronIcon /></div>
                  </button>

                  <button className="group flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all text-left w-full cursor-pointer" onClick={() => navigate("/admin/orders")}>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm mr-4 group-hover:scale-110 transition-transform"><OrderIcon /></div>
                    <div className="flex-1">
                      <span className="block font-bold text-gray-900 group-hover:text-orange-900">Manage Orders</span>
                      <span className="block text-xs font-semibold text-gray-500 mt-0.5">View & update all customer orders</span>
                    </div>
                    <div className="text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all"><ChevronIcon /></div>
                  </button>
                </>
              ) : (
                <>
                  {/* User Quick Actions */}
                  <button className="group flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all text-left w-full cursor-pointer" onClick={() => navigate("/orders")}>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm mr-4 group-hover:scale-110 transition-transform"><OrderIcon /></div>
                    <div className="flex-1">
                      <span className="block font-bold text-gray-900 group-hover:text-orange-900">My Orders</span>
                      <span className="block text-xs font-semibold text-gray-500 mt-0.5">View your order history</span>
                    </div>
                    <div className="text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all"><ChevronIcon /></div>
                  </button>

                  <button className="group flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 transition-all text-left w-full cursor-pointer" onClick={() => navigate("/cart")}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm mr-4 group-hover:scale-110 transition-transform"><CartIcon /></div>
                    <div className="flex-1">
                      <span className="block font-bold text-gray-900 group-hover:text-primary">My Cart</span>
                      <span className="block text-xs font-semibold text-gray-500 mt-0.5">Review items before checkout</span>
                    </div>
                    <div className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"><ChevronIcon /></div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* LOGOUT */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            {!showLogoutConfirm ? (
              <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold border-2 border-gray-100 bg-white hover:bg-red-50 hover:border-red-100 text-gray-500 hover:text-red-500 transition-colors" onClick={() => setShowLogoutConfirm(true)}>
                <LogoutIcon /> Sign Out Securely
              </button>
            ) : (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center animate-[fadeIn_0.2s_ease-out]">
                <p className="font-bold text-red-900 text-sm mb-4">Are you sure you want to sign out?</p>
                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2.5 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors text-sm" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                  <button className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-lg active:scale-95 transition-all text-sm" onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}