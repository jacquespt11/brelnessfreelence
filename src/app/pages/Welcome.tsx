import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ShoppingBag, BarChart3, Users, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

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
        <header className="pt-8 pb-4 px-6 md:px-12 max-w-7xl mx-auto w-full flex items-center gap-3 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
             <img src="/logoBrelness.png" alt="Brelness" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Brelness</h1>
        </header>

        {/* Hero Section */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center mt-12 md:mt-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide mb-8 animate-in fade-in zoom-in duration-500">
            <Sparkles size={16} /> Brelness O.S 2.0 est arrivé
          </div>
          
          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 mb-6 leading-tight tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            La plateforme totale pour gérer votre business.
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            Boutique en ligne, paiements, calendriers et statistiques intelligentes. Tout au même endroit pour révolutionner vos ventes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <button 
              onClick={finishWelcome}
              className="group flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Démarrer l'expérience
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features" className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 transition-all">
              Découvrir les atouts
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6 flex items-center gap-1.5 animate-in fade-in duration-1000 delay-700">
            <ShieldCheck size={16} /> Configuration terminée en 2 minutes chrono.
          </p>
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
            <div className="md:col-span-2 rounded-[32px] p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-amber-500/50 transition-colors flex flex-col justify-end">
              <div className="absolute bottom-0 left-1/4 w-full h-32 bg-amber-500/20 rounded-full blur-[80px] -mb-16 group-hover:bg-amber-500/30 transition-colors"></div>
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Users size={32} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Fidélisation Instantanée</h4>
                  <p className="text-gray-400 text-lg">Suivez les habitudes et récompensez les clients avec des coupons de réduction exclusifs depuis un CRM intégré.</p>
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
    </div>
  );
}
