import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Store, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<"superadmin" | "admin">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = await login(email, password, role);
    setLoading(false);
    if (ok) {
      navigate(role === "superadmin" ? "/superadmin" : "/admin");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  const fillDemo = () => {
    if (role === "superadmin") {
      setEmail("super@brelness.com");
      setPassword("superadmin123");
    } else {
      setEmail("admin@demoshop.com");
      setPassword("shopadmin123");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: Math.random() * 300 + 50, height: Math.random() * 300 + 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.1 + Math.random() * 0.2 }} />
          ))}
        </div>
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Store className="text-indigo-600" size={22} />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">Brelness</span>
          </div>
        </div>
        <div className="relative z-10 px-12 pb-12">
          <h1 className="text-white mb-4" style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 }}>
            Gérez vos boutiques en toute simplicité
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            La plateforme SaaS multi-boutiques pour la gestion de réservations, produits et licences.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Boutiques actives", value: "4" },
              { label: "Réservations", value: "982" },
              { label: "Satisfaction", value: "98%" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-white text-2xl font-bold">{stat.value}</div>
                <div className="text-indigo-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Store className="text-white" size={20} />
            </div>
            <span className="text-gray-900 dark:text-white text-xl font-bold">Brelness</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-gray-900 dark:text-white mb-1">Connexion</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Choisissez votre type de compte</p>

            {/* Role selector */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              {([
                { value: "admin", label: "Admin Boutique", icon: Store },
                { value: "superadmin", label: "Super Admin", icon: Shield },
              ] as const).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => { setRole(value); setEmail(""); setPassword(""); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${role === value
                    ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder={role === "superadmin" ? "super@brelness.com" : "admin@demoshop.com"}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  style={{ display: loading ? 'inline-block' : 'none' }}
                />
                <span>{loading ? "Connexion…" : "Se connecter"}</span>
              </button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={fillDemo} className="text-xs text-indigo-500 hover:text-indigo-700 underline">
                Remplir avec les identifiants de démo
              </button>
            </div>

            <div className="mt-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">Comptes de démonstration :</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Admin Boutique : admin@demoshop.com / shopadmin123</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Super Admin : super@brelness.com / superadmin123</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 Brelness · Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}