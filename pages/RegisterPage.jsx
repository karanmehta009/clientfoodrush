import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

/* ── Icons ── */
const EyeOpen = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.409 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.806L1.24 17.35C3.198 21.302 7.269 24 12 24c3.24 0 5.936-1.08 7.923-2.916l-3.882-3.071Z" />
    <path fill="#4A90E2" d="M23.988 12.273c0-.853-.077-1.675-.224-2.467H12v4.673h6.706a5.71 5.71 0 0 1-2.477 3.78l3.882 3.072c2.27-2.094 3.877-5.184 3.877-9.058Z" />
    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
  </svg>
);

/* ── Password Strength ── */
function getStrength(password) {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { level: 2, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { level: 3, label: "Good", color: "#3b82f6" };
  return { level: 4, label: "Strong", color: "#22c55e" };
}

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

function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-[fadeIn_0.2s_ease-out] border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Terms &amp; Conditions</h2>
          <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors" onClick={onClose}><XIcon /></button>
        </div>
        <div className="overflow-y-auto pr-2 space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <section>
            <h3 className="font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
            <p>By creating a FoodRush account, you confirm you have read, understood, and agreed to be bound by these Terms &amp; Conditions.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900 mb-2">2. Use of Service</h3>
            <p>FoodRush is a food ordering platform. You agree to use it lawfully and responsibly. Fraudulent activity will result in account termination.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900 mb-2">3. Privacy &amp; Data</h3>
            <p>We collect only what we need to deliver your orders. We never sell your personal data to third parties.</p>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button className="px-8 py-3.5 rounded-xl font-bold bg-gray-900 hover:bg-black text-white shadow-lg active:scale-95 transition-all" onClick={onClose}>I Agree</button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const register = useAuthStore(state => state.register);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const navigate = useNavigate();

  const pushToast = (message, type = "success") => {
    const id = ++toastId.current;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    if (!agreedToTerms) e.terms = "You must agree to the terms.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      pushToast(res.data.message || "Account created! Redirecting…", "success");
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (error) {
      pushToast(error.response?.data?.message || "Registration failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-primary/20 bg-white">
      <Toast toasts={toasts} />
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      {/* ── LEFT PANEL (Branding) ── */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-bl from-primary/30 to-orange-600/30 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-gradient-to-tr from-emerald-500/20 to-teal-600/20 rounded-full blur-[80px] mix-blend-screen" />
        
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
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">New Accounts Open</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Start your journey <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">with us today.</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed mb-8 max-w-md">
            Create an account to track orders, save favorites, and experience lightning-fast delivery checkout.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-black text-white mb-1">0%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Setup Fees</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">24/7</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Support Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:py-16 lg:px-24 relative overflow-y-auto">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">FR</div>
            <span className="text-xl font-black tracking-tight text-gray-900">FoodRush.</span>
          </Link>
        </div>

        <div className="w-full max-w-md my-auto">
          <div className="mb-8 mt-12 lg:mt-0">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Join us and experience the premium way to order food.</p>
          </div>

          <button type="button" className="w-full mb-8 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors shadow-sm active:scale-[0.98]">
            <GoogleIcon /> Sign up with Google
          </button>

          <div className="relative flex items-center py-2 mb-8">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-widest text-gray-400">Or continue with email</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Full Name</label>
              <div className={`relative group ${errors.name ? "text-red-500" : "text-gray-400 focus-within:text-primary"}`}>
                <span className="absolute inset-y-0 left-4 flex items-center transition-colors"><UserIcon /></span>
                <input type="text" placeholder="John Doe" className={`w-full bg-white border-2 ${errors.name ? "border-red-300 bg-red-50/30" : "border-gray-200 focus:border-primary focus:bg-white"} rounded-2xl pl-12 pr-4 py-3.5 text-gray-900 font-semibold placeholder:font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm`} value={form.name} onChange={handleChange("name")} autoComplete="name" />
              </div>
              {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Email Address</label>
              <div className={`relative group ${errors.email ? "text-red-500" : "text-gray-400 focus-within:text-primary"}`}>
                <span className="absolute inset-y-0 left-4 flex items-center transition-colors"><MailIcon /></span>
                <input type="email" placeholder="name@company.com" className={`w-full bg-white border-2 ${errors.email ? "border-red-300 bg-red-50/30" : "border-gray-200 focus:border-primary focus:bg-white"} rounded-2xl pl-12 pr-4 py-3.5 text-gray-900 font-semibold placeholder:font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm`} value={form.email} onChange={handleChange("email")} autoComplete="email" />
              </div>
              {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-1.5 flex-1">
                <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Password</label>
                <div className={`relative group ${errors.password ? "text-red-500" : "text-gray-400 focus-within:text-primary"}`}>
                  <span className="absolute inset-y-0 left-4 flex items-center transition-colors"><LockIcon /></span>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full bg-white border-2 ${errors.password ? "border-red-300 bg-red-50/30" : "border-gray-200 focus:border-primary focus:bg-white"} rounded-2xl pl-12 pr-10 py-3.5 text-gray-900 font-semibold placeholder:font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm`} value={form.password} onChange={handleChange("password")} autoComplete="new-password" />
                  <button type="button" className="absolute inset-y-0 right-4 flex items-center hover:text-gray-900 transition-colors" onClick={() => setShowPassword(!showPassword)}><EyeOff /></button>
                </div>
                {errors.password && <p className="text-xs font-bold text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1.5 flex-1">
                <label className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Confirm</label>
                <div className={`relative group ${errors.confirmPassword ? "text-red-500" : "text-gray-400 focus-within:text-primary"}`}>
                  <span className="absolute inset-y-0 left-4 flex items-center transition-colors"><LockIcon /></span>
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={`w-full bg-white border-2 ${errors.confirmPassword ? "border-red-300 bg-red-50/30" : "border-gray-200 focus:border-primary focus:bg-white"} rounded-2xl pl-12 pr-10 py-3.5 text-gray-900 font-semibold placeholder:font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm`} value={form.confirmPassword} onChange={handleChange("confirmPassword")} autoComplete="new-password" />
                  <button type="button" className="absolute inset-y-0 right-4 flex items-center hover:text-gray-900 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><EyeOff /></button>
                </div>
                {errors.confirmPassword && <p className="text-xs font-bold text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {form.password && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map(n => <div key={n} className="flex-1 rounded-full bg-gray-200 transition-colors" style={{ background: n <= strength.level ? strength.color : undefined }} />)}
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: strength.color }}>{strength.label} Password</span>
                   <span className={`text-[10px] font-semibold ${form.password.length >= 6 ? "text-green-500" : "text-gray-400"}`}>Min 6 chars</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 pt-3">
               <button type="button" className={`w-5 h-5 mt-0.5 rounded-[6px] flex items-center justify-center border-2 transition-colors shrink-0 ${agreedToTerms ? "bg-gray-900 border-gray-900 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`} onClick={() => { setAgreedToTerms(v => !v); if (errors.terms) setErrors({ ...errors, terms: undefined }); }}>
                 {agreedToTerms && <CheckIcon />}
               </button>
               <div>
                 <span className="text-sm font-semibold text-gray-600">I agree to the <button type="button" className="text-primary font-bold hover:underline transition-colors" onClick={() => setShowTerms(true)}>Terms &amp; Conditions</button></span>
                 {errors.terms && <p className="text-xs font-bold text-red-500 mt-1">{errors.terms}</p>}
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
               {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
             Already have an account? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}