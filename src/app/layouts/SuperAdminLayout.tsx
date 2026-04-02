import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import {
  Store, LayoutDashboard, Building2, Users, Key, Bell,
  Settings, LogOut, ChevronLeft, ChevronRight, Sun, Moon, Menu, X, LifeBuoy
} from "lucide-react";

const navItems = [
  { to: "/superadmin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/superadmin/shops", label: "Boutiques", icon: Building2 },
  { to: "/superadmin/admins", label: "Administrateurs", icon: Users },
  { to: "/superadmin/licenses", label: "Licences", icon: Key },
  { to: "/superadmin/tickets", label: "Tickets Support", icon: LifeBuoy },
  { to: "/superadmin/notifications", label: "Notifications", icon: Bell },
  { to: "/superadmin/settings", label: "Paramètres", icon: Settings },
];

export default function SuperAdminLayout() {
  const { currentUser, logout, isDark, toggleDark, notificationCount } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${collapsed && !mobile ? "justify-center px-3" : "gap-3 px-5"} h-16 border-b border-blue-700/50`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/10 p-0.5">
          <img src="/logoBrelness.png" alt="Brelness" className="w-full h-full object-contain" />
        </div>
        {(!collapsed || mobile) && (
          <span className="text-white font-bold text-xl tracking-tight">Brelness</span>
        )}
      </div>

      {/* Role badge */}
      {(!collapsed || mobile) && (
        <div className="mx-4 mt-4 px-3 py-1.5 bg-blue-500/20 rounded-lg">
          <p className="text-blue-200 text-xs font-medium">Super Administrateur</p>
          <p className="text-white text-xs truncate">{currentUser?.email}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center ${collapsed && !mobile ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-xl text-sm transition-all ${isActive
                ? "bg-white/15 text-white font-medium"
                : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={18} />
                  {label === "Notifications" && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                      {notificationCount}
                    </span>
                  )}
                </div>
                {(!collapsed || mobile) && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`p-3 border-t border-blue-700/50 space-y-1`}>
        <button
          onClick={toggleDark}
          className={`w-full flex items-center ${collapsed && !mobile ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white text-sm transition-all`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {(!collapsed || mobile) && <span>{isDark ? "Mode clair" : "Mode sombre"}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed && !mobile ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-xl text-blue-200 hover:bg-red-500/20 hover:text-red-300 text-sm transition-all`}
        >
          <LogOut size={18} />
          {(!collapsed || mobile) && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
        style={{ background: "linear-gradient(180deg, #312e81 0%, #4f46e5 100%)" }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-1/2 -translate-y-1/2 translate-x-full w-5 h-10 bg-blue-600 hover:bg-blue-500 rounded-r-lg flex items-center justify-center text-white transition-colors z-10"
          style={{ left: collapsed ? "4rem" : "16rem", transition: "left 0.3s" }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 flex flex-col z-50" style={{ background: "linear-gradient(180deg, #312e81 0%, #4f46e5 100%)" }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-blue-200 hover:text-white">
              <X size={20} />
            </button>
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <NavLink to="/superadmin/notifications" className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                  {notificationCount}
                </span>
              )}
            </NavLink>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name?.charAt(0).toUpperCase() || "SA"
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{currentUser?.name || "Super Admin"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
