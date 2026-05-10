import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/userService";

// ── Icons ──
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>;
const AlertIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const WarnLargeIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const EmptyIcon = () => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;

// ── Toast Component ──
function Toast({ toasts }) {
  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl shadow-gray-900/10 backdrop-blur-xl border border-white max-w-sm animate-[fadeIn_0.3s_ease-out] font-bold text-sm tracking-wide ${t.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-white/90 text-gray-900"}`}>
          <span className={`${t.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {t.type === "success" ? <CheckIcon /> : <AlertIcon />}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ── Confirm Dialog Component ──
function ConfirmDialog({ visible, onConfirm, onCancel }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 mt-10 shadow-2xl transform transition-all text-center border border-gray-100 flex flex-col items-center animate-[fadeIn_0.2s_ease-out]">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-100">
          <WarnLargeIcon />
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Erase Account?</h3>
        <p className="text-gray-500 font-medium leading-relaxed mb-8 text-sm">
          This operation is irreversible. The user's account records will be permanently removed.
        </p>
        <div className="flex items-center gap-3 w-full">
          <button className="flex-1 py-3 rounded-xl font-bold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors" onClick={onCancel}>Cancel</button>
          <button className="flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all text-shadow" onClick={onConfirm}>Erase</button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton Row ──
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100/60 last:border-0 animate-pulse">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </td>
      <td className="px-6 py-5"><div className="h-3 bg-gray-100 rounded w-32" /></td>
      <td className="px-6 py-5"><div className="h-6 bg-gray-100 rounded-full w-20" /></td>
      <td className="px-6 py-5"><div className="h-6 bg-gray-100 rounded-full w-16" /></td>
      <td className="px-6 py-5"><div className="h-8 bg-gray-100 rounded-lg w-20" /></td>
    </tr>
  );
}

// ── Main Component ──
export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ visible: false, userId: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Admin: Fetching users...");
      const res = await getAllUsers();
      console.log("Admin: Users fetched successfully", res.data);
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Admin: Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleDeleteClick = (id) => setConfirmState({ visible: true, userId: id });

  const handleConfirmDelete = async () => {
    const id = confirmState.userId;
    setConfirmState({ visible: false, userId: null });
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      showToast("Account purged successfully.", "success");
    } catch {
      showToast("Failed to delete user. Connection interrupted.", "error");
    }
  };

  const handleCancelDelete = () => setConfirmState({ visible: false, userId: null });

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-8 pb-32 font-sans selection:bg-primary/20">
      <Toast toasts={toasts} />
      <ConfirmDialog visible={confirmState.visible} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100 shadow-sm shrink-0">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">Identify Registry</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Review access parameters and registered user accounts</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            <span className="font-black text-purple-600">{(users || []).length}</span> Active Directories
          </div>
        </div>

        {/* ── Grid Container ── */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest min-w-[200px]">Identity</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest min-w-[200px]">Secure Email</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">Role Matrix</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest min-w-[100px]">Status</th>
                  <th className="px-6 py-4 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest w-[120px]">Action Protocol</th>
                </tr>
              </thead>
              <tbody>

                {/* ── Skeleton ── */}
                {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

                {/* ── Empty ── */}
                {!loading && (!users || users.length === 0) && (
                  <tr>
                    <td colSpan="5">
                      <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="text-gray-200 mb-6 drop-shadow-sm scale-110"><EmptyIcon /></div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Zero Identities Detected</h3>
                        <p className="text-gray-500 font-medium">Wait for external network registrants to appear.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* ── Data Rows ── */}
                {!loading && (users || []).length > 0 && users.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-100/60 last:border-0 hover:bg-gray-50/50 transition-colors animate-[fadeIn_0.5s_ease-out_forwards] opacity-0 group" style={{ animationDelay: `${index * 0.05}s` }}>
                    
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-black text-lg rounded-xl flex items-center justify-center shrink-0 border border-white shadow-sm">
                          {String(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 truncate max-w-[160px] group-hover:text-primary transition-colors">{user.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-gray-500 font-mono tracking-tight bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/50">{user.email}</span>
                    </td>

                    <td className="px-6 py-5">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 text-purple-600 rounded-full text-xs font-bold uppercase tracking-widest">
                          <span className="text-lg leading-none mt-px">⬡</span> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">
                          <span className="text-sm leading-none mt-px text-gray-400">◎</span> User
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                        Active
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl font-bold text-[0.7rem] uppercase tracking-widest transition-all shadow-sm active:scale-95"
                      >
                        <TrashIcon /> DELETE 
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
