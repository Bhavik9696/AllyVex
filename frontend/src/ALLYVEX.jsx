import {
  useState,
  useRef,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8000";

// ─── Responsive Hook ─────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);

const THEMES = {
  gold: {
    name: "gold",
    // Primary accent
    accent: "#f5c842",
    accentDim: "rgba(245,200,66,0.6)",
    accentGlow: "rgba(245,200,66,0.3)",
    accentBg: "rgba(245,200,66,0.06)",
    accentBg2: "rgba(245,200,66,0.1)",
    accentBorder: "rgba(245,200,66,0.2)",
    accentBorder2: "rgba(245,200,66,0.35)",
    accentBorderStrong: "rgba(245,200,66,0.5)",
    // Secondary
    secondary: "#e8a020",
    secondaryBg: "rgba(232,160,32,0.08)",
    secondaryBorder: "rgba(232,160,32,0.2)",
    tertiary: "#c9a227",
    tertiaryBg: "rgba(201,162,39,0.08)",
    // Danger
    danger: "#ff4d6d",
    dangerBg: "rgba(255,77,109,0.07)",
    dangerBorder: "rgba(255,77,109,0.25)",
    // Background
    bg: "#080600",
    bgDeep: "#080600",
    bgCard: "rgba(18,13,4,0.65)",
    bgCard2: "rgba(20,15,5,0.55)",
    bgInput: "rgba(10,7,2,0.7)",
    bgGlass: "rgba(30,20,5,0.6)",
    bgNav: "rgba(8,6,0,0.75)",
    bgOverlay: "rgba(6,4,0,0.6)",
    bgButton: "rgba(245,200,66,0.04)",
    // Text
    textPrimary: "#e8d9b0",
    textHeading: "#f0e8d0",
    textBright: "#f0d878",
    textMid: "#9a8660",
    textDim: "#7a6840",
    textFaint: "#5a4820",
    textVeryFaint: "#3a2e18",
    textDarkest: "#2a2010",
    // Orb gradients
    orbTop: "rgba(180,130,10,0.09)",
    orbBottom: "rgba(200,140,10,0.06)",
    radialHero:
      "radial-gradient(ellipse at 50% 0%, rgba(40,28,4,0.8) 0%, #080600 60%)",
    // Logo gradient
    logoGradient: "linear-gradient(135deg, #b8860b, #f5c842, #c9a227)",
    logoGradientBtn: "linear-gradient(135deg, #c9a227, #f5c842, #b8860b)",
    logoColor: "#0d0900",
    // Grid
    gridColor: "rgba(245,200,66,0.018)",
    // Scan line
    scanColor: "rgba(245,200,66,0.7)",
    // Scrollbar
    scrollThumb: "rgba(245,200,66,0.2)",
    // Selection
    selectionBg: "rgba(245,200,66,0.25)",
    selectionColor: "#ffd700",
    // cursor inner
    cursorInner: "#f5c842",
    cursorGlow: "0 0 8px #f5c842, 0 0 20px rgba(245,200,66,0.5)",
    // Agent colors
    bull: "#f5c842",
    bear: "#ff4d6d",
    detective: "#e8a020",
    orchestrator: "#c9a227",
    // Verdicts
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
    // Toggle button
    toggleBg: "rgba(245,200,66,0.08)",
    toggleBorder: "rgba(245,200,66,0.25)",
    toggleColor: "#f5c842",
    toggleLabel: "NEBULA MODE",
    toggleIcon: "◈",
  },
  purple: {
    name: "purple",
    // Primary accent
    accent: "#a78bfa",
    accentDim: "rgba(167,139,250,0.6)",
    accentGlow: "rgba(167,139,250,0.3)",
    accentBg: "rgba(167,139,250,0.06)",
    accentBg2: "rgba(167,139,250,0.1)",
    accentBorder: "rgba(167,139,250,0.2)",
    accentBorder2: "rgba(167,139,250,0.35)",
    accentBorderStrong: "rgba(167,139,250,0.5)",
    // Secondary
    secondary: "#60a5fa",
    secondaryBg: "rgba(96,165,250,0.08)",
    secondaryBorder: "rgba(96,165,250,0.2)",
    tertiary: "#818cf8",
    tertiaryBg: "rgba(129,140,248,0.08)",
    // Danger
    danger: "#f472b6",
    dangerBg: "rgba(244,114,182,0.07)",
    dangerBorder: "rgba(244,114,182,0.25)",
    // Background
    bg: "#04020e",
    bgDeep: "#04020e",
    bgCard: "rgba(10,5,30,0.7)",
    bgCard2: "rgba(12,6,28,0.6)",
    bgInput: "rgba(6,3,18,0.75)",
    bgGlass: "rgba(14,7,35,0.65)",
    bgNav: "rgba(4,2,14,0.8)",
    bgOverlay: "rgba(3,1,10,0.65)",
    bgButton: "rgba(167,139,250,0.05)",
    // Text
    textPrimary: "#c4b5f4",
    textHeading: "#e2d9f3",
    textBright: "#c4b5f4",
    textMid: "#7c6db0",
    textDim: "#5e508a",
    textFaint: "#3d3165",
    textVeryFaint: "#2a2248",
    textDarkest: "#1a1530",
    // Orb gradients
    orbTop: "rgba(88,28,220,0.12)",
    orbBottom: "rgba(37,99,235,0.08)",
    radialHero:
      "radial-gradient(ellipse at 50% 0%, rgba(30,10,80,0.9) 0%, #04020e 60%)",
    // Logo gradient
    logoGradient: "linear-gradient(135deg, #6d28d9, #a78bfa, #818cf8)",
    logoGradientBtn: "linear-gradient(135deg, #5b21b6, #a78bfa, #6d28d9)",
    logoColor: "#e2d9f3",
    // Grid
    gridColor: "rgba(167,139,250,0.018)",
    // Scan line
    scanColor: "rgba(167,139,250,0.7)",
    // Scrollbar
    scrollThumb: "rgba(167,139,250,0.2)",
    // Selection
    selectionBg: "rgba(167,139,250,0.25)",
    selectionColor: "#c4b5f4",
    // cursor inner
    cursorInner: "#a78bfa",
    cursorGlow: "0 0 8px #a78bfa, 0 0 20px rgba(167,139,250,0.5)",
    // Agent colors
    bull: "#a78bfa",
    bear: "#f472b6",
    detective: "#60a5fa",
    orchestrator: "#818cf8",
    // Verdicts
    PURSUE: {
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      border: "rgba(167,139,250,0.35)",
    },
    HOLD: {
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.1)",
      border: "rgba(96,165,250,0.35)",
    },
    AVOID: {
      color: "#f472b6",
      bg: "rgba(244,114,182,0.1)",
      border: "rgba(244,114,182,0.35)",
    },
    // Toggle button
    toggleBg: "rgba(167,139,250,0.08)",
    toggleBorder: "rgba(167,139,250,0.25)",
    toggleColor: "#a78bfa",
    toggleLabel: "GOLD MODE",
    toggleIcon: "◆",
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

// ─── Dynamic Global Styles ────────────────────────────────────────────────────
const makeStyles = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { -webkit-text-size-adjust: 100%; }

  body {
    background: ${t.bg};
    color: ${t.textPrimary};
    font-family: 'IBM Plex Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
    cursor: none;
    transition: background 0.5s ease, color 0.5s ease;
  }

  ::selection { background: ${t.selectionBg}; color: ${t.selectionColor}; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${t.bg}; }
  ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 2px; }

  #cursor-outer {
    position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid ${t.accentDim};
    transform: translate(-50%, -50%);
    transition: transform 0.12s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
    mix-blend-mode: screen;
  }
  #cursor-inner {
    position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none;
    width: 6px; height: 6px; border-radius: 50%;
    background: ${t.accent};
    transform: translate(-50%, -50%);
    transition: transform 0.05s ease;
    box-shadow: ${t.cursorGlow};
  }

  @keyframes pulse-accent { 0%,100%{opacity:1} 50%{opacity:0.35} }
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
  @keyframes gold-glow-pulse { 0%,100%{box-shadow:0 0 20px ${t.accentBg}} 50%{box-shadow:0 0 40px ${t.accentGlow}, 0 0 80px ${t.accentBg}} }
  @keyframes theme-switch { 0%{opacity:0;transform:scale(0.96)} 100%{opacity:1;transform:scale(1)} }

  .fade-in-up { animation: fade-in-up 0.4s ease forwards; }
  .thinking-appear { animation: thinking-appear 0.3s ease forwards; }
  .page-in { animation: page-in 0.45s ease forwards; }
  .theme-transition { animation: theme-switch 0.4s ease forwards; }

  .glass {
    background: ${t.bgCard2};
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid ${t.accentBorder};
    border-radius: 12px;
  }
  .glass-gold {
    background: ${t.bgGlass};
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
    border: 1px solid ${t.accentBorder2};
    border-radius: 12px;
    position: relative;
  }

  .btn-primary {
    background: ${t.logoGradientBtn};
    background-size: 200% 100%;
    color: ${t.logoColor};
    border: none;
    padding: 13px 28px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: none;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    box-shadow: 0 4px 20px ${t.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    background-size: 200% 100%;
    animation: shimmer 2.5s infinite;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px ${t.accentGlow}, 0 8px 24px rgba(0,0,0,0.4); }

  .btn-secondary {
    background: ${t.accentBg};
    color: ${t.accent};
    border: 1px solid ${t.accentBorder2};
    padding: 13px 28px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    cursor: none;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    white-space: nowrap;
    backdrop-filter: blur(10px);
  }
  .btn-secondary:hover { background: ${t.accentBg2}; border-color: ${t.accentBorderStrong}; transform: translateY(-2px); }

  .btn-ghost {
    background: rgba(255,255,255,0.03);
    color: ${t.textDim};
    border: 1px solid rgba(255,255,255,0.07);
    padding: 13px 28px;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 2px;
    cursor: none;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    backdrop-filter: blur(10px);
  }
  .btn-ghost:hover { background: ${t.accentBg}; color: ${t.textMid}; border-color: ${t.accentBorder2}; }

  .feature-card {
    background: ${t.bgCard};
    backdrop-filter: blur(20px) saturate(130%);
    -webkit-backdrop-filter: blur(20px) saturate(130%);
    border: 1px solid ${t.accentBorder};
    border-radius: 16px;
    padding: 28px;
    transition: all 0.35s;
    cursor: none;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 0%, ${t.accentBg}, transparent 60%);
    opacity: 0; transition: opacity 0.35s;
  }
  .feature-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, ${t.accentBorder2}, transparent);
    opacity: 0; transition: opacity 0.35s;
  }
  .feature-card:hover::before, .feature-card:hover::after { opacity: 1; }
  .feature-card:hover { border-color: ${t.accentBorder2}; transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.5); }

  .agent-pill {
    display: flex; align-items: center; gap: 10px; padding: 12px 20px;
    border-radius: 10px; border: 1px solid ${t.accentBorder};
    background: ${t.bgCard}; backdrop-filter: blur(16px);
    transition: all 0.25s; cursor: none;
  }
  .agent-pill:hover { border-color: ${t.accentBorder2}; background: ${t.accentBg}; transform: translateY(-2px); }

  .stat-card {
    padding: 24px 28px; text-align: center;
    border-right: 1px solid ${t.accentBorder};
    background: ${t.bgCard}; backdrop-filter: blur(16px);
    transition: background 0.25s;
  }
  .stat-card:hover { background: ${t.accentBg}; }
  .stat-card:last-child { border-right: none; }

  .nav-link {
    font-size: 11px; letter-spacing: 1.5px; color: ${t.textDim};
    cursor: none; transition: color 0.2s;
    font-family: 'IBM Plex Mono', monospace;
    white-space: nowrap;
  }
  .nav-link:hover { color: ${t.accent}; }

  .input-field {
    width: 100%; padding: 13px 16px;
    background: ${t.bgInput}; backdrop-filter: blur(12px);
    border: 1px solid ${t.accentBorder};
    border-radius: 8px; color: ${t.textPrimary};
    font-family: 'IBM Plex Mono', monospace; font-size: 13px;
    outline: none; transition: all 0.25s; cursor: none;
    -webkit-appearance: none;
  }
  .input-field:focus { border-color: ${t.accentBorderStrong}; box-shadow: 0 0 0 3px ${t.accentBg}, 0 0 20px ${t.accentBg}; }
  .input-field::placeholder { color: ${t.textVeryFaint}; }

  .war-card {
    background: ${t.bgCard};
    backdrop-filter: blur(20px) saturate(130%);
    -webkit-backdrop-filter: blur(20px) saturate(130%);
    border: 1px solid ${t.accentBorder};
    border-radius: 10px;
    transition: border-color 0.5s ease, background 0.5s ease;
  }

  .section-divider { height: 1px; background: linear-gradient(90deg, transparent, ${t.accentBorder2}, transparent); }
  .glow-card { animation: gold-glow-pulse 4s ease-in-out infinite; }

  .theme-toggle {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 20px;
    background: ${t.toggleBg}; border: 1px solid ${t.toggleBorder};
    color: ${t.toggleColor};
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    font-weight: 600; letter-spacing: 1.5px;
    cursor: none; transition: all 0.3s ease;
    position: relative; overflow: hidden; white-space: nowrap;
  }
  .theme-toggle::before { content: ''; position: absolute; inset: 0; background: ${t.accentBg2}; opacity: 0; transition: opacity 0.3s; }
  .theme-toggle:hover::before { opacity: 1; }
  .theme-toggle:hover { border-color: ${t.accentBorderStrong}; box-shadow: 0 0 16px ${t.accentGlow}; transform: translateY(-1px); }

  /* ─── Tablet (≤900px) ─────────────────────────────────── */
  @media (max-width: 900px) {
    .feature-card:hover { transform: none; box-shadow: none; }
    .agent-pill:hover { transform: none; }
    .btn-primary:hover, .btn-secondary:hover, .btn-ghost:hover { transform: none; }
  }

  /* ─── Mobile (≤768px) ────────────────────────────────── */
  @media (max-width: 768px) {
    body { cursor: auto; }
    #cursor-outer, #cursor-inner { display: none; }

    .btn-primary, .btn-secondary, .btn-ghost {
      padding: 12px 20px; font-size: 11px; letter-spacing: 1px;
    }

    .feature-card { padding: 20px; border-radius: 12px; }
    .agent-pill { padding: 10px 14px; gap: 8px; }

    .stat-card {
      padding: 16px 20px;
      border-right: none;
      border-bottom: 1px solid ${t.accentBorder};
    }
    .stat-card:last-child { border-bottom: none; }

    .war-card { border-radius: 8px; }
    .glass-gold { border-radius: 10px; }

    .theme-toggle { padding: 6px 11px; font-size: 9px; letter-spacing: 1px; }
    .nav-link { font-size: 10px; letter-spacing: 1px; }

    .input-field { font-size: 16px; cursor: auto; }

    /* Hide hero 3D visual on mobile — not enough space */
    .hero-visual-wrapper { display: none !important; }
  }

  /* ─── Small mobile (≤480px) ──────────────────────────── */
  @media (max-width: 480px) {
    .btn-primary, .btn-secondary, .btn-ghost {
      padding: 12px 16px; font-size: 10px; letter-spacing: 1px;
      width: 100%; justify-content: center;
    }

    /* Prevent iOS zoom on input focus */
    .input-field { font-size: 16px; }

    .theme-toggle-label { display: none; }

    .track-header { flex-direction: column !important; gap: 12px !important; }
    .score-rings { flex-direction: row !important; gap: 8px !important; }

    .war-card { border-radius: 6px; }
    .feature-card { border-radius: 10px; }
  }
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

    const onEnter = () => {
      if (outerRef.current) {
        outerRef.current.style.width = "56px";
        outerRef.current.style.height = "56px";
      }
      if (innerRef.current) {
        innerRef.current.style.transform = "translate(-50%,-50%) scale(1.5)";
      }
    };
    const onLeave = () => {
      if (outerRef.current) {
        outerRef.current.style.width = "36px";
        outerRef.current.style.height = "36px";
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
          border: "1.5px solid",
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
          transform: "translate(-50%,-50%)",
          transition: "transform 0.1s",
        }}
      />
    </>
  );
};

// ─── Theme Toggle Button ──────────────────────────────────────────────────────
const ThemeToggle = ({ onToggle }) => {
  const t = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      data-hover
      title={`Switch to ${t.toggleLabel}`}
    >
      <span style={{ fontSize: 13 }}>{t.toggleIcon}</span>
      <span style={{ position: "relative", zIndex: 1 }}>{t.toggleLabel}</span>
      {/* Animated pip */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: t.accent,
          display: "inline-block",
          animation: "pulse-accent 2s ease infinite",
          boxShadow: `0 0 8px ${t.accent}`,
          position: "relative",
          zIndex: 1,
        }}
      />
    </button>
  );
};

// ─── Shared BG Layer ──────────────────────────────────────────────────────────
const BgLayer = ({ mousePos }) => {
  const t = useTheme();
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: t.radialHero,
          transition: "background 0.6s ease",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,
          backgroundSize: "80px 80px",
          animation: "grid-move 30s linear infinite",
          transition: "opacity 0.5s",
        }}
      />
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
          background: `radial-gradient(ellipse, ${t.orbTop} 0%, transparent 65%)`,
          transform: mousePos
            ? `translate(${mousePos.x * -40}px,${mousePos.y * -40}px)`
            : "none",
          transition:
            "transform 0.9s cubic-bezier(.25,.46,.45,.94), background 0.6s ease",
          animation: "orb-drift 20s ease-in-out infinite",
        }}
      />
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
          background: `radial-gradient(ellipse, ${t.orbBottom} 0%, transparent 65%)`,
          transform: mousePos
            ? `translate(${mousePos.x * 25}px,${mousePos.y * 25}px)`
            : "none",
          transition:
            "transform 0.9s cubic-bezier(.25,.46,.45,.94), background 0.6s ease",
          animation: "orb-drift-2 25s ease-in-out infinite",
        }}
      />
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
};

// ─── Global Nav ───────────────────────────────────────────────────────────────
const Nav = ({ page, onNav, user, onToggleTheme }) => {
  const t = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const navItem = (label, onClick, accent = false) => (
    <div
      key={label}
      onClick={() => {
        onClick();
        closeSidebar();
      }}
      data-hover
      style={{
        padding: "16px 24px",
        fontSize: 12,
        fontFamily: "IBM Plex Mono, monospace",
        letterSpacing: 2,
        fontWeight: accent ? 700 : 400,
        color: accent ? t.logoColor : t.textMid,
        background: accent ? t.logoGradientBtn : "transparent",
        borderRadius: accent ? 8 : 0,
        borderBottom: accent ? "none" : `1px solid ${t.accentBorder}`,
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: accent ? "8px 16px" : 0,
      }}
    >
      {label}
    </div>
  );

  // Desktop nav
  if (!isMobile) {
    return (
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
          padding: "16px 40px",
          background: t.bgNav,
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: `1px solid ${t.accentBorder}`,
          boxShadow: `0 1px 0 ${t.accentBg}, 0 4px 24px rgba(0,0,0,0.5)`,
          transition: "background 0.5s ease, border-color 0.5s ease",
          minHeight: 70,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            cursor: "none",
          }}
          onClick={() => onNav("landing")}
          data-hover
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: t.logoGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Syne, sans-serif",
              fontWeight: 900,
              fontSize: 19,
              color: t.logoColor,
              boxShadow: `0 0 24px ${t.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              transition: "background 0.5s ease, box-shadow 0.5s ease",
            }}
          >
            A
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: t.textBright,
              letterSpacing: 3,
              textShadow: `0 0 20px ${t.accentGlow}`,
              transition: "color 0.5s ease, text-shadow 0.5s ease",
            }}
          >
            ALLYVEX
          </span>
          <span
            style={{
              fontSize: 9,
              color: t.textDarkest,
              letterSpacing: 3,
              transition: "color 0.5s",
            }}
          >
            {page === "warroom" ? "WAR ROOM" : "INTELLIGENCE"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <ThemeToggle onToggle={onToggleTheme} />
          {page === "landing" && (
            <>
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
                    background: t.accent,
                    animation: "pulse-accent 2s ease infinite",
                    display: "inline-block",
                    boxShadow: `0 0 8px ${t.accent}`,
                  }}
                />
                <span
                  style={{ fontSize: 10, color: t.textDim, letterSpacing: 1 }}
                >
                  SYSTEM ONLINE
                </span>
              </div>
              {user && (
                <span style={{ fontSize: 11, color: t.textDim }}>{user}</span>
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
                  background: t.accentBg,
                  color: t.textDim,
                  border: `1px solid ${t.accentBorder}`,
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
  }

  // Mobile nav + sidebar
  return (
    <>
      {/* Mobile top bar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 56,
          background: t.bgNav,
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: `1px solid ${t.accentBorder}`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.5)`,
          transition: "background 0.5s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          onClick={() => {
            onNav("landing");
            closeSidebar();
          }}
          data-hover
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              background: t.logoGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Syne, sans-serif",
              fontWeight: 900,
              fontSize: 16,
              color: t.logoColor,
              boxShadow: `0 0 16px ${t.accentGlow}`,
            }}
          >
            A
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: t.textBright,
              letterSpacing: 2,
              textShadow: `0 0 16px ${t.accentGlow}`,
            }}
          >
            ALLYVEX
          </span>
        </div>

        {/* Right side: theme toggle + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle onToggle={onToggleTheme} />
          {/* Hamburger / close button */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: sidebarOpen ? t.accentBg2 : t.accentBg,
              border: `1px solid ${sidebarOpen ? t.accentBorderStrong : t.accentBorder}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              cursor: "pointer",
              padding: 0,
              transition: "all 0.25s",
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                borderRadius: 2,
                background: t.accent,
                transform: sidebarOpen
                  ? "translateY(6.5px) rotate(45deg)"
                  : "none",
                transition: "transform 0.25s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                borderRadius: 2,
                background: t.accent,
                opacity: sidebarOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                borderRadius: 2,
                background: t.accent,
                transform: sidebarOpen
                  ? "translateY(-6.5px) rotate(-45deg)"
                  : "none",
                transition: "transform 0.25s ease",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        onClick={closeSidebar}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 350,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sidebar drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 400,
          width: 280,
          background: t.bgCard,
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          borderLeft: `1px solid ${t.accentBorder2}`,
          boxShadow: `-20px 0 60px rgba(0,0,0,0.6), inset 1px 0 0 ${t.accentBorder}`,
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${t.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: `linear-gradient(180deg, ${t.accentBg} 0%, transparent 100%)`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 13,
                color: t.textHeading,
                letterSpacing: 3,
              }}
            >
              MENU
            </div>
            {page === "warroom" && user && (
              <div
                style={{
                  fontSize: 10,
                  color: t.textDim,
                  marginTop: 3,
                  letterSpacing: 1,
                }}
              >
                {user}
              </div>
            )}
          </div>
          {page === "warroom" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: t.accent,
                  animation: "pulse-accent 2s ease infinite",
                  display: "inline-block",
                  boxShadow: `0 0 8px ${t.accent}`,
                }}
              />
              <span style={{ fontSize: 9, color: t.textDim, letterSpacing: 1 }}>
                ONLINE
              </span>
            </div>
          )}
        </div>

        {/* Sidebar nav items */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
          {/* Accent top bar on sidebar */}
          <div
            style={{
              height: 2,
              background: `linear-gradient(90deg, ${t.accent}, ${t.secondary}, transparent)`,
              marginBottom: 8,
            }}
          />

          {page === "landing" && (
            <>
              {navItem("⊕  HOME", () => onNav("landing"))}
              {navItem("◎  LOGIN", () => onNav("login"))}
              {navItem("◆  REGISTER", () => onNav("register"))}
            </>
          )}

          {page === "login" && (
            <>
              {navItem("← BACK TO HOME", () => onNav("landing"))}
              {navItem("◆  REGISTER", () => onNav("register"))}
            </>
          )}

          {page === "register" && (
            <>
              {navItem("← BACK TO HOME", () => onNav("landing"))}
              {navItem("◎  LOGIN", () => onNav("login"))}
            </>
          )}

          {page === "warroom" && (
            <>
              {navItem("◈  NEW ANALYSIS", () => {})}
              {navItem("← LOGOUT", () => onNav("landing"))}
            </>
          )}

          {/* GET ACCESS accent button */}
          {page === "landing" &&
            navItem("→ GET ACCESS", () => onNav("register"), true)}
          {page === "warroom" &&
            navItem("→ GO TO HOME", () => onNav("landing"), true)}
        </div>

        {/* Sidebar footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${t.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 9, color: t.textDarkest, letterSpacing: 2 }}>
            ALLYVEX v1.0
          </span>
          <span style={{ fontSize: 9, color: t.textFaint, letterSpacing: 1 }}>
            {t.name === "gold" ? "◆ GOLD" : "◈ NEBULA"}
          </span>
        </div>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════
// PAGE 1: LANDING
// ══════════════════════════════════════════════════════
const HeroVisual = ({ mouseX, mouseY }) => {
  const t = useTheme();
  const rx = mouseY * 15,
    ry = mouseX * 15;
  const colors = [t.bull, t.bear, t.detective, t.orchestrator];
  const agentLabels = [
    { label: "BULL", color: t.bull, offset: { x: -220, y: -80 } },
    { label: "BEAR", color: t.bear, offset: { x: 220, y: 60 } },
    { label: "DETECTIVE", color: t.detective, offset: { x: -180, y: 100 } },
    {
      label: "ORCHESTRATOR",
      color: t.orchestrator,
      offset: { x: 160, y: -110 },
    },
  ];

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
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
      <div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          border: `1px solid ${t.accentBg}`,
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
          border: `1px solid ${t.accentBorder}`,
          borderRadius: "50%",
          transform: `rotateX(${rx * 1.2}deg) rotateY(${ry * 1.2}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: `1px dashed ${t.accentBorder2}`,
          animation: "spin-ring 22s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: `1px dashed ${t.secondaryBorder}`,
          animation: "counter-ring 16s linear infinite",
        }}
      />
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
            background: `radial-gradient(ellipse, ${t.accentBg2} 0%, transparent 60%)`,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              t.name === "gold"
                ? "radial-gradient(ellipse at 35% 35%, rgba(245,200,66,0.28) 0%, rgba(140,100,10,0.45) 50%, rgba(10,7,0,0.95) 100%)"
                : "radial-gradient(ellipse at 35% 35%, rgba(167,139,250,0.28) 0%, rgba(60,30,120,0.45) 50%, rgba(4,2,14,0.95) 100%)",
            borderRadius: "50%",
            border: `1px solid ${t.accentBorder2}`,
            boxShadow: `0 0 70px ${t.accentBg2}, inset 0 0 50px ${t.accentBg}`,
            transition: "background 0.6s ease, box-shadow 0.6s ease",
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
            color: t.accent,
            textShadow: `0 0 30px ${t.accent}, 0 0 60px ${t.accentGlow}`,
            transition: "color 0.5s, text-shadow 0.5s",
          }}
        >
          A
        </div>
      </div>
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
              transition: "transform 0.1s ease-out, background 0.5s",
            }}
          />
        );
      })}
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
            background: `rgba(${hexToRgb(color)},0.08)`,
            border: `1px solid rgba(${hexToRgb(color)},0.28)`,
            borderRadius: 5,
            whiteSpace: "nowrap",
            animation: `float-glyph ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            backdropFilter: "blur(8px)",
            transition: "color 0.5s, border-color 0.5s",
          }}
        >
          {label}
        </div>
      ))}
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
            background: `linear-gradient(90deg, transparent, ${t.scanColor}, transparent)`,
            animation: "scan 3.5s linear infinite",
          }}
        />
      </div>
    </div>
  );
};

const LandingPage = ({ onNav }) => {
  const t = useTheme();
  const isMobile = useIsMobile();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    let handler;
    const timeout = setTimeout(() => {
      handler = (e) =>
        setMousePos({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
      window.addEventListener("mousemove", handler);
    }, 600);
    return () => {
      clearTimeout(timeout);
      if (handler) window.removeEventListener("mousemove", handler);
    };
  }, []);

  const features = [
    {
      icon: "◎",
      color: t.detective,
      title: "Autonomous Research",
      desc: "AI agents crawl the web to build a comprehensive dossier on any target company in seconds.",
    },
    {
      icon: "◈",
      color: t.bull,
      title: "Dual-Track Verdicts",
      desc: "Get a definitive PURSUE / HOLD / AVOID verdict on both Customer and Partner tracks with confidence scores.",
    },
    {
      icon: "⊕",
      color: t.orchestrator,
      title: "Instant Outreach",
      desc: "Generates hyper-personalized draft emails targeted exactly at the right decision-maker.",
    },
  ];
  const agents = [
    {
      icon: "◆",
      name: "Bull Agent",
      color: t.bull,
      desc: "Building the case FOR",
    },
    { icon: "◈", name: "Bear Agent", color: t.bear, desc: "Hunting red flags" },
    {
      icon: "◎",
      name: "Detective Agent",
      color: t.detective,
      desc: "Auditing all evidence",
    },
    {
      icon: "⊕",
      name: "Orchestrator",
      color: t.orchestrator,
      desc: "Final verdict engine",
    },
  ];
  const stats = [
    { val: "4", label: "AI Agents" },
    { val: "2×", label: "Track Analysis" },
    { val: "<60s", label: "Full Intel" },
    { val: "∞", label: "Targets" },
  ];
  const vColors = [t.PURSUE.color, t.HOLD.color, t.AVOID.color];
  const vBgs = [t.PURSUE.bg, t.HOLD.bg, t.AVOID.bg];
  const vBorders = [t.PURSUE.border, t.HOLD.border, t.AVOID.border];

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(20px)",
    transition: `all 0.7s ${delay}s ease`,
  });

  const hexToRgb = (hex) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    } catch {
      return "245,200,66";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        transition: "background 0.5s",
      }}
    >
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
          <div
            style={{
              maxWidth: isMobile ? "100%" : 600,
              position: "relative",
              zIndex: 2,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 18px",
                borderRadius: 6,
                background: t.accentBg,
                border: `1px solid ${t.accentBorder}`,
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
                  background: t.accent,
                  animation: "pulse-accent 1.5s ease infinite",
                  display: "inline-block",
                  boxShadow: `0 0 8px ${t.accent}`,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: t.accent,
                  letterSpacing: 3,
                  fontWeight: 500,
                }}
              >
                ALLYVEX INTELLIGENCE IS LIVE
              </span>
            </div>
            <div style={{ marginBottom: 32, ...anim(0.1) }}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(44px,6vw,84px)",
                  lineHeight: 1.04,
                  letterSpacing: -2,
                  color: t.textHeading,
                }}
              >
                Beyond the
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(44px,6vw,84px)",
                  lineHeight: 1.04,
                  letterSpacing: -2,
                }}
              >
                <span
                  style={{
                    color: t.name === "purple" ? "#f0ecff" : "#f5c842",
                    textShadow:
                      t.name === "purple"
                        ? "0 0 30px rgba(167,139,250,0.8), 0 0 60px rgba(167,139,250,0.4), 0 0 100px rgba(167,139,250,0.2)"
                        : "0 0 30px rgba(245,200,66,0.7), 0 0 60px rgba(245,200,66,0.3)",
                  }}
                >
                  Search Bar.
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: "clamp(14px,1.4vw,18px)",
                color: t.textDim,
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
            <div
              style={{
                display: "flex",
                marginTop: 72,
                border: `1px solid ${t.accentBorder}`,
                borderRadius: 10,
                overflow: "hidden",
                backdropFilter: "blur(16px)",
                ...anim(0.6),
              }}
            >
              {/* {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 800,
                      fontSize: 30,
                      color: t.accent,
                      letterSpacing: 1,
                      marginBottom: 4,
                      textShadow: `0 0 24px ${t.accentGlow}`,
                      transition: "color 0.5s, text-shadow 0.5s",
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textDarkest,
                      letterSpacing: 2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))} */}
            </div>
          </div>
          <div style={{ display: "contents" }} className="hero-visual-wrapper">
            <HeroVisual mouseX={mousePos.x} mouseY={mousePos.y} />
          </div>
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
                color: t.textFaint,
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
                color: t.textHeading,
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Built for Modern Sales Teams
            </h2>
            <p
              style={{
                fontSize: 13,
                color: t.textFaint,
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
                    background: `rgba(${hexToRgb(f.color)},0.08)`,
                    border: `1px solid rgba(${hexToRgb(f.color)},0.22)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: f.color,
                    backdropFilter: "blur(8px)",
                    transition: "color 0.5s",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: t.textHeading,
                    marginBottom: 12,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{ fontSize: 12, color: t.textFaint, lineHeight: 1.8 }}
                >
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
            borderTop: `1px solid ${t.accentBg}`,
            borderBottom: `1px solid ${t.accentBg}`,
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                fontSize: 10,
                color: t.textFaint,
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
                color: t.textHeading,
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Powered by Multi-Agent Swarms
            </h2>
            <p
              style={{
                fontSize: 13,
                color: t.textFaint,
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
                        transition: "color 0.5s, text-shadow 0.5s",
                      }}
                    >
                      {a.icon}
                    </span>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: t.textPrimary,
                          letterSpacing: 1,
                        }}
                      >
                        {a.name}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: t.textFaint,
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
                        animation: "pulse-accent 2s ease infinite",
                        animationDelay: `${i * 0.4}s`,
                        display: "inline-block",
                        marginLeft: 4,
                        boxShadow: `0 0 8px ${a.color}`,
                        transition: "background 0.5s",
                      }}
                    />
                  </div>
                  {i < agents.length - 1 && (
                    <div
                      style={{
                        fontSize: 14,
                        color: t.textDarkest,
                        margin: "0 4px",
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 28px",
                background: t.bgCard,
                border: `1px solid ${t.accentBorder}`,
                borderRadius: 10,
                backdropFilter: "blur(16px)",
              }}
            >
              <span
                style={{ fontSize: 10, color: t.textFaint, letterSpacing: 2 }}
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
                background: t.logoGradient,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: 32,
                color: t.logoColor,
                boxShadow: `0 0 50px ${t.accentGlow}, 0 0 100px ${t.accentBg}`,
                transition: "all 0.5s",
              }}
            >
              A
            </div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(30px,4.5vw,58px)",
                color: t.textHeading,
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
                color: t.textDim,
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
            borderTop: `1px solid ${t.accentBg}`,
            padding: "32px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            background: t.bgOverlay,
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 5,
                background: t.logoGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne, sans-serif",
                fontWeight: 900,
                fontSize: 14,
                color: t.logoColor,
                transition: "all 0.5s",
              }}
            >
              A
            </div>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: t.textDarkest,
                letterSpacing: 2,
              }}
            >
              ALLYVEX
            </span>
          </div>
          <div style={{ fontSize: 10, color: t.textDarkest, letterSpacing: 2 }}>
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
  const t = useTheme();
  const isMobile = useIsMobile();
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
        background: t.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        transition: "background 0.5s",
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
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              background: t.logoGradient,
              borderRadius: 12,
              fontSize: 28,
              fontWeight: 800,
              color: t.logoColor,
              fontFamily: "Syne, sans-serif",
              marginBottom: 16,
              boxShadow: `0 0 40px ${t.accentGlow}, 0 0 80px ${t.accentBg}`,
              transition: "all 0.5s",
            }}
          >
            A
          </div>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: t.textBright,
              letterSpacing: 3,
              textShadow: `0 0 20px ${t.accentBg2}`,
              transition: "color 0.5s",
            }}
          >
            ALLYVEX
          </div>
          <div
            style={{
              fontSize: 10,
              color: t.textFaint,
              letterSpacing: 3,
              marginTop: 6,
            }}
          >
            SECURE ACCESS
          </div>
        </div>
        <div className="glass-gold" style={{ padding: isMobile ? 20 : 32 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 32,
              right: 32,
              height: 1,
              background: `linear-gradient(90deg,transparent,${t.accentBorder2},transparent)`,
              borderRadius: 1,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: t.textFaint,
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
                  color: t.textFaint,
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
                  color: t.textFaint,
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
                color: t.textVeryFaint,
                cursor: "none",
                letterSpacing: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = t.accent)}
              onMouseLeave={(e) => (e.target.style.color = t.textVeryFaint)}
              data-hover
            >
              FORGOT PASSWORD?
            </span>
          </div>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: t.dangerBg,
                border: `1px solid ${t.dangerBorder}`,
                borderRadius: 7,
                fontSize: 11,
                color: t.danger,
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
              background: loading ? t.accentBg2 : t.logoGradientBtn,
              color: loading ? t.textFaint : t.logoColor,
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
              color: t.textVeryFaint,
            }}
          >
            No account?{" "}
            <span
              onClick={() => onNav("register")}
              style={{ color: t.accent, cursor: "none" }}
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
  const t = useTheme();
  const isMobile = useIsMobile();
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
        background: t.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        transition: "background 0.5s",
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
              background: t.logoGradient,
              borderRadius: 12,
              fontSize: 28,
              fontWeight: 800,
              color: t.logoColor,
              fontFamily: "Syne, sans-serif",
              marginBottom: 16,
              boxShadow: `0 0 40px ${t.accentGlow}`,
              transition: "all 0.5s",
            }}
          >
            A
          </div>
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: t.textBright,
              letterSpacing: 3,
              transition: "color 0.5s",
            }}
          >
            ALLYVEX
          </div>
          <div
            style={{
              fontSize: 10,
              color: t.textFaint,
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
              background: `linear-gradient(90deg,transparent,${t.accentBorder2},transparent)`,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: t.textFaint,
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
                    color: t.textFaint,
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
                background: t.dangerBg,
                border: `1px solid ${t.dangerBorder}`,
                borderRadius: 7,
                fontSize: 11,
                color: t.danger,
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
              background: loading ? t.accentBg2 : t.logoGradientBtn,
              color: loading ? t.textFaint : t.logoColor,
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
              color: t.textVeryFaint,
            }}
          >
            Already have access?{" "}
            <span
              onClick={() => onNav("login")}
              style={{ color: t.accent, cursor: "none" }}
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
const SectionLabel = ({ children }) => {
  const t = useTheme();
  return (
    <div
      style={{
        fontSize: 10,
        color: t.textFaint,
        letterSpacing: 3,
        marginBottom: 12,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

const VerdictBadge = ({ verdict, size = "sm" }) => {
  const t = useTheme();
  const cfg = t[verdict] || t.AVOID;
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
        transition: "all 0.5s",
      }}
    >
      {verdict}
    </span>
  );
};

const ScoreRing = ({ score, label, color, size = 88 }) => {
  const t = useTheme();
  const ringColor = color || t.accent;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={t.accentBg2}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dasharray 1s ease, stroke 0.5s",
            filter: `drop-shadow(0 0 4px ${ringColor})`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: ringColor,
            lineHeight: 1,
            textShadow: `0 0 12px ${ringColor}60`,
            transition: "color 0.5s",
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: 9,
            color: t.textFaint,
            letterSpacing: 1,
            marginTop: 3,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

const ThinkingItem = ({ item, index }) => {
  const t = useTheme();
  const isDealKiller = item.fact?.includes("DEAL KILLER");
  const isCritical = item.impact === "CRITICAL";
  let accentColor = t.textVeryFaint;
  if (isDealKiller || item.severity === "HIGH") accentColor = t.danger;
  else if (item.strength === "HIGH" || item.impact === "STRENGTHENS_BULL")
    accentColor = t.bull;
  else if (item.impact === "STRENGTHENS_BEAR" || isCritical)
    accentColor = t.detective;
  return (
    <div
      className="thinking-appear"
      style={{
        animationDelay: `${index * 0.05}s`,
        padding: "10px 12px",
        borderLeft: `2px solid ${accentColor}`,
        background: isDealKiller
          ? t.dangerBg
          : isCritical
            ? t.secondaryBg
            : "transparent",
        borderRadius: "0 5px 5px 0",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: isDealKiller ? t.danger : isCritical ? t.detective : t.textMid,
          fontWeight: 500,
          marginBottom: 3,
        }}
      >
        {String(item.fact ?? "")}
      </div>
      <div style={{ fontSize: 10, color: t.textFaint, lineHeight: 1.5 }}>
        {String(item.reasoning ?? "")}
      </div>
      {item.source && (
        <a
          href={item.source}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 9,
            color: t.tertiary,
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
              background: item.strength === "HIGH" ? t.accentBg2 : t.accentBg,
              color: item.strength === "HIGH" ? t.accent : t.textFaint,
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
              background: item.severity === "HIGH" ? t.dangerBg : t.accentBg,
              color: item.severity === "HIGH" ? t.danger : t.textFaint,
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
              background: t.accentBg,
              color: t.textDim,
            }}
          >
            {item.impact}
          </span>
        )}
      </div>
    </div>
  );
};

const AGENT_META_BASE = {
  bull: { icon: "◆", label: "BULL AGENT", desc: "Building the case FOR" },
  bear: { icon: "◈", label: "BEAR AGENT", desc: "Hunting for red flags" },
  detective: {
    icon: "◎",
    label: "DETECTIVE AGENT",
    desc: "Auditing all evidence",
  },
  orchestrator: {
    icon: "⊕",
    label: "ORCHESTRATOR",
    desc: "Final verdict engine",
  },
};

const AgentCard = ({ agent, status, message, thinking = [] }) => {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  const meta = { ...AGENT_META_BASE[agent], color: t[agent] };
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
            color: isDone ? meta.color : isRunning ? meta.color : t.textDarkest,
            textShadow: isDone ? `0 0 12px ${meta.color}60` : "none",
            transition: "color 0.5s",
          }}
        >
          {meta.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: isDone
                ? t.textPrimary
                : isRunning
                  ? t.textMid
                  : t.textDarkest,
              letterSpacing: 2,
              transition: "color 0.5s",
            }}
          >
            {meta.label}
          </div>
          <div style={{ fontSize: 10, color: t.textFaint, marginTop: 2 }}>
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
                animation: "pulse-accent 1s ease infinite",
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
            <span
              style={{ fontSize: 10, color: t.textDarkest, letterSpacing: 1 }}
            >
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
            borderTop: `1px solid ${t.accentBorder}`,
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
  const t = useTheme();
  const isMobile = useIsMobile();
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
  const cfg = t[verdict] || t.AVOID;
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
        <div
          className="score-rings"
          style={{ display: "flex", gap: isMobile ? 8 : 12, flexShrink: 0 }}
        >
          <ScoreRing
            score={confidence}
            label="CONF"
            color={cfg.color}
            size={isMobile ? 64 : 72}
          />
          <ScoreRing
            score={regretScore?.score || 0}
            label="REGRET"
            color={t.textMid}
            size={isMobile ? 64 : 72}
          />
        </div>
      </div>
      {regretScore?.reason && (
        <div
          style={{
            fontSize: 11,
            color: t.textDim,
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
                    color: t.textFaint,
                    flexShrink: 0,
                    width: 160,
                    fontSize: 10,
                  }}
                >
                  {k.replace(/([A-Z])/g, " $1").toUpperCase()}
                </span>
                <span style={{ color: t.textMid }}>
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
            background: t.bgInput,
            borderRadius: 8,
            border: `1px solid ${t.accentBorder}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <SectionLabel>TARGET DECISION MAKER</SectionLabel>
          <div
            style={{
              fontSize: 13,
              color: t.textPrimary,
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            {targetDecisionMaker.title}
          </div>
          <div style={{ fontSize: 11, color: t.textDim, marginBottom: 6 }}>
            {targetDecisionMaker.why}
          </div>
          <div style={{ fontSize: 10, color: t.textFaint }}>
            🔍 {targetDecisionMaker.linkedinSearchTip}
          </div>
        </div>
      )}
      {(ifHold || ifAvoid) && (
        <div
          style={{
            marginBottom: 16,
            padding: 10,
            background: verdict === "HOLD" ? t.secondaryBg : t.dangerBg,
            border: `1px solid ${verdict === "HOLD" ? t.secondaryBorder : t.dangerBorder}`,
            borderRadius: 7,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: verdict === "HOLD" ? t.secondary : t.danger,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            {verdict === "HOLD" ? "WATCH FOR" : "NEEDS BEFORE PURSUING"}
          </div>
          <div style={{ fontSize: 11, color: t.textMid }}>
            {ifHold || ifAvoid}
          </div>
        </div>
      )}
      {outreachEmail && (
        <div>
          <button
            onClick={() => setShowEmail((e) => !e)}
            style={{
              background: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
              color: t.textDim,
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
                background: t.bgInput,
                borderRadius: 8,
                fontSize: 11,
                border: `1px solid ${t.accentBorder}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ color: t.textFaint, marginBottom: 4 }}>
                SUBJECT:
              </div>
              <div style={{ color: t.textPrimary, marginBottom: 10 }}>
                {outreachEmail.subject}
              </div>
              <div style={{ color: t.textFaint, marginBottom: 4 }}>BODY:</div>
              <pre
                style={{
                  color: t.textMid,
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
  const t = useTheme();
  const isMobile = useIsMobile();
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
      <div
        className="war-card glow-card"
        style={{
          padding: "24px 28px",
          marginBottom: 24,
          borderColor: t.accentBorder2,
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
            background: `linear-gradient(90deg,${t.tertiary},${t.accent},transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "30%",
            background: `radial-gradient(ellipse at right, ${t.accentBg}, transparent 70%)`,
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
                color: t.textFaint,
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
                color: t.textHeading,
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
                  background: t.accentBg,
                  border: `1px solid ${t.accentBorder}`,
                  borderRadius: 5,
                  color: t.accent,
                  letterSpacing: 2,
                }}
              >
                {confirmedScale}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: t.secondaryBg,
                  border: `1px solid ${t.secondaryBorder}`,
                  borderRadius: 5,
                  color: t.secondary,
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
              borderTop: `1px solid ${t.accentBorder}`,
              fontSize: 13,
              color: t.textMid,
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
              color: t.textDim,
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
              <span style={{ color: t.bull, flexShrink: 0 }}>+</span>
              <span style={{ color: t.textMid }}>
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
                  background: t.accentBorder,
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
                  <span style={{ color: t.danger, flexShrink: 0 }}>−</span>
                  <span style={{ color: t.textMid }}>
                    {typeof d === "object"
                      ? d.disadvantage || d.text || JSON.stringify(d)
                      : String(d ?? "")}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="war-card" style={{ padding: isMobile ? 16 : 20 }}>
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
                style={{ color: t.textFaint, flexShrink: 0, fontWeight: 600 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ color: t.textMid, lineHeight: 1.5 }}>
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
                  background: file ? t.accentBg : t.bgCard,
                  border: `1px solid ${file ? t.accentBorder : t.accentBg}`,
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
                    color: file ? t.accent : t.textDarkest,
                  }}
                >
                  {ext === "PDF" ? "📋" : "📄"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: file ? t.textMid : t.textDarkest,
                    letterSpacing: 1,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: file ? t.accent : t.textDarkest,
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
  const t = useTheme();
  const isMobile = useIsMobile();
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
        setAgentThinking((th) => ({ ...th, [a]: event.thinking }));
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

  const goldBtn = (onClick, disabled, label) => (
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
        background: disabled ? t.accentBg : t.logoGradientBtn,
        color: disabled ? t.textFaint : t.logoColor,
        border: "none",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.2s",
        boxShadow: disabled ? "none" : `0 4px 16px ${t.accentGlow}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        transition: "background 0.5s",
      }}
    >
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
                background: `linear-gradient(90deg,transparent,${t.accentBorder2},transparent)`,
              }}
            />
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: t.textHeading,
                marginBottom: 6,
                letterSpacing: 1,
              }}
            >
              INITIALIZE CLIENT
            </div>
            <div
              style={{
                fontSize: 12,
                color: t.textFaint,
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
                  color: t.danger,
                  marginTop: 10,
                  padding: "8px 12px",
                  background: t.dangerBg,
                  borderRadius: 6,
                  border: `1px solid ${t.dangerBorder}`,
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
                  background: t.bgInput,
                  borderRadius: 8,
                  fontSize: 11,
                  color: t.textFaint,
                  border: `1px solid ${t.accentBorder}`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    animation: "blink 1s infinite",
                    display: "inline-block",
                    marginRight: 8,
                    color: t.accent,
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
              borderColor: t.accentBorder2,
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
                background: `linear-gradient(90deg,transparent,${t.accentBorder2},transparent)`,
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
                    color: t.accent,
                    letterSpacing: 2,
                    marginBottom: 4,
                  }}
                >
                  ✓ CLIENT PROFILE LOADED
                </div>
                <div style={{ fontSize: 12, color: t.textMid }}>
                  {clientUrl}
                </div>
              </div>
              <button
                onClick={() => setProfilePreview((p) => !p)}
                style={{
                  background: t.accentBg,
                  border: `1px solid ${t.accentBorder}`,
                  color: t.textDim,
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
                  background: t.bgInput,
                  borderRadius: 8,
                  fontSize: 10,
                  color: t.textDim,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  maxHeight: 200,
                  overflowY: "auto",
                  fontFamily: "IBM Plex Mono",
                  border: `1px solid ${t.accentBorder}`,
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
                background: `linear-gradient(90deg,transparent,${t.accentBorder},transparent)`,
              }}
            />
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: t.textHeading,
                marginBottom: 6,
              }}
            >
              RUN TARGET ANALYSIS
            </div>
            <div style={{ fontSize: 11, color: t.textFaint, marginBottom: 24 }}>
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
            <div style={{ marginTop: 10, fontSize: 10, color: t.textDarkest }}>
              Strip https:// and www. — just the root domain
            </div>
          </div>
        </div>
      )}

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
                  color: t.textHeading,
                  letterSpacing: 1,
                  textShadow: `0 0 30px ${t.accentBg2}`,
                }}
              >
                {companyName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: t.textFaint,
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
                  background: t.dangerBg,
                  border: `1px solid ${t.dangerBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: t.danger,
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
                  background: t.accentBg,
                  color: t.accent,
                  border: `1px solid ${t.accentBorder}`,
                }}
              >
                ← RETRY
              </button>
            </div>
          )}
        </div>
      )}

      {appState === "RESULTS" && result && (
        <>
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "16px 40px",
              borderBottom: `1px solid ${t.accentBorder}`,
              alignItems: "center",
              background: t.bgOverlay,
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
                background: t.accentBg,
                color: t.accent,
                border: `1px solid ${t.accentBorder}`,
                transition: "all 0.2s",
              }}
            >
              ← NEW ANALYSIS
            </button>
            <span style={{ fontSize: 10, color: t.textDarkest }}>|</span>
            <span
              style={{ fontSize: 10, color: t.textFaint, letterSpacing: 1 }}
            >
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
          color: t.textDarkest,
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
  const [themeName, setThemeName] = useState("gold");
  const isMobile = useIsMobile();
  const theme = THEMES[themeName];

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

  const handleToggleTheme = () => {
    setThemeName((n) => (n === "gold" ? "purple" : "gold"));
  };

  // Ensure mobile viewport is set
  useEffect(() => {
    let meta = document.querySelector("meta[name=viewport]");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1";
  }, []);

  // Update cursor colors when theme changes
  useEffect(() => {
    const outer = document.getElementById("cursor-outer");
    const inner = document.getElementById("cursor-inner");
    if (outer) {
      outer.style.borderColor = theme.accentDim;
    }
    if (inner) {
      inner.style.background = theme.cursorInner;
      inner.style.boxShadow = theme.cursorGlow;
    }
  }, [themeName, theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <style>{makeStyles(theme)}</style>
      <Cursor />
      <Nav
        page={page}
        onNav={(p) =>
          p === "landing" && user
            ? (handleLogout(), handleNav("landing"))
            : p === "warroom" || handleNav(p)
        }
        user={user}
        onToggleTheme={handleToggleTheme}
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
    </ThemeContext.Provider>
  );
}
