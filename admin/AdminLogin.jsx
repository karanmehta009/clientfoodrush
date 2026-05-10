import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await login(form);

      // ✅ only allow admin
      if (res.data.user.role !== "admin") {
        setError("Access denied. Not an admin.");
        // We might want to logout here if they successfully logged in as a non-admin
        // But the store handles state, so we just show error.
        setLoading(false);
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 selection:bg-orange-500/30 p-4">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 -right-1/4 w-[40rem] h-[40rem] bg-orange-500/10 rounded-full blur-[100px]" />
         <div className="absolute -bottom-1/4 -left-1/4 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5">
            🔐
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Admin Protocol</h2>
          <p className="text-gray-400 font-medium text-sm">Secure dashboard access control</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest ml-2">Secure Email</label>
            <input
              type="email"
              placeholder="admin@foodrush.com"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:bg-white/5 focus:border-orange-500/50 outline-none transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest ml-2">Master Code</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:bg-white/5 focus:border-orange-500/50 outline-none transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-red-400 text-sm font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Authenticate"}
          </button>
        </form>

        {/* Back */}
        <button 
          className="mt-8 mx-auto w-full text-center text-sm font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          onClick={() => navigate("/login")}
        >
          ← Return to Portal
        </button>
      </div>
    </div>
  );
}