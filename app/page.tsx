"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { translations, type Lang } from "@/lib/i18n";

const galleryPhotos = [
  "photo_1_2026-05-16_14-37-06.jpg",
  "photo_2_2026-05-16_14-37-06.jpg",
  "photo_3_2026-05-16_14-37-06.jpg",
  "photo_4_2026-05-16_14-37-06.jpg",
  "photo_5_2026-05-16_14-37-06.jpg",
  "photo_6_2026-05-16_14-37-06.jpg",
  "photo_7_2026-05-16_14-37-06.jpg",
  "photo_8_2026-05-16_14-37-06.jpg",
  "photo_9_2026-05-16_14-37-06.jpg",
  "photo_10_2026-05-16_14-37-06.jpg",
  "photo_11_2026-05-16_14-37-06.jpg",
  "photo_12_2026-05-16_14-37-06.jpg",
  "photo_13_2026-05-16_14-37-06.jpg",
  "photo_14_2026-05-16_14-37-06.jpg",
  "photo_15_2026-05-16_14-37-06.jpg",
  "photo_16_2026-05-16_14-37-06.jpg",
  "photo_17_2026-05-16_14-37-06.jpg",
  "photo_18_2026-05-16_14-37-06.jpg",
  "photo_19_2026-05-16_14-37-06.jpg",
  "photo_20_2026-05-16_14-37-06.jpg",
  "photo_21_2026-05-16_14-37-06.jpg",
  "photo_22_2026-05-16_14-37-06.jpg",
  "photo_23_2026-05-16_14-37-06.jpg",
  "photo_24_2026-05-16_14-37-06.jpg",
  "photo_25_2026-05-16_14-37-06.jpg",
  "photo_26_2026-05-16_14-37-06.jpg",
  "photo_27_2026-05-16_14-37-06.jpg",
  "photo_28_2026-05-16_14-37-06.jpg",
  "photo_29_2026-05-16_14-37-06.jpg",
  "photo_30_2026-05-16_14-37-06.jpg",
  "photo_31_2026-05-16_14-37-06.jpg",
  "photo_32_2026-05-16_14-37-06.jpg",
  "photo_33_2026-05-16_14-37-06.jpg",
  "photo_34_2026-05-16_14-37-06.jpg",
  "photo_35_2026-05-16_14-37-06.jpg",
  "photo_36_2026-05-16_14-37-06.jpg",
  "photo_37_2026-05-16_14-37-06.jpg",
  "photo_38_2026-05-16_14-37-06.jpg",
  "photo_39_2026-05-16_14-37-06.jpg",
  "photo_40_2026-05-16_14-37-06.jpg",
  "photo_41_2026-05-16_14-37-06.jpg",
  "photo_42_2026-05-16_14-37-06.jpg",
  "photo_43_2026-05-16_14-37-06.jpg",
  "photo_44_2026-05-16_14-37-06.jpg",
  "photo_45_2026-05-16_14-37-06.jpg",
  "photo_46_2026-05-16_14-37-06.jpg",
  "photo_47_2026-05-16_14-37-06.jpg",
  "photo_48_2026-05-16_14-37-06.jpg",
  "photo_49_2026-05-16_14-37-06.jpg",
  "photo_50_2026-05-16_14-37-06.jpg",
  "photo_51_2026-05-16_14-37-06.jpg",
  "photo_52_2026-05-16_14-37-06.jpg",
  "photo_53_2026-05-16_14-37-06.jpg",
  "photo_54_2026-05-16_14-37-06.jpg",
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

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [heroIdx, setHeroIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: "", email: "", phone: "", event_type: "", event_date: "", guest_count: "", venue: "", message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => setHeroIdx((i) => (i + 1) % heroPhotos.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxImg(null); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
      if (res.ok) {
        setFormStatus("success");
        setFormState({ name: "", email: "", phone: "", event_type: "", event_date: "", guest_count: "", venue: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const navItems = [
    { key: "services", label: t.nav.services },
    { key: "gallery", label: t.nav.gallery },
    { key: "about", label: t.nav.about },
    { key: "contact", label: t.nav.contact },
  ];

  return (
    <div style={{ background: DARK, minHeight: "100vh", color: "#f5f0e8" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.93)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ color: GOLD, fontSize: "1.3rem", letterSpacing: "0.15em", fontWeight: 300, lineHeight: 1 }}>MT</div>
            <div style={{ color: "#666", fontSize: "0.5rem", letterSpacing: "0.35em", textTransform: "uppercase" }}>Event & Wedding</div>
          </button>

          {/* Desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} id="desktop-nav">
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => scrollTo(key)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = "#999")}>
                {label}
              </button>
            ))}
            <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
              {(["en", "it"] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ background: lang === l ? GOLD : "transparent", color: lang === l ? "#000" : "#555", border: `1px solid ${lang === l ? GOLD : "#333"}`, padding: "0.2rem 0.55rem", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, padding: 8, display: "none" }} id="mobile-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: "#080808", borderTop: `1px solid ${BORDER}`, padding: "1.5rem 2rem" }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => scrollTo(key)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "0.8rem 0", background: "none", border: "none", borderBottom: `1px solid ${BORDER}`, color: "#aaa", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                {label}
              </button>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: "1.2rem" }}>
              {(["en", "it"] as Lang[]).map(l => (
                <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }}
                  style={{ background: lang === l ? GOLD : "transparent", color: lang === l ? "#000" : "#555", border: `1px solid ${lang === l ? GOLD : "#333"}`, padding: "0.3rem 0.8rem", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {heroPhotos.map((photo, i) => (
          <div key={photo} style={{ position: "absolute", inset: 0, opacity: i === heroIdx ? 1 : 0, transition: "opacity 1.5s ease-in-out" }}>
            <Image src={`/images/${photo}`} alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} priority={i === 0} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.9) 100%)" }} />
          </div>
        ))}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", maxWidth: 840 }}>
          <p style={{ color: GOLD, fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Italy · {lang === "en" ? "Est. 2020" : "Dal 2020"}</p>
          <h1 style={{ color: "#f5f0e8", fontSize: "clamp(2.8rem, 8vw, 6.5rem)", fontWeight: 300, letterSpacing: "0.06em", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            {t.hero.tagline}
          </h1>
          <div style={{ width: 60, height: 1, background: GOLD, margin: "0 auto 1.5rem" }} />
          <p style={{ color: "#ccc", fontSize: "clamp(0.85rem, 2vw, 1.05rem)", letterSpacing: "0.18em", fontWeight: 300, marginBottom: "3rem" }}>
            {t.hero.sub}
          </p>
          <button onClick={() => scrollTo("contact")}
            style={{ background: GOLD, border: `1px solid ${GOLD}`, color: "#000", padding: "0.9rem 2.8rem", letterSpacing: "0.18em", fontSize: "0.7rem", textTransform: "uppercase", cursor: "pointer", fontWeight: 600, transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}>
            {t.hero.cta}
          </button>
        </div>
        {/* Dots */}
        <div style={{ position: "absolute", bottom: 36, right: 36, display: "flex", gap: 8, zIndex: 10 }}>
          {heroPhotos.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              style={{ width: i === heroIdx ? 28 : 8, height: 2, background: i === heroIdx ? GOLD : "#555", border: "none", cursor: "pointer", transition: "all 0.4s", padding: 0 }} />
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "8rem 1.5rem", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1rem" }}>
            {lang === "en" ? "What We Do" : "Cosa Facciamo"}
          </p>
          <h2 style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.services.title}</h2>
          <div style={{ width: 60, height: 1, background: GOLD, margin: "1.5rem auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {t.services.items.map((item, i) => (
            <div key={i}
              style={{ background: DARK2, border: `1px solid ${BORDER}`, padding: "3rem 2rem", textAlign: "center", transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = GOLD; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
              <div style={{ color: GOLD, marginBottom: "1.5rem", fontSize: "2rem" }}>
                {["◇", "◈", "✦", "◉"][i]}
              </div>
              <h3 style={{ color: "#f5f0e8", fontSize: "1rem", fontWeight: 400, letterSpacing: "0.1em", marginBottom: "1rem" }}>{item.title}</h3>
              <div style={{ width: 30, height: 1, background: GOLD, margin: "0 auto 1rem" }} />
              <p style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.85, fontWeight: 300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FULLWIDTH BANNER ── */}
      <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <Image src="/images/photo_10_2026-05-16_14-37-06.jpg" alt="Ceremony" fill style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.52)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase" }}>
            {lang === "en" ? "Destination Weddings" : "Destination Wedding"}
          </p>
          <h2 style={{ color: "#f5f0e8", fontSize: "clamp(1.8rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em", textAlign: "center" }}>
            {lang === "en" ? "Italy, Beyond Compare" : "Italia, Senza Paragoni"}
          </h2>
          <div style={{ width: 60, height: 1, background: GOLD }} />
        </div>
      </div>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding: "8rem 1.5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1rem" }}>
            {lang === "en" ? "Our Work" : "I Nostri Lavori"}
          </p>
          <h2 style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.gallery.title}</h2>
          <div style={{ width: 60, height: 1, background: GOLD, margin: "1.5rem auto" }} />
          <p style={{ color: "#777", fontSize: "0.88rem", letterSpacing: "0.12em" }}>{t.gallery.sub}</p>
        </div>
        <div style={{ columns: "280px", columnGap: "0.75rem" }}>
          {galleryPhotos.map((photo, i) => (
            <div key={i} onClick={() => setLightboxImg(photo)}
              style={{ marginBottom: "0.75rem", overflow: "hidden", cursor: "zoom-in", breakInside: "avoid" }}>
              <Image src={`/images/${photo}`} alt={`Portfolio ${i + 1}`} width={600} height={800}
                style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.5s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: DARK2, padding: "8rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div style={{ position: "relative", height: 580 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: "12%", bottom: "12%", overflow: "hidden" }}>
              <Image src="/images/photo_20_2026-05-16_14-37-06.jpg" alt="Planner" fill style={{ objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "44%", height: "48%", overflow: "hidden", border: `4px solid ${DARK2}` }}>
              <Image src="/images/photo_30_2026-05-16_14-37-06.jpg" alt="Detail" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div>
            <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              {lang === "en" ? "Our Story" : "La Nostra Storia"}
            </p>
            <h2 style={{ color: "#f5f0e8", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, letterSpacing: "0.08em", marginBottom: "1.5rem", lineHeight: 1.2 }}>
              {t.about.title}
            </h2>
            <div style={{ width: 40, height: 1, background: GOLD, marginBottom: "2rem" }} />
            <p style={{ color: "#888", lineHeight: 1.9, marginBottom: "1.25rem", fontWeight: 300, fontSize: "0.95rem" }}>{t.about.p1}</p>
            <p style={{ color: "#888", lineHeight: 1.9, marginBottom: "1.25rem", fontWeight: 300, fontSize: "0.95rem" }}>{t.about.p2}</p>
            <p style={{ color: GOLD, lineHeight: 1.9, fontSize: "1rem", letterSpacing: "0.05em" }}>{t.about.p3}</p>
            <div style={{ display: "flex", gap: "3rem", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${BORDER}` }}>
              {[{ num: "150+", label: t.about.stat1 }, { num: "12", label: t.about.stat2 }, { num: "5+", label: t.about.stat3 }].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ color: GOLD, fontSize: "2rem", fontWeight: 300 }}>{s.num}</div>
                  <div style={{ color: "#555", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "8rem 1.5rem", maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1rem" }}>
            {lang === "en" ? "Get in Touch" : "Contattaci"}
          </p>
          <h2 style={{ color: "#f5f0e8", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}>{t.contact.title}</h2>
          <div style={{ width: 60, height: 1, background: GOLD, margin: "1.5rem auto" }} />
          <p style={{ color: "#777", fontSize: "0.88rem" }}>{t.contact.sub}</p>
        </div>

        {formStatus === "success" ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", border: `1px solid ${GOLD}`, background: "rgba(201,168,76,0.04)" }}>
            <div style={{ color: GOLD, fontSize: "3rem", marginBottom: "1.5rem" }}>✓</div>
            <p style={{ color: GOLD, fontSize: "1rem", letterSpacing: "0.1em" }}>{t.contact.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
              {[
                { label: t.contact.name + " *", key: "name", type: "text", required: true, placeholder: t.contact.name },
                { label: t.contact.email + " *", key: "email", type: "email", required: true, placeholder: "email@example.com" },
                { label: t.contact.phone, key: "phone", type: "tel", required: false, placeholder: "+39 000 000 0000" },
              ].map(({ label, key, type, required, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#666", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{label}</label>
                  <input className="input-dark" type={type} required={required} placeholder={placeholder}
                    value={(formState as Record<string, string>)[key]}
                    onChange={e => setFormState(s => ({ ...s, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", color: "#666", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.contact.eventType} *</label>
                <select className="input-dark" required value={formState.event_type} onChange={e => setFormState(s => ({ ...s, event_type: e.target.value }))}>
                  <option value="">—</option>
                  {t.contact.eventTypes.map(et => <option key={et} value={et}>{et}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#666", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.contact.date}</label>
                <input className="input-dark" type="date" value={formState.event_date} onChange={e => setFormState(s => ({ ...s, event_date: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: "block", color: "#666", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.contact.guests}</label>
                <input className="input-dark" type="number" min="1" placeholder="50" value={formState.guest_count} onChange={e => setFormState(s => ({ ...s, guest_count: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "#666", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.contact.venue}</label>
              <input className="input-dark" placeholder="Lake Como, Venice, Tuscany..." value={formState.venue} onChange={e => setFormState(s => ({ ...s, venue: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "2.5rem" }}>
              <label style={{ display: "block", color: "#666", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t.contact.message}</label>
              <textarea className="input-dark" rows={5} placeholder={t.contact.message} value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            {formStatus === "error" && <p style={{ color: "#c0392b", marginBottom: "1.5rem", fontSize: "0.85rem", textAlign: "center" }}>{t.contact.error}</p>}
            <div style={{ textAlign: "center" }}>
              <button type="submit" disabled={formStatus === "loading"}
                style={{ background: GOLD, border: `1px solid ${GOLD}`, color: "#000", padding: "0.9rem 3rem", letterSpacing: "0.18em", fontSize: "0.7rem", textTransform: "uppercase", cursor: formStatus === "loading" ? "not-allowed" : "pointer", fontWeight: 600, opacity: formStatus === "loading" ? 0.6 : 1, transition: "all 0.3s" }}
                onMouseEnter={e => { if (formStatus !== "loading") { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; } }}
                onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}>
                {formStatus === "loading" ? "..." : t.contact.submit}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050505", borderTop: `1px solid ${BORDER}`, padding: "4rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ color: GOLD, fontSize: "1.5rem", letterSpacing: "0.15em", fontWeight: 300, marginBottom: "0.4rem" }}>MT</div>
              <div style={{ color: "#444", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Event & Wedding</div>
              <p style={{ color: "#444", fontSize: "0.85rem", lineHeight: 1.7, fontStyle: "italic" }}>{t.footer.tagline}</p>
            </div>
            <div>
              <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1rem" }}>Contact</p>
              <a href={`mailto:${t.footer.email}`} style={{ color: "#666", fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                {t.footer.email}
              </a>
              <a href="https://instagram.com/mteventwedding" target="_blank" rel="noopener noreferrer"
                style={{ color: "#666", fontSize: "0.85rem", display: "block", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                {t.footer.instagram}
              </a>
            </div>
            <div>
              <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1rem" }}>
                {lang === "en" ? "Booking" : "Prenotazioni"}
              </p>
              <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.7 }}>2026 &amp; 2027</p>
              <button onClick={() => scrollTo("contact")}
                style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, padding: "0.6rem 1.5rem", letterSpacing: "0.15em", fontSize: "0.6rem", textTransform: "uppercase", cursor: "pointer", marginTop: "1rem", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}>
                {t.hero.cta}
              </button>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ color: "#333", fontSize: "0.72rem" }}>© {new Date().getFullYear()} MT Event &amp; Wedding. {t.footer.rights}</p>
            <p style={{ color: "#333", fontSize: "0.68rem", letterSpacing: "0.12em" }}>Italy</p>
          </div>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: "2rem" }}>
          <button onClick={() => setLightboxImg(null)}
            style={{ position: "absolute", top: 24, right: 28, background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: "1.5rem" }}>✕</button>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative" }}>
            <Image src={`/images/${lightboxImg}`} alt="" width={1200} height={1600}
              style={{ maxWidth: "88vw", maxHeight: "88vh", width: "auto", height: "auto", objectFit: "contain" }} />
          </div>
        </div>
      )}

      {/* ── Responsive + Animations ── */}
      <style>{`
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #mobile-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          #desktop-nav { display: flex !important; }
          #mobile-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
