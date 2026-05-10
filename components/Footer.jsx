import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── Icons ── */
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const ArrowUpIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
  </svg>
);
const MenuNavIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const OrdersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);
const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
);

function Footer() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [visible, setVisible]     = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socials = [
    { icon: <GlobeIcon />,     label: "Website",   color: "hover:text-blue-400 hover:border-blue-400" },
    { icon: <FacebookIcon />,  label: "Facebook",  color: "hover:text-blue-600 hover:border-blue-600" },
    { icon: <InstagramIcon />, label: "Instagram", color: "hover:text-pink-400 hover:border-pink-400" },
    { icon: <TwitterIcon />,   label: "Twitter",   color: "hover:text-sky-400 hover:border-sky-400" },
  ];

  const quickLinks = [
    { label: "Home",   icon: <HomeIcon />,    path: "/home"   },
    { label: "Menu",   icon: <MenuNavIcon />, path: "/menu"   },
    { label: "Cart",   icon: <CartIcon />,    path: "/cart"   },
    { label: "Orders", icon: <OrdersIcon />,  path: "/orders" },
  ];

  const companyLinks = ["About Us", "Careers", "Privacy Policy", "Terms & Conditions"];

  return (
    <footer ref={footerRef} className={`relative bg-[#f8f9fa] border-t border-gray-200 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-60"></div>
      
      {/* Back to top */}
      <button 
        className="absolute -top-5 right-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-lg border border-gray-100 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 z-10"
        onClick={scrollToTop} 
        aria-label="Back to top"
      >
        <ArrowUpIcon />
      </button>

      <div className="max-w-[1600px] mx-auto px-6 pt-16 pb-8 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Brand ── */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer group w-fit" onClick={() => navigate("/home")}>
              <span className="text-3xl drop-shadow-sm group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🔥</span>
              <span className="text-2xl font-black text-primary tracking-tight uppercase">FoodRush</span>
            </div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xs">
              Delicious food delivered to your doorstep. Fast, fresh, and always reliable.
            </p>

            {/* Newsletter */}
            <div className="mt-2 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Newsletter</p>
              {subscribed ? (
                <div className="text-sm font-bold text-green-600 py-2 animate-bounce">✅ You're subscribed!</div>
              ) : (
                <form className="flex bg-white border border-gray-200 rounded-full overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="flex-1 bg-transparent px-5 py-2.5 text-sm font-medium outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="px-4 bg-primary text-white hover:bg-orange-600 transition-colors border-l border-gray-100">
                    <SendIcon />
                  </button>
                </form>
              )}
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-2">
              {socials.map((s) => (
                <button
                  key={s.label}
                  className={`w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-400 flex items-center justify-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${s.color}`}
                  aria-label={s.label}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-primary after:rounded-full">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <button 
                    onClick={() => navigate(l.path)}
                    className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all group"
                  >
                    <span className="text-gray-400 group-hover:text-primary transition-colors">{l.icon}</span>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-primary after:rounded-full">Company</h3>
            <ul className="space-y-1">
              {companyLinks.map((l) => (
                <li key={l}>
                  <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all group">
                    <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-primary after:rounded-full">Contact</h3>
            <ul className="space-y-4 mt-1">
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <span className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm"><MailIcon /></span>
                support@foodrush.com
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <span className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm"><PhoneIcon /></span>
                +91 98765 43210
              </li>
            </ul>
            <div className="mt-4 px-4 py-2.5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-[0.65rem] font-black text-green-600 uppercase tracking-widest w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)] animate-pulse" />
              Available 24 / 7
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mt-16 mb-8 border-dashed"></div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-400">© {new Date().getFullYear()} FoodRush. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs font-black text-gray-400 uppercase tracking-widest">
            <button className="hover:text-primary transition-colors">Privacy</button>
            <button className="hover:text-primary transition-colors">Terms</button>
            <button className="hover:text-primary transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;