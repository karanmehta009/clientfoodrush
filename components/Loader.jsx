function Loader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      
      {/* Animated Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
        <div className="absolute inset-2 border-2 border-orange-200 border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
      </div>

      {/* Pulsing Text */}
      <p className="text-sm font-black text-gray-900 uppercase tracking-[0.3em] animate-pulse drop-shadow-sm">
        {text}
      </p>

    </div>
  );
}

export default Loader;