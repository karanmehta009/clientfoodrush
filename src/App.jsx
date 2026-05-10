import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AppRoutes from "../routes/AppRoutes";
import Footer from "../components/Footer";
import SpotlightBackground from "../components/SpotlightBackground";
import { useAuthStore } from "../store/useAuthStore";

function App() {
  const location = useLocation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1. Listen for hydration
    const unsub = useAuthStore.persist?.onFinishHydration(() => setHydrated(true));
    
    // 2. Immediate check
    if (useAuthStore.persist?.hasHydrated()) {
      setHydrated(true);
    }

    // 3. NUCLEAR FALLBACK: Force show after 600ms
    const timer = setTimeout(() => setHydrated(true), 600);

    return () => {
      if (unsub) unsub();
      clearTimeout(timer);
    };
  }, []);

  // Hide Navbar/Footer on these routes
  const noLayoutPaths = ["/admin/login", "/login", "/register"];
  const hideLayout = noLayoutPaths.includes(location.pathname);

  if (!hydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] selection:bg-primary/20">
      <SpotlightBackground />
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;