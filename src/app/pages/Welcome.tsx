import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ShoppingBag, BarChart3, Users, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import api from "../../api";

export default function Welcome() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", businessName: "", details: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeSlide, setActiveSlide] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Dashboard Analytics
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop", // POS / Checkout
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop" // Cosmetic shop catalog (working URL)
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      await api.post("/shop-requests", formData);
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const finishWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white relative overflow-hidden">

      {/* Dynamic Mesh Background */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-700/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute -bottom-[40%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-800/20 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-8 pb-4 px-6 md:px-12 max-w-7xl mx-auto w-full flex items-center justify-between animate-in fade-in slide-in-from-top-8 duration-700">
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logoBrelness.png" alt="Brelness" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Brelness</h1>
          </button>

          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide animate-in fade-in zoom-in duration-500">
            <Sparkles size={16} /> Brelness O.S 2.0 est arrivé
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center gap-12 md:gap-16 mt-10 md:mt-16">

          {/* Section 1 : Textes et Boutons */}
          <section className="w-full text-center flex flex-col items-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 mb-5 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              La plateforme totale pour gérer votre business.
            </h2>

            <p className="text-base md:text-lg text-gray-400 leading-relaxed font-medium max-w-xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Boutique en ligne, réservation à la demande, calendriers et statistiques intelligentes. Tout au même endroit pour révolutionner vos ventes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 w-full sm:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="group flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-base hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
              >
                Demander ma plateforme
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#features" className="flex w-full sm:w-auto items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-base border border-white/10 transition-all">
                Découvrir les atouts
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-5 flex items-center justify-center gap-1.5 animate-in fade-in duration-1000 delay-700">
              <ShieldCheck size={16} /> Configuration terminée en 2 minutes chrono.
            </p>
          </section>

          {/* Section 2 : Bloc Démo Slider */}
          <section className="w-full max-w-5xl mx-auto relative animate-in fade-in zoom-in duration-1000 delay-500 z-10">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[1/1] sm:aspect-video flex items-center justify-center group bg-gradient-to-tr from-blue-900/20 to-purple-900/20">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay group-hover:bg-blue-400/10 transition-colors duration-500 z-10"></div>

              {/* Images en background avec effet de slide/fade */}
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
                  style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute inset-0 bg-blue-900/50 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent"></div>
                </div>
              ))}

              {/* Interface factice du Dashboard qui flotte */}
              <div className="relative z-20 w-[90%] sm:w-[70%] md:w-[60%] h-[80%] bg-[#0B1120]/80 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group-hover:scale-[1.02] transition-transform duration-500 ease-out">
                {/* Barre de navigation fausse MacOS */}
                <div className="h-8 bg-white/5 flex items-center px-4 gap-2 border-b border-white/5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></div>
                </div>

                {/* Contenu de l'interface qui s'adapte à la slide */}
                <div className="flex-1 relative flex flex-col justify-end p-4 sm:p-6 overflow-hidden">

                  <div className={`transition-all duration-700 w-full absolute bottom-4 sm:bottom-6 left-0 px-4 sm:px-6 ${activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {/* Slide 1 : Dashboard Stats */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 shadow-xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <BarChart3 size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div>
                          <div className="text-white text-xs sm:text-sm font-bold">Ventes du jour</div>
                          <div className="text-emerald-400 text-[10px] sm:text-xs">+15 Nouvelles ventes</div>
                        </div>
                      </div>
                      <div className="text-white font-black text-lg sm:text-xl">$984.50</div>
                    </div>
                  </div>

                  <div className={`transition-all duration-700 w-full absolute bottom-4 sm:bottom-6 left-0 px-4 sm:px-6 ${activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {/* Slide 2 : Réservation modale */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-4 border border-white/10 flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <CalendarCheck size={16} className="text-emerald-400 sm:w-[20px] sm:h-[20px]" />
                        </div>
                        <div>
                          <div className="text-white text-xs sm:text-sm font-bold">Réservation confirmée</div>
                          <div className="text-gray-300 text-[10px] sm:text-xs">Mardi 14h00 - Coupe Homme</div>
                        </div>
                      </div>
                      <ShieldCheck size={18} className="text-emerald-400 hidden sm:block sm:w-[20px] sm:h-[20px]" />
                    </div>
                  </div>

                  <div className={`transition-all duration-700 w-full absolute bottom-4 sm:bottom-6 left-0 px-4 sm:px-6 ${activeSlide === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {/* Slide 3 : Produit Cosmétique */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-4 border border-white/10 flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <ShoppingBag size={16} className="text-purple-400 sm:w-[20px] sm:h-[20px]" />
                        </div>
                        <div>
                          <div className="text-white text-xs sm:text-sm font-bold">Catalogue Cosmétique</div>
                          <div className="text-gray-300 text-[10px] sm:text-xs">Sérum Visage Nuit ajouté</div>
                        </div>
                      </div>
                      <button className="bg-purple-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg hidden sm:block">Acheter</button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Lueur arrière de la boite démo */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-20"></div>
            </div>
          </section>
        </main>

        {/* Bento Grid Features */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 z-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Un écosystème surpuissant</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">Pensé pour les PME modernes, Brelness regroupe des outils haut de gamme dans une interface cristalline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Bento Item 1 - Large */}
            <div className="md:col-span-2 rounded-[32px] p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-blue-500/30 transition-colors"></div>
              <div className="relative z-10 w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag size={28} className="text-blue-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">Vitrine Numérique</h4>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">Propulsez vos produits et services avec un catalogue ultra-rapide doté de filtres avancés et d'une esthétique prémium.</p>
            </div>

            {/* Bento Item 2 */}
            <div className="rounded-[32px] p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] -mr-10 -mb-10 group-hover:bg-emerald-500/30 transition-colors"></div>
              <div className="relative z-10 w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <CalendarCheck size={24} className="text-emerald-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Réservations 24/7</h4>
              <p className="text-gray-400">Automatisez la prise de rendez-vous avec gestion des disponibilités en temps réel.</p>
            </div>

            {/* Bento Item 3 */}
            <div className="rounded-[32px] p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
              <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] -ml-10 -mt-10 group-hover:bg-purple-500/30 transition-colors"></div>
              <div className="relative z-10 w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Analytics Poussées</h4>
              <p className="text-gray-400">Suivez la performance avec des KPI précis : revenus, tendances et taux d'achèvement.</p>
            </div>

            {/* Bento Item 4 - Wide */}
            <div className="md:col-span-2 rounded-[32px] p-6 sm:p-8 min-h-[320px] md:min-h-0 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-amber-500/50 transition-colors flex flex-col justify-end">
              <div className="absolute bottom-0 left-1/4 w-full h-32 bg-amber-500/20 rounded-full blur-[80px] -mb-16 group-hover:bg-amber-500/30 transition-colors"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-auto">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Users size={32} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Fidélisation Instantanée</h4>
                  <p className="text-gray-400 text-base sm:text-lg">Suivez les habitudes et récompensez les clients avec des coupons de réduction exclusifs depuis un CRM intégré.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm bg-black/50 z-10 w-full mt-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logoBrelness.png" alt="Brelness" className="w-4 h-4 object-contain opacity-50 grayscale" />
            <span className="font-bold tracking-widest text-white uppercase text-xs">Brelness O.S</span>
          </div>
          <p>© {new Date().getFullYear()} propulsé par Brelness. Sécurisé & Performant.</p>
        </footer>
      </div>

      {/* Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-[320px]:p-4 relative overflow-hidden">

            {/* Décoration douce */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>

            <h3 className="text-2xl max-[320px]:text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10 flex items-center gap-2">
              <Sparkles className="text-blue-500 w-6 h-6 max-[320px]:w-5 max-[320px]:h-5" />
              Créons votre interface admin
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-[320px]:text-xs relative z-10">Un expert Brelness configurera votre boutique et vous contactera sous 24h.</p>

            {submitStatus === "success" ? (
              <div className="text-center py-8 relative z-10">
                <div className="w-16 h-16 max-[320px]:w-12 max-[320px]:h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={32} className="max-[320px]:w-6 max-[320px]:h-6" />
                </div>
                <h4 className="text-xl max-[320px]:text-lg font-bold text-gray-900 dark:text-white mb-2">Demande envoyée !</h4>
                <p className="text-gray-500 mb-6 max-[320px]:text-xs">Nous avons bien reçu votre demande. Surveillez votre boîte mail.</p>
                <button onClick={() => setShowModal(false)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-colors max-[320px]:text-sm max-[320px]:py-2">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-[320px]:space-y-3 text-left relative z-10">
                <div className="grid grid-cols-2 gap-4 max-[320px]:grid-cols-1 max-[320px]:gap-3">
                  <div>
                    <label className="text-xs max-[320px]:text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1 block">Votre Nom</label>
                    <input required minLength={2} value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 max-[320px]:py-2 max-[320px]:px-3 max-[320px]:text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white shadow-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Rhenard Munongo" />
                  </div>
                  <div>
                    <label className="text-xs max-[320px]:text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1 block">Nom de Boutique</label>
                    <input required minLength={2} value={formData.businessName} onChange={e => setFormData(f => ({ ...f, businessName: e.target.value }))} className="w-full px-4 py-3 max-[320px]:py-2 max-[320px]:px-3 max-[320px]:text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white shadow-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Mon entreprise" />
                  </div>
                </div>
                <div>
                  <label className="text-xs max-[320px]:text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1 block">MAIL</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 max-[320px]:py-2 max-[320px]:px-3 max-[320px]:text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white shadow-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="jean@entreprise.com" />
                </div>
                <div>
                  <label className="text-xs max-[320px]:text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1 block">Téléphone (Optionnel)</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 max-[320px]:py-2 max-[320px]:px-3 max-[320px]:text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white shadow-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+243 995 89 55 69" />
                </div>
                <div>
                  <label className="text-xs max-[320px]:text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1 block">Un détail particulier ? (Optionnel)</label>
                  <textarea value={formData.details} onChange={e => setFormData(f => ({ ...f, details: e.target.value }))} className="w-full px-4 py-3 max-[320px]:py-2 max-[320px]:px-3 max-[320px]:text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white shadow-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 max-[320px]:h-20 transition-all" placeholder="Je voudrais un système de rendez-vous pour mon salon de coiffure..." />
                </div>

                {submitStatus === "error" && <p className="text-red-500 text-sm max-[320px]:text-xs">Une erreur est survenue, veuillez réessayer.</p>}

                <div className="flex gap-3 pt-2 max-[320px]:pt-0 max-[320px]:flex-col">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 px-4 max-[320px]:py-2 max-[320px]:text-sm text-gray-600 dark:text-gray-300 font-bold bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Annuler</button>
                  <button type="submit" disabled={submitStatus === "loading"} className="flex-[2] py-3 px-4 max-[320px]:py-2 max-[320px]:text-sm flex items-center justify-center gap-2 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-70 transition-colors">
                    {submitStatus === "loading" ? "Envoi..." : "Envoyer ma demande"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
