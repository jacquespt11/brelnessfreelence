import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ShoppingBag, TrendingUp, Users, Zap, ArrowRight, BarChart3, Shield, Globe } from "lucide-react";

const FEATURES = [
  { icon: BarChart3, label: "Analytics temps réel", desc: "Suivez vos performances en un coup d'œil" },
  { icon: Users, label: "Gestion multi-boutiques", desc: "Pilotez toutes vos boutiques depuis un point central" },
  { icon: Shield, label: "Sécurisé & fiable", desc: "Licences, accès et droits gérés automatiquement" },
  { icon: Globe, label: "Vitrine publique", desc: "Votre boutique en ligne prête à partager" },
];

export default function Welcome() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
        ctx.fill();
      }
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleStart = () => {
    localStorage.setItem("brelness_welcomed", "true");
    navigate("/login");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 45%, #24243e 100%)",
      }}
    >
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Big blurred glow blobs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)", zIndex: 0 }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", zIndex: 0 }}
      />

      {/* Main card */}
      <div
        className="relative flex flex-col items-center px-8 py-12 max-w-2xl w-full mx-4 text-center"
        style={{
          zIndex: 1,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "2rem",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.15) inset",
        }}
      >
        {/* Brand badge */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6366f1)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.6)",
            }}
          >
            <ShoppingBag size={28} className="text-white" />
          </div>
          <span
            className="text-white font-black text-3xl tracking-tight"
            style={{ letterSpacing: "-0.04em" }}
          >
            Brelness
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white font-black mb-4 leading-tight"
          style={{ fontSize: "2.75rem", letterSpacing: "-0.04em" }}
        >
          Bienvenue sur{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #818cf8, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Brelness
          </span>
        </h1>
        <p className="text-lg mb-10" style={{ color: "rgba(196,181,253,0.85)", lineHeight: 1.6 }}>
          La plateforme SaaS qui propulse votre business.<br />
          Gérez vos boutiques, produits, commandes et analytics — en un seul endroit.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-10">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-3 text-left p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(124,58,237,0.25)" }}
              >
                <Icon size={18} className="text-violet-300" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight mb-0.5">{label}</p>
                <p className="text-xs" style={{ color: "rgba(196,181,253,0.7)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="group relative w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset",
          }}
        >
          {/* Shimmer effect */}
          <span
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
          />
          <Zap size={22} className="relative" />
          <span className="relative">Commencer maintenant</span>
          <ArrowRight size={22} className="relative group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Tagline */}
        <div className="mt-6 flex items-center gap-2" style={{ color: "rgba(196,181,253,0.5)" }}>
          <TrendingUp size={14} />
          <span className="text-xs">Propulsez votre business · Zéro complexité · 100% Pro</span>
        </div>
      </div>

      {/* Floating version tag */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs"
        style={{ color: "rgba(196,181,253,0.35)", zIndex: 1 }}
      >
        Brelness v1.0 · Plateforme SaaS pour PME & Startups
      </div>
    </div>
  );
}
