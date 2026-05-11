import { useEffect, useState, useRef } from "react";
import { getCategories, addCategory, deleteCategory } from "../services/categoryService";

/* ── Icons ── */
const FolderIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── Toast ── */
function Toast({ toasts }) {
  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl shadow-gray-900/10 backdrop-blur-xl border border-white max-w-sm animate-[fadeIn_0.3s_ease-out] font-bold text-sm tracking-wide ${t.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-white/90 text-gray-900"}`}>
          <span className="text-xl drop-shadow-sm">{t.type === "success" ? "✅" : "❌"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Confirm Modal ── */
function ConfirmModal({ onConfirm, onCancel, name }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] p-8 md:p-10 shadow-2xl transform transition-all duration-300 animate-[fadeIn_0.2s_ease-out] text-center border border-gray-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
          <TrashIcon />
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Delete Category?</h3>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          Are you sure you want to completely remove <strong>"{name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <button className="flex-1 py-3.5 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors" onClick={onCancel}>Cancel</button>
          <button className="flex-1 py-3.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center animate-pulse gap-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded-md w-2/3" />
        <div className="h-3 bg-gray-100 rounded-md w-1/3" />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ManageCategories() {
  const [categories,   setCategories]   = useState([]);
  const [name,         setName]         = useState("");
  const [search,       setSearch]       = useState("");
  const [loading,      setLoading]      = useState(false);
  const [fetching,     setFetching]     = useState(true);
  const [nameError,    setNameError]    = useState("");
  const [toasts,       setToasts]       = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const toastId = useRef(0);
  const inputRef = useRef();

  useEffect(() => { fetchCategories(); }, []);

  const pushToast = (message, type = "success") => {
    const id = ++toastId.current;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  const fetchCategories = async () => {
    setFetching(true);
    try {
      const res = await getCategories();
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
      pushToast("Failed to load categories.", "error");
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Category name cannot be empty.");
      inputRef.current?.focus();
      return;
    }
    setNameError("");
    setLoading(true);
    try {
      await addCategory({ name: name.trim() });
      setName("");
      pushToast(`"${name.trim()}" added successfully!`, "success");
      fetchCategories();
    } catch {
      pushToast("Error adding category.", "error");
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id, catName) => setConfirmState({ id, name: catName });

  const handleDeleteConfirmed = async () => {
    const { id, name: catName } = confirmState;
    setConfirmState(null);
    try {
      await deleteCategory(id);
      pushToast(`"${catName}" deleted.`, "success");
      fetchCategories();
    } catch {
      pushToast("Error deleting category.", "error");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-8 pb-24 font-sans selection:bg-primary/20">
      <Toast toasts={toasts} />

      {confirmState && (
        <ConfirmModal name={confirmState.name} onConfirm={handleDeleteConfirmed} onCancel={() => setConfirmState(null)} />
      )}

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <FolderIcon />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">Manage Categories</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Organize your entire food catalogue structure</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {categories.length} {categories.length === 1 ? "Category" : "Categories"} Built
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Add form */}
          <form className="flex-1 bg-white p-2 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center gap-2" onSubmit={handleAdd} noValidate>
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-5 flex items-center text-primary"><PlusIcon /></span>
              <input
                ref={inputRef}
                type="text"
                placeholder="New category name…"
                className={`w-full bg-transparent pl-12 pr-4 py-4 text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-400 outline-none ${nameError ? "placeholder:text-red-300" : ""}`}
                value={name}
                onChange={(e) => { setName(e.target.value); if (nameError) setNameError(""); }}
                disabled={loading}
                autoComplete="off"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-[1.5rem] shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Deploy Category"}
            </button>
          </form>

          {/* Search */}
          <div className="w-full lg:w-96 flex shrink-0">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors"><SearchIcon /></span>
              <input
                type="text"
                className="w-full h-full min-h-[64px] bg-white border-2 border-white focus:border-blue-500/50 rounded-[2rem] pl-12 pr-12 text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-400 outline-none shadow-sm transition-all"
                placeholder="Search index…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setSearch("")}>
                  <XIcon />
                </button>
              )}
            </div>
          </div>
        </div>
        {nameError && <p className="text-red-500 font-bold text-sm tracking-wide px-4 -mt-6 mb-6">{nameError}</p>}

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fetching ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="text-gray-300 mb-6 drop-shadow-sm"><EmptyIcon /></div>
              <p className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                {search ? "No results found" : "No classifications yet"}
              </p>
              <p className="text-gray-500 font-medium">
                {search ? `Searching for "${search}" yielded zero records.` : "Input a structure type above to initiate your global menu."}
              </p>
            </div>
          ) : (
            filtered.map((cat, i) => (
              <div key={cat._id} className="group flex items-center p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 mr-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <FolderIcon />
                </div>
                <div className="flex-1 pr-4 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-primary transition-colors">{cat.name}</h3>
                  <span className="block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">ID: {cat._id?.slice(-6)}</span>
                </div>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-gray-300 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all shrink-0 z-10"
                  onClick={() => requestDelete(cat._id, cat.name)}
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
