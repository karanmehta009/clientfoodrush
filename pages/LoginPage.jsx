import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

/* ── Icons ── */
const EyeOpen = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.409 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.806L1.24 17.35C3.198 21.302 7.269 24 12 24c3.24 0 5.936-1.08 7.923-2.916l-3.882-3.071Z" />
    <path fill="#4A90E2" d="M23.988 12.273c0-.853-.077-1.675-.224-2.467H12v4.673h6.706a5.71 5.71 0 0 1-2.477 3.78l3.882 3.072c2.27-2.094 3.877-5.184 3.877-9.058Z" />
    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
  </svg>
);

/* ── Toast ── */
function Toast({ toasts }) {
  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl shadow-gray-900/10 backdrop-blur-xl border border-white max-w-sm animate-[fadeIn_0.3s_ease-out] font-bold text-sm tracking-wide ${t.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-white text-gray-900"}`}>
          <span className="text-xl drop-shadow-sm">{t.type === "success" ? "✅" : "❌"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const login = useAuthStore(state => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) { setForm(f => ({ ...f, email: saved })); setRemember(true); }
  }, []);

  const pushToast = (message, type = "success") => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const validate = () => {
    let ok = true;
    if (!form.email) { setEmailError("Email is required"); ok = false; }
    else if (!/\S+@\S+\.\S+/.test(form.email)) { setEmailError("Enter a valid email"); ok = false; }
    else setEmailError("");

    if (!form.password) { setPasswordError("Password is required"); ok = false; }
    else if (form.password.length < 6) { setPasswordError("Minimum 6 characters"); ok = false; }
    else setPasswordError("");
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    if (remember) localStorage.setItem("rememberedEmail", form.email);
    else localStorage.removeItem("rememberedEmail");

    setLoading(true);
    try {
      const res = await login(form);
      if (res.data.success) {
        pushToast("Identity verified! Forwarding…", "success");
        setTimeout(() => navigate("/", { replace: true }), 1000);
      }
    } catch (error) {
      pushToast(error.response?.data?.message || "Invalid identity token.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-primary/20 bg-white">
      <Toast toasts={toasts} />

      {/* ── LEFT PANEL (Branding) ── */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-primary/30 to-orange-600/30 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-[80px] mix-blend-screen" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              FR
            </div>
            <span className="text-2xl font-black tracking-tight text-white">FoodRush.</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">System Operational</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Manage your orders <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">with precision.</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed mb-8 max-w-md">
            Join thousands of restaurants and customers experiencing the fastest, most reliable food delivery platform built for the modern web.
          </p>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-8 border-t border-white/10">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gradient-to-br from-blue-400 to-indigo-500" />
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gradient-to-br from-emerald-400 to-teal-500" />
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gradient-to-br from-orange-400 to-red-500" />
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-white text-xs font-bold">+2k</div>
            </div>
            <div className="text-sm font-bold text-white">
              Trusted by <span className="text-primary">2,000+</span> users
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">FR</div>
            <span className="text-xl font-black tracking-tight text-gray-900">FoodRush.</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please enter your details to access your dashboard.</p>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 mb-8">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors shadow-sm active:scale-[0.98]">
              <GoogleIcon /> Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors shadow-sm active:scale-[0.98]">
              <GithubIcon /> GitHub
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-8">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-widest text-gray-400">Or continue with</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Email Address</label>
              <div className={`relative group ${emailError ? "text-red-500" : "text-gray-400 focus-within:text-primary"}`}>
                <span className="absolute inset-y-0 left-4 flex items-center transition-colors"><MailIcon /></span>
                <input type="email" placeholder="name@company.com" className={`w-full bg-white border-2 ${emailError ? "border-red-300 bg-red-50/30" : "border-gray-200 focus:border-primary focus:bg-white"} rounded-2xl pl-12 pr-4 py-3.5 text-gray-900 font-semibold placeholder:font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm`} value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setEmailError(""); }} autoComplete="email" />
              </div>
              {emailError && <p className="text-xs font-bold text-red-500 mt-1">{emailError}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[11px] font-bold text-primary hover:underline transition-all">Forgot password?</a>
              </div>
              <div className={`relative group ${passwordError ? "text-red-500" : "text-gray-400 focus-within:text-primary"}`}>
                <span className="absolute inset-y-0 left-4 flex items-center transition-colors"><LockIcon /></span>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full bg-white border-2 ${passwordError ? "border-red-300 bg-red-50/30" : "border-gray-200 focus:border-primary focus:bg-white"} rounded-2xl pl-12 pr-12 py-3.5 text-gray-900 font-semibold placeholder:font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm`} value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setPasswordError(""); }} autoComplete="current-password" />
                <button type="button" className="absolute inset-y-0 right-4 flex items-center hover:text-gray-900 transition-colors" onClick={() => setShowPassword(!showPassword)}><EyeOff /></button>
              </div>
              {passwordError && <p className="text-xs font-bold text-red-500 mt-1">{passwordError}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
               <button type="button" className={`w-5 h-5 rounded-[6px] flex items-center justify-center border-2 transition-colors shrink-0 ${remember ? "bg-primary border-primary text-white" : "border-gray-300 bg-white hover:border-gray-400"}`} onClick={() => setRemember(v => !v)}>
                 {remember && <CheckIcon />}
               </button>
               <span className="text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => setRemember(v => !v)}>Remember for 30 days</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
               {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign in to Dashboard"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
             Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}