"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { translations, type Lang } from "@/lib/i18n";

const galleryPhotos = [
  "photo_1_2026-05-16_14-37-06.jpg","photo_2_2026-05-16_14-37-06.jpg","photo_3_2026-05-16_14-37-06.jpg",
  "photo_4_2026-05-16_14-37-06.jpg","photo_5_2026-05-16_14-37-06.jpg","photo_6_2026-05-16_14-37-06.jpg",
  "photo_7_2026-05-16_14-37-06.jpg","photo_8_2026-05-16_14-37-06.jpg","photo_9_2026-05-16_14-37-06.jpg",
  "photo_10_2026-05-16_14-37-06.jpg","photo_11_2026-05-16_14-37-06.jpg","photo_12_2026-05-16_14-37-06.jpg",
  "photo_13_2026-05-16_14-37-06.jpg","photo_14_2026-05-16_14-37-06.jpg","photo_15_2026-05-16_14-37-06.jpg",
  "photo_16_2026-05-16_14-37-06.jpg","photo_17_2026-05-16_14-37-06.jpg","photo_18_2026-05-16_14-37-06.jpg",
  "photo_19_2026-05-16_14-37-06.jpg","photo_20_2026-05-16_14-37-06.jpg","photo_21_2026-05-16_14-37-06.jpg",
  "photo_22_2026-05-16_14-37-06.jpg","photo_23_2026-05-16_14-37-06.jpg","photo_24_2026-05-16_14-37-06.jpg",
  "photo_25_2026-05-16_14-37-06.jpg","photo_26_2026-05-16_14-37-06.jpg","photo_27_2026-05-16_14-37-06.jpg",
  "photo_28_2026-05-16_14-37-06.jpg","photo_29_2026-05-16_14-37-06.jpg","photo_30_2026-05-16_14-37-06.jpg",
  "photo_31_2026-05-16_14-37-06.jpg","photo_32_2026-05-16_14-37-06.jpg","photo_33_2026-05-16_14-37-06.jpg",
  "photo_34_2026-05-16_14-37-06.jpg","photo_35_2026-05-16_14-37-06.jpg","photo_36_2026-05-16_14-37-06.jpg",
  "photo_37_2026-05-16_14-37-06.jpg","photo_38_2026-05-16_14-37-06.jpg","photo_39_2026-05-16_14-37-06.jpg",
  "photo_40_2026-05-16_14-37-06.jpg","photo_41_2026-05-16_14-37-06.jpg","photo_42_2026-05-16_14-37-06.jpg",
  "photo_43_2026-05-16_14-37-06.jpg","photo_44_2026-05-16_14-37-06.jpg","photo_45_2026-05-16_14-37-06.jpg",
  "photo_46_2026-05-16_14-37-06.jpg","photo_47_2026-05-16_14-37-06.jpg","photo_48_2026-05-16_14-37-06.jpg",
  "photo_49_2026-05-16_14-37-06.jpg","photo_50_2026-05-16_14-37-06.jpg","photo_51_2026-05-16_14-37-06.jpg",
  "photo_52_2026-05-16_14-37-06.jpg","photo_53_2026-05-16_14-37-06.jpg","photo_54_2026-05-16_14-37-06.jpg",
];

const heroPhotos = [
  "photo_1_2026-05-16_14-37-06.jpg",
  "photo_10_2026-05-16_14-37-06.jpg",
  "photo_20_2026-05-16_14-37-06.jpg",
  "photo_30_2026-05-16_14-37-06.jpg",
  "photo_40_2026-05-16_14-37-06.jpg",
];

const GOLD = "#c9a84c";
const DARK = "#0a0a0a";
const DARK2 = "#0d0d0d";
const BORDER = "#1a1a1a";
const SECTIONS = ["hero","services","gallery","about","contact"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [langPhase, setLangPhase] = useState<"idle"|"out"|"in">("idle");
  const [heroIdx, setHeroIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number|null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [formState, setFormState] = useState({
    name:"", email:"", phone:"", event_type:"", event_date:"", guest_count:"", venue:"", message:"",
  });
  const [formStatus, setFormStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const langTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const t = translations[lang];

  // ── Language fade transition ──
  const switchLang = useCallback((newLang: Lang) => {
    if (newLang === lang || langPhase !== "idle") return;
    clearTimeout(langTimer.current);
    setLangPhase("out");
    langTimer.current = setTimeout(() => {
      setLang(newLang);
      setLangPhase("in");
      langTimer.current = setTimeout(() => setLangPhase("idle"), 600);
    }, 260);
  }, [lang, langPhase]);

  // ── Scroll: navbar opacity + progress bar ──
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 60);
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? sy / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section tracker ──
  useEffect(() => {
    const observers = SECTIONS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  // ── Scroll reveal (IntersectionObserver) ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Hero slideshow ──
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i+1) % heroPhotos.length), 5500);
    return () => clearInterval(id);
  }, []);

  // ── Lightbox keyboard ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") setLightboxIdx(i => ((i!)+1) % galleryPhotos.length);
      if (e.key === "ArrowLeft") setLightboxIdx(i => ((i!)-1+galleryPhotos.length) % galleryPhotos.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx]);

  // ── Lock scroll when lightbox open ──
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, guest_count: formState.guest_count ? parseInt(formState.guest_count) : undefined }),
      });
      setFormStatus(res.ok ? "success" : "error");
      if (res.ok) setFormState({ name:"", email:"", phone:"", event_type:"", event_date:"", guest_count:"", venue:"", message:"" });
    } catch { setFormStatus("error"); }
  };

  const navItems = [
    { key:"services", label:t.nav.services },
    { key:"gallery",  label:t.nav.gallery  },
    { key:"about",    label:t.nav.about    },
    { key:"contact",  label:t.nav.contact  },
  ];

  const contentCls = langPhase === "out" ? "lang-out" : langPhase === "in" ? "lang-in" : "";

  // ── NAV BUTTON ──
  const NavBtn = ({ id, label }: { id: string; label: string }) => {
    const active = activeSection === id;
    return (
      <button onClick={() => scrollTo(id)} style={{
        background: "none", border: "none", cursor: "pointer",
        color: active ? GOLD : "#888",
        fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase",
        transition: "color 0.35s", position: "relative", padding: "4px 0",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
        onMouseLeave={e => (e.currentTarget.style.color = active ? GOLD : "#888")}
      >
        {label}
        <span style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: GOLD,
          transform: active ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </button>
    );
  };

  return (
    <>
      {/* ── FIXED NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(8,8,8,0.97)" : "rgba(10,10,10,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "#222" : "transparent"}`,
        transition: "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Gold scroll progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: 1,
          background: `linear-gradient(90deg, ${GOLD}, #e8d5a3)`,
          width: `${scrollProgress * 100}%`,
          transition: "width 0.1s linear",
          opacity: scrolled ? 1 : 0,
        }} />

        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ color: GOLD, fontSize: "1.25rem", letterSpacing: "0.2em", fontWeight: 300, lineHeight: 1 }}>MT</span>
            <span style={{ color: "#555", fontSize: "0.45rem", letterSpacing: "0.4em", textTransform: "uppercase" }}>Event & Wedding</span>
          </button>

          <div id="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {navItems.map(({ key, label }) => <NavBtn key={key} id={key} label={label} />)}

            {/* Lang toggle */}
            <div style={{ display: "flex", gap: 1, marginLeft: 8 }}>
              {(["en","it"] as Lang[]).map(l => (
                <button key={l} onClick={() => switchLang(l)}
                  style={{
                    background: lang === l ? GOLD : "transparent",
                    color: lang === l ? "#000" : "#555",
                    border: `1px solid ${lang === l ? GOLD : "#2a2a2a"}`,
                    padding: "0.22rem 0.6rem",
                    fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile btn */}
          <button id="mobile-btn" onClick={() => setMenuOpen(o => !o)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: GOLD, padding: 6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          overflow: "hidden",
          maxHeight: menuOpen ? 400 : 0,
          transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
          background: "#060606",
          borderTop: menuOpen ? `1px solid ${BORDER}` : "1px solid transparent",
        }}>
          <div style={{ padding: "1.5rem 2rem" }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => scrollTo(key)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "0.85rem 0", background: "none", border: "none", borderBottom: `1px solid ${BORDER}`, color: activeSection === key ? GOLD : "#888", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.3s" }}>
                {label}
              </button>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: "1.25rem" }}>
              {(["en","it"] as Lang[]).map(l => (
                <button key={l} onClick={() => { switchLang(l); setMenuOpen(false); }}
                  style={{ background: lang === l ? GOLD : "transparent", color: lang === l ? "#000" : "#555", border: `1px solid ${lang === l ? GOLD : "#2a2a2a"}`, padding: "0.3rem 0.85rem", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.35s" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── FADING CONTENT WRAPPER ── */}
      <div className={contentCls} style={{ background: DARK, minHeight: "100vh", color: "#f5f0e8" }}>

        {/* ── HERO ── */}
        <section id="hero" style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {heroPhotos.map((photo, i) => (
            <div key={photo} style={{
              position: "absolute", inset: 0,
              opacity: i === heroIdx ? 1 : 0,
              transition: "opacity 2s cubic-bezier(0.4,0,0.2,1)",
              transform: i === heroIdx ? "scale(1)" : "scale(1.03)",
            }}>
              <Image src={`/images/${photo}`} alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} priority={i === 0} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.7) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)" }} />
            </div>
          ))}

          <div className="hero-content" style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", maxWidth: 860 }}>
            <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", marginBottom: "2rem", animation: "heroFadeUp 1.2s 0.2s both" }}>
              Italy · {lang === "en" ? "Est. 2020" : "Dal 2020"}
            </p>
            <h1 style={{ color: "#f5f0e8", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.05, marginBottom: "1.5rem", animation: "heroFadeUp 1.2s 0.4s both" }}>
              {t.hero.tagline}
            </h1>
            <div style={{ width: 50, height: 1, background: GOLD, margin: "0 auto 2rem", animation: "heroFadeUp 1.2s 0.6s both" }} />
            <p style={{ color: "#bbb", fontSize: "clamp(0.8rem, 2vw, 1rem)", letterSpacing: "0.22em", fontWeight: 300, marginBottom: "3.5rem", animation: "heroFadeUp 1.2s 0.7s both" }}>
              {t.hero.sub}
            </p>
            <div style={{ animation: "heroFadeUp 1.2s 0.9s both", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("contact")}
                style={{ background: GOLD, border: `1px solid ${GOLD}`, color: "#000", padding: "0.9rem 3rem", letterSpacing: "0.2em", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", fontWeight: 600, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; e.currentTarget.style.letterSpacing = "0.28em"; }}
                onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; e.currentTarget.style.letterSpacing = "0.2em"; }}>
                {t.hero.cta}
              </button>
              <button onClick={() => scrollTo("gallery")}
                style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.2)`, color: "#ccc", padding: "0.9rem 2.5rem", letterSpacing: "0.2em", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", fontWeight: 300, transition: "all 0.4s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#ccc"; }}>
                {lang === "en" ? "View Portfolio" : "Vedi Portfolio"}
              </button>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 10 }}>
            {heroPhotos.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                style={{ width: i === heroIdx ? 32 : 8, height: 1.5, background: i === heroIdx ? GOLD : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", padding: 0 }} />
            ))}
          </div>

          {/* Scroll arrow */}
          <div style={{ position: "absolute", bottom: 38, right: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 10, animation: "arrowPulse 2.5s ease-in-out infinite" }}>
            <span style={{ color: "#666", fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase", writingMode: "vertical-rl" }}>scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.6))" }} />
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" style={{ padding: "9rem 2rem", maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <p data-reveal data-d="0" style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
              {lang === "en" ? "What We Do" : "Cosa Facciamo"}
            </p>
            <h2 data-reveal data-d="1" style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
              {t.services.title}
            </h2>
            <div data-reveal data-d="2" style={{ width: 50, height: 1, background: GOLD, margin: "1.75rem auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: BORDER }}>
            {t.services.items.map((item, i) => (
              <div key={i} data-reveal data-d={String(i)}
                style={{ background: DARK2, padding: "3.5rem 2.5rem", textAlign: "center", transition: "background 0.4s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#111"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = DARK2; }}>
                {/* Gold corner accent */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 32, height: 1, background: GOLD, transition: "width 0.4s ease" }} className="card-accent-top" />
                <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: 32, background: GOLD, transition: "height 0.4s ease" }} className="card-accent-left" />
                <div style={{ color: GOLD, marginBottom: "2rem", fontSize: "1.6rem", fontWeight: 300, letterSpacing: "0.1em", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                  {["◇", "◈", "✦", "◉"][i]}
                </div>
                <h3 style={{ color: "#eee", fontSize: "0.95rem", fontWeight: 400, letterSpacing: "0.12em", marginBottom: "1.2rem", textTransform: "uppercase" }}>{item.title}</h3>
                <div style={{ width: 24, height: 1, background: GOLD, margin: "0 auto 1.25rem", transition: "width 0.4s" }} />
                <p style={{ color: "#666", fontSize: "0.87rem", lineHeight: 1.9, fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FULLWIDTH BANNER ── */}
        <div style={{ position: "relative", height: 520, overflow: "hidden" }}>
          <Image src="/images/photo_10_2026-05-16_14-37-06.jpg" alt="Ceremony" fill style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.85) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.25rem" }}>
            <p data-reveal style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.55em", textTransform: "uppercase" }}>
              {lang === "en" ? "Destination Weddings" : "Destination Wedding"}
            </p>
            <h2 data-reveal data-d="1" style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300, letterSpacing: "0.08em", textAlign: "center" }}>
              {lang === "en" ? "Italy, Beyond Compare" : "Italia, Senza Paragoni"}
            </h2>
            <div data-reveal data-d="2" style={{ width: 50, height: 1, background: GOLD }} />
            <button data-reveal data-d="3" onClick={() => scrollTo("contact")}
              style={{ background: "transparent", border: `1px solid rgba(201,168,76,0.5)`, color: GOLD, padding: "0.7rem 2rem", letterSpacing: "0.2em", fontSize: "0.6rem", textTransform: "uppercase", cursor: "pointer", marginTop: "0.5rem", transition: "all 0.4s" }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; e.currentTarget.style.borderColor = GOLD; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; }}>
              {lang === "en" ? "Book 2026 / 2027" : "Prenota 2026 / 2027"}
            </button>
          </div>
        </div>

        {/* ── GALLERY ── */}
        <section id="gallery" style={{ padding: "9rem 2rem", maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <p data-reveal style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
              {lang === "en" ? "Our Work" : "I Nostri Lavori"}
            </p>
            <h2 data-reveal data-d="1" style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.gallery.title}</h2>
            <div data-reveal data-d="2" style={{ width: 50, height: 1, background: GOLD, margin: "1.75rem auto 1.5rem" }} />
            <p data-reveal data-d="3" style={{ color: "#666", fontSize: "0.87rem", letterSpacing: "0.15em" }}>{t.gallery.sub}</p>
          </div>
          <div style={{ columns: "280px", columnGap: "6px" }}>
            {galleryPhotos.map((photo, i) => (
              <div key={i} onClick={() => setLightboxIdx(i)}
                style={{ marginBottom: "6px", overflow: "hidden", cursor: "zoom-in", breakInside: "avoid", position: "relative", background: "#111" }}>
                <Image src={`/images/${photo}`} alt={`Portfolio ${i+1}`} width={600} height={800}
                  style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease", filter: "brightness(0.92)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; (e.currentTarget as HTMLImageElement).style.filter = "brightness(1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.92)"; }}
                />
                {/* Index overlay on hover */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "1rem", background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                  <span style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.55rem", letterSpacing: "0.2em" }}>VIEW</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ background: DARK2, padding: "9rem 2rem", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "6rem", alignItems: "center" }}>
            <div data-reveal style={{ position: "relative", height: 600 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: "14%", bottom: "14%", overflow: "hidden" }}>
                <Image src="/images/photo_20_2026-05-16_14-37-06.jpg" alt="Planner" fill style={{ objectFit: "cover", transition: "transform 0.8s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "46%", height: "50%", overflow: "hidden", outline: `3px solid ${DARK2}`, outlineOffset: -3 }}>
                <Image src="/images/photo_30_2026-05-16_14-37-06.jpg" alt="Detail" fill style={{ objectFit: "cover" }} />
              </div>
              {/* Decorative gold frame */}
              <div style={{ position: "absolute", bottom: "12%", right: "12%", width: "55%", height: "60%", border: `1px solid rgba(201,168,76,0.2)`, pointerEvents: "none", transform: "translate(12px, 12px)" }} />
            </div>

            <div>
              <p data-reveal style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                {lang === "en" ? "Our Story" : "La Nostra Storia"}
              </p>
              <h2 data-reveal data-d="1" style={{ color: "#f5f0e8", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, letterSpacing: "0.06em", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                {t.about.title}
              </h2>
              <div data-reveal data-d="2" style={{ width: 36, height: 1, background: GOLD, marginBottom: "2rem" }} />
              <p data-reveal data-d="2" style={{ color: "#777", lineHeight: 1.95, marginBottom: "1.25rem", fontWeight: 300, fontSize: "0.93rem" }}>{t.about.p1}</p>
              <p data-reveal data-d="3" style={{ color: "#777", lineHeight: 1.95, marginBottom: "1.25rem", fontWeight: 300, fontSize: "0.93rem" }}>{t.about.p2}</p>
              <p data-reveal data-d="4" style={{ color: GOLD, lineHeight: 1.9, fontSize: "0.95rem", letterSpacing: "0.04em", fontStyle: "italic" }}>{t.about.p3}</p>
              <div data-reveal data-d="4" style={{ display: "flex", gap: "3rem", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${BORDER}` }}>
                {[{num:"150+",label:t.about.stat1},{num:"12",label:t.about.stat2},{num:"5+",label:t.about.stat3}].map((s,i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ color: GOLD, fontSize: "2.2rem", fontWeight: 300, lineHeight: 1 }}>{s.num}</div>
                    <div style={{ color: "#444", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding: "9rem 2rem", maxWidth: 920, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <p data-reveal style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
              {lang === "en" ? "Get in Touch" : "Contattaci"}
            </p>
            <h2 data-reveal data-d="1" style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.contact.title}</h2>
            <div data-reveal data-d="2" style={{ width: 50, height: 1, background: GOLD, margin: "1.75rem auto 1.5rem" }} />
            <p data-reveal data-d="3" style={{ color: "#666", fontSize: "0.88rem", letterSpacing: "0.08em" }}>{t.contact.sub}</p>
          </div>

          {formStatus === "success" ? (
            <div data-reveal style={{ textAlign: "center", padding: "5rem 2rem", border: `1px solid ${GOLD}`, background: "rgba(201,168,76,0.03)" }}>
              <div style={{ width: 48, height: 48, border: `1px solid ${GOLD}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "1.2rem", color: GOLD }}>✓</div>
              <p style={{ color: GOLD, fontSize: "1rem", letterSpacing: "0.1em", fontWeight: 300 }}>{t.contact.success}</p>
              <button onClick={() => setFormStatus("idle")} style={{ marginTop: "2rem", background: "none", border: `1px solid #333`, color: "#666", padding: "0.6rem 1.5rem", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666"; }}>
                {lang === "en" ? "Send Another" : "Invia Altra"}
              </button>
            </div>
          ) : (
            <form data-reveal onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {[
                  { label: t.contact.name+" *", key:"name", type:"text", required:true, placeholder:t.contact.name },
                  { label: t.contact.email+" *", key:"email", type:"email", required:true, placeholder:"email@example.com" },
                  { label: t.contact.phone, key:"phone", type:"tel", required:false, placeholder:"+39 000 000 0000" },
                ].map(({ label, key, type, required, placeholder }) => (
                  <div key={key}>
                    <label style={{ display:"block", color:"#555", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.6rem" }}>{label}</label>
                    <input className="input-dark" type={type} required={required} placeholder={placeholder}
                      value={(formState as Record<string,string>)[key]}
                      onChange={e => setFormState(s => ({ ...s, [key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label style={{ display:"block", color:"#555", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.6rem" }}>{t.contact.eventType} *</label>
                  <select className="input-dark" required value={formState.event_type} onChange={e => setFormState(s => ({ ...s, event_type: e.target.value }))}>
                    <option value="">—</option>
                    {t.contact.eventTypes.map(et => <option key={et} value={et}>{et}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", color:"#555", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.6rem" }}>{t.contact.date}</label>
                  <input className="input-dark" type="date" value={formState.event_date} onChange={e => setFormState(s => ({ ...s, event_date: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display:"block", color:"#555", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.6rem" }}>{t.contact.guests}</label>
                  <input className="input-dark" type="number" min="1" placeholder="50" value={formState.guest_count} onChange={e => setFormState(s => ({ ...s, guest_count: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display:"block", color:"#555", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.6rem" }}>{t.contact.venue}</label>
                <input className="input-dark" placeholder="Lake Como, Venice, Tuscany..." value={formState.venue} onChange={e => setFormState(s => ({ ...s, venue: e.target.value }))} />
              </div>
              <div style={{ marginBottom: "2.5rem" }}>
                <label style={{ display:"block", color:"#555", fontSize:"0.58rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.6rem" }}>{t.contact.message}</label>
                <textarea className="input-dark" rows={5} placeholder={t.contact.message} value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} style={{ resize:"vertical" }} />
              </div>
              {formStatus === "error" && (
                <p style={{ color:"#c0392b", marginBottom:"1.5rem", fontSize:"0.83rem", textAlign:"center", letterSpacing:"0.05em" }}>{t.contact.error}</p>
              )}
              <div style={{ textAlign: "center" }}>
                <button type="submit" disabled={formStatus === "loading"}
                  style={{ background: GOLD, border:`1px solid ${GOLD}`, color:"#000", padding:"0.9rem 3.5rem", letterSpacing:"0.2em", fontSize:"0.65rem", textTransform:"uppercase", cursor:formStatus==="loading"?"not-allowed":"pointer", fontWeight:600, opacity:formStatus==="loading"?0.7:1, transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => { if (formStatus!=="loading") { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=GOLD; e.currentTarget.style.letterSpacing="0.28em"; } }}
                  onMouseLeave={e => { e.currentTarget.style.background=GOLD; e.currentTarget.style.color="#000"; e.currentTarget.style.letterSpacing="0.2em"; }}>
                  {formStatus === "loading"
                    ? <span style={{ display:"flex", alignItems:"center", gap:8 }}><span className="spinner" />...</span>
                    : t.contact.submit}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#040404", borderTop: `1px solid ${BORDER}`, padding: "5rem 2rem 2.5rem" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3.5rem", marginBottom: "4rem" }}>
              <div>
                <div style={{ color: GOLD, fontSize: "1.6rem", letterSpacing: "0.2em", fontWeight: 300, marginBottom: "0.4rem" }}>MT</div>
                <div style={{ color: "#333", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Event & Wedding</div>
                <p style={{ color: "#3a3a3a", fontSize: "0.85rem", lineHeight: 1.8, fontStyle: "italic" }}>{t.footer.tagline}</p>
              </div>
              <div>
                <p style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Contact</p>
                {[
                  { href:`mailto:${t.footer.email}`, text: t.footer.email },
                  { href:"https://instagram.com/mteventwedding", text: t.footer.instagram },
                ].map(({ href, text }) => (
                  <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    style={{ color:"#555", fontSize:"0.84rem", display:"block", marginBottom:"0.6rem", textDecoration:"none", transition:"color 0.3s, letter-spacing 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}>
                    {text}
                  </a>
                ))}
              </div>
              <div>
                <p style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  {lang === "en" ? "Booking" : "Prenotazioni"}
                </p>
                <p style={{ color: "#555", fontSize: "0.85rem", lineHeight: 1.8 }}>2026 &amp; 2027</p>
                <button onClick={() => scrollTo("contact")}
                  style={{ marginTop: "1.25rem", background:"transparent", border:`1px solid #2a2a2a`, color:"#666", padding:"0.65rem 1.6rem", letterSpacing:"0.18em", fontSize:"0.58rem", textTransform:"uppercase", cursor:"pointer", transition:"all 0.4s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=GOLD; e.currentTarget.style.color=GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.color="#666"; }}>
                  {t.hero.cta}
                </button>
              </div>
            </div>
            <div style={{ borderTop:`1px solid #111`, paddingTop:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
              <p style={{ color:"#2a2a2a", fontSize:"0.7rem" }}>© {new Date().getFullYear()} MT Event &amp; Wedding. {t.footer.rights}</p>
              <p style={{ color:"#2a2a2a", fontSize:"0.65rem", letterSpacing:"0.15em" }}>Italy</p>
            </div>
          </div>
        </footer>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <div
          style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.97)", display:"flex", alignItems:"center", justifyContent:"center", animation:"lightboxBgIn 0.3s ease" }}
          onClick={() => setLightboxIdx(null)}
        >
          {/* Close */}
          <button onClick={() => setLightboxIdx(null)}
            style={{ position:"absolute", top:24, right:28, background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:"1rem", letterSpacing:"0.15em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:8, transition:"color 0.3s" }}
            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
            <span style={{ fontSize:"0.55rem" }}>ESC</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div style={{ position:"absolute", top:28, left:"50%", transform:"translateX(-50%)", color:"#555", fontSize:"0.58rem", letterSpacing:"0.3em" }}>
            {lightboxIdx+1} / {galleryPhotos.length}
          </div>

          {/* Prev */}
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i!)-1+galleryPhotos.length) % galleryPhotos.length); }}
            style={{ position:"absolute", left:24, top:"50%", transform:"translateY(-50%)", background:"none", border:`1px solid #222`, color:"#888", cursor:"pointer", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=GOLD; e.currentTarget.style.color=GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#222"; e.currentTarget.style.color="#888"; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ animation:"lightboxImgIn 0.35s cubic-bezier(0.16,1,0.3,1)" }} key={lightboxIdx}>
            <Image src={`/images/${galleryPhotos[lightboxIdx]}`} alt="" width={1200} height={1600}
              style={{ maxWidth:"82vw", maxHeight:"85vh", width:"auto", height:"auto", objectFit:"contain", display:"block" }} />
          </div>

          {/* Next */}
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i!)+1) % galleryPhotos.length); }}
            style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", background:"none", border:`1px solid #222`, color:"#888", cursor:"pointer", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=GOLD; e.currentTarget.style.color=GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#222"; e.currentTarget.style.color="#888"; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail strip */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, display:"flex", justifyContent:"center", padding:"1rem", gap:4, overflowX:"auto" }}>
            {galleryPhotos.map((p, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                style={{ width:40, height:28, flexShrink:0, overflow:"hidden", cursor:"pointer", opacity:i===lightboxIdx?1:0.35, border:i===lightboxIdx?`1px solid ${GOLD}`:"1px solid transparent", transition:"all 0.3s" }}>
                <Image src={`/images/${p}`} alt="" width={80} height={60} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Global CSS ── */}
      <style>{`
        /* Lang transition */
        .lang-out { animation: langOut 0.26s cubic-bezier(0.4,0,1,1) forwards; }
        .lang-in  { animation: langIn  0.55s cubic-bezier(0,0,0.2,1) forwards; }
        @keyframes langOut {
          to { opacity: 0; filter: blur(6px); transform: translateY(-4px); }
        }
        @keyframes langIn {
          from { opacity: 0; filter: blur(6px); transform: translateY(6px); }
          to   { opacity: 1; filter: blur(0);   transform: translateY(0);   }
        }

        /* Scroll reveal */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.1s; }
        [data-reveal][data-d="2"] { transition-delay: 0.22s; }
        [data-reveal][data-d="3"] { transition-delay: 0.34s; }
        [data-reveal][data-d="4"] { transition-delay: 0.46s; }

        /* Hero entrance */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Lightbox */
        @keyframes lightboxBgIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightboxImgIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }

        /* Scroll arrow pulse */
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(6px); }
        }

        /* Spinner */
        .spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 1.5px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #mobile-btn  { display: block !important; }
        }
        @media (min-width: 769px) {
          #desktop-nav { display: flex !important; }
          #mobile-btn  { display: none !important; }
        }

        /* Service card hover accent lines */
        div:hover > .card-accent-top  { width: 100% !important; }
        div:hover > .card-accent-left { height: 100% !important; }

        /* Input date color fix */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.4);
        }

        /* Gallery thumbnail scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>
    </>
  );
}
