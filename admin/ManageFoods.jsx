import { useEffect, useState, useMemo, useCallback } from "react";
import { getFoods, addFood, deleteFood, updateFood } from "../services/foodService";
import { getCategories } from "../services/categoryService";
import toast, { Toaster } from "react-hot-toast";

/* ── Icons ── */
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const ImageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const AlertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
);

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm animate-pulse flex flex-col h-[400px]">
      <div className="w-full h-48 bg-gray-200 rounded-2xl mb-5" />
      <div className="w-2/3 h-5 bg-gray-200 rounded-lg mb-3" />
      <div className="w-1/3 h-4 bg-gray-100 rounded-lg mb-auto" />
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
        <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
        <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ── Food Card ── */
function FoodCard({ food, onEdit, onDelete }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group bg-white rounded-[2rem] p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 mb-5 border border-gray-100/50">
        {!imgErr && food.image ? (
          <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
            <ImageIcon /><span className="text-sm font-bold mt-2">No Image</span>
          </div>
        )}
        {food.category?.name && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-orange-600 uppercase tracking-widest shadow-sm">
            {food.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 z-10">
        <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">{food.name}</h3>
        <p className="text-lg font-black text-gray-900 tracking-tight mt-auto pt-4 border-t border-gray-100 border-dashed">₹{food.price}</p>

        <div className="flex items-center gap-3 mt-5">
          <button className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200" onClick={() => onEdit(food)}>
            <EditIcon /> Edit
          </button>
          <button className="flex-1 py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-red-100 hover:border-red-500" onClick={() => onDelete(food)}>
            <TrashIcon /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ food, onConfirm, onCancel }) {
  if (!food) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl transform transition-all text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
          <AlertIcon />
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Delete Food?</h3>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          Are you sure you want to completely remove <strong>"{food.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button className="w-full sm:w-1/2 py-4 rounded-2xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors" onClick={onCancel}>Cancel</button>
          <button className="w-full sm:w-1/2 py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Food Form Modal ── */
function FoodModal({ editFood, form, setForm, previewImg, setPreviewImg, categories, onSubmit, onClose }) {
  const isValid = form.name.trim() && form.price && form.category;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row transform transition-all h-[90vh] md:h-[600px]">
        
        <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm border border-gray-200/50 hover:scale-110 transition-all font-black" onClick={onClose}>
          <CloseIcon />
        </button>

        {/* Image Preview Side */}
        <div className="w-full md:w-2/5 md:h-full h-48 bg-gray-100 relative group border-b md:border-b-0 md:border-r border-gray-200/60 flex items-center justify-center">
          {previewImg ? (
            <img src={previewImg} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewImg(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon />
              <span className="text-sm font-bold mt-3 uppercase tracking-widest">Image Preview</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 transition-opacity" />
        </div>

        {/* Form Side */}
        <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{editFood ? "Edit Menu Item" : "Add Menu Item"}</h3>
            <p className="text-gray-500 font-medium mt-1">{editFood ? "Update the culinary details below." : "Deploy a new dish to the catalogue."}</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col flex-1 space-y-6">
             
             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Food Name <span className="text-red-500">*</span></label>
               <input
                 className={`w-full bg-gray-50 border-2 ${!form.name.trim() && form.name !== "" ? "border-red-300" : "border-gray-100 focus:border-primary"} px-5 py-3.5 rounded-2xl outline-none font-bold text-gray-900 transition-colors`}
                 placeholder="e.g. Classic cheeseburger"
                 value={form.name}
                 onChange={(e) => setForm({ ...form, name: e.target.value })}
               />
             </div>

             <div className="flex flex-col sm:flex-row gap-6">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-5 py-3.5 rounded-2xl outline-none font-bold text-gray-900 transition-colors"
                    placeholder="e.g. 299"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category <span className="text-red-500">*</span></label>
                  <select
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary px-5 py-3.5 rounded-2xl outline-none font-bold text-gray-900 transition-colors appearance-none cursor-pointer"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="" disabled>— Select Classification —</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
             </div>

             <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Image Asset <span className="text-gray-400 font-medium normal-case tracking-normal">(Upload or URL)</span></label>
                
                <div className="p-1 bg-gray-50 border-2 border-gray-100 rounded-2xl flex flex-col gap-2 relative">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-primary file:shadow-sm hover:file:bg-gray-100 file:cursor-pointer p-2 file:transition-colors"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm({ ...form, file, image: "" });
                        setPreviewImg(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="w-full text-center text-xs font-bold text-gray-400 uppercase tracking-widest my-1">— OR —</div>
                  <input
                    className="w-full bg-white border border-gray-200 focus:border-primary px-5 py-3.5 rounded-xl outline-none font-bold text-gray-900 transition-colors"
                    placeholder="https://example.com/asset.jpg"
                    value={form.image}
                    onChange={(e) => {
                      setForm({ ...form, image: e.target.value, file: null });
                      setPreviewImg(e.target.value);
                    }}
                  />
                </div>
             </div>

             <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
               <button type="button" className="py-4 px-6 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-1" onClick={onClose}>Cancel</button>
               <button type="submit" disabled={!isValid} className="py-4 px-6 rounded-xl font-bold bg-primary hover:bg-orange-600 text-white shadow-lg shadow-primary/20 active:scale-95 transition-all flex-1 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-primary">
                 {editFood ? "Approve Updates" : "Deploy Item"}
               </button>
             </div>
          </form>
        </div>

      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ManageFoods() {
  const [foods,      setFoods]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editFood,   setEditFood]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");

  const [form, setForm] = useState({ name: "", price: "", category: "", image: "", file: null });

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await getFoods();
      setFoods(res.data.foods || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
    }
  };

  const openModal = useCallback((food = null) => {
    if (food) {
      setEditFood(food);
      setForm({ name: food.name, price: food.price, category: food.category?._id, image: food.image, file: null });
      setPreviewImg(food.image);
    } else {
      setEditFood(null);
      setForm({ name: "", price: "", category: "", image: "", file: null });
      setPreviewImg(null);
    }
    setShowModal(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      if (form.file) formData.append("image", form.file);
      else if (form.image) formData.append("image", form.image);

      if (editFood) await updateFood(editFood._id, formData);
      else await addFood(formData);

      toast.success(editFood ? "Item synchronized!" : "New item deployed!");
      setShowModal(false);
      fetchFoods();
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors)) {
        validationErrors.forEach(err => toast.error(`${err.field}: ${err.message}`));
      } else {
        toast.error(serverMsg || "Data transmission failed");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFood(deleteTarget._id);
      toast.success("Item permanently erased.");
      setDeleteTarget(null);
      fetchFoods();
    } catch {
      toast.error("Process aborted. Error erasing item.");
    }
  };

  const filteredFoods = useMemo(() => {
    let result = [...foods];
    if (catFilter) result = result.filter((f) => f.category?._id === catFilter);
    if (search.trim()) result = result.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [foods, search, catFilter]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] bg-gradient-to-br from-[#f8f9fa] to-[#f1f5f9] pt-8 pb-32 font-sans selection:bg-primary/20">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ── Page Header ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
              <span className="text-3xl">🍽</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">Manage Foods</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">{foods.length} items deployed across {categories.length} core categories</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all" onClick={() => openModal()}>
            <PlusIcon /> Deploy New Food
          </button>
        </header>

        {/* ── Filters ── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="flex-1 relative group w-full">
            <span className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-orange-500 transition-colors"><SearchIcon /></span>
            <input
              className="w-full min-h-[64px] bg-white border-2 border-transparent focus:border-orange-500/50 rounded-[2rem] pl-14 pr-12 text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-400 outline-none shadow-sm transition-all"
              type="text"
              placeholder="Search catalogue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setSearch("")}>
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="lg:w-80 relative group w-full">
            <span className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors"><FilterIcon /></span>
            <select
              className="w-full min-h-[64px] bg-white border-2 border-transparent focus:border-blue-500/50 rounded-[2rem] pl-14 pr-12 text-gray-900 font-bold outline-none shadow-sm transition-all appearance-none cursor-pointer"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-5 flex items-center text-gray-400 pointer-events-none transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>
        </div>

        {/* ── Results meta ── */}
        {!loading && (search || catFilter) && (
          <p className="text-gray-500 font-medium mb-8 bg-black/5 inline-block px-4 py-2 rounded-xl text-sm border border-black/5">
            Showing <strong className="text-gray-900">{filteredFoods.length}</strong> result{filteredFoods.length !== 1 ? "s" : ""}
            {search && <> for "<strong className="text-gray-900">{search}</strong>"</>}
            {catFilter && <> in <strong className="text-gray-900">{categories.find(c => c._id === catFilter)?.name}</strong></>}
          </p>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm mt-8 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-50 rounded-full blur-3xl pointer-events-none" />
             <div className="text-gray-200 mb-8 relative z-10"><EmptyIcon /></div>
             <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight relative z-10">
               {foods.length === 0 ? "Empty Data Source" : "Zero Results Found"}
             </h3>
             <p className="text-gray-500 font-medium text-lg max-w-md relative z-10">
               {foods.length === 0 ? "Your catalogue currently has zero records. Deploy an item to start tracking." : "Adjust your search parameters to find the dish you're trying to locate."}
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredFoods.map((food, i) => (
              <div key={food._id} className="animate-[fadeIn_0.5s_ease-out_forwards] opacity-0" style={{ animationDelay: `${i * 0.05}s`, animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
                <FoodCard
                  food={food}
                  onEdit={openModal}
                  onDelete={(f) => setDeleteTarget(f)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <FoodModal editFood={editFood} form={form} setForm={setForm} previewImg={previewImg} setPreviewImg={setPreviewImg} categories={categories} onSubmit={handleSubmit} onClose={() => setShowModal(false)} />
      )}
      {deleteTarget && (
        <DeleteModal food={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
