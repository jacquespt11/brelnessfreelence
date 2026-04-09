import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, setCurrentUser } = useApp() as any; // Cast en any pour utiliser setCurrentUser si non exposé ou l'ajouter
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Gestion du retour Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthData = params.get("oauth_data");
    
    if (oauthData) {
      try {
        const user = JSON.parse(decodeURIComponent(oauthData));
        const backendRole = user.role === 'SUPER_ADMIN' ? 'superadmin' : 'admin';
        
        const loggedInUser: any = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: backendRole,
          shopId: user.shopId,
          token: user.token,
        };
        
        if (user.shop && user.shop.name) {
          loggedInUser.shopName = user.shop.name;
        }

        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Enregistrer dans le localStorage et forcer ou appeler une méthode du context
        localStorage.setItem("brelness_user", JSON.stringify(loggedInUser));
        
        // Redirection
        if (backendRole === 'superadmin') {
          window.location.href = "/superadmin";
        } else {
          window.location.href = "/admin";
        }
      } catch (err) {
        console.error("Erreur parsing oauth_data:", err);
        setError("Erreur lors de la connexion via Google.");
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    // Login ne requiert plus de rôle depuis le frontend
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      if (result.role === 'superadmin') {
        navigate("/superadmin");
      } else {
        navigate("/admin");
      }
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  const handleGoogleLogin = () => {
    // Redirige vers le backend NestJS gérant Passport Google
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logoBrelness.png" alt="Brelness" className="w-full h-full object-cover" />
            </div>
            <span className="text-white text-3xl font-bold tracking-tight">Brelness</span>
          </div>
        </div>
        <div className="relative z-10 px-12 pb-12">
          <h1 className="text-white mb-4" style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 }}>
            Gérez vos boutiques en toute simplicité
          </h1>
          <p className="text-blue-200 text-lg mb-8">
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
                <div className="text-blue-200 text-sm">{stat.label}</div>
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logoBrelness.png" alt="Brelness" className="w-full h-full object-cover" />
            </div>
            <span className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight">Brelness</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-gray-900 dark:text-white mb-1">Connexion</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Connectez-vous pour accéder à votre espace.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="votre@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-700 dark:text-gray-300 block">Mot de passe</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Contactez le support SuperAdmin Brelness pour réinitialiser."); }} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">Mot de passe oublié ?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  style={{ display: loading ? 'inline-block' : 'none' }}
                />
                <span>{loading ? "Connexion…" : "Se connecter"}</span>
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-xs font-medium text-gray-400 uppercase">Ou</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 text-sm text-gray-700 dark:text-gray-200"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Se connecter avec Google
              </button>
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