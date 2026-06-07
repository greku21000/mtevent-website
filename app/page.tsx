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
const SECTIONS = ["hero","services","gallery","about","testimonials","contact"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [langPhase, setLangPhase] = useState<"idle"|"out"|"in">("idle");
  const [heroIdx, setHeroIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number|null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statValues, setStatValues] = useState([0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);
  const GALLERY_PREVIEW = 12;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [formState, setFormState] = useState({
    name:"", email:"", phone:"", event_type:"", event_date:"", guest_count:"", venue:"", message:"",
  });
  const [formStatus, setFormStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const langTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // ── Language fade transition ──
  const switchLang = useCallback((newLang: Lang) => {
    if (newLang === lang || langPhase !== "idle") return;
    clearTimeout(langTimer.current);
    setLangPhase("out");
    langTimer.current = setTimeout(() => {
      setLang(newLang);
      setLangPhase("in");
      langTimer.current = setTimeout(() => setLangPhase("idle"), 750);
    }, 320);
  }, [lang, langPhase]);

  // ── Scroll: navbar opacity + progress bar + banner parallax ──
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sy = window.scrollY;
        setScrolled(sy > 60);
        const total = document.body.scrollHeight - window.innerHeight;
        setScrollProgress(total > 0 ? sy / total : 0);

        // Parallax: banner image moves 25% of the section's scroll velocity
        if (bannerRef.current && bannerImgRef.current) {
          const rect = bannerRef.current.getBoundingClientRect();
          const vh = window.innerHeight;
          if (rect.bottom > 0 && rect.top < vh) {
            const progress = (vh - rect.top) / (vh + rect.height);
            const translate = (progress - 0.5) * 120; // -60 .. +60 px
            bannerImgRef.current.style.transform = `translate3d(0, ${translate}px, 0) scale(1.15)`;
          }
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ── Dove cursor follower (desktop only) ──
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const wrap = document.createElement("div");
    wrap.className = "mt-dove";
    wrap.innerHTML = `
      <svg viewBox="0 0 64 64" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stop-color="#f5f0e8"/>
            <stop offset="60%" stop-color="#e8d5a3"/>
            <stop offset="100%" stop-color="#c9a84c"/>
          </linearGradient>
        </defs>
        <path d="M44 14c4 0 8 2 10 6-3-1-6-1-8 0 3 2 5 5 6 9-3-1-6 0-8 2 1 4-1 8-4 11-3 3-7 4-11 4-3 0-6-1-9-3-3-2-5-5-6-9-1-3-1-7 0-10 2-5 6-9 11-11l1-1c2-1 5-2 7-2 4 0 8 1 11 4z" fill="url(#dgrad)"/>
        <path d="M28 30c-3-1-6-1-9 1-2 1-4 3-5 5 4 1 8 1 12-1 3-2 5-4 6-7l-4 2z" fill="rgba(10,10,10,0.18)"/>
        <circle cx="46" cy="22" r="1.4" fill="#0a0a0a"/>
        <path d="M52 22c2-1 4-1 6 0-2 1-4 2-6 1z" fill="#c9a84c"/>
      </svg>`;
    document.body.appendChild(wrap);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let prevX = mx, prevY = my;
    let rafId = 0;

    const tick = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      const dx = cx - prevX;
      const dy = cy - prevY;
      // gentle rotation toward movement direction (capped for elegance)
      const tilt = Math.max(-18, Math.min(18, dx * 1.6));
      const bob = Math.sin(performance.now() / 600) * 1.2;
      wrap.style.transform = `translate3d(${cx - 19}px, ${cy - 19 + bob}px, 0) rotate(${tilt}deg)`;
      prevX = cx; prevY = cy;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("button, a, input, textarea, select")) {
        wrap.classList.add("mt-dove--hover");
      } else {
        wrap.classList.remove("mt-dove--hover");
      }
    };
    const onDown = () => wrap.classList.add("mt-dove--down");
    const onUp   = () => wrap.classList.remove("mt-dove--down");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      wrap.remove();
    };
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

  // ── Testimonials autoplay ──
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(i => (i+1) % 3), 6000);
    return () => clearInterval(id);
  }, []);

  // ── Animated counter when stats enter viewport ──
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsAnimated) {
        setStatsAnimated(true);
        const targets = [150, 12, 5];
        const duration = 1800;
        const start = performance.now();
        const step = () => {
          const now = performance.now();
          const p = Math.min((now - start) / duration, 1);
          // ease-out cubic
          const ease = 1 - Math.pow(1 - p, 3);
          setStatValues(targets.map(t => Math.round(t * ease)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [statsAnimated]);

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
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 96;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;

    let target: number;
    if (id === "hero") {
      target = 0;
    } else if (id === "contact") {
      // Land so the Send Inquiry button is comfortably in view.
      const sectionH = el.offsetHeight;
      const viewportH = window.innerHeight;
      // Show the bottom of the form with ~80px footer peek.
      const fitBottom = sectionTop + sectionH - viewportH + 80;
      const fitTop = sectionTop - navOffset;
      target = Math.max(fitTop, fitBottom);
    } else {
      target = sectionTop - navOffset;
    }
    window.scrollTo({ top: target, behavior: "smooth" });
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

  // ── NAV BUTTON (glass pill style) ──
  const NavBtn = ({ id, label }: { id: string; label: string }) => {
    const active = activeSection === id;
    return (
      <button onClick={() => scrollTo(id)} style={{
        background: "none", border: "none", cursor: "pointer",
        color: active ? "#f5f0e8" : "rgba(255,255,255,0.55)",
        fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase",
        fontWeight: 500,
        transition: "color 0.35s ease",
        position: "relative", padding: "6px 2px",
      }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#f5f0e8"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
      >
        {label}
        {/* gold dot indicator */}
        <span style={{
          position: "absolute",
          bottom: -2, left: "50%",
          width: 3, height: 3, borderRadius: "50%",
          background: GOLD,
          transform: `translateX(-50%) scale(${active ? 1 : 0})`,
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 0 8px ${GOLD}`,
        }} />
      </button>
    );
  };

  return (
    <>
      {/* ── FLOATING GLASS PILL NAVBAR ── */}
      <div style={{
        position: "fixed",
        top: scrolled ? 16 : 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "calc(100% - 24px)",
        maxWidth: 920,
        transition: "top 0.6s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none",
      }}>
        <nav
          aria-label="Primary"
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            padding: "10px 14px 10px 22px",
            borderRadius: 999,
            background: scrolled
              ? "rgba(14, 14, 16, 0.72)"
              : "rgba(20, 20, 22, 0.42)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: scrolled
              ? "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 14px 44px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            transition: "background 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease",
            position: "relative",
            overflow: "hidden",
          }}>
          {/* subtle gold scroll progress baked into the pill */}
          <div style={{
            position: "absolute", bottom: 0, left: 16, right: 16, height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD} 50%, transparent)`,
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "left",
            transition: "transform 0.15s linear",
            opacity: 0.7,
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <button onClick={() => scrollTo("hero")} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 1, paddingRight: 12,
          }}>
            <span style={{ color: GOLD, fontFamily: "var(--font-display), serif", fontSize: "1.05rem", letterSpacing: "0.25em", fontWeight: 400, lineHeight: 1 }}>MT</span>
            <span style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.42rem", letterSpacing: "0.42em", textTransform: "uppercase", fontWeight: 500 }}>Event &amp; Wedding</span>
          </button>

          {/* Desktop nav links */}
          <div id="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1.6rem", paddingLeft: 4 }}>
            {navItems.map(({ key, label }) => <NavBtn key={key} id={key} label={label} />)}
          </div>

          {/* Right cluster: lang + mobile */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Lang segmented control */}
            <div style={{
              display: "flex",
              position: "relative",
              padding: 3,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 999,
            }}>
              {/* Sliding gold pill indicator */}
              <span style={{
                position: "absolute",
                top: 3,
                bottom: 3,
                width: "calc(50% - 3px)",
                left: lang === "en" ? 3 : "calc(50%)",
                background: `linear-gradient(180deg, ${GOLD}, #b8964a)`,
                borderRadius: 999,
                transition: "left 0.5s cubic-bezier(0.7, 0, 0.2, 1)",
                boxShadow: "0 2px 10px rgba(201,168,76,0.35)",
                pointerEvents: "none",
              }} />
              {(["en", "it"] as Lang[]).map(l => (
                <button key={l} onClick={() => switchLang(l)}
                  style={{
                    position: "relative", zIndex: 1,
                    background: "transparent", border: "none",
                    color: lang === l ? "#0a0a0a" : "rgba(255,255,255,0.55)",
                    padding: "4px 12px",
                    fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
                    cursor: "pointer", fontWeight: 600,
                    transition: "color 0.4s ease",
                    minWidth: 32,
                  }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Mobile btn */}
            <button id="mobile-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu"
              style={{
                display: "none",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 999,
                cursor: "pointer", color: "#e8d5a3",
                width: 36, height: 36,
                alignItems: "center", justifyContent: "center",
                transition: "background 0.3s",
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu — also glass */}
        <div style={{
          pointerEvents: menuOpen ? "auto" : "none",
          overflow: "hidden",
          marginTop: 10,
          maxHeight: menuOpen ? 480 : 0,
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          background: "rgba(14, 14, 16, 0.78)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}>
          <div style={{ padding: "1rem 1.5rem 1.25rem" }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => scrollTo(key)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  width: "100%", padding: "0.85rem 0",
                  background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                  color: activeSection === key ? GOLD : "rgba(255,255,255,0.7)",
                  fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
                  cursor: "pointer", transition: "color 0.3s",
                }}>
                <span>{label}</span>
                {activeSection === key && <span style={{ color: GOLD, fontSize: "0.6rem" }}>—</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

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
              Italy · {lang === "en" ? "Est. 2025" : "Dal 2025"}
            </p>
            <h1 key={`h-${lang}`} className="hero-headline" style={{ color: "#f5f0e8", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              {t.hero.tagline.split(" ").map((word, i) => (
                <span key={i} className="word-wrap">
                  <span className="word-inner" style={{ animationDelay: `${0.4 + i * 0.14}s` }}>{word}&nbsp;</span>
                </span>
              ))}
            </h1>
            <div style={{ width: 50, height: 1, background: GOLD, margin: "0 auto 2rem", animation: "heroFadeUp 1.2s 0.6s both" }} />
            <p style={{ color: "#bbb", fontSize: "clamp(0.8rem, 2vw, 1rem)", letterSpacing: "0.22em", fontWeight: 300, marginBottom: "3.5rem", animation: "heroFadeUp 1.2s 0.7s both" }}>
              {t.hero.sub}
            </p>
            <div style={{ animation: "heroFadeUp 1.2s 0.9s both", display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("contact")} className="btn-primary">
                {t.hero.cta}
              </button>
              <button onClick={() => scrollTo("gallery")} className="btn-ghost">
                {lang === "en" ? "View Portfolio" : "Vedi Portfolio"}
              </button>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 10 }}>
            {heroPhotos.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} aria-label={`Slide ${i+1}`}
                style={{ width: i === heroIdx ? 28 : 8, height: 8, background: i === heroIdx ? GOLD : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", padding: 0, borderRadius: 999 }} />
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {t.services.items.map((item, i) => (
              <div key={i} data-reveal data-d={String(i)} className="service-card">
                <div className="service-icon" style={{ color: GOLD }}>
                  {["◇", "◈", "✦", "◉"][i]}
                </div>
                <h3 style={{ color: "#eee", fontSize: "0.95rem", fontWeight: 500, letterSpacing: "0.14em", marginBottom: "1.1rem", textTransform: "uppercase" }}>{item.title}</h3>
                <div className="service-divider" style={{ background: GOLD }} />
                <p style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.9, fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FULLWIDTH BANNER (parallax + soft fade edges) ── */}
        <div ref={bannerRef} className="banner-wrap" style={{ position: "relative", height: 560, overflow: "hidden" }}>
          <div ref={bannerImgRef} style={{ position: "absolute", inset: "-15% 0", willChange: "transform" }}>
            <Image src="/images/photo_10_2026-05-16_14-37-06.jpg" alt="Ceremony" fill style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          </div>

          {/* Horizontal cinematic vignette */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.32) 50%, rgba(10,10,10,0.78) 100%)" }} />
          {/* Top fade into the dark page background */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, background: "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.6) 50%, transparent 100%)", pointerEvents: "none" }} />
          {/* Bottom fade into the dark page background */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 50%, transparent 100%)", pointerEvents: "none" }} />

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.25rem", zIndex: 3, padding: "0 1.5rem" }}>
            <p data-reveal style={{ color: "#e8d5a3", fontSize: "0.7rem", letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 500, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
              {lang === "en" ? "Destination Weddings" : "Destination Wedding"}
            </p>
            <h2 data-reveal data-d="1" style={{ color: "#fff", fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)", fontWeight: 400, letterSpacing: "0.06em", textAlign: "center", textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>
              {lang === "en" ? "Italy, Beyond Compare" : "Italia, Senza Paragoni"}
            </h2>
            <div data-reveal data-d="2" style={{ width: 50, height: 1, background: GOLD, boxShadow: "0 0 12px rgba(201,168,76,0.6)" }} />
            <button data-reveal data-d="3" onClick={() => scrollTo("contact")} className="btn-ghost-gold" style={{ marginTop: "0.5rem", backdropFilter: "blur(16px)", background: "rgba(20,18,12,0.5)" }}>
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
          <div style={{ position: "relative" }}>
            <div style={{ columns: "280px", columnGap: "10px" }}>
              {(galleryExpanded ? galleryPhotos : galleryPhotos.slice(0, GALLERY_PREVIEW)).map((photo, i) => (
                <div key={i} onClick={() => setLightboxIdx(i)} className="gallery-tile"
                  style={{ marginBottom: "10px", overflow: "hidden", cursor: "zoom-in", breakInside: "avoid", position: "relative", background: "#111", borderRadius: 16 }}>
                  <Image src={`/images/${photo}`} alt={`Portfolio ${i+1}`} width={600} height={800}
                    style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease", filter: "brightness(0.92)" }} />
                  <div className="gallery-overlay">
                    <span style={{ color: "rgba(201,168,76,0.85)", fontSize: "0.55rem", letterSpacing: "0.22em", fontWeight: 500 }}>VIEW</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fade + View More overlay (when collapsed) */}
            {!galleryExpanded && galleryPhotos.length > GALLERY_PREVIEW && (
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                height: 360,
                background: `linear-gradient(to bottom, transparent 0%, ${DARK} 65%)`,
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                paddingBottom: "1.5rem",
                pointerEvents: "none",
              }}>
                <button onClick={() => setGalleryExpanded(true)} className="btn-primary" style={{ pointerEvents: "auto" }}>
                  {lang === "en"
                    ? `Show More · ${galleryPhotos.length - GALLERY_PREVIEW}+ photos`
                    : `Mostra altre · ${galleryPhotos.length - GALLERY_PREVIEW}+ foto`}
                </button>
              </div>
            )}

            {/* Collapse button (when expanded) */}
            {galleryExpanded && (
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button onClick={() => { setGalleryExpanded(false); scrollTo("gallery"); }} className="btn-ghost">
                  {lang === "en" ? "Show Less" : "Mostra meno"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ background: DARK2, padding: "9rem 2rem", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "6rem", alignItems: "center" }}>
            <div data-reveal style={{ position: "relative", height: 600 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: "14%", bottom: "14%", overflow: "hidden", borderRadius: 20 }}>
                <Image src="/images/photo_20_2026-05-16_14-37-06.jpg" alt="Planner" fill style={{ objectFit: "cover", transition: "transform 0.8s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "46%", height: "50%", overflow: "hidden", outline: `4px solid ${DARK2}`, outlineOffset: -4, borderRadius: 16 }}>
                <Image src="/images/photo_30_2026-05-16_14-37-06.jpg" alt="Detail" fill style={{ objectFit: "cover" }} />
              </div>
              {/* Decorative gold frame */}
              <div style={{ position: "absolute", bottom: "12%", right: "12%", width: "55%", height: "60%", border: `1px solid rgba(201,168,76,0.2)`, pointerEvents: "none", transform: "translate(12px, 12px)", borderRadius: 16 }} />
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
              <div ref={statsRef} data-reveal data-d="4" style={{ display: "flex", gap: "3rem", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${BORDER}` }}>
                {[
                  { val: statValues[0], suffix: "+", label: t.about.stat1 },
                  { val: statValues[1], suffix: "",  label: t.about.stat2 },
                  { val: statValues[2], suffix: "+", label: t.about.stat3 },
                ].map((s,i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ color: GOLD, fontSize: "2.4rem", fontWeight: 300, lineHeight: 1, fontFamily: "var(--font-display), serif", fontVariantNumeric: "tabular-nums" }}>
                      {s.val}{s.suffix}
                    </div>
                    <div style={{ color: "#555", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", marginTop: 10, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS (editorial style — inspired by 21st.dev) ── */}
        <section id="testimonials" style={{ padding: "9rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p data-reveal style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
              {t.testimonials.kicker}
            </p>
            <h2 data-reveal data-d="1" style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>
              {t.testimonials.title}
            </h2>
            <div data-reveal data-d="2" style={{ width: 50, height: 1, background: GOLD, margin: "1.75rem auto 0" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 200px) 1fr", gap: "clamp(1rem, 4vw, 3rem)", alignItems: "flex-start" }}>
            {/* Giant index number */}
            <div style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(7rem, 16vw, 14rem)",
              fontWeight: 300,
              lineHeight: 0.8,
              color: "rgba(201, 168, 76, 0.12)",
              fontVariantNumeric: "tabular-nums",
              transition: "all 0.6s var(--ease-out)",
              userSelect: "none",
            }}>
              {String(testimonialIdx + 1).padStart(2, "0")}
            </div>

            {/* Quote + author */}
            <div style={{ paddingTop: "1.5rem", minHeight: 260 }}>
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none" style={{ marginBottom: "1.5rem", opacity: 0.4 }}>
                <path d="M0 16C0 7 5 0 14 0v6c-4 0-7 4-7 8h7v14H0V16zm22 0c0-9 5-16 14-16v6c-4 0-7 4-7 8h7v14H22V16z" fill="#c9a84c"/>
              </svg>

              <div key={`q-${testimonialIdx}-${lang}`} className="testimonial-fade">
                <blockquote style={{
                  color: "#f5f0e8",
                  fontFamily: "var(--font-display), serif",
                  fontSize: "clamp(1.4rem, 3vw, 2.1rem)",
                  fontWeight: 300,
                  lineHeight: 1.4,
                  letterSpacing: "0.005em",
                  fontStyle: "italic",
                  marginBottom: "2.5rem",
                }}>
                  &ldquo;{t.testimonials.items[testimonialIdx].quote}&rdquo;
                </blockquote>

                <div>
                  <div style={{ color: GOLD, fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
                    {t.testimonials.items[testimonialIdx].author}
                  </div>
                  <div style={{ color: "#666", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {t.testimonials.items[testimonialIdx].location}
                  </div>
                </div>
              </div>

              {/* Navigation — animated line selectors */}
              <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {t.testimonials.items.map((_, i) => (
                      <button key={i} onClick={() => setTestimonialIdx(i)} aria-label={`Testimonial ${i+1}`}
                        style={{ background: "none", border: "none", padding: "10px 0", cursor: "pointer" }}>
                        <span style={{
                          display: "block", height: 1,
                          width: i === testimonialIdx ? 48 : 20,
                          background: i === testimonialIdx ? GOLD : "rgba(255,255,255,0.2)",
                          transition: "all 0.5s var(--ease-out)",
                        }} />
                      </button>
                    ))}
                  </div>
                  <span style={{ color: "#555", fontSize: "0.6rem", letterSpacing: "0.3em" }}>
                    {String(testimonialIdx + 1).padStart(2, "0")} / {String(t.testimonials.items.length).padStart(2, "0")}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setTestimonialIdx(i => (i - 1 + t.testimonials.items.length) % t.testimonials.items.length)}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#888"; }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={() => setTestimonialIdx(i => (i + 1) % t.testimonials.items.length)}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#888"; }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
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
            <div data-reveal style={{ textAlign: "center", padding: "5rem 2rem", border: `1px solid rgba(201,168,76,0.4)`, background: "rgba(201,168,76,0.03)", borderRadius: 24, backdropFilter: "blur(8px)" }}>
              <div style={{ width: 56, height: 56, border: `1px solid ${GOLD}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "1.3rem", color: GOLD }}>✓</div>
              <p style={{ color: GOLD, fontSize: "1rem", letterSpacing: "0.1em", fontWeight: 300 }}>{t.contact.success}</p>
              <button onClick={() => setFormStatus("idle")} className="btn-ghost" style={{ marginTop: "2rem" }}>
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
                <button type="submit" disabled={formStatus === "loading"} className="btn-primary btn-primary--lg" style={{ opacity: formStatus === "loading" ? 0.7 : 1, cursor: formStatus === "loading" ? "not-allowed" : "pointer" }}>
                  {formStatus === "loading"
                    ? <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><span className="spinner" />{lang === "en" ? "Sending" : "Invio"}</span>
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
                <button onClick={() => scrollTo("contact")} className="btn-ghost btn-ghost--sm" style={{ marginTop: "1.25rem" }}>
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
            style={{ position:"absolute", left:24, top:"50%", transform:"translateY(-50%)", background:"rgba(20,20,22,0.6)", border:`1px solid rgba(255,255,255,0.1)`, color:"#aaa", cursor:"pointer", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s", borderRadius:999, backdropFilter:"blur(12px)" }}
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
            style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", background:"rgba(20,20,22,0.6)", border:`1px solid rgba(255,255,255,0.1)`, color:"#aaa", cursor:"pointer", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s", borderRadius:999, backdropFilter:"blur(12px)" }}
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
                style={{ width:42, height:30, flexShrink:0, overflow:"hidden", cursor:"pointer", opacity:i===lightboxIdx?1:0.35, border:i===lightboxIdx?`1px solid ${GOLD}`:"1px solid transparent", transition:"all 0.3s", borderRadius:6 }}>
                <Image src={`/images/${p}`} alt="" width={80} height={60} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Global CSS ── */}
      <style>{`
        /* Language transition — staggered fade + soft blur */
        .lang-out { animation: langOut 0.32s cubic-bezier(0.4, 0, 1, 1) forwards; }
        .lang-in  { animation: langIn  0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes langOut {
          0%   { opacity: 1; filter: blur(0);    transform: translateY(0)    scale(1); }
          100% { opacity: 0; filter: blur(8px);  transform: translateY(-6px) scale(0.994); }
        }
        @keyframes langIn {
          0%   { opacity: 0; filter: blur(10px); transform: translateY(10px) scale(1.006); }
          60%  { opacity: 1;                                                                }
          100% { opacity: 1; filter: blur(0);    transform: translateY(0)    scale(1);     }
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
        @media (max-width: 880px) {
          #desktop-nav { display: none !important; }
          #mobile-btn  { display: flex !important; }
        }
        @media (min-width: 881px) {
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
