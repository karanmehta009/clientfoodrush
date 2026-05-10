import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "../services/foodService";
import { useCartStore } from "../store/useCartStore";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFood = async () => {
      try {
        const res = await getFoodById(id);
        const foodData = res.data.food;
        setFood({
          ...foodData,
          image: foodData.image?.startsWith("http") ? foodData.image : `http://localhost:5000${foodData.image}`
        });
      } catch (error) {
        toast.error("Could not locate telemetry for this asset.");
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const handleAddToCart = async () => {
    if (!food) return;
    try {
      await addItem(food._id, 1);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center pt-24 font-sans">
        <div className="flex flex-col items-center">
           <span className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
           <p className="font-bold text-gray-500 uppercase tracking-widest text-sm animate-pulse">Syncing Telemetry...</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-24 px-4 flex flex-col items-center font-sans tracking-tight">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Signal Lost</h1>
        <p className="text-gray-500 font-medium mb-8">This asset cannot be located on the current server index.</p>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-full font-bold text-gray-600 transition-colors" onClick={() => navigate("/menu")}>
          <ArrowLeftIcon /> Retreat
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-32 px-4 lg:px-8 font-sans selection:bg-primary/20">
      <Toaster position="top-right" toastOptions={{ style: { fontWeight: "bold", fontFamily: "inherit" } }} />

      <div className="max-w-5xl mx-auto space-y-8">
        
        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest group" onClick={() => navigate(-1)}>
          <span className="group-hover:-translate-x-1 transition-transform"><ArrowLeftIcon /></span> Scan Previous
        </button>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row gap-10 lg:gap-16 items-center relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Left: Image */}
          <div className="w-full md:w-1/2 aspect-square max-h-[500px] shrink-0 bg-gray-50 rounded-[2rem] border-2 border-gray-100/50 p-4 sm:p-8 flex items-center justify-center overflow-hidden group">
             {!imgErr && food.image ? (
               <img src={food.image} alt={food.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" onError={() => setImgErr(true)} />
             ) : (
               <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl shadow-inner border order-gray-100">🍽</div>
             )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 flex flex-col z-10">
            <span className="inline-flex max-w-max items-center px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-sm border border-orange-100 animate-[fadeIn_0.5s_delay-100ms_forwards] opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
               {food.category?.name || "Global"} Matrix
            </span>
            
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4 animate-[fadeIn_0.5s_forwards] opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              {food.name}
            </h1>
            
            <p className="text-gray-500 font-medium text-lg leading-relaxed mb-8 animate-[fadeIn_0.5s_forwards] opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              A high-yield culinary asset integrated directly from verified vendor sources. Guaranteed freshness and optimal delivery logistics.
            </p>

            <div className="text-5xl font-black text-gray-900 mb-10 tracking-tighter drop-shadow-sm animate-[fadeIn_0.5s_forwards] opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
               ₹{food.price}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_0.5s_forwards] opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
               {!isAdmin && (
                 <>
                   <button className="flex-1 px-8 py-5 rounded-[1.5rem] bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm" onClick={handleAddToCart}>
                     <CartIcon /> Compile To Cart
                   </button>
                   {totalItems > 0 && (
                     <button className="px-8 py-5 rounded-[1.5rem] bg-gray-900 hover:bg-gray-800 text-white font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all text-sm shrink-0 whitespace-nowrap" onClick={() => navigate("/cart")}>
                       Checkout ({totalItems})
                     </button>
                   )}
                 </>
               )}
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU Identity</p>
                  <p className="font-bold text-gray-900">{food._id.slice(-8).toUpperCase()}</p>
               </div>
               <div>
                  <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                  <p className="font-bold text-green-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Authorized</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}