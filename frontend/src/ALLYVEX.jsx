import { useState, useRef, useCallback, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8000";

const VERDICT_CONFIG = {
  PURSUE: {
    color: "#f5c842",
    bg: "rgba(245,200,66,0.1)",
    border: "rgba(245,200,66,0.35)",
  },
  HOLD: {
    color: "#e8a020",
    bg: "rgba(232,160,32,0.1)",
    border: "rgba(232,160,32,0.35)",
  },
  AVOID: {
    color: "#ff4d6d",
    bg: "rgba(255,77,109,0.1)",
    border: "rgba(255,77,109,0.35)",
  },
};

const APPROACH_LABELS = {
  CUSTOMER_FIRST: "Customer First",
  PARTNER_FIRST: "Partner First",
  BOTH_SIMULTANEOUSLY: "Both Simultaneously",
  CUSTOMER_NOW_PARTNER_LATER: "Customer Now, Partner Later",
  PARTNER_NOW_CUSTOMER_LATER: "Partner Now, Customer Later",
  NEITHER: "Neither",
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080600;
    color: #e8d9b0;
    font-family: 'IBM Plex Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
    cursor: none;
  }

  ::selection { background: rgba(245,200,66,0.25); color: #ffd700; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080600; }
  ::-webkit-scrollbar-thumb { background: rgba(245,200,66,0.2); border-radius: 2px; }

  /* ── Custom Cursor ── */
  #cursor-outer {
    position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid rgba(245,200,66,0.6);
    transform: translate(-50%, -50%);
    transition: transform 0.12s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
    mix-blend-mode: screen;
  }
  #cursor-inner {
    position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none;
    width: 6px; height: 6px; border-radius: 50%;
    background: #f5c842;
    transform: translate(-50%, -50%);
    transition: transform 0.05s ease;
    box-shadow: 0 0 8px #f5c842, 0 0 20px rgba(245,200,66,0.4);
  }
  body:has(button:hover) #cursor-outer,
  body:has(a:hover) #cursor-outer,
  body:has([data-hover]:hover) #cursor-outer {
    width: 52px; height: 52px;
    border-color: rgba(245,200,66,0.9);
  }

  /* ── Keyframes ── */
  @keyframes pulse-gold { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes orb-drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.06)} 66%{transform:translate(-25px,15px) scale(0.96)} }
  @keyframes orb-drift-2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
  @keyframes grid-move { 0%{background-position:0 0} 100%{background-position:80px 80px} }
  @keyframes float-glyph { 0%,100%{transform:translateY(0) rotate(0deg);opacity:0.7} 50%{transform:translateY(-18px) rotate(3deg);opacity:1} }
  @keyframes scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes counter-ring { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes scan-line { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes fade-in-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes thinking-appear { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes page-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes gold-glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(245,200,66,0.1)} 50%{box-shadow:0 0 40px rgba(245,200,66,0.25), 0 0 80px rgba(245,200,66,0.08)} }

  .fade-in-up { animation: fade-in-up 0.4s ease forwards; }
  .thinking-appear { animation: thinking-appear 0.3s ease forwards; }
  .page-in { animation: page-in 0.45s ease forwards; }

  /* ── Glass Card Base ── */
  .glass {
    background: rgba(20,15,5,0.55);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid rgba(245,200,66,0.12);
    border-radius: 12px;
  }
  .glass-gold {
    background: rgba(30,20,5,0.6);
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
    border: 1px solid rgba(245,200,66,0.22);
    border-radius: 12px;
  }

  /* ── Buttons ── */
  .btn-primary {
    background: linear-gradient(135deg, #c9a227, #f5c842, #b8860b);
    background-size: 200% 100%;
    color: #0d0900;
    border: none;
    padding: 14px 34px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: none;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(245,200,66,0.25), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    background-size: 200% 100%;
    animation: shimmer 2.5s infinite;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(245,200,66,0.5), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .btn-secondary {
    background: rgba(245,200,66,0.06);
    color: #f5c842;
    border: 1px solid rgba(245,200,66,0.3);
    padding: 14px 34px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    cursor: none;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(10px);
  }
  .btn-secondary:hover {
    background: rgba(245,200,66,0.12);
    border-color: rgba(245,200,66,0.6);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(245,200,66,0.15);
  }

  .btn-ghost {
    background: rgba(255,255,255,0.03);
    color: #9a8660;
    border: 1px solid rgba(255,255,255,0.07);
    padding: 14px 34px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 2px;
    cursor: none;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }
  .btn-ghost:hover { background: rgba(245,200,66,0.05); color: #d4b870; border-color: rgba(245,200,66,0.2); }

  /* ── Feature Cards ── */
  .feature-card {
    background: rgba(20,14,4,0.6);
    backdrop-filter: blur(20px) saturate(130%);
    -webkit-backdrop-filter: blur(20px) saturate(130%);
    border: 1px solid rgba(245,200,66,0.1);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.35s;
    cursor: none;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 0%, rgba(245,200,66,0.06), transparent 60%);
    opacity: 0; transition: opacity 0.35s;
  }
  .feature-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,200,66,0.4), transparent);
    opacity: 0; transition: opacity 0.35s;
  }
  .feature-card:hover::before, .feature-card:hover::after { opacity: 1; }
  .feature-card:hover {
    border-color: rgba(245,200,66,0.25);
    transform: translateY(-8px);
    box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 1px rgba(245,200,66,0.3);
  }

  /* ── Agent Pills ── */
  .agent-pill {
    display: flex; align-items: center; gap: 12px; padding: 14px 24px;
    border-radius: 10px;
    border: 1px solid rgba(245,200,66,0.1);
    background: rgba(20,14,4,0.7);
    backdrop-filter: blur(16px);
    transition: all 0.25s; cursor: none;
  }
  .agent-pill:hover {
    border-color: rgba(245,200,66,0.35);
    background: rgba(245,200,66,0.05);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(245,200,66,0.08);
  }

  /* ── Stats ── */
  .stat-card {
    padding: 28px 36px; text-align: center;
    border-right: 1px solid rgba(245,200,66,0.1);
    background: rgba(20,14,4,0.6);
    backdrop-filter: blur(16px);
    transition: background 0.25s;
  }
  .stat-card:hover { background: rgba(245,200,66,0.04); }
  .stat-card:last-child { border-right: none; }

  /* ── Nav Links ── */
  .nav-link {
    font-size: 11px; letter-spacing: 1.5px; color: #7a6840;
    cursor: none; transition: color 0.2s;
    font-family: 'IBM Plex Mono', monospace;
  }
  .nav-link:hover { color: #f5c842; }

  /* ── Inputs ── */
  .input-field {
    width: 100%; padding: 13px 16px;
    background: rgba(10,7,2,0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(245,200,66,0.15);
    border-radius: 8px; color: #e8d9b0;
    font-family: 'IBM Plex Mono', monospace; font-size: 13px;
    outline: none; transition: all 0.25s;
    cursor: none;
  }
  .input-field:focus {
    border-color: rgba(245,200,66,0.5);
    box-shadow: 0 0 0 3px rgba(245,200,66,0.07), 0 0 20px rgba(245,200,66,0.08);
  }
  .input-field::placeholder { color: #3a2e18; }

  /* ── War Card ── */
  .war-card {
    background: rgba(18,13,4,0.65);
    backdrop-filter: blur(20px) saturate(130%);
    -webkit-backdrop-filter: blur(20px) saturate(130%);
    border: 1px solid rgba(245,200,66,0.12);
    border-radius: 10px;
  }

  /* ── Section Divider ── */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,200,66,0.2), transparent);
  }

  /* ── Gold Glow animation on cards ── */
  .glow-card { animation: gold-glow-pulse 4s ease-in-out infinite; }
`;

// ─── Custom Cursor Component ──────────────────────────────────────────────────
const Cursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (innerRef.current) {
        innerRef.current.style.left = e.clientX + "px";
        innerRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      outerPos.current.x = lerp(outerPos.current.x, pos.current.x, 0.12);
      outerPos.current.y = lerp(outerPos.current.y, pos.current.y, 0.12);
      if (outerRef.current) {
        outerRef.current.style.left = outerPos.current.x + "px";
        outerRef.current.style.top = outerPos.current.y + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Scale on hover
    const onEnter = () => {
      if (outerRef.current) {
        outerRef.current.style.width = "56px";
        outerRef.current.style.height = "56px";
        outerRef.current.style.borderColor = "rgba(245,200,66,0.9)";
      }
      if (innerRef.current) {
        innerRef.current.style.transform = "translate(-50%,-50%) scale(1.5)";
      }
    };
    const onLeave = () => {
      if (outerRef.current) {
        outerRef.current.style.width = "36px";
        outerRef.current.style.height = "36px";
        outerRef.current.style.borderColor = "rgba(245,200,66,0.6)";
      }
      if (innerRef.current) {
        innerRef.current.style.transform = "translate(-50%,-50%) scale(1)";
      }
    };
    const clickables = () =>
      document.querySelectorAll(
        "button, a, [data-hover], input, .nav-link, .agent-pill, .feature-card, .stat-card",
      );
    const attach = () => {
      clickables().forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div
        id="cursor-outer"
        ref={outerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(245,200,66,0.6)",
          transform: "translate(-50%,-50%)",
          transition: "width 0.2s,height 0.2s,border-color 0.2s",
          mixBlendMode: "screen",
        }}
      />
      <div
        id="cursor-inner"
        ref={innerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          pointerEvents: "none",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#f5c842",
          transform: "translate(-50%,-50%)",
          boxShadow: "0 0 8px #f5c842, 0 0 20px rgba(245,200,66,0.5)",
          transition: "transform 0.1s",
        }}
      />
    </>
  );
};

// ─── Shared BG Layer ──────────────────────────────────────────────────────────
const BgLayer = ({ mousePos }) => (
  <>
    {/* Deep base gradient */}
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(40,28,4,0.8) 0%, #080600 60%)",
      }}
    />
    {/* Grid */}
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(245,200,66,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(245,200,66,0.018) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
        animation: "grid-move 30s linear infinite",
      }}
    />
    {/* Gold orb top-left */}
    <div
      style={{
        position: "fixed",
        zIndex: 0,
        pointerEvents: "none",
        top: "-15%",
        left: "-5%",
        width: "55%",
        height: "55%",
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse, rgba(180,130,10,0.09) 0%, transparent 65%)",
        transform: mousePos
          ? `translate(${mousePos.x * -40}px,${mousePos.y * -40}px)`
          : "none",
        transition: "transform 0.9s cubic-bezier(.25,.46,.45,.94)",
        animation: "orb-drift 20s ease-in-out infinite",
      }}
    />
    {/* Warm orb bottom-right */}
    <div
      style={{
        position: "fixed",
        zIndex: 0,
        pointerEvents: "none",
        bottom: "-15%",
        right: "-5%",
        width: "50%",
        height: "50%",
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse, rgba(200,140,10,0.06) 0%, transparent 65%)",
        transform: mousePos
          ? `translate(${mousePos.x * 25}px,${mousePos.y * 25}px)`
          : "none",
        transition: "transform 0.9s cubic-bezier(.25,.46,.45,.94)",
        animation: "orb-drift-2 25s ease-in-out infinite",
      }}
    />
    {/* Noise grain texture overlay */}
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
    />
  </>
);

// ─── Global Nav ───────────────────────────────────────────────────────────────
const Nav = ({ page, onNav, user }) => (
  <nav
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 48px",
      background: "rgba(8,6,0,0.75)",
      backdropFilter: "blur(24px) saturate(160%)",
      WebkitBackdropFilter: "blur(24px) saturate(160%)",
      borderBottom: "1px solid rgba(245,200,66,0.1)",
      boxShadow: "0 1px 0 rgba(245,200,66,0.05), 0 4px 24px rgba(0,0,0,0.5)",
    }}
  >
    <div
      style={{ display: "flex", alignItems: "center", gap: 14, cursor: "none" }}
      onClick={() => onNav("landing")}
      data-hover
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: "linear-gradient(135deg, #b8860b, #f5c842, #c9a227)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Syne, sans-serif",
          fontWeight: 900,
          fontSize: 19,
          color: "#0d0900",
          boxShadow:
            "0 0 24px rgba(245,200,66,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        A
      </div>
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: 18,
          color: "#f0d878",
          letterSpacing: 3,
          textShadow: "0 0 20px rgba(245,200,66,0.3)",
        }}
      >
        ALLYVEX
      </span>
      <span style={{ fontSize: 9, color: "#4a3c1a", letterSpacing: 3 }}>
        {page === "warroom" ? "WAR ROOM" : "INTELLIGENCE"}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      {page === "landing" && (
        <>
          <span className="nav-link">FEATURES</span>
          <span className="nav-link">HOW IT WORKS</span>
          <span className="nav-link" onClick={() => onNav("login")}>
            LOGIN
          </span>
          <button
            onClick={() => onNav("register")}
            className="btn-primary"
            style={{ padding: "9px 22px", fontSize: 11 }}
          >
            GET ACCESS →
          </button>
        </>
      )}
      {page === "login" && (
        <>
          <span className="nav-link" onClick={() => onNav("landing")}>
            ← HOME
          </span>
          <span className="nav-link" onClick={() => onNav("register")}>
            REGISTER
          </span>
        </>
      )}
      {page === "register" && (
        <>
          <span className="nav-link" onClick={() => onNav("landing")}>
            ← HOME
          </span>
          <span className="nav-link" onClick={() => onNav("login")}>
            LOGIN
          </span>
        </>
      )}
      {page === "warroom" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f5c842",
                animation: "pulse-gold 2s ease infinite",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(245,200,66,0.6)",
              }}
            />
            <span style={{ fontSize: 10, color: "#7a6840", letterSpacing: 1 }}>
              SYSTEM ONLINE
            </span>
          </div>
          {user && (
            <span style={{ fontSize: 11, color: "#7a6840" }}>{user}</span>
          )}
          <button
            onClick={() => onNav("landing")}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              fontFamily: "IBM Plex Mono",
              fontSize: 10,
              cursor: "none",
              letterSpacing: 1,
              background: "rgba(245,200,66,0.04)",
              color: "#7a6840",
              border: "1px solid rgba(245,200,66,0.15)",
              transition: "all 0.2s",
            }}
          >
            LOGOUT
          </button>
        </>
      )}
    </div>
  </nav>
);

// ══════════════════════════════════════════════════════
// PAGE 1: LANDING
// ══════════════════════════════════════════════════════
const HeroVisual = ({ mouseX, mouseY }) => {
  const rx = mouseY * 15,
    ry = mouseX * 15;
  const colors = ["#f5c842", "#ff4d6d", "#e8a020", "#c9a227"];
  const agentLabels = [
    { label: "BULL", color: "#f5c842", offset: { x: -220, y: -80 } },
    { label: "BEAR", color: "#ff4d6d", offset: { x: 220, y: 60 } },
    { label: "DETECTIVE", color: "#e8a020", offset: { x: -180, y: 100 } },
    { label: "ORCHESTRATOR", color: "#c9a227", offset: { x: 160, y: -110 } },
  ];
  const toRgb = {
    "#f5c842": "245,200,66",
    "#ff4d6d": "255,77,109",
    "#e8a020": "232,160,32",
    "#c9a227": "201,162,39",
  };
  return (
    <div
      style={{
        position: "absolute",
        right: "-5%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "52%",
        height: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Outer rings */}
      <div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          border: "1px solid rgba(245,200,66,0.05)",
          borderRadius: "50%",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 430,
          height: 430,
          border: "1px solid rgba(245,200,66,0.08)",
          borderRadius: "50%",
          transform: `rotateX(${rx * 1.2}deg) rotateY(${ry * 1.2}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      {/* Spinning rings */}
      <div
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: "1px dashed rgba(245,200,66,0.18)",
          animation: "spin-ring 22s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: "1px dashed rgba(232,160,32,0.12)",
          animation: "counter-ring 16s linear infinite",
        }}
      />
      {/* Center orb */}
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          transform: `rotateX(${rx * 0.5}deg) rotateY(${ry * 0.5}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -70,
            background:
              "radial-gradient(ellipse, rgba(245,200,66,0.14) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 35% 35%, rgba(245,200,66,0.28) 0%, rgba(140,100,10,0.45) 50%, rgba(10,7,0,0.95) 100%)",
            borderRadius: "50%",
            border: "1px solid rgba(245,200,66,0.3)",
            boxShadow:
              "0 0 70px rgba(245,200,66,0.18), inset 0 0 50px rgba(245,200,66,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "18%",
            width: "32%",
            height: "32%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Syne, sans-serif",
            fontWeight: 900,
            fontSize: 64,
            color: "rgba(245,200,66,0.92)",
            textShadow:
              "0 0 30px rgba(245,200,66,0.7), 0 0 60px rgba(245,200,66,0.3)",
          }}
        >
          A
        </div>
      </div>
      {/* Orbiting dots */}
      {[0, 90, 180, 270].map((deg, i) => {
        const r = 180,
          angle = ((deg + mouseX * 10) * Math.PI) / 180;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: colors[i],
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${Math.cos(angle) * r}px), calc(-50% + ${Math.sin(angle) * r * 0.4}px))`,
              boxShadow: `0 0 16px ${colors[i]}, 0 0 4px ${colors[i]}`,
              transition: "transform 0.1s ease-out",
            }}
          />
        );
      })}
      {/* Agent labels */}
      {agentLabels.map(({ label, color, offset }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${offset.x}px)`,
            top: `calc(50% + ${offset.y}px)`,
            transform: "translate(-50%,-50%)",
            fontSize: 9,
            letterSpacing: 2,
            color,
            fontFamily: "IBM Plex Mono, monospace",
            fontWeight: 600,
            padding: "5px 10px",
            background: `rgba(${toRgb[color]},0.08)`,
            border: `1px solid rgba(${toRgb[color]},0.28)`,
            borderRadius: 5,
            whiteSpace: "nowrap",
            animation: `float-glyph ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            backdropFilter: "blur(8px)",
          }}
        >
          {label}
        </div>
      ))}
      {/* Scan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: "50%",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(245,200,66,0.7), transparent)",
            animation: "scan 3.5s linear infinite",
          }}
        />
      </div>
    </div>
  );
};

const LandingPage = ({ onNav }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    let handler;
    const t = setTimeout(() => {
      handler = (e) =>
        setMousePos({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
      window.addEventListener("mousemove", handler);
    }, 600);
    return () => {
      clearTimeout(t);
      if (handler) window.removeEventListener("mousemove", handler);
    };
  }, []);

  const features = [
    {
      icon: "◎",
      color: "#e8a020",
      title: "Autonomous Research",
      desc: "AI agents crawl the web to build a comprehensive dossier on any target company in seconds.",
    },
    {
      icon: "◈",
      color: "#f5c842",
      title: "Dual-Track Verdicts",
      desc: "Get a definitive PURSUE / HOLD / AVOID verdict on both Customer and Partner tracks with confidence scores.",
    },
    {
      icon: "⊕",
      color: "#c9a227",
      title: "Instant Outreach",
      desc: "Generates hyper-personalized draft emails targeted exactly at the right decision-maker.",
    },
  ];
  const agents = [
    {
      icon: "◆",
      name: "Bull Agent",
      color: "#f5c842",
      desc: "Building the case FOR",
    },
    {
      icon: "◈",
      name: "Bear Agent",
      color: "#ff4d6d",
      desc: "Hunting red flags",
    },
    {
      icon: "◎",
      name: "Detective Agent",
      color: "#e8a020",
      desc: "Auditing all evidence",
    },
    {
      icon: "⊕",
      name: "Orchestrator",
      color: "#c9a227",
      desc: "Final verdict engine",
    },
  ];
  const stats = [
    { val: "4", label: "AI Agents" },
    { val: "2×", label: "Track Analysis" },
    { val: "<60s", label: "Full Intel" },
    { val: "∞", label: "Targets" },
  ];
  const toRgb = {
    "#e8a020": "232,160,32",
    "#f5c842": "245,200,66",
    "#c9a227": "201,162,39",
  };
  const vColors = ["#f5c842", "#e8a020", "#ff4d6d"];
  const vBgs = [
    "rgba(245,200,66,0.1)",
    "rgba(232,160,32,0.1)",
    "rgba(255,77,109,0.1)",
  ];
  const vBorders = [
    "rgba(245,200,66,0.35)",
    "rgba(232,160,32,0.35)",
    "rgba(255,77,109,0.35)",
  ];

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(20px)",
    transition: `all 0.7s ${delay}s ease`,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080600" }}>
      <BgLayer mousePos={mousePos} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HERO */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "120px 48px 80px",
            maxWidth: 1400,
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: 600, position: "relative", zIndex: 2 }}>
            {/* Live badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 18px",
                borderRadius: 6,
                background: "rgba(245,200,66,0.06)",
                border: "1px solid rgba(245,200,66,0.2)",
                marginBottom: 40,
                backdropFilter: "blur(12px)",
                ...anim(0),
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f5c842",
                  animation: "pulse-gold 1.5s ease infinite",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(245,200,66,0.7)",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: "#f5c842",
                  letterSpacing: 3,
                  fontWeight: 500,
                }}
              >
                ALLYVEX INTELLIGENCE IS LIVE
              </span>
            </div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(44px,6vw,84px)",
                lineHeight: 1.04,
                letterSpacing: -2,
                color: "#f0e8d0",
                marginBottom: 12,
                ...anim(0.1),
              }}
            >
              Beyond the
            </h1>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(44px,6vw,84px)",
                lineHeight: 1.04,
                letterSpacing: -2,
                marginBottom: 32,
                background:
                  "linear-gradient(135deg, #c9a227 0%, #f5c842 45%, #e8c040 70%, #b8860b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(245,200,66,0.3))",
                ...anim(0.2),
              }}
            >
              Search Bar.
            </h1>
            <p
              style={{
                fontSize: "clamp(14px,1.4vw,18px)",
                color: "#7a6840",
                lineHeight: 1.8,
                maxWidth: 500,
                marginBottom: 48,
                fontWeight: 300,
                ...anim(0.3),
              }}
            >
              Autonomous Strategic Intelligence for B2B Sales.
              <br />
              Stop researching, start closing with our premium AI swarm.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                ...anim(0.45),
              }}
            >
              <button className="btn-primary" onClick={() => onNav("login")}>
                LAUNCH WAR ROOM <span>→</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNav("register")}
              >
                REGISTER COMPANY <span>↗</span>
              </button>
              <button className="btn-ghost" onClick={() => onNav("login")}>
                LOGIN
              </button>
            </div>
            {/* Stats */}
            <div
              style={{
                display: "flex",
                marginTop: 72,
                border: "1px solid rgba(245,200,66,0.1)",
                borderRadius: 10,
                overflow: "hidden",
                backdropFilter: "blur(16px)",
                ...anim(0.6),
              }}
            >
              {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 800,
                      fontSize: 30,
                      color: "#f5c842",
                      letterSpacing: 1,
                      marginBottom: 4,
                      textShadow: "0 0 24px rgba(245,200,66,0.4)",
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{ fontSize: 9, color: "#4a3c1a", letterSpacing: 2 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <HeroVisual mouseX={mousePos.x} mouseY={mousePos.y} />
        </section>

        <div className="section-divider" />

        {/* FEATURES */}
        <section
          style={{ padding: "120px 48px", maxWidth: 1200, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div
              style={{
                fontSize: 10,
                color: "#5a4820",
                letterSpacing: 4,
                marginBottom: 14,
              }}
            >
              CAPABILITIES
            </div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px,4vw,52px)",
                color: "#f0e8d0",
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Built for Modern Sales Teams
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#5a4820",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Every analysis runs four specialized agents in parallel to deliver
              comprehensive, unbiased intelligence.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 32,
                    right: 32,
                    height: 2,
                    background: `linear-gradient(90deg,transparent,${f.color},transparent)`,
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    marginBottom: 24,
                    background: `rgba(${toRgb[f.color]},0.08)`,
                    border: `1px solid rgba(${toRgb[f.color]},0.22)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: f.color,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#f0e8d0",
                    marginBottom: 12,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 12, color: "#6a5830", lineHeight: 1.8 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* PIPELINE */}
        <section
          style={{
            padding: "120px 48px",
            background: "rgba(0,0,0,0.3)",
            borderTop: "1px solid rgba(245,200,66,0.06)",
            borderBottom: "1px solid rgba(245,200,66,0.06)",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                fontSize: 10,
                color: "#5a4820",
                letterSpacing: 4,
                marginBottom: 14,
              }}
            >
              INTELLIGENCE PIPELINE
            </div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px,3.5vw,48px)",
                color: "#f0e8d0",
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Powered by Multi-Agent Swarms
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#5a4820",
                maxWidth: 460,
                margin: "0 auto 60px",
              }}
            >
              Four specialized agents work in concert — bull, bear, detective,
              and orchestrator — to deliver objective intelligence.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 14,
                marginBottom: 60,
              }}
            >
              {agents.map((a, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 0 }}
                >
                  <div className="agent-pill">
                    <span
                      style={{
                        fontSize: 16,
                        color: a.color,
                        textShadow: `0 0 10px ${a.color}`,
                      }}
                    >
                      {a.icon}
                    </span>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#e8d9b0",
                          letterSpacing: 1,
                        }}
                      >
                        {a.name}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: "#5a4820",
                          letterSpacing: 1,
                          marginTop: 2,
                        }}
                      >
                        {a.desc}
                      </div>
                    </div>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: a.color,
                        animation: "pulse-gold 2s ease infinite",
                        animationDelay: `${i * 0.4}s`,
                        display: "inline-block",
                        marginLeft: 4,
                        boxShadow: `0 0 8px ${a.color}`,
                      }}
                    />
                  </div>
                  {i < agents.length - 1 && (
                    <div
                      style={{
                        fontSize: 14,
                        color: "#2a2010",
                        margin: "0 4px",
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Verdict output */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 28px",
                background: "rgba(18,13,4,0.8)",
                border: "1px solid rgba(245,200,66,0.15)",
                borderRadius: 10,
                backdropFilter: "blur(16px)",
              }}
            >
              <span
                style={{ fontSize: 10, color: "#5a4820", letterSpacing: 2 }}
              >
                VERDICT OUTPUT →
              </span>
              {["PURSUE", "HOLD", "AVOID"].map((v, i) => (
                <span
                  key={i}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 5,
                    background: vBgs[i],
                    border: `1px solid ${vBorders[i]}`,
                    color: vColors[i],
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 2,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "140px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 32px",
                background: "linear-gradient(135deg,#b8860b,#f5c842,#c9a227)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: 32,
                color: "#0d0900",
                boxShadow:
                  "0 0 50px rgba(245,200,66,0.25), 0 0 100px rgba(245,200,66,0.08)",
              }}
            >
              A
            </div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(30px,4.5vw,58px)",
                color: "#f0e8d0",
                letterSpacing: -1,
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              Ready to Outmaneuver
              <br />
              Your Competition?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6a5830",
                lineHeight: 1.8,
                maxWidth: 520,
                margin: "0 auto 48px",
              }}
            >
              Join sales teams already using ALLYVEX to close deals faster with
              precision AI intelligence. Get your first analysis in under 60
              seconds.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button className="btn-primary" onClick={() => onNav("login")}>
                ACCESS THE WAR ROOM →
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNav("register")}
              >
                REGISTER FREE
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(245,200,66,0.08)",
            padding: "32px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            background: "rgba(6,4,0,0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 5,
                background: "linear-gradient(135deg,#b8860b,#f5c842)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: 14,
                color: "#0d0900",
              }}
            >
              A
            </div>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#3a2e18",
                letterSpacing: 2,
              }}
            >
              ALLYVEX
            </span>
          </div>
          <div style={{ fontSize: 10, color: "#2a2010", letterSpacing: 2 }}>
            INTELLIGENCE PIPELINE v1.0 — ALL RIGHTS RESERVED
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["PRIVACY", "TERMS", "CONTACT"].map((l) => (
              <span key={l} className="nav-link" style={{ fontSize: 9 }}>
                {l}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
// PAGE 2: LOGIN
// ══════════════════════════════════════════════════════
const LoginPage = ({ onNav, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      onSuccess(data.email);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      <BgLayer />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
        }}
        className="page-in"
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              background: "linear-gradient(135deg,#b8860b,#f5c842,#c9a227)",
              borderRadius: 12,
              fontSize: 28,
              fontWeight: 800,
              color: "#0d0900",
              fontFamily: "Syne, sans-serif",
              marginBottom: 16,
              boxShadow:
                "0 0 40px rgba(245,200,66,0.25), 0 0 80px rgba(245,200,66,0.08)",
            }}
          >
            A
          </div>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "#f0d878",
              letterSpacing: 3,
              textShadow: "0 0 20px rgba(245,200,66,0.2)",
            }}
          >
            ALLYVEX
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#5a4820",
              letterSpacing: 3,
              marginTop: 6,
            }}
          >
            SECURE ACCESS
          </div>
        </div>

        <div className="glass-gold" style={{ padding: 36 }}>
          {/* Gold top line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 32,
              right: 32,
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(245,200,66,0.4),transparent)",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: "#5a4820",
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
            LOGIN TO YOUR ACCOUNT
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#5a4820",
                  letterSpacing: 3,
                  marginBottom: 8,
                }}
              >
                EMAIL ADDRESS
              </div>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ai"
                disabled={loading}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#5a4820",
                  letterSpacing: 3,
                  marginBottom: 8,
                }}
              >
                PASSWORD
              </div>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handle()}
              />
            </div>
          </div>
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <span
              style={{
                fontSize: 10,
                color: "#3a2e18",
                cursor: "none",
                letterSpacing: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#f5c842")}
              onMouseLeave={(e) => (e.target.style.color = "#3a2e18")}
              data-hover
            >
              FORGOT PASSWORD?
            </span>
          </div>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(255,77,109,0.07)",
                border: "1px solid rgba(255,77,109,0.25)",
                borderRadius: 7,
                fontSize: 11,
                color: "#ff4d6d",
                marginBottom: 16,
              }}
            >
              ✗ {error}
            </div>
          )}
          <button
            onClick={handle}
            disabled={loading}
            className={loading ? "" : "btn-primary"}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              fontFamily: "IBM Plex Mono",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2,
              background: loading
                ? "rgba(245,200,66,0.12)"
                : "linear-gradient(135deg,#b8860b,#f5c842,#c9a227)",
              color: loading ? "#5a4820" : "#0d0900",
              border: "none",
              cursor: loading ? "not-allowed" : "none",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    animation: "blink 0.8s infinite",
                    display: "inline-block",
                    marginRight: 8,
                  }}
                >
                  ▌
                </span>
                AUTHENTICATING...
              </>
            ) : (
              "ACCESS WAR ROOM →"
            )}
          </button>
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 11,
              color: "#3a2e18",
            }}
          >
            No account?{" "}
            <span
              onClick={() => onNav("register")}
              style={{ color: "#f5c842", cursor: "none" }}
              data-hover
            >
              Register your company
            </span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span
            onClick={() => onNav("landing")}
            className="nav-link"
            style={{ fontSize: 10 }}
          >
            ← BACK TO HOME
          </span>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
// PAGE 3: REGISTER
// ══════════════════════════════════════════════════════
const RegisterPage = ({ onNav, onSuccess }) => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!company || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      onSuccess(email);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      <BgLayer />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
        }}
        className="page-in"
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              background: "linear-gradient(135deg,#b8860b,#f5c842,#c9a227)",
              borderRadius: 12,
              fontSize: 28,
              fontWeight: 800,
              color: "#0d0900",
              fontFamily: "Syne, sans-serif",
              marginBottom: 16,
              boxShadow: "0 0 40px rgba(245,200,66,0.25)",
            }}
          >
            A
          </div>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "#f0d878",
              letterSpacing: 3,
            }}
          >
            ALLYVEX
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#5a4820",
              letterSpacing: 3,
              marginTop: 6,
            }}
          >
            CREATE YOUR ACCOUNT
          </div>
        </div>
        <div
          className="glass-gold"
          style={{ padding: 36, position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 32,
              right: 32,
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(245,200,66,0.4),transparent)",
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: "#5a4820",
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
            REGISTER YOUR COMPANY
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {[
              {
                label: "COMPANY NAME",
                val: company,
                set: setCompany,
                ph: "Acme Corp",
                type: "text",
              },
              {
                label: "WORK EMAIL",
                val: email,
                set: setEmail,
                ph: "you@company.ai",
                type: "email",
              },
              {
                label: "PASSWORD",
                val: password,
                set: setPassword,
                ph: "Create a password",
                type: "password",
              },
              {
                label: "CONFIRM PASSWORD",
                val: confirm,
                set: setConfirm,
                ph: "Repeat password",
                type: "password",
              },
            ].map(({ label, val, set, ph, type }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#5a4820",
                    letterSpacing: 3,
                    marginBottom: 8,
                  }}
                >
                  {label}
                </div>
                <input
                  className="input-field"
                  type={type}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  placeholder={ph}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(255,77,109,0.07)",
                border: "1px solid rgba(255,77,109,0.25)",
                borderRadius: 7,
                fontSize: 11,
                color: "#ff4d6d",
                marginBottom: 16,
              }}
            >
              ✗ {error}
            </div>
          )}
          <button
            onClick={handle}
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              fontFamily: "IBM Plex Mono",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2,
              background: loading
                ? "rgba(245,200,66,0.1)"
                : "linear-gradient(135deg,#b8860b,#f5c842,#c9a227)",
              color: loading ? "#5a4820" : "#0d0900",
              border: "none",
              cursor: loading ? "not-allowed" : "none",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    animation: "blink 0.8s infinite",
                    display: "inline-block",
                    marginRight: 8,
                  }}
                >
                  ▌
                </span>
                CREATING ACCOUNT...
              </>
            ) : (
              "CREATE ACCOUNT →"
            )}
          </button>
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 11,
              color: "#3a2e18",
            }}
          >
            Already have access?{" "}
            <span
              onClick={() => onNav("login")}
              style={{ color: "#f5c842", cursor: "none" }}
              data-hover
            >
              Login
            </span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span
            onClick={() => onNav("landing")}
            className="nav-link"
            style={{ fontSize: 10 }}
          >
            ← BACK TO HOME
          </span>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
// PAGE 4: WAR ROOM
// ══════════════════════════════════════════════════════
const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      color: "#5a4820",
      letterSpacing: 3,
      marginBottom: 12,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const VerdictBadge = ({ verdict, size = "sm" }) => {
  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.AVOID;
  return (
    <span
      style={{
        padding: size === "lg" ? "6px 16px" : "3px 10px",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        borderRadius: 5,
        fontSize: size === "lg" ? 13 : 10,
        fontWeight: 600,
        letterSpacing: 2,
      }}
    >
      {verdict}
    </span>
  );
};

const ScoreRing = ({ score, label, color = "#f5c842", size = 80 }) => {
  const r = 30,
    c = 2 * Math.PI * r,
    fill = (score / 100) * c;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="rgba(245,200,66,0.08)"
          strokeWidth="4"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${fill} ${c}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 1s ease",
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
      </svg>
      <div
        style={{
          textAlign: "center",
          marginTop: -size / 2 - 4,
          position: "relative",
          top: -size / 2 + 8,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color,
            lineHeight: 1,
            textShadow: `0 0 12px ${color}60`,
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: 9, color: "#5a4820", letterSpacing: 1 }}>
          {label}
        </div>
      </div>
    </div>
  );
};

const ThinkingItem = ({ item, index }) => {
  const isDealKiller = item.fact?.includes("DEAL KILLER");
  const isCritical = item.impact === "CRITICAL";
  let accentColor = "#3a2e18";
  if (isDealKiller || item.severity === "HIGH") accentColor = "#ff4d6d";
  else if (item.strength === "HIGH" || item.impact === "STRENGTHENS_BULL")
    accentColor = "#f5c842";
  else if (item.impact === "STRENGTHENS_BEAR" || isCritical)
    accentColor = "#e8a020";
  return (
    <div
      className="thinking-appear"
      style={{
        animationDelay: `${index * 0.05}s`,
        padding: "10px 12px",
        borderLeft: `2px solid ${accentColor}`,
        background: isDealKiller
          ? "rgba(255,77,109,0.05)"
          : isCritical
            ? "rgba(232,160,32,0.04)"
            : "transparent",
        borderRadius: "0 5px 5px 0",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: isDealKiller ? "#ff4d6d" : isCritical ? "#e8a020" : "#9a8660",
          fontWeight: 500,
          marginBottom: 3,
        }}
      >
        {String(item.fact ?? "")}
      </div>
      <div style={{ fontSize: 10, color: "#5a4820", lineHeight: 1.5 }}>
        {String(item.reasoning ?? "")}
      </div>
      {item.source && (
        <a
          href={item.source}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 9,
            color: "#c9a227",
            display: "block",
            marginTop: 4,
            textDecoration: "none",
          }}
        >
          ↗ source
        </a>
      )}
      <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
        {item.strength && (
          <span
            style={{
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: 1,
              background:
                item.strength === "HIGH"
                  ? "rgba(245,200,66,0.1)"
                  : "rgba(58,46,24,0.3)",
              color: item.strength === "HIGH" ? "#f5c842" : "#5a4820",
            }}
          >
            STRENGTH:{item.strength}
          </span>
        )}
        {item.severity && (
          <span
            style={{
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: 1,
              background:
                item.severity === "HIGH"
                  ? "rgba(255,77,109,0.1)"
                  : "rgba(58,46,24,0.3)",
              color: item.severity === "HIGH" ? "#ff4d6d" : "#5a4820",
            }}
          >
            SEVERITY:{item.severity}
          </span>
        )}
        {item.impact && item.impact !== "NEUTRAL" && (
          <span
            style={{
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: 1,
              background: "rgba(58,46,24,0.2)",
              color: "#7a6840",
            }}
          >
            {item.impact}
          </span>
        )}
      </div>
    </div>
  );
};

const AGENT_META = {
  bull: {
    icon: "◆",
    label: "BULL AGENT",
    desc: "Building the case FOR",
    color: "#f5c842",
  },
  bear: {
    icon: "◈",
    label: "BEAR AGENT",
    desc: "Hunting for red flags",
    color: "#ff4d6d",
  },
  detective: {
    icon: "◎",
    label: "DETECTIVE AGENT",
    desc: "Auditing all evidence",
    color: "#e8a020",
  },
  orchestrator: {
    icon: "⊕",
    label: "ORCHESTRATOR",
    desc: "Final verdict engine",
    color: "#c9a227",
  },
};

const AgentCard = ({ agent, status, message, thinking = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = AGENT_META[agent];
  const isRunning = status === "running",
    isDone = status === "done";
  return (
    <div
      className="war-card"
      style={{ overflow: "hidden", position: "relative" }}
    >
      {isDone && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg,transparent,${meta.color}40,transparent)`,
          }}
        />
      )}
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: isDone ? "none" : "default",
        }}
        onClick={() => isDone && setExpanded((e) => !e)}
        data-hover
      >
        <span
          style={{
            fontSize: 18,
            color: isDone ? meta.color : isRunning ? meta.color : "#2a2010",
            textShadow: isDone ? `0 0 12px ${meta.color}60` : "none",
          }}
        >
          {meta.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: isDone ? "#e8d9b0" : isRunning ? "#9a8660" : "#2a2010",
              letterSpacing: 2,
            }}
          >
            {meta.label}
          </div>
          <div style={{ fontSize: 10, color: "#5a4820", marginTop: 2 }}>
            {message || (isRunning ? meta.desc + "..." : meta.desc)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isRunning && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: meta.color,
                animation: "pulse-gold 1s ease infinite",
                display: "inline-block",
                boxShadow: `0 0 10px ${meta.color}`,
              }}
            />
          )}
          {isDone && (
            <span style={{ fontSize: 10, color: meta.color, letterSpacing: 1 }}>
              {expanded ? "▲ COLLAPSE" : "▼ EXPAND"}
            </span>
          )}
          {status === "pending" && (
            <span style={{ fontSize: 10, color: "#2a2010", letterSpacing: 1 }}>
              PENDING
            </span>
          )}
        </div>
      </div>
      {isRunning && (
        <div
          style={{
            height: 2,
            background: "rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: `linear-gradient(90deg,transparent,${meta.color},transparent)`,
              animation: "scan-line 1.5s linear infinite",
              width: "60%",
            }}
          />
        </div>
      )}
      {expanded && thinking.length > 0 && (
        <div
          style={{
            padding: "0 16px 16px",
            maxHeight: 300,
            overflowY: "auto",
            borderTop: "1px solid rgba(245,200,66,0.08)",
          }}
        >
          <div style={{ paddingTop: 12 }}>
            {thinking.map((item, i) => (
              <ThinkingItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TrackCard = ({ track, trackType }) => {
  const [showEmail, setShowEmail] = useState(false);
  if (!track) return null;
  const {
    verdict,
    confidence,
    regretScore,
    decidingFactors,
    targetDecisionMaker,
    outreachEmail,
    ifHold,
    ifAvoid,
  } = track;
  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.AVOID;
  return (
    <div
      className="war-card fade-in-up"
      style={{ padding: 20, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg,transparent,${cfg.color}30,transparent)`,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <SectionLabel>{trackType} TRACK</SectionLabel>
          <VerdictBadge verdict={verdict} size="lg" />
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <ScoreRing score={confidence} label="CONF" color={cfg.color} />
          <ScoreRing
            score={regretScore?.score || 0}
            label="REGRET"
            color="#9a6820"
          />
        </div>
      </div>
      {regretScore?.reason && (
        <div
          style={{
            fontSize: 11,
            color: "#7a6840",
            marginBottom: 16,
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {regretScore.reason}
        </div>
      )}
      {decidingFactors && (
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>DECIDING FACTORS</SectionLabel>
          {Object.entries(decidingFactors).map(([k, v]) => {
            if (!v) return null;
            return (
              <div
                key={k}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 11,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: "#5a4820",
                    flexShrink: 0,
                    width: 160,
                    fontSize: 10,
                  }}
                >
                  {k.replace(/([A-Z])/g, " $1").toUpperCase()}
                </span>
                <span style={{ color: "#9a8660" }}>
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {targetDecisionMaker && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "rgba(10,7,0,0.5)",
            borderRadius: 8,
            border: "1px solid rgba(245,200,66,0.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <SectionLabel>TARGET DECISION MAKER</SectionLabel>
          <div
            style={{
              fontSize: 13,
              color: "#e8d9b0",
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            {targetDecisionMaker.title}
          </div>
          <div style={{ fontSize: 11, color: "#7a6840", marginBottom: 6 }}>
            {targetDecisionMaker.why}
          </div>
          <div style={{ fontSize: 10, color: "#5a4820" }}>
            🔍 {targetDecisionMaker.linkedinSearchTip}
          </div>
        </div>
      )}
      {(ifHold || ifAvoid) && (
        <div
          style={{
            marginBottom: 16,
            padding: 10,
            background:
              verdict === "HOLD"
                ? "rgba(232,160,32,0.06)"
                : "rgba(255,77,109,0.06)",
            border: `1px solid ${verdict === "HOLD" ? "rgba(232,160,32,0.2)" : "rgba(255,77,109,0.2)"}`,
            borderRadius: 7,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: verdict === "HOLD" ? "#e8a020" : "#ff4d6d",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            {verdict === "HOLD" ? "WATCH FOR" : "NEEDS BEFORE PURSUING"}
          </div>
          <div style={{ fontSize: 11, color: "#9a8660" }}>
            {ifHold || ifAvoid}
          </div>
        </div>
      )}
      {outreachEmail && (
        <div>
          <button
            onClick={() => setShowEmail((e) => !e)}
            style={{
              background: "rgba(245,200,66,0.04)",
              border: "1px solid rgba(245,200,66,0.12)",
              color: "#7a6840",
              padding: "8px 14px",
              borderRadius: 6,
              fontSize: 11,
              cursor: "none",
              fontFamily: "IBM Plex Mono",
              letterSpacing: 1,
              marginBottom: showEmail ? 10 : 0,
              width: "100%",
              transition: "all 0.2s",
            }}
            data-hover
          >
            {showEmail ? "▲ HIDE OUTREACH EMAIL" : "▼ VIEW OUTREACH EMAIL"}
          </button>
          {showEmail && (
            <div
              style={{
                padding: 14,
                background: "rgba(8,6,0,0.6)",
                borderRadius: 8,
                fontSize: 11,
                border: "1px solid rgba(245,200,66,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ color: "#5a4820", marginBottom: 4 }}>SUBJECT:</div>
              <div style={{ color: "#e8d9b0", marginBottom: 10 }}>
                {outreachEmail.subject}
              </div>
              <div style={{ color: "#5a4820", marginBottom: 4 }}>BODY:</div>
              <pre
                style={{
                  color: "#9a8660",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  fontFamily: "IBM Plex Mono",
                  fontSize: 11,
                }}
              >
                {outreachEmail.body}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ResultsView = ({ result }) => {
  const {
    companyName,
    domain,
    confirmedScale,
    recommendedApproach,
    recommendedApproachReason,
    executiveSummary,
    customerTrack,
    partnerTrack,
    clientAdvantages,
    clientDisadvantages,
    proposedNextSteps,
    documents,
  } = result;
  const triggerDownload = (filename) => {
    const a = document.createElement("a");
    a.href = `${BASE_URL}/api/download/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div
      style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }}
      className="fade-in-up"
    >
      {/* Banner */}
      <div
        className="war-card glow-card"
        style={{
          padding: "24px 28px",
          marginBottom: 24,
          borderColor: "rgba(245,200,66,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg,#b8860b,#f5c842,transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "30%",
            background:
              "radial-gradient(ellipse at right, rgba(245,200,66,0.04), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#5a4820",
                letterSpacing: 3,
                marginBottom: 6,
              }}
            >
              ANALYSIS COMPLETE — {domain}
            </div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#f0e8d0",
                marginBottom: 8,
              }}
            >
              {companyName}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: "rgba(245,200,66,0.08)",
                  border: "1px solid rgba(245,200,66,0.2)",
                  borderRadius: 5,
                  color: "#f5c842",
                  letterSpacing: 2,
                }}
              >
                {confirmedScale}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: "rgba(232,160,32,0.08)",
                  border: "1px solid rgba(232,160,32,0.2)",
                  borderRadius: 5,
                  color: "#e8a020",
                  letterSpacing: 1,
                }}
              >
                {APPROACH_LABELS[recommendedApproach] || recommendedApproach}
              </span>
            </div>
          </div>
        </div>
        {executiveSummary && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid rgba(245,200,66,0.08)",
              fontSize: 13,
              color: "#9a8660",
              lineHeight: 1.7,
              maxWidth: 800,
            }}
          >
            {executiveSummary}
          </div>
        )}
        {recommendedApproachReason && (
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: "#7a6840",
              fontStyle: "italic",
            }}
          >
            ↳ {recommendedApproachReason}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <TrackCard track={customerTrack} trackType="CUSTOMER" />
        <TrackCard track={partnerTrack} trackType="PARTNER" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div className="war-card" style={{ padding: 20 }}>
          <SectionLabel>CLIENT ADVANTAGES</SectionLabel>
          {(clientAdvantages || []).map((a, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 11 }}
            >
              <span style={{ color: "#f5c842", flexShrink: 0 }}>+</span>
              <span style={{ color: "#9a8660" }}>
                {typeof a === "object"
                  ? a.advantage || a.text || JSON.stringify(a)
                  : String(a ?? "")}
              </span>
            </div>
          ))}
          {(clientDisadvantages || []).length > 0 && (
            <>
              <div
                style={{
                  height: 1,
                  background: "rgba(245,200,66,0.08)",
                  margin: "12px 0",
                }}
              />
              <SectionLabel>OBSTACLES</SectionLabel>
              {(clientDisadvantages || []).map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: "#ff4d6d", flexShrink: 0 }}>−</span>
                  <span style={{ color: "#9a8660" }}>
                    {typeof d === "object"
                      ? d.disadvantage || d.text || JSON.stringify(d)
                      : String(d ?? "")}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="war-card" style={{ padding: 20 }}>
          <SectionLabel>PROPOSED NEXT STEPS</SectionLabel>
          {(proposedNextSteps || []).map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 10,
                fontSize: 11,
              }}
            >
              <span
                style={{ color: "#5a4820", flexShrink: 0, fontWeight: 600 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "#9a8660", lineHeight: 1.5 }}>
                {typeof step === "object"
                  ? step.step ||
                    step.action ||
                    step.text ||
                    JSON.stringify(step)
                  : String(step ?? "")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {documents && (
        <div className="war-card" style={{ padding: 20 }}>
          <SectionLabel>GENERATED DOCUMENTS</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            {[
              {
                label: "Customer Dossier",
                file: documents.customer?.dossier,
                ext: "DOCX",
              },
              {
                label: "Customer Summary",
                file: documents.customer?.executiveSummary,
                ext: "PDF",
              },
              {
                label: "Partner Dossier",
                file: documents.partner?.dossier,
                ext: "DOCX",
              },
              {
                label: "Partner Summary",
                file: documents.partner?.executiveSummary,
                ext: "PDF",
              },
            ].map(({ label, file, ext }, i) => (
              <button
                key={i}
                onClick={() => file && triggerDownload(file)}
                disabled={!file}
                data-hover
                style={{
                  background: file
                    ? "rgba(245,200,66,0.05)"
                    : "rgba(20,14,4,0.3)",
                  border: `1px solid ${file ? "rgba(245,200,66,0.18)" : "rgba(245,200,66,0.05)"}`,
                  borderRadius: 8,
                  padding: "14px 12px",
                  cursor: file ? "none" : "not-allowed",
                  textAlign: "center",
                  fontFamily: "IBM Plex Mono",
                  transition: "all 0.2s",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    marginBottom: 6,
                    color: file ? "#f5c842" : "#2a2010",
                  }}
                >
                  {ext === "PDF" ? "📋" : "📄"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: file ? "#9a8660" : "#2a2010",
                    letterSpacing: 1,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: file ? "#f5c842" : "#2a2010",
                    marginTop: 2,
                    letterSpacing: 2,
                  }}
                >
                  {ext}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WarRoom = ({ user, onNav }) => {
  const [appState, setAppState] = useState("IDLE");
  const [clientUrl, setClientUrl] = useState("");
  const [clientProfile, setClientProfile] = useState("");
  const [profileError, setProfileError] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [analyzeError, setAnalyzeError] = useState("");
  const [profilePreview, setProfilePreview] = useState(false);
  const [agentStatus, setAgentStatus] = useState({
    bull: "pending",
    bear: "pending",
    detective: "pending",
    orchestrator: "pending",
  });
  const [agentMessages, setAgentMessages] = useState({
    bull: "",
    bear: "",
    detective: "",
    orchestrator: "",
  });
  const [agentThinking, setAgentThinking] = useState({
    bull: [],
    bear: [],
    detective: [],
    orchestrator: [],
  });
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState(null);
  const readerRef = useRef(null);

  const handleGenerateProfile = async () => {
    if (!clientUrl.trim()) return;
    setAppState("PROFILING");
    setProfileError("");
    try {
      const res = await fetch(`${BASE_URL}/api/generate-client-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: clientUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Profile generation failed");
      setClientProfile(data.clientProfile);
      setAppState("READY");
    } catch (e) {
      setProfileError(e.message);
      setAppState("IDLE");
    }
  };

  const handleAnalyze = async () => {
    if (!targetDomain.trim()) return;
    const domain = targetDomain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
    setAppState("ANALYZING");
    setAnalyzeError("");
    setResult(null);
    setCompanyName("");
    setAgentStatus({
      bull: "pending",
      bear: "pending",
      detective: "pending",
      orchestrator: "pending",
    });
    setAgentMessages({ bull: "", bear: "", detective: "", orchestrator: "" });
    setAgentThinking({ bull: [], bear: [], detective: [], orchestrator: [] });
    try {
      const res = await fetch(`${BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, client_info: clientProfile }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Analysis failed");
      }
      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") {
            reader.cancel();
            break;
          }
          try {
            handleSSEEvent(JSON.parse(raw));
          } catch (_) {}
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        setAnalyzeError(e.message);
        setAppState("ERROR");
      }
    }
  };

  const handleSSEEvent = useCallback((event) => {
    const { phase } = event;
    if (event.companyName) setCompanyName(event.companyName);
    const agentMap = {
      BULL_START: "bull",
      BULL_DONE: "bull",
      BEAR_START: "bear",
      BEAR_DONE: "bear",
      DETECTIVE_START: "detective",
      DETECTIVE_DONE: "detective",
      ORCHESTRATOR_START: "orchestrator",
      ORCHESTRATOR_DONE: "orchestrator",
    };
    if (phase.endsWith("_START")) {
      const a = agentMap[phase];
      setAgentStatus((s) => ({ ...s, [a]: "running" }));
      setAgentMessages((m) => ({ ...m, [a]: event.message || "" }));
    } else if (phase.endsWith("_DONE")) {
      const a = agentMap[phase];
      setAgentStatus((s) => ({ ...s, [a]: "done" }));
      setAgentMessages((m) => ({ ...m, [a]: event.message || "" }));
      if (event.thinking)
        setAgentThinking((t) => ({ ...t, [a]: event.thinking }));
    } else if (phase === "COMPLETE") {
      setResult(event.result);
      setAppState("RESULTS");
    } else if (phase === "ERROR") {
      const a = (event.agent || "").toLowerCase();
      if (a) setAgentStatus((s) => ({ ...s, [a]: "error" }));
      setAnalyzeError(`${event.agent}: ${event.message}`);
      setAppState("ERROR");
    }
  }, []);

  const goldBtn = (onClick, disabled, label, loading = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-hover
      style={{
        padding: "10px 22px",
        borderRadius: 7,
        fontFamily: "IBM Plex Mono",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 1,
        cursor: disabled ? "not-allowed" : "none",
        background: disabled
          ? "rgba(245,200,66,0.05)"
          : "linear-gradient(135deg,#b8860b,#f5c842,#c9a227)",
        color: disabled ? "#3a2e18" : "#0d0900",
        border: "none",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.2s",
        boxShadow: disabled ? "none" : "0 4px 16px rgba(245,200,66,0.2)",
      }}
    >
      {loading ? "PROCESSING..." : label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080600" }}>
      {/* IDLE / PROFILING */}
      {(appState === "IDLE" || appState === "PROFILING") && (
        <div
          style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px" }}
          className="page-in"
        >
          <div
            className="war-card"
            style={{ padding: 32, position: "relative", overflow: "hidden" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 32,
                right: 32,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(245,200,66,0.3),transparent)",
              }}
            />
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: "#f0e8d0",
                marginBottom: 6,
                letterSpacing: 1,
              }}
            >
              INITIALIZE CLIENT
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#5a4820",
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Enter your company URL. ALLYVEX will build an intelligence profile
              used in all subsequent target analyses.
            </div>
            <SectionLabel>YOUR COMPANY URL</SectionLabel>
            <input
              className="input-field"
              value={clientUrl}
              onChange={(e) => setClientUrl(e.target.value)}
              placeholder="https://yourcompany.ai"
              disabled={appState === "PROFILING"}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateProfile()}
            />
            {profileError && (
              <div
                style={{
                  fontSize: 11,
                  color: "#ff4d6d",
                  marginTop: 10,
                  padding: "8px 12px",
                  background: "rgba(255,77,109,0.07)",
                  borderRadius: 6,
                  border: "1px solid rgba(255,77,109,0.2)",
                }}
              >
                ✗ {profileError}
              </div>
            )}
            <div style={{ marginTop: 18 }}>
              {goldBtn(
                handleGenerateProfile,
                !clientUrl.trim() || appState === "PROFILING",
                appState === "PROFILING"
                  ? "GENERATING PROFILE..."
                  : "GENERATE CLIENT PROFILE →",
              )}
            </div>
            {appState === "PROFILING" && (
              <div
                style={{
                  marginTop: 20,
                  padding: "12px 16px",
                  background: "rgba(8,6,0,0.5)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#5a4820",
                  border: "1px solid rgba(245,200,66,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    animation: "blink 1s infinite",
                    display: "inline-block",
                    marginRight: 8,
                    color: "#f5c842",
                  }}
                >
                  ▌
                </span>
                Scraping {clientUrl}... building intelligence profile...
              </div>
            )}
          </div>
        </div>
      )}

      {/* READY */}
      {appState === "READY" && (
        <div
          style={{ maxWidth: 720, margin: "40px auto", padding: "0 24px" }}
          className="page-in"
        >
          <div
            className="war-card"
            style={{
              padding: 20,
              marginBottom: 20,
              borderColor: "rgba(245,200,66,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(245,200,66,0.3),transparent)",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#f5c842",
                    letterSpacing: 2,
                    marginBottom: 4,
                  }}
                >
                  ✓ CLIENT PROFILE LOADED
                </div>
                <div style={{ fontSize: 12, color: "#9a8660" }}>
                  {clientUrl}
                </div>
              </div>
              <button
                onClick={() => setProfilePreview((p) => !p)}
                style={{
                  background: "rgba(245,200,66,0.05)",
                  border: "1px solid rgba(245,200,66,0.15)",
                  color: "#7a6840",
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 10,
                  cursor: "none",
                  fontFamily: "IBM Plex Mono",
                  letterSpacing: 1,
                  transition: "all 0.2s",
                }}
                data-hover
              >
                {profilePreview ? "HIDE" : "PREVIEW"}
              </button>
            </div>
            {profilePreview && (
              <pre
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: "rgba(4,3,0,0.5)",
                  borderRadius: 8,
                  fontSize: 10,
                  color: "#7a6840",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  maxHeight: 200,
                  overflowY: "auto",
                  fontFamily: "IBM Plex Mono",
                  border: "1px solid rgba(245,200,66,0.06)",
                }}
              >
                {clientProfile}
              </pre>
            )}
          </div>
          <div
            className="war-card"
            style={{ padding: 28, position: "relative", overflow: "hidden" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 32,
                right: 32,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(245,200,66,0.2),transparent)",
              }}
            />
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#f0e8d0",
                marginBottom: 6,
              }}
            >
              RUN TARGET ANALYSIS
            </div>
            <div style={{ fontSize: 11, color: "#5a4820", marginBottom: 24 }}>
              Enter the domain of a company to evaluate as a potential customer
              or partner.
            </div>
            <SectionLabel>TARGET DOMAIN</SectionLabel>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                className="input-field"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="amazon.com"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                style={{ flex: 1 }}
              />
              {goldBtn(handleAnalyze, !targetDomain.trim(), "ANALYZE →")}
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: "#2a2010" }}>
              Strip https:// and www. — just the root domain
            </div>
          </div>
        </div>
      )}

      {/* ANALYZING / ERROR */}
      {(appState === "ANALYZING" || appState === "ERROR") && (
        <div
          style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px" }}
          className="page-in"
        >
          {companyName && (
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: 24,
                  color: "#f0e8d0",
                  letterSpacing: 1,
                  textShadow: "0 0 30px rgba(245,200,66,0.15)",
                }}
              >
                {companyName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#5a4820",
                  letterSpacing: 2,
                  marginTop: 4,
                }}
              >
                INTELLIGENCE GATHERING IN PROGRESS
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["bull", "bear", "detective", "orchestrator"].map((a) => (
              <AgentCard
                key={a}
                agent={a}
                status={agentStatus[a]}
                message={agentMessages[a]}
                thinking={agentThinking[a]}
              />
            ))}
          </div>
          {appState === "ERROR" && analyzeError && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  padding: "14px 16px",
                  background: "rgba(255,77,109,0.07)",
                  border: "1px solid rgba(255,77,109,0.25)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#ff4d6d",
                  marginBottom: 12,
                }}
              >
                ✗ {analyzeError}
              </div>
              <button
                onClick={() => setAppState("READY")}
                data-hover
                style={{
                  padding: "10px 20px",
                  borderRadius: 7,
                  fontFamily: "IBM Plex Mono",
                  fontSize: 12,
                  letterSpacing: 1,
                  cursor: "none",
                  background: "rgba(245,200,66,0.05)",
                  color: "#f5c842",
                  border: "1px solid rgba(245,200,66,0.2)",
                }}
              >
                ← RETRY
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {appState === "RESULTS" && result && (
        <>
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "16px 40px",
              borderBottom: "1px solid rgba(245,200,66,0.08)",
              alignItems: "center",
              background: "rgba(8,6,0,0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <button
              onClick={() => setAppState("READY")}
              data-hover
              style={{
                padding: "8px 16px",
                borderRadius: 7,
                fontFamily: "IBM Plex Mono",
                fontSize: 11,
                letterSpacing: 1,
                cursor: "none",
                background: "rgba(245,200,66,0.05)",
                color: "#f5c842",
                border: "1px solid rgba(245,200,66,0.18)",
                transition: "all 0.2s",
              }}
            >
              ← NEW ANALYSIS
            </button>
            <span style={{ fontSize: 10, color: "#2a2010" }}>|</span>
            <span style={{ fontSize: 10, color: "#5a4820", letterSpacing: 1 }}>
              {result.domain} · {result.confirmedScale}
            </span>
          </div>
          <ResultsView result={result} />
        </>
      )}

      <div
        style={{
          textAlign: "center",
          padding: "40px 24px",
          fontSize: 10,
          color: "#2a2010",
          letterSpacing: 2,
        }}
      >
        ALLYVEX WAR ROOM — INTELLIGENCE PIPELINE v1.0
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
// ROOT APP — ROUTER
// ══════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const handleNav = (target) => {
    if (target === "warroom" && !user) {
      setPage("login");
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSuccess = (email) => {
    setUser(email);
    setPage("warroom");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setUser(null);
    setPage("landing");
  };

  return (
    <>
      <style>{STYLES}</style>
      <Cursor />
      <Nav
        page={page}
        onNav={(p) =>
          p === "landing" && user
            ? handleLogout() || handleNav("landing")
            : p === "warroom" || handleNav(p)
        }
        user={user}
      />
      <div style={{ paddingTop: page === "landing" ? 0 : 73 }}>
        {page === "landing" && <LandingPage onNav={handleNav} />}
        {page === "login" && (
          <LoginPage onNav={handleNav} onSuccess={handleAuthSuccess} />
        )}
        {page === "register" && (
          <RegisterPage onNav={handleNav} onSuccess={handleAuthSuccess} />
        )}
        {page === "warroom" && <WarRoom user={user} onNav={handleNav} />}
      </div>
    </>
  );
}
