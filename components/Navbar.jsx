import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

/* ── ICONS ── */
const HomeIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
const CartIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>;
const OrderIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>;
const AdminIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>;
const UserIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogoutIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const MenuIcon    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const MenuBookIcon= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 004 19.5V4a2 2 0 012-2z"/></svg>;
const InfoIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const ContactIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 01-4 4H7l-4 4V5a4 4 0 014-4h10a4 4 0 014 4z"/></svg>;

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  
  // Connect Zustand cart store correctly
  const { cart } = useCartStore();
  const cartBadge = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const [open,       setOpen]       = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [tooltip,    setTooltip]    = useState(null);

  const dropdownRef  = useRef();
  const hamburgerRef = useRef();

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Close drawer on route change ── */
  useEffect(() => {
    const id = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  /* ── ESC closes dropdown + drawer ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setOpen(false); setMobileOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── Lock body scroll when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home",    path: "/home",            icon: <HomeIcon />,     roles: ["user","admin"] },
    { label: "Menu",    path: "/menu",            icon: <MenuBookIcon />, roles: ["user","admin"] },
    { label: "About",   path: "/about",           icon: <InfoIcon />,     roles: ["user","admin"] },
    { label: "Contact", path: "/contact",         icon: <ContactIcon />,  roles: ["user","admin"] },
    { label: "Cart",    path: "/cart",            icon: <CartIcon />,     roles: ["user"], badge: cartBadge },
    { label: "Orders",  path: "/orders",          icon: <OrderIcon />,    roles: ["user"] },
    { label: "Admin",   path: "/admin/dashboard", icon: <AdminIcon />,    roles: ["admin"], isAdmin: true },
  ].filter(l => user?.role && l.roles.includes(user.role));

  const avatarLetter = (user?.name?.charAt(0) || "U").toUpperCase();

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" : "bg-transparent py-2"}`}>
        <nav className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          
          {/* ── LOGO ── */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate("/home")}
            role="button"
            tabIndex={0}
            aria-label="FoodRush home"
            onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
          >
            <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🔥</span>
            <span className="font-black text-2xl tracking-tight text-primary uppercase">Food Rush</span>
          </div>

          {/* ── DESKTOP NAV LINKS ── */}
          <ul className="hidden md:flex items-center gap-1.5" role="list">
            {navLinks.map(({ label, path, icon, isAdmin, badge }) => {
              const active = isActive(path);
              return (
                <li key={path} className="relative group">
                  <button
                    className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-bold text-[0.95rem] transition-all duration-300
                      ${active ? (isAdmin ? "bg-purple-100 text-purple-700 shadow-sm" : "bg-primary text-white shadow-md shadow-primary/30") 
                               : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                    `}
                    onClick={() => navigate(path)}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setTooltip(label)}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <span>{icon}</span>
                    <span className="hidden lg:block">{label}</span>
                    {badge > 0 && (
                      <span className="ml-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-900 text-white text-[0.65rem] font-black pointer-events-none shadow-sm">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    )}
                  </button>
                  {tooltip === label && !active && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 backdrop-blur text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                      {label}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── RIGHT SECTION ── */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar trigger */}
                <button
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-300 hover:bg-gray-50 focus:ring-4 focus:ring-primary/10 ${open ? "border-primary bg-primary/5" : "border-gray-200 bg-white shadow-sm"}`}
                  onClick={() => setOpen(o => !o)}
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-label="Open user menu"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white shadow-inner ${user.role === "admin" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-primary to-orange-500"}`}>
                    {avatarLetter}
                  </span>
                  <ChevronIcon className={`transition-transform duration-300 text-gray-500 ${open ? "-rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 top-[120%] w-60 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 origin-top-right ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                  role="menu"
                  aria-hidden={!open}
                >
                  <div className="p-5 flex items-center gap-4 bg-gray-50/50">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md ${user.role === "admin" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-primary to-orange-500"}`}>
                      {avatarLetter}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight block line-clamp-1">{user.name}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[0.65rem] font-bold uppercase tracking-wider ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-primary/10 text-primary"}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => { navigate("/profile"); setOpen(false); }}
                      role="menuitem"
                    >
                      <span className="text-gray-400"><UserIcon /></span> Profile
                    </button>

                    {user.role !== "admin" && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => { navigate("/orders"); setOpen(false); }}
                        role="menuitem"
                      >
                        <span className="text-gray-400"><OrderIcon /></span> My Orders
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                        onClick={() => { navigate("/admin/dashboard"); setOpen(false); }}
                        role="menuitem"
                      >
                        <span className="text-purple-500"><AdminIcon /></span> Admin Panel
                      </button>
                    )}

                    <div className="h-px bg-gray-100 my-1 mx-2" role="separator" />

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <span className="text-red-400"><LogoutIcon /></span> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── HAMBURGER ── */}
            <button
              ref={hamburgerRef}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-primary/10 transition-colors"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="nb-drawer"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

        </nav>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div
        id="nb-drawer"
        className={`fixed inset-y-0 right-0 w-[280px] bg-white/95 backdrop-blur-2xl shadow-[-10px_0_40px_rgba(0,0,0,0.08)] z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full overflow-y-auto p-6">
          
          {/* User info */}
          {user && (
            <div className="flex flex-col mb-8 border-b border-gray-100 pb-8">
               <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-md mb-4 ${user.role === "admin" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-primary to-orange-500"}`}>
                  {avatarLetter}
               </div>
               <h3 className="font-extrabold text-2xl text-gray-900 leading-tight">{user.name}</h3>
               <span className={`inline-block mt-2 self-start px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-primary/10 text-primary"}`}>
                 {user.role}
               </span>
            </div>
          )}

          {/* Nav links */}
          <ul className="flex flex-col gap-2 flex-1" role="list">
            {navLinks.map(({ label, path, icon, isAdmin, badge }) => {
              const active = isActive(path);
              return (
                <li key={path}>
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-lg transition-colors
                      ${active ? (isAdmin ? "bg-purple-100 text-purple-700" : "bg-primary text-white shadow-lg shadow-primary/20") 
                               : "text-gray-600 hover:bg-gray-100"}
                    `}
                    onClick={() => navigate(path)}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <span>{icon}</span> {label}
                    </div>
                    {badge > 0 && (
                      <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-gray-900 text-white text-xs font-black shadow-sm">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="h-px bg-gray-100 w-full my-6" role="separator" />

          <button
            className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-lg text-gray-700 hover:bg-gray-100 transition-colors mb-2"
            onClick={() => { navigate("/profile"); setMobileOpen(false); }}
          >
            <span className="text-gray-400"><UserIcon /></span> Profile
          </button>

          <button
            className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            onClick={handleLogout}
          >
            <span className="text-red-500"><LogoutIcon /></span> Logout
          </button>

        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] transition-opacity animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Navbar;
