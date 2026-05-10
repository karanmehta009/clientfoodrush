import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-24 font-sans flex flex-col items-center selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 drop-shadow-md">
           The <span className="text-primary">Food Rush</span> Story.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
           Born from a passion for authentic culinary experiences, Food Rush bridges the gap between extraordinary chefs and your dining table. We deliver uncompromising quality at lightning speeds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
             <div className="text-4xl mb-4">🚀</div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
             <p className="text-gray-500 font-medium">Hot food delivered in under 30 minutes, universally guaranteed.</p>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
             <div className="text-4xl mb-4">👨‍🍳</div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Master Chefs</h3>
             <p className="text-gray-500 font-medium">Curated kitchens featuring incredibly talented culinary artists.</p>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
             <div className="text-4xl mb-4">🌿</div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Fresh Ingredients</h3>
             <p className="text-gray-500 font-medium">Sourced daily from local organic farms to ensure maximum quality.</p>
           </div>
        </div>

        <button 
          onClick={() => navigate("/home")}
          className="px-10 py-4 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-full shadow-xl shadow-gray-900/20 active:scale-95 transition-all duration-300"
        >
          Explore Our Menu
        </button>
      </div>
    </div>
  );
}
