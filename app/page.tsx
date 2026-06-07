"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { translations, type Lang } from "@/lib/i18n";

const allPhotos = Array.from({ length: 54 }, (_, i) => `photo_${i + 1}_2026-05-16_14-37-06.jpg`);
const heroPhotos = ["photo_1_2026-05-16_14-37-06.jpg","photo_10_2026-05-16_14-37-06.jpg","photo_20_2026-05-16_14-37-06.jpg","photo_30_2026-05-16_14-37-06.jpg","photo_40_2026-05-16_14-37-06.jpg"];

const SECTIONS = ["hero", "services", "portfolio", "about", "testimonials", "contact"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [langPhase, setLangPhase] = useState<"idle" | "out" | "in">("idle");
  const [heroIdx, setHeroIdx] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", event_type: "", event_date: "", guest_count: "", venue: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statValues, setStatValues] = useState([0, 0, 0]);
  const [time, setTime] = useState("");

  const langTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // ── Page-load intro ──
  useEffect(() => {
    const id = setTimeout(() => setIntroDone(true), 1600);
    return () => clearTimeout(id);
  }, []);

  // ── Italian time ticker (editorial detail) ──
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome", hour12: false });
      setTime(`Rome · ${fmt.format(d)}`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // ── Language transition ──
  const switchLang = useCallback((newLang: Lang) => {
    if (newLang === lang || langPhase !== "idle") return;
    clearTimeout(langTimer.current);
    setLangPhase("out");
    langTimer.current = setTimeout(() => {
      setLang(newLang);
      setLangPhase("in");
      langTimer.current = setTimeout(() => setLangPhase("idle"), 750);
    }, 340);
  }, [lang, langPhase]);

  // ── Hero slideshow + Ken Burns ──
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % heroPhotos.length), 5500);
    return () => clearInterval(id);
  }, []);

  // ── Hero parallax ──
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (heroImgRef.current) {
          const y = window.scrollY * 0.4;
          heroImgRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  // ── Active section tracker ──
  useEffect(() => {
    const obs = SECTIONS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id); }, { threshold: 0.35 });
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o?.disconnect());
  }, []);

  // ── Scroll reveal ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-in"); }),
      { threshold: 0.1, rootMargin: "0px 0px -64px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  // ── Stats counter ──
  useEffect(() => {
    if (!statsRef.current) return;
    let animated = false;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) {
        animated = true;
        const targets = [150, 12, 5];
        const dur = 1800;
        const start = performance.now();
        const step = () => {
          const p = Math.min((performance.now() - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setStatValues(targets.map(t => Math.round(t * eased)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    o.observe(statsRef.current);
    return () => o.disconnect();
  }, []);

  // ── Mouse orb + custom cursor ──
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const orb = document.createElement("div");
    const cur = document.createElement("div");
    orb.className = "mouse-orb";
    cur.className = "ed-cursor";
    document.body.appendChild(orb);
    document.body.appendChild(cur);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let ox = mx, oy = my;
    let raf = 0;
    const tick = () => {
      ox += (mx - ox) * 0.08;
      oy += (my - oy) * 0.08;
      orb.style.transform = `translate(${ox}px, ${oy}px) translate(-50%, -50%)`;
      cur.style.transform = `translate(${mx}px, ${my}px)`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, textarea, select, .pf-card, .h-card")) {
        cur.classList.add("ed-cursor--hover");
      } else {
        cur.classList.remove("ed-cursor--hover");
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); orb.remove(); cur.remove(); };
  }, []);

  // ── Testimonials autoplay ──
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(i => (i + 1) % 3), 7000);
    return () => clearInterval(id);
  }, []);

  // ── Lightbox keyboard ──
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") setLightboxIdx(i => ((i!) + 1) % allPhotos.length);
      if (e.key === "ArrowLeft") setLightboxIdx(i => ((i!) - 1 + allPhotos.length) % allPhotos.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxIdx]);
  useEffect(() => { document.body.style.overflow = lightboxIdx !== null ? "hidden" : ""; }, [lightboxIdx]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 96;
    if (id === "hero") { window.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (id === "contact") {
      const sTop = el.getBoundingClientRect().top + window.scrollY;
      const sH = el.offsetHeight, vH = window.innerHeight;
      const target = Math.max(sTop - offset, sTop + sH - vH + 80);
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
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
      if (res.ok) setFormState({ name: "", email: "", phone: "", event_type: "", event_date: "", guest_count: "", venue: "", message: "" });
    } catch { setFormStatus("error"); }
  };

  const navItems = [
    { key: "services", label: t.nav.services, num: "01" },
    { key: "portfolio", label: t.nav.gallery, num: "02" },
    { key: "about", label: t.nav.about, num: "03" },
    { key: "contact", label: t.nav.contact, num: "04" },
  ];

  const contentCls = langPhase === "out" ? "lang-out" : langPhase === "in" ? "lang-in" : "";

  return (
    <>
      {/* ── PAGE-LOAD INTRO CURTAIN ── */}
      <div className={`intro-curtain ${introDone ? "intro-done" : ""}`} aria-hidden="true">
        <div className="intro-half intro-half--left" />
        <div className="intro-half intro-half--right" />
      </div>
      <div className={`intro-logo ${introDone ? "intro-done" : ""}`} aria-hidden="true">
        <div style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 400, letterSpacing: "0.06em", lineHeight: 1 }}>M·T</div>
        <div style={{ fontSize: "0.55rem", letterSpacing: "0.5em", marginTop: 8, color: "rgba(245,241,234,0.6)" }}>EVENT &amp; WEDDING</div>
      </div>

      {/* ── EDITORIAL HEADER ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(245, 241, 234, 0.86)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "1px solid var(--ink)",
      }}>
        {/* Top mini-strip */}
        <div style={{ borderBottom: "1px solid var(--ink)", padding: "6px 0", fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase" }}>
          <div className="container-ed" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span>No. 001 — {lang === "en" ? "Volume MMXXVI" : "Volume MMXXVI"}</span>
            <span style={{ textAlign: "center", flex: 1, minWidth: 0 }}>{lang === "en" ? "Editorial Wedding Planning · Italy" : "Wedding Planning Editoriale · Italia"}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="container-ed" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display), serif", fontSize: "1.6rem", fontWeight: 500, letterSpacing: "0.02em", lineHeight: 1 }}>M·T</span>
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Event &amp; Wedding</span>
          </button>

          {/* Desktop nav */}
          <div id="desk-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {navItems.map(({ key, label, num }) => (
              <button key={key} onClick={() => scrollTo(key)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 500,
                  color: activeSection === key ? "var(--ink)" : "var(--ink-muted)",
                  transition: "color 0.3s",
                  display: "flex", alignItems: "baseline", gap: 6,
                }}>
                <span style={{ color: activeSection === key ? "var(--gold)" : "var(--ink-muted)", fontSize: "0.55rem", fontFamily: "var(--font-display), serif", fontStyle: "italic" }}>{num}</span>
                {label}
              </button>
            ))}
            <div style={{ display: "flex", borderLeft: "1px solid var(--ink)", paddingLeft: "1.5rem", gap: 12 }}>
              {(["en", "it"] as Lang[]).map(l => (
                <button key={l} onClick={() => switchLang(l)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                    color: lang === l ? "var(--ink)" : "var(--ink-muted)",
                    fontWeight: lang === l ? 700 : 400,
                    borderBottom: lang === l ? "1px solid var(--gold)" : "1px solid transparent",
                    paddingBottom: 2,
                    transition: "all 0.3s",
                  }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <button id="mob-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu"
            style={{ display: "none", background: "none", border: "1px solid var(--ink)", padding: "8px 12px", cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>

        {/* Mobile menu */}
        <div style={{ overflow: "hidden", maxHeight: menuOpen ? 500 : 0, transition: "max-height 0.5s var(--ease)", background: "var(--paper)", borderTop: menuOpen ? "1px solid var(--ink)" : "none" }}>
          <div style={{ padding: "1.5rem 1.5rem 2rem" }}>
            {navItems.map(({ key, label, num }) => (
              <button key={key} onClick={() => scrollTo(key)}
                style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "1rem 0", background: "none", border: "none", borderBottom: "1px solid var(--ink)", color: activeSection === key ? "var(--ink)" : "var(--ink-muted)", fontSize: "1.1rem", fontFamily: "var(--font-display), serif", cursor: "pointer", letterSpacing: "0.02em" }}>
                <span>{label}</span>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-muted)", fontStyle: "italic" }}>{num}</span>
              </button>
            ))}
            <div style={{ display: "flex", gap: 16, marginTop: "1.5rem", fontSize: "0.7rem", letterSpacing: "0.2em" }}>
              {(["en", "it"] as Lang[]).map(l => (
                <button key={l} onClick={() => { switchLang(l); setMenuOpen(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: lang === l ? "var(--ink)" : "var(--ink-muted)", textTransform: "uppercase", fontWeight: lang === l ? 700 : 400, borderBottom: lang === l ? "1px solid var(--gold)" : "1px solid transparent" }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT WRAPPER ── */}
      <div className={contentCls} style={{ position: "relative", zIndex: 2 }}>

        {/* ── HERO — editorial split layout ── */}
        <section id="hero" style={{ position: "relative", minHeight: "100vh", paddingTop: 110 }}>
          <div className="container-ed" style={{ paddingBottom: "4rem" }}>
            {/* Top kicker row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 0", borderBottom: "1px solid var(--ink)", marginBottom: "clamp(2rem, 6vw, 5rem)" }}>
              <div className="kicker">{lang === "en" ? "Italy · Est. MMXXV" : "Italia · Dal MMXXV"}</div>
              <div className="kicker" style={{ flexDirection: "row-reverse" }}>{lang === "en" ? "Booking 2026 — 2027" : "Prenotazioni 2026 — 2027"}</div>
            </div>

            {/* HUGE editorial headline */}
            <div style={{ position: "relative" }}>
              <h1 key={`h-${lang}`} className="display" style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(3.5rem, 13vw, 14rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                fontWeight: 500,
                display: "block",
              }}>
                {/* Line 1 */}
                <div style={{ display: "block", marginBottom: "0.15em" }}>
                  {(lang === "en" ? "Beyond" : "Oltre").split(" ").map((w, i) => (
                    <span key={i} className="word-w"><span className="word-i" style={{ animationDelay: `${1.6 + i * 0.12}s` }}>{w}&nbsp;</span></span>
                  ))}
                </div>
                {/* Line 2 — italic */}
                <div style={{ display: "block", marginBottom: "0.15em", fontStyle: "italic", color: "var(--ink-soft)" }}>
                  {(lang === "en" ? "Your" : "le tue").split(" ").map((w, i) => (
                    <span key={i} className="word-w"><span className="word-i" style={{ animationDelay: `${1.85 + i * 0.12}s` }}>{w}&nbsp;</span></span>
                  ))}
                </div>
                {/* Line 3 — with image inline */}
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.4em" }}>
                  {(lang === "en" ? "Expectations" : "aspettative").split("").map((char, i) => (
                    <span key={i} className="word-w" style={{ display: "inline-block" }}>
                      <span className="word-i" style={{ animationDelay: `${2.1 + i * 0.04}s`, display: "inline-block" }}>{char}</span>
                    </span>
                  ))}
                </div>
              </h1>

              {/* Floating image collage */}
              <div ref={heroImgRef} style={{ position: "absolute", top: "10%", right: "-2%", width: "clamp(180px, 22vw, 360px)", aspectRatio: "3/4", overflow: "hidden", pointerEvents: "none", willChange: "transform", animation: "wordIn 1.6s var(--ease) 1.4s both", animationFillMode: "both" }}>
                {heroPhotos.map((p, i) => (
                  <div key={p} style={{ position: "absolute", inset: 0, opacity: i === heroIdx ? 1 : 0, transition: "opacity 1.8s var(--ease)" }}>
                    <Image src={`/images/${p}`} alt="" fill style={{ objectFit: "cover", filter: "grayscale(0.15) contrast(1.05)" }} priority={i === 0} />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row — sub + CTA */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", marginTop: "clamp(3rem, 8vw, 6rem)", alignItems: "end" }}>
              <div data-reveal data-d="3" style={{ maxWidth: 480 }}>
                <p style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.55, fontStyle: "italic", color: "var(--ink-soft)" }}>
                  {lang === "en"
                    ? "An editorial atelier composing destination weddings, private celebrations and brand rituals across Italy's most poetic addresses."
                    : "Un atelier editoriale che compone matrimoni di destinazione, celebrazioni private e rituali di marca attraverso gli indirizzi più poetici d'Italia."}
                </p>
              </div>
              <div data-reveal data-d="4" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button onClick={() => scrollTo("contact")} className="btn-ink"><span>{t.hero.cta}</span></button>
                  <button onClick={() => scrollTo("portfolio")} className="btn-outline"><span>{lang === "en" ? "Portfolio" : "Portfolio"}</span></button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "0.5rem", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
                  <span style={{ width: 24, height: 1, background: "var(--ink-muted)", display: "inline-block" }} />
                  {lang === "en" ? "Scroll to begin" : "Scorri per iniziare"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="marq-strip" aria-hidden="true">
          <div className="marq-track">
            {Array.from({ length: 2 }).map((_, copy) => (
              <div key={copy} style={{ display: "flex" }}>
                {[
                  lang === "en" ? "Destination Weddings" : "Destination Wedding",
                  "Lago di Como",
                  lang === "en" ? "Beyond Your Expectations" : "Oltre le tue Aspettative",
                  "Venezia",
                  lang === "en" ? "Editorial Atelier" : "Atelier Editoriale",
                  "Toscana",
                  "Amalfi",
                  "MMXXVI",
                ].map((text, i) => (
                  <span key={`${copy}-${i}`} className="marq-item">
                    <span>{text}</span>
                    <span className="marq-dot" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── CHAPTER 01 — SERVICES ── */}
        <section id="services" style={{ padding: "clamp(5rem, 10vw, 8rem) 0", position: "relative" }}>
          <div className="container-ed">
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(1rem, 4vw, 3rem)", alignItems: "start", marginBottom: "5rem" }}>
              <div className="chapter-num">01</div>
              <div data-reveal style={{ paddingTop: "clamp(1rem, 3vw, 3rem)" }}>
                <div className="kicker" style={{ marginBottom: "1.5rem" }}>{lang === "en" ? "Chapter One" : "Capitolo Primo"}</div>
                <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1, fontWeight: 400, letterSpacing: "-0.01em" }}>
                  {t.services.title}
                </h2>
                <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-display), serif", fontStyle: "italic", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "var(--ink-soft)", maxWidth: 540, lineHeight: 1.5 }}>
                  {lang === "en"
                    ? "Four chapters of service, each crafted as a singular composition."
                    : "Quattro capitoli di servizio, ciascuno realizzato come una composizione singolare."}
                </p>
              </div>
            </div>

            <div className="full-rule" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {t.services.items.map((item, i) => (
                <div key={i} data-reveal data-d={String(i % 4)} className="svc-card" style={{ borderRight: i < t.services.items.length - 1 ? "1px solid var(--ink)" : "none", borderBottom: "1px solid var(--ink)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--gold)", fontWeight: 600 }}>0{i + 1}</span>
                    <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "var(--ink-muted)", textTransform: "uppercase" }}>{lang === "en" ? "Service" : "Servizio"}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(1.4rem, 2.4vw, 2rem)", lineHeight: 1.15, marginBottom: "1.25rem", fontWeight: 500 }}>{item.title}</h3>
                  <p style={{ color: "var(--ink-soft)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 360 }}>{item.desc}</p>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10, color: "var(--ink)" }}>
                    {lang === "en" ? "Inquire" : "Richiedi"}
                    <svg width="20" height="8" viewBox="0 0 20 8" fill="none"><path d="M1 4h17m0 0L14 1m4 3l-4 3" stroke="currentColor" strokeWidth="1"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHAPTER 02 — PORTFOLIO (horizontal scroll editorial) ── */}
        <section id="portfolio" style={{ padding: "clamp(5rem, 10vw, 8rem) 0 clamp(4rem, 8vw, 6rem)", background: "var(--ink)", color: "var(--paper)", position: "relative" }}>
          <div className="container-ed" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(1rem, 4vw, 3rem)", alignItems: "start" }}>
              <div className="chapter-num" style={{ WebkitTextStroke: "1px var(--paper)", color: "transparent" }}>02</div>
              <div data-reveal style={{ paddingTop: "clamp(1rem, 3vw, 3rem)", color: "var(--paper)" }}>
                <div className="kicker" style={{ color: "rgba(245,241,234,0.55)", marginBottom: "1.5rem" }}>{lang === "en" ? "Chapter Two" : "Capitolo Secondo"}</div>
                <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1, fontWeight: 400, color: "var(--paper)" }}>{t.gallery.title}</h2>
                <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-display), serif", fontStyle: "italic", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "rgba(245,241,234,0.7)", maxWidth: 540 }}>{t.gallery.sub}</p>
              </div>
            </div>
          </div>

          <div className="h-scroll-wrap">
            <div className="h-scroll-track">
              {allPhotos.slice(0, 18).map((p, i) => (
                <div key={i} className="h-card pf-card" onClick={() => setLightboxIdx(i)}>
                  <Image src={`/images/${p}`} alt={`Portfolio ${i + 1}`} width={500} height={700} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="pf-curtain">
                    <div className="pf-curtain-content">
                      <div style={{ fontSize: "0.55rem", letterSpacing: "0.4em", marginBottom: 8, color: "var(--gold-soft)" }}>N° {String(i + 1).padStart(3, "0")}</div>
                      <div style={{ fontFamily: "var(--font-display), serif", fontSize: "1.4rem", fontStyle: "italic" }}>{lang === "en" ? "View" : "Vedi"}</div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 16, left: 16, color: "var(--paper)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                    {String(i + 1).padStart(2, "0")} / {String(allPhotos.length).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container-ed" style={{ marginTop: "3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,241,234,0.55)" }}>
              {lang === "en" ? `Showing 18 of ${allPhotos.length} · drag to explore` : `Visualizzando 18 di ${allPhotos.length} · trascina per esplorare`}
            </p>
            <button onClick={() => setLightboxIdx(0)} className="btn-outline" style={{ borderColor: "var(--paper)", color: "var(--paper)" }}>
              <span>{lang === "en" ? "Open full gallery" : "Apri galleria completa"}</span>
            </button>
          </div>
        </section>

        {/* ── CHAPTER 03 — ABOUT (magazine spread) ── */}
        <section id="about" style={{ padding: "clamp(6rem, 12vw, 10rem) 0", position: "relative" }}>
          <div className="container-ed">
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(1rem, 4vw, 3rem)", alignItems: "start", marginBottom: "5rem" }}>
              <div className="chapter-num">03</div>
              <div data-reveal style={{ paddingTop: "clamp(1rem, 3vw, 3rem)" }}>
                <div className="kicker" style={{ marginBottom: "1.5rem" }}>{lang === "en" ? "Chapter Three" : "Capitolo Terzo"}</div>
                <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1, fontWeight: 400 }}>{lang === "en" ? "The Atelier" : "L'Atelier"}</h2>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "clamp(1rem, 3vw, 2.5rem)", alignItems: "start" }}>
              {/* Left: portrait + caption */}
              <div data-reveal style={{ gridColumn: "span 5", position: "relative" }} className="hide-mobile-col">
                <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
                  <Image src="/images/photo_20_2026-05-16_14-37-06.jpg" alt="Maria" fill style={{ objectFit: "cover", filter: "grayscale(0.2)" }} />
                </div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ink-muted)", display: "flex", justifyContent: "space-between" }}>
                  <span>Maria Tomash</span>
                  <span style={{ fontStyle: "italic", fontFamily: "var(--font-display), serif", textTransform: "none", letterSpacing: 0 }}>{lang === "en" ? "Creative Director" : "Direttrice Creativa"}</span>
                </p>
              </div>

              {/* Right: body + drop cap */}
              <div data-reveal data-d="1" style={{ gridColumn: "span 7" }} className="about-body">
                <p style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(1.1rem, 1.6vw, 1.45rem)", lineHeight: 1.55, color: "var(--ink-soft)", marginBottom: "1.5rem" }}>
                  <span style={{ float: "left", fontFamily: "var(--font-display), serif", fontSize: "5rem", lineHeight: 0.85, marginRight: "0.6rem", marginTop: "0.25rem", fontWeight: 600 }}>
                    {lang === "en" ? "W" : "S"}
                  </span>
                  {t.about.p1}
                </p>
                <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--ink-soft)", marginBottom: "1.5rem" }}>{t.about.p2}</p>
                <p style={{ fontFamily: "var(--font-display), serif", fontSize: "1.2rem", lineHeight: 1.5, color: "var(--gold)", fontStyle: "italic", paddingTop: "1.25rem", borderTop: "1px solid var(--ink)" }}>
                  &mdash; {t.about.p3}
                </p>

                {/* Animated stats */}
                <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--ink)" }}>
                  {[
                    { val: statValues[0], suffix: "+", label: t.about.stat1 },
                    { val: statValues[1], suffix: "",  label: t.about.stat2 },
                    { val: statValues[2], suffix: "+", label: t.about.stat3 },
                  ].map((s, i) => (
                    <div key={i} style={{ borderRight: i < 2 ? "1px solid rgba(15,14,12,0.15)" : "none", paddingRight: i < 2 ? "1rem" : 0 }}>
                      <div style={{ fontFamily: "var(--font-display), serif", fontSize: "clamp(2.6rem, 5vw, 3.6rem)", fontWeight: 500, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                        {s.val}{s.suffix}
                      </div>
                      <div style={{ marginTop: 8, fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ink-muted)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHAPTER 04 — TESTIMONIALS ── */}
        <section id="testimonials" style={{ padding: "clamp(5rem, 10vw, 8rem) 0", background: "var(--paper-dark)", position: "relative" }}>
          <div className="container-ed">
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <div className="kicker" data-reveal style={{ justifyContent: "center", marginBottom: "1.5rem" }}>{t.testimonials.kicker}</div>
              <h2 data-reveal data-d="1" style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)", lineHeight: 1, fontStyle: "italic", fontWeight: 400 }}>
                &ldquo;{t.testimonials.title}&rdquo;
              </h2>
            </div>

            <div key={`tst-${testimonialIdx}-${lang}`} className="testimonial-fade" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
              <blockquote style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.4rem, 3.2vw, 2.6rem)",
                lineHeight: 1.35,
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--ink)",
                marginBottom: "2.5rem",
              }}>
                &ldquo;{t.testimonials.items[testimonialIdx].quote}&rdquo;
              </blockquote>
              <div style={{ width: 60, height: 1, background: "var(--gold)", margin: "0 auto 1.5rem" }} />
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--ink)", marginBottom: 6, fontWeight: 600 }}>
                {t.testimonials.items[testimonialIdx].author}
              </div>
              <div style={{ fontFamily: "var(--font-display), serif", fontStyle: "italic", color: "var(--ink-muted)", fontSize: "0.95rem" }}>
                {t.testimonials.items[testimonialIdx].location}
              </div>
            </div>

            {/* Indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: "3.5rem", alignItems: "center" }}>
              <button onClick={() => setTestimonialIdx(i => (i - 1 + 3) % 3)} style={{ background: "none", border: "1px solid var(--ink)", padding: "10px 14px", cursor: "pointer", color: "var(--ink)" }} aria-label="Prev">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M13 5H1m0 0l4 4M1 5l4-4" stroke="currentColor" strokeWidth="1"/></svg>
              </button>
              {t.testimonials.items.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} aria-label={`Show ${i+1}`}
                  style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
                  <span style={{ display: "block", width: i === testimonialIdx ? 36 : 12, height: 1, background: i === testimonialIdx ? "var(--ink)" : "rgba(15,14,12,0.25)", transition: "all 0.5s var(--ease)" }} />
                </button>
              ))}
              <button onClick={() => setTestimonialIdx(i => (i + 1) % 3)} style={{ background: "none", border: "1px solid var(--ink)", padding: "10px 14px", cursor: "pointer", color: "var(--ink)" }} aria-label="Next">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* ── CONTACT — editorial form ── */}
        <section id="contact" style={{ padding: "clamp(5rem, 10vw, 8rem) 0", position: "relative" }}>
          <div className="container-ed" style={{ maxWidth: 1100 }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(1rem, 4vw, 3rem)", alignItems: "start", marginBottom: "4rem" }}>
              <div className="chapter-num">04</div>
              <div data-reveal style={{ paddingTop: "clamp(1rem, 3vw, 3rem)" }}>
                <div className="kicker" style={{ marginBottom: "1.5rem" }}>{lang === "en" ? "Final Chapter" : "Ultimo Capitolo"}</div>
                <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1, fontWeight: 400, marginBottom: "1.25rem" }}>{t.contact.title}</h2>
                <p style={{ fontFamily: "var(--font-display), serif", fontStyle: "italic", fontSize: "clamp(1rem, 1.4vw, 1.25rem)", color: "var(--ink-soft)", maxWidth: 540, lineHeight: 1.5 }}>{t.contact.sub}</p>
              </div>
            </div>

            {formStatus === "success" ? (
              <div data-reveal style={{ textAlign: "center", padding: "5rem 2rem", border: "1px solid var(--ink)" }}>
                <div style={{ fontFamily: "var(--font-display), serif", fontSize: "3rem", marginBottom: "1.5rem", color: "var(--gold)" }}>✓</div>
                <p style={{ fontFamily: "var(--font-display), serif", fontStyle: "italic", fontSize: "1.5rem", color: "var(--ink)" }}>{t.contact.success}</p>
                <button onClick={() => setFormStatus("idle")} className="btn-outline" style={{ marginTop: "2.5rem" }}>
                  <span>{lang === "en" ? "Send Another" : "Invia Altra"}</span>
                </button>
              </div>
            ) : (
              <form data-reveal onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem 2.5rem", marginBottom: "2rem" }}>
                  <div>
                    <label className="label-ed">{t.contact.name} *</label>
                    <input className="input-ed" type="text" required placeholder={t.contact.name} value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label-ed">{t.contact.email} *</label>
                    <input className="input-ed" type="email" required placeholder="email@example.com" value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label-ed">{t.contact.phone}</label>
                    <input className="input-ed" type="tel" placeholder="+39 000 000 0000" value={formState.phone} onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label-ed">{t.contact.eventType} *</label>
                    <select className="input-ed" required value={formState.event_type} onChange={e => setFormState(s => ({ ...s, event_type: e.target.value }))}>
                      <option value="">—</option>
                      {t.contact.eventTypes.map(et => <option key={et} value={et}>{et}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-ed">{t.contact.date}</label>
                    <input className="input-ed" type="date" value={formState.event_date} onChange={e => setFormState(s => ({ ...s, event_date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label-ed">{t.contact.guests}</label>
                    <input className="input-ed" type="number" min="1" placeholder="50" value={formState.guest_count} onChange={e => setFormState(s => ({ ...s, guest_count: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: "2rem" }}>
                  <label className="label-ed">{t.contact.venue}</label>
                  <input className="input-ed" placeholder="Lake Como, Venice, Tuscany..." value={formState.venue} onChange={e => setFormState(s => ({ ...s, venue: e.target.value }))} />
                </div>
                <div style={{ marginBottom: "3rem" }}>
                  <label className="label-ed">{t.contact.message}</label>
                  <textarea className="input-ed" rows={4} placeholder={t.contact.message} value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} />
                </div>
                {formStatus === "error" && <p style={{ color: "var(--accent)", marginBottom: "1.5rem", fontSize: "0.85rem" }}>{t.contact.error}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
                    {lang === "en" ? "We reply within 24 hours" : "Rispondiamo entro 24 ore"}
                  </p>
                  <button type="submit" disabled={formStatus === "loading"} className="btn-ink">
                    <span>{formStatus === "loading" ? (lang === "en" ? "Sending..." : "Invio...") : t.contact.submit}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── FOOTER — editorial colophon ── */}
        <footer style={{ background: "var(--ink)", color: "var(--paper)", padding: "5rem 0 2.5rem" }}>
          <div className="container-ed">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display), serif", fontSize: "2rem", fontWeight: 500, marginBottom: 6 }}>M·T</div>
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,241,234,0.5)", marginBottom: "1.5rem" }}>Event &amp; Wedding</div>
                <p style={{ fontFamily: "var(--font-display), serif", fontStyle: "italic", color: "rgba(245,241,234,0.6)", fontSize: "0.95rem", lineHeight: 1.6 }}>{t.footer.tagline}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold-soft)", marginBottom: "1.25rem" }}>Contact</p>
                {[{ href: `mailto:${t.footer.email}`, text: t.footer.email },
                  { href: "https://instagram.com/mteventwedding", text: t.footer.instagram }].map(l => (
                  <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    style={{ display: "block", color: "rgba(245,241,234,0.7)", fontSize: "0.92rem", textDecoration: "none", marginBottom: 8, transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-soft)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,241,234,0.7)")}>
                    {l.text}
                  </a>
                ))}
              </div>
              <div>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold-soft)", marginBottom: "1.25rem" }}>{lang === "en" ? "Index" : "Indice"}</p>
                {navItems.map(({ key, label, num }) => (
                  <button key={key} onClick={() => scrollTo(key)}
                    style={{ background: "none", border: "none", padding: 0, color: "rgba(245,241,234,0.7)", fontSize: "0.92rem", cursor: "pointer", display: "block", marginBottom: 8, fontFamily: "inherit", textAlign: "left", transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-soft)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,241,234,0.7)")}>
                    <span style={{ color: "rgba(245,241,234,0.4)", marginRight: 8, fontStyle: "italic", fontFamily: "var(--font-display), serif", fontSize: "0.7em" }}>{num}</span>
                    {label}
                  </button>
                ))}
              </div>
              <div>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--gold-soft)", marginBottom: "1.25rem" }}>{lang === "en" ? "Colophon" : "Colofone"}</p>
                <p style={{ color: "rgba(245,241,234,0.7)", fontSize: "0.85rem", lineHeight: 1.7, fontFamily: "var(--font-display), serif", fontStyle: "italic" }}>
                  Libre Bodoni · Public Sans<br />
                  {lang === "en" ? "Volume MMXXVI" : "Volume MMXXVI"}<br />
                  {lang === "en" ? "Composed in Italy" : "Composto in Italia"}
                </p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(245,241,234,0.15)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,241,234,0.4)" }}>
              <span>© {new Date().getFullYear()} MT Event &amp; Wedding</span>
              <span>{lang === "en" ? "All rights reserved." : "Tutti i diritti riservati."}</span>
              <span>{lang === "en" ? "Italy" : "Italia"}</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <div onClick={() => setLightboxIdx(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,14,12,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", animation: "fadeIn 0.3s ease" }}>
          <button onClick={() => setLightboxIdx(null)} style={{ position: "absolute", top: 24, right: 28, background: "none", border: "1px solid rgba(245,241,234,0.4)", color: "var(--paper)", cursor: "pointer", padding: "8px 14px", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Close · ESC
          </button>
          <div style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(245,241,234,0.55)", fontSize: "0.55rem", letterSpacing: "0.3em", fontVariantNumeric: "tabular-nums" }}>
            {String(lightboxIdx + 1).padStart(3, "0")} / {String(allPhotos.length).padStart(3, "0")}
          </div>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i!) - 1 + allPhotos.length) % allPhotos.length); }}
            style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "none", border: "1px solid rgba(245,241,234,0.3)", padding: 16, color: "var(--paper)", cursor: "pointer" }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M13 5H1m0 0l4 4M1 5l4-4" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
          <div onClick={e => e.stopPropagation()} key={lightboxIdx} style={{ animation: "lbIn 0.4s var(--ease)" }}>
            <Image src={`/images/${allPhotos[lightboxIdx]}`} alt="" width={1200} height={1600} style={{ maxWidth: "82vw", maxHeight: "82vh", width: "auto", height: "auto", objectFit: "contain" }} />
          </div>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i!) + 1) % allPhotos.length); }}
            style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "none", border: "1px solid rgba(245,241,234,0.3)", padding: 16, color: "var(--paper)", cursor: "pointer" }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .lang-out { animation: lOut 0.34s var(--ease-sharp) forwards; }
        .lang-in  { animation: lIn  0.75s var(--ease) forwards; }
        @keyframes lOut { to { opacity: 0; filter: blur(8px); transform: translateY(-6px); } }
        @keyframes lIn  { from { opacity: 0; filter: blur(10px); transform: translateY(10px); } 60% { opacity: 1; } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
        .testimonial-fade { animation: tFade 0.7s var(--ease); }
        @keyframes tFade { from { opacity: 0; transform: translateY(14px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @media (max-width: 880px) {
          #desk-nav { display: none !important; }
          #mob-btn  { display: block !important; }
          .hide-mobile-col { grid-column: span 12 !important; max-width: 480px; }
          .about-body { grid-column: span 12 !important; }
        }
      `}</style>
    </>
  );
}
